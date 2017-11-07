// Created by starea - 2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0
#define C_RED vec4(1.0, 0.0, 0.0, 1.0)
#define C_YELLOW vec4(1.0, 1.0, 0.0, 1.0)
#define C_BLUE vec4(0.0, 0.0, 1.0, 1.0)
#define THRESHOLD 0.5

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec4 c = texture2D(iChannel0, uv); 
    float luminance = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
    int is_blue = (luminance < THRESHOLD) ? 0 : 1; 
    
    if (luminance < THRESHOLD) 
        fragColor = mix(C_BLUE, C_YELLOW, (luminance - float(is_blue) * 0.5) / 0.5 ); 
    else
        fragColor = mix(C_YELLOW, C_RED, (luminance - float(is_blue) * 0.5) / 0.5);
}