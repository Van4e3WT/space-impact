export const lineFragment = `
  uniform float limitDistance;
  uniform vec3 origin;
  uniform vec3 color;
  varying vec3 vPos;

  float basicOpacity = 0.5;

  void main() {
    float distance = clamp(length(vPos - origin), 0., limitDistance);
    float opacity = basicOpacity - basicOpacity * 2. * (distance / limitDistance);
    gl_FragColor = vec4(color, opacity);
  }
`;
