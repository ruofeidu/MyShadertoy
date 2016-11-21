vec3 RGBtoHCV(in vec3 RGB)
{
	float Epsilon = 1e-10;
	vec4 P = (RGB.g < RGB.b) ? vec4(RGB.bg, -1.0, 2.0 / 3.0) : vec4(RGB.gb, 0.0, -1.0 / 3.0);
	vec4 Q = (RGB.r < P.x) ? vec4(P.xyw, RGB.r) : vec4(RGB.r, P.yzx);
	float C = Q.x - min(Q.w, Q.y);
	float H = abs((Q.w - Q.y) / (6.0 * C + Epsilon) + Q.z);
	return vec3(H, C, Q.x);
}

vec3 RGBtoHSV(in vec3 RGB)
{
	float Epsilon = 1e-10;
	vec3 HCV = RGBtoHCV(RGB);
	float S = HCV.y / (HCV.z + Epsilon);
	return vec3(HCV.x, S, HCV.z);
}

vec4 RGBColor(float r, float g, float b) {
	return vec4(r / 255.0, g / 255.0, b / 255.0, 1.0); 
}

vec4 RGBLabel(int i) {
	if (i == 0) return RGBColor(127.0, 201.0, 127.0); else
	if (i == 1) return RGBColor(190.0, 174.0, 212.0); else
	if (i == 2) return RGBColor(253.0, 192.0, 134.0); else
	if (i == 3) return RGBColor(255.0, 255.0, 153.0); else
	if (i == 4) return RGBColor(56.0, 108.0, 176.0); else
	if (i == 5) return RGBColor(240.0, 2.0, 127.0); else
	if (i == 6) return RGBColor(191.0, 91.0, 23.0); else
	if (i == 7) return RGBColor(102.0, 102.0, 102.0); else
				return RGBColor(0.0, 0.0, 0.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
	fragColor = RGBLabel(int(floor(uv.x * 9.0))); 
}