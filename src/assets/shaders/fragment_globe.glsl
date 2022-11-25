uniform sampler2D globe_texture;
varying vec2 vertex_uv;
varying vec3 vertex_normal;

void main() {
    //atmospheric effect
    float intensity = 1.05 - dot(vertex_normal, vec3(0.0,0.0,1.0));
    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);

	gl_FragColor = vec4(
        atmosphere + texture2D(globe_texture, vertex_uv).xyz,
        1.0
    );
}