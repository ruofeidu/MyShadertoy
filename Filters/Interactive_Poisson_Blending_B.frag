// Mask Image, white indicates foreground
// Demo: https://www.shadertoy.com/view/4l3Xzl
// Ruofei Du (http://duruofei.com)
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
#define BRUSH_SIZE 0.1
#define INITIAL_CIRCLE_SIZE 0.4
const bool INIT_CLEAN_CANVAS = false;
const float KEY_1 = 49.5;
const float KEY_2 = 50.5;
const float KEY_SPACE = 32.5;
const float KEY_ALL = 256.0;

bool getKeyDown(float key) {
    return texture2D(iChannel1, vec2(key / KEY_ALL, 0.5)).x > 0.1;
}

bool getMouseDown() {
    return iMouse.z > 0.0;
}

bool isInitialization() {
	vec2 lastResolution = texture2D(iChannel0, vec2(0.0) / iResolution.xy).yz; 
    return any(notEqual(lastResolution, iResolution.xy));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 p = 2.0 * (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
	float mixingGradients = texture2D(iChannel0, vec2(1.5) / iResolution.xy).y;    
    float frameReset = texture2D(iChannel0, vec2(1.5) / iResolution.xy).z;    
    float mask = 0.0;
    
    bool resetBlending = (getKeyDown(KEY_1) && mixingGradients > 0.5) || (getKeyDown(KEY_2) && mixingGradients < 0.5); 
    
    if (getKeyDown(KEY_1)) mixingGradients = 0.0;
    if (getKeyDown(KEY_2)) mixingGradients = 1.0;

    if (isInitialization() || getKeyDown(KEY_SPACE)) {    
        // reset canvas
        vec2 q = vec2(-0.7, 0.5); 
        if (distance(p, q) < INITIAL_CIRCLE_SIZE) mask = 1.0; 
        if (INIT_CLEAN_CANVAS) mask = 0.0; 
        resetBlending = true; 
    } else 
    if (getMouseDown()) {
        // draw on canvas
    	vec2 mouse = 2.0 * (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;
        mask = (distance(mouse, p) < BRUSH_SIZE) ? 1.0 : texture2D(iChannel0, uv).x;
    } else {
        mask = texture2D(iChannel0, uv).x;
    }
    
	if (fragCoord.x < 1.0) { 
        fragColor = vec4(mask, iResolution.xy, 1.0);  
    } else 
    if (fragCoord.x < 2.0) { 
        if (resetBlending) frameReset = float(iFrame); 
  		fragColor = vec4(mask, mixingGradients, frameReset, 1.0);  
    } else {
        fragColor = vec4(vec3(mask), 1.0); 
    }
}