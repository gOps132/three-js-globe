varying vec2 vertex_uv;
varying vec3 vertex_normal;

void main() {
    vertex_uv = uv;
    vertex_normal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}