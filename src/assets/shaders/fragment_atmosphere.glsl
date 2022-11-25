varying vec3 vertex_normal;

void main() {
    //atmospheric effect
    float intensity = pow(0.7 - dot(vertex_normal, vec3(0.0,0.0,1.0)), 2.0);

	gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
}