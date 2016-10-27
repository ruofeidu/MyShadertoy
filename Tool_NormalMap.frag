const float heightScale = 0.0125;

float sampleHeight(in vec2 coord)
{
    return heightScale * 
        dot(texture2D(iChannel0, coord), vec4(vec3(1.0/3.0), 0.0));
} 
   
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 du = vec2(1.0 / iResolution.x, 0.0);
    vec2 dv = vec2(0.0, 1.0 / iResolution.y);
    
    float h0 = sampleHeight(uv);
    float hpx = sampleHeight(uv + du);
    float hmx = sampleHeight(uv - du);
    float hpy = sampleHeight(uv + dv);
    float hmy = sampleHeight(uv - dv);
    
    float dHdU = (hmx - hpx) / (2.0 * du.x);
    float dHdV = (hmy - hpy) / (2.0 * dv.y);
    
    vec3 normal = normalize(vec3(dHdU, dHdV, 1.0));
   
	fragColor = vec4(0.5 + 0.5 * normal, 1.0);
}

