// Poisson Blending
// Demo: https://www.shadertoy.com/view/4l3Xzl
// Ruofei Du (http://duruofei.com)
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
#define NUM_NEIGHBORS 4
float mixingGradients; 
vec2 neighbors[NUM_NEIGHBORS];

#define RES(UV) (tap(iChannel0, vec2(UV)))
#define MASK(UV) (tap(iChannel1, vec2(UV)))
#define BASE(UV) (tap(iChannel2, vec2(UV)))
#define SRC(UV) (tap(iChannel3, vec2(UV)))

vec3 tap(sampler2D tex, vec2 uv) { return texture2D(tex, uv).rgb; }

bool isInitialization() {
    vec2 lastResolution = texture2D(iChannel1, vec2(0.5) / iResolution.xy).yz;   
    return any(notEqual(lastResolution, iResolution.xy)) || iFrame < 4;
}

bool isMasked(vec2 uv) {
    return texture2D(iChannel1, uv).x > 0.5; 
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    fragColor.a = 1.0; 
    
  	mixingGradients = texture2D(iChannel1, vec2(1.5) / iResolution.xy).y;  
  	float resetBlending = texture2D(iChannel1, vec2(1.5) / iResolution.xy).z;  
    // init
    if (isInitialization() || resetBlending > 0.5) {
    	fragColor.rgb = BASE(uv);
        return; 
    }
    
    vec2 p = uv; 
    if (isMasked(p)) {
        vec3 col = vec3(0.0); 
        float convergence = 0.0; 
        
        neighbors[0] = uv + vec2(-1.0 / iChannelResolution[3].x, 0.0); 
        neighbors[1] = uv + vec2( 1.0 / iChannelResolution[3].x, 0.0); 
        neighbors[2] = uv + vec2(0.0, -1.0 / iChannelResolution[3].y); 
        neighbors[3] = uv + vec2(0.0,  1.0 / iChannelResolution[3].y);
        
        for (int i = 0; i < NUM_NEIGHBORS; ++i) {
            vec2 q = neighbors[i];
            col += isMasked(q) ? RES(q) : BASE(q);
            vec3 srcGrad = SRC(p) - SRC(q);
            
            if (mixingGradients > 0.5) {
                vec3 baseGrad = BASE(p) - BASE(q);
                col.r += (abs(baseGrad.r) > abs(srcGrad.r)) ? baseGrad.r : srcGrad.r;
                col.g += (abs(baseGrad.g) > abs(srcGrad.g)) ? baseGrad.g : srcGrad.g;
                col.b += (abs(baseGrad.b) > abs(srcGrad.b)) ? baseGrad.b : srcGrad.b;
            } else {
                col += srcGrad;     
            }
        }     
        col /= float(NUM_NEIGHBORS); 
        convergence += distance(col, RES(p)); // TODO: converge
        fragColor.rgb = col;
        return; 
    }
                
    fragColor.rgb = RES(uv); 
}