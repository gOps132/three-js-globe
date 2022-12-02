function RGB(p_r, p_g, p_b) {
	this.r = p_r;
	this.g = p_g;
	this.b = p_b;
}

export function hexToRgb(hex) {
	return new RGB((hex >> 8 & 0xf) | (hex >> 4 & 0x0f0),
		(hex >> 4 & 0xf) | (hex & 0xf),
		((hex & 0xf) << 4) | (hex & 0xf),
		1);
}