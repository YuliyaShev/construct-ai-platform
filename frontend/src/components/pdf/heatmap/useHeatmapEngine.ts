"use client";

import { useCallback, useRef } from "react";
import type { HeatmapPoint } from "./types/heatmap";

type RenderState = {
  gl: WebGLRenderingContext | null;
  program: WebGLProgram | null;
  buffer: WebGLBuffer | null;
  attribs: {
    position: number;
    severity: number;
    confidence: number;
  };
  uniforms: {
    scale: WebGLUniformLocation | null;
    translate: WebGLUniformLocation | null;
    pageSize: WebGLUniformLocation | null;
    canvasSize: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
    opacity: WebGLUniformLocation | null;
    dpr: WebGLUniformLocation | null;
  };
  pointCount: number;
  shaderSourceLoaded: boolean;
  vertSource?: string;
  fragSource?: string;
};

export type HeatmapViewport = {
  scale: number;
  translateX: number;
  translateY: number;
  pageWidth: number;
  pageHeight: number;
  opacity: number;
  dpr: number;
};

const SEVERITY_MAP: Record<HeatmapPoint["severity"], number> = {
  low: 0,
  medium: 1,
  high: 2
};

async function loadText(url: string) {
  const res = await fetch(url);
  return res.text();
}

async function loadShaderSources() {
  const vertURL = new URL("./shaders/heatmap.vert", import.meta.url).toString();
  const fragURL = new URL("./shaders/heatmap.frag", import.meta.url).toString();
  const [vertSource, fragSource] = await Promise.all([loadText(vertURL), loadText(fragURL)]);
  return { vertSource, fragSource };
}

function compileShader(gl: WebGLRenderingContext, source: string, type: number) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${info || "unknown error"}`);
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertSource: string, fragSource: string) {
  const vertexShader = compileShader(gl, vertSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragSource, gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create program");
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed: ${info || "unknown error"}`);
  }
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  return program;
}

export function useHeatmapEngine() {
  const state = useRef<RenderState>({
    gl: null,
    program: null,
    buffer: null,
    attribs: {
      position: -1,
      severity: -1,
      confidence: -1
    },
    uniforms: {
      scale: null,
      translate: null,
      pageSize: null,
      canvasSize: null,
      time: null,
      opacity: null,
      dpr: null
    },
    pointCount: 0,
    shaderSourceLoaded: false
  });

  const initWebGL = useCallback(async (canvas: HTMLCanvasElement) => {
    const gl =
      (canvas.getContext("webgl", { antialias: true, preserveDrawingBuffer: false }) ||
        canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      console.error("WebGL unavailable for heatmap");
      return;
    }

    const shared = state.current;
    const { vertSource, fragSource } = shared.shaderSourceLoaded
      ? { vertSource: shared.vertSource!, fragSource: shared.fragSource! }
      : await loadShaderSources();

    const program = createProgram(gl, vertSource, fragSource);
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    const severityLoc = gl.getAttribLocation(program, "a_severity");
    const confidenceLoc = gl.getAttribLocation(program, "a_confidence");

    const uniforms = {
      scale: gl.getUniformLocation(program, "u_scale"),
      translate: gl.getUniformLocation(program, "u_translate"),
      pageSize: gl.getUniformLocation(program, "u_pageSize"),
      canvasSize: gl.getUniformLocation(program, "u_canvasSize"),
      time: gl.getUniformLocation(program, "u_time"),
      opacity: gl.getUniformLocation(program, "u_opacity"),
      dpr: gl.getUniformLocation(program, "u_dpr")
    };

    state.current = {
      ...state.current,
      gl,
      program,
      buffer,
      attribs: {
        position: positionLoc,
        severity: severityLoc,
        confidence: confidenceLoc
      },
      uniforms,
      shaderSourceLoaded: true,
      vertSource,
      fragSource
    };
  }, []);

  const resize = useCallback((width: number, height: number, dpr: number) => {
    const { gl } = state.current;
    if (!gl) return;
    gl.viewport(0, 0, width * dpr, height * dpr);
  }, []);

  const uploadPoints = useCallback((points: HeatmapPoint[], pageWidth: number, pageHeight: number) => {
    const { gl, buffer } = state.current;
    if (!gl || !buffer) return;

    const filtered = points;
    const data = new Float32Array(filtered.length * 4);
    for (let i = 0; i < filtered.length; i += 1) {
      const p = filtered[i];
      const idx = i * 4;
      data[idx] = p.x * pageWidth;
      data[idx + 1] = p.y * pageHeight;
      data[idx + 2] = SEVERITY_MAP[p.severity];
      data[idx + 3] = p.confidence;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    state.current.pointCount = filtered.length;
  }, []);

  const render = useCallback((viewport: HeatmapViewport) => {
    const { gl, program, buffer, attribs, uniforms, pointCount } = state.current;
    if (!gl || !program || !buffer) return;

    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!pointCount) return;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const stride = 4 * 4; // 4 floats per vertex

    gl.enableVertexAttribArray(attribs.position);
    gl.vertexAttribPointer(attribs.position, 2, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(attribs.severity);
    gl.vertexAttribPointer(attribs.severity, 1, gl.FLOAT, false, stride, 2 * 4);

    gl.enableVertexAttribArray(attribs.confidence);
    gl.vertexAttribPointer(attribs.confidence, 1, gl.FLOAT, false, stride, 3 * 4);

    gl.uniform1f(uniforms.scale, viewport.scale);
    gl.uniform2f(uniforms.translate, viewport.translateX, viewport.translateY);
    gl.uniform2f(uniforms.pageSize, viewport.pageWidth, viewport.pageHeight);
    gl.uniform2f(uniforms.canvasSize, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform1f(uniforms.opacity, viewport.opacity);
    gl.uniform1f(uniforms.time, performance.now() / 1000);
    gl.uniform1f(uniforms.dpr, viewport.dpr);

    gl.drawArrays(gl.POINTS, 0, pointCount);
  }, []);

  const dispose = useCallback(() => {
    const { gl, program, buffer } = state.current;
    if (gl && program) gl.deleteProgram(program);
    if (gl && buffer) gl.deleteBuffer(buffer);
    state.current = {
      ...state.current,
      gl: null,
      program: null,
      buffer: null,
      pointCount: 0
    };
  }, []);

  return {
    initWebGL,
    resize,
    uploadPoints,
    render,
    dispose
  };
}
