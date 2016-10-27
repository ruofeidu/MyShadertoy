// Created by starea - 2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    float g = dot( texture2D(iChannel0, uv), vec4(0.375, 0.5, 0.125, 0.0) );
    fragColor = vec4(0.0, g, 0.0, 1.0);
}