/**
 * An interactive heatmap visualization by Ruofei Du (www.duruofei.com). 
 * The transfer function (color palette) is forked from: https://www.shadertoy.com/view/llKGWG
 * The Sigmoid function is forked from: https://www.shadertoy.com/view/MtX3z2
 **/

float Sigmoid (float x) { return 1.0 / (1.0 + (exp(-(x - 0.5) * 14.0))); } //probability useful

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    float heat = texture2D(iChannel0, uv).r;
    
    if (iMouse.z > 0.0) {
        vec2 m = iMouse.xy / iResolution.xy;
        // correct aspect ratio
    	uv.x *= iResolution.x / iResolution.y;
    	m.x  *= iResolution.x / iResolution.y;
        
        float d = 1.0 - pow(distance(uv, m), 0.6); 
        
		heat = heat * 0.995;
        heat = max(heat, d);
        //heat += d; 
        heat = clamp(heat, 0.0, 1.0);    
    } 
    
    fragColor = vec4(vec3(heat), 1.0);  
}