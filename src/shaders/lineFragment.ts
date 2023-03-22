export const lineFragment = `
  uniform vec3 origin;
  uniform vec3 color;
  varying vec3 vPos;
  float limitDistance = 70.;
  void main() {
    float distance = clamp(length(vPos - origin), 0., limitDistance);
    float opacity = 1. - distance / limitDistance;
    gl_FragColor = vec4(color, opacity);
  }
`;
