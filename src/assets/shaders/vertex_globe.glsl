varying vec2 vertex_uv;

void main() {
    vertex_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}