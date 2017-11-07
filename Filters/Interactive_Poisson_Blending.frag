// Interactive Poisson Blending
// Demo: https://www.shadertoy.com/view/4l3Xzl
// Ruofei Du (http://duruofei.com)
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Reference: P. Pérez, M. Gangnet, A. Blake. Poisson image editing. ACM Transactions on Graphics (SIGGRAPH'03), 22(3):313-318, 2003.
const int NUM_NEIGHBORS = 4; 
vec2 neighbors[NUM_NEIGHBORS];

bool isMasked(vec2 uv) {
    return texture2D(iChannel1, uv).r > 0.5; 
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
	fragColor = texture2D(iChannel0, uv);
}