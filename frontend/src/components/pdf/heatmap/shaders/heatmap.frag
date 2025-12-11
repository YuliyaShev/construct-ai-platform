precision mediump float;

uniform float u_opacity;
uniform float u_time;

// Map severity (0=low,1=medium,2=high) to base color
vec3 severityColor(float level) {
  if (level > 1.5) return vec3(0.95, 0.2, 0.2);   // high -> red
  if (level > 0.5) return vec3(0.98, 0.58, 0.16); // medium -> orange
  return vec3(0.99, 0.86, 0.16);                  // low -> yellow
}

varying float v_severity;
varying float v_confidence;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord) * 2.0; // 0 at center, ~1 at edge
  float alpha = smoothstep(1.0, 0.2, dist);

  vec3 baseColor = severityColor(v_severity);
  float intensity = 0.6 + clamp(v_confidence, 0.0, 1.0) * 0.6;

  // Slight pulsing on high severity adds brightness
  float pulseBoost = (v_severity > 1.5) ? (0.07 * sin(u_time * 4.0) + 0.07) : 0.0;

  vec3 color = baseColor * (intensity + pulseBoost);
  gl_FragColor = vec4(color, alpha * u_opacity);
}
