varying vec3 vertex_normal;

void main() {
    vertex_normal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.9);
}