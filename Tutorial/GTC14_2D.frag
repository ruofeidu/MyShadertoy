// Ruofei Du
// Created from GTC '14 Tutorial
// https://www.shadertoy.com/view/4lj3WD

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Get UV coordinates [0, 1]
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    // Render a gradient red-black circle
    vec2 p = uv - 0.5;
    //vec2 p = uv * 2.0 - 1.0; 
    float r = length(p);
    float a = atan(p.x, p.y); 
    
    // Sample sound from channel1
    vec4 sound = texture2D( iChannel1, vec2(0.01, 0.25) ); 
    vec4 tex = texture2D ( iChannel0, vec2(1.0 / r + iGlobalTime + sound.x, a));  // better polar coordinate
    //vec4 tex = texture2D (iChannel0, vec2(r, a));  // polar coordinate
    //vec4 tex = texture2D (iChannel0, p);
    
    vec3 c = tex.xyz * r; 
    
    fragColor = vec4(c, 1.0);
    
}