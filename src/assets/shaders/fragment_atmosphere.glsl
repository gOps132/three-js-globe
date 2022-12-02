varying vec3 vertex_normal;
uniform int u_color;

float modI(float a, float b);

void main() {
    // float temp = modI(256.0,256.0);
    float r_int_val = modI(float(u_color / 256 / 256), 256.0);
    float g_int_val = modI(float(u_color / 256), 256.0);
    float b_int_val = modI(float(u_color), 256.0);

    //atmospheric effect
    float intensity = pow(0.7 - dot(vertex_normal, vec3(0.0,0.0,1.0)), 2.0);

	// gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    gl_FragColor = vec4(r_int_val / 255.0, g_int_val / 255.0, b_int_val / 255.0, 1.0) * intensity;
}

float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}