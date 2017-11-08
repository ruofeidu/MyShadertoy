void mainImage( out vec4 O, in vec2 U )
{
    float boost = iMouse.x < 0.01 ? 1.5 : iMouse.x / iResolution.x * 2.0; 
    float reduction = iMouse.y < 0.01 ? 2.0 : iMouse.y / iResolution.y * 4.0; 
	vec2 uv = U / iResolution.xy;
    vec3 col = texture(iChannel0, uv).rgb;
    float vignette = distance( iResolution.xy * 0.5, U ) / iResolution.x;
    col *= boost - vignette * reduction;
	O = vec4(col, 1.0);
}