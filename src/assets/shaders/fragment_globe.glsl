uniform sampler2D globe_texture;
varying vec2 vertex_uv; //vec2

void main() {
	gl_FragColor = texture2D(globe_texture, vertex_uv);
}