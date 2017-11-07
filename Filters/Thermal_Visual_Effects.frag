// Created by starea - 2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0
#define C_RED vec4(1.0, 0.0, 0.0, 1.0)
#define C_YELLOW vec4(1.0, 1.0, 0.0, 1.0)
#define C_BLUE vec4(0.0, 0.0, 1.0, 1.0)

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec4 c = texture(iChannel0, uv); 
    float luminance = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
    float THRESHOLD = (length(iMouse.xy) < 1e-2) ? 0.5 : iMouse.x / iResolution.x;
    fragColor = (luminance < THRESHOLD) ? mix(C_BLUE, C_YELLOW, luminance * 2.0 ) : mix(C_YELLOW, C_RED, (luminance - 0.5) * 2.0);
    fragColor.rgb *= 0.1 + 0.25 + 0.75 * pow( 16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.15 );
}