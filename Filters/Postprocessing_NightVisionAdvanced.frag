// 4rknova
// https://www.shadertoy.com/view/Xsl3zf
#ifdef GL_ES
precision highp float;
#endif

float hash(in float n) { return fract(sin(n)*43758.5453123); }

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = fragCoord.xy / iResolution.xy;
	
	vec2 u = p * 2. - 1.;
	vec2 n = u * vec2(iResolution.x / iResolution.y, 1.0);
	vec3 c = texture2D(iChannel0, p).xyz;
    
    if (mod(fragCoord.y * .5, 2.) > 1.)
    {
        fragColor = vec4(vec3(0),1);
        return;
    }
	
	// flicker, grain, vignette, fade in
	c += sin(hash(iGlobalTime)) * 0.01;
	c += hash((hash(n.x) + n.y) * iGlobalTime) * 0.5;
	c *= smoothstep(length(n * n * n * vec2(0.075, 0.4)), 1.0, 0.4);
    c *= smoothstep(0.001, 3.5, iGlobalTime) * 1.5;
	
	c = dot(c, vec3(0.2126, 0.7152, 0.0722)) 
	  * vec3(0.2, 1.5 - hash(iGlobalTime) * 0.1,0.4);
	
	fragColor = vec4(c,1.0);
}