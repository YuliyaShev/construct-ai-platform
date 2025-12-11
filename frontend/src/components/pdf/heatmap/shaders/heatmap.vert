precision mediump float;

attribute vec2 a_position;
attribute float a_severity;
attribute float a_confidence;

varying float v_severity;
varying float v_confidence;

uniform float u_scale;
uniform vec2 u_translate;
uniform vec2 u_pageSize;
uniform vec2 u_canvasSize;
uniform float u_time;
uniform float u_dpr;

// Map severity to a size multiplier
float severitySize(float level) {
  if (level > 1.5) return 1.0;       // high
  if (level > 0.5) return 0.8;       // medium
  return 0.65;                       // low
}

void main() {
  float severityLevel = a_severity; // 0=low,1=med,2=high

  // Convert page-space coords to screen-space (CSS px), then to device px
  vec2 world = a_position * u_scale + u_translate;
  vec2 device = world * u_dpr;

  vec2 clip = (device / u_canvasSize) * 2.0 - 1.0;
  clip.y *= -1.0; // flip Y for WebGL clip space
  gl_Position = vec4(clip, 0.0, 1.0);

  float baseSize = 18.0;
  float severityMul = severitySize(severityLevel);
  float confidenceMul = 0.5 + clamp(a_confidence, 0.0, 1.0) * 0.7;

  float pulse = 0.0;
  if (severityLevel > 1.5) { // High severity pulsing
    pulse = (sin(u_time * 4.0) * 0.15);
  }

  gl_PointSize = baseSize * severityMul * (1.0 + pulse) * u_scale * confidenceMul * u_dpr;

  v_severity = severityLevel;
  v_confidence = a_confidence;
}
