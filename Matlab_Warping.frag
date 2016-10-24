//https://www.shadertoy.com/view/llBSWw
#define W 1280.0
#define H 720.0
#define SIZE vec2(W, H)
mat3 affineMatrix;

/**
 * How to do image warping in WebGL using affine matrix from Matlab image registration
 * Author: Ruofei Du
 * A note to remember to do inverse, transpose and y flipping from Matlab affine2d matrix
 */
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0

mat2 transpose(mat2 m) {
    return mat2(m[0][0], m[1][0],
                m[0][1], m[1][1]);
}

mat3 transpose(mat3 m) {
    return mat3(m[0][0], m[1][0], m[2][0],
                m[0][1], m[1][1], m[2][1],
                m[0][2], m[1][2], m[2][2]);
}

mat4 transpose(mat4 m) {
    return mat4(m[0][0], m[1][0], m[2][0], m[3][0],
                m[0][1], m[1][1], m[2][1], m[3][1],
                m[0][2], m[1][2], m[2][2], m[3][2],
                m[0][3], m[1][3], m[2][3], m[3][3]);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float k = 10.0; 
    bool forwardMapping = false; 
    bool yFlipped = true; 
    
    if (forwardMapping) {
   		if (k < 0.1) affineMatrix = mat3(1.0000, -0.0000, 20.3000, 0.0000, 1.0000, 6.4000, 0.0000, 0.0000, 1.0000); else
        if (k < 1.1) affineMatrix = mat3(0.9998, -0.0199, -8.2065, 0.0199, 0.9998, 15.5379, 0.0000, 0.0000, 1.0000); else
        if (k < 2.1) affineMatrix = mat3(1.0000, -0.0000, -27.1001, 0.0000, 1.0000, 19.7000, 0.0000, 0.0000, 1.0000); else
        if (k < 3.1) affineMatrix = mat3(1.0000, -0.0000, -89.0000, 0.0000, 1.0000, 17.0000, 0.0000, 0.0000, 1.0000); else
        if (k < 4.1) affineMatrix = mat3(1.0050, -0.0000, 32.2107, 0.0000, 1.0050, -31.4950, 0.0000, 0.0000, 1.0000); else
        if (k < 5.1) affineMatrix = mat3(1.0000, -0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 1.0000); else
        if (k < 6.1) affineMatrix = mat3(0.9960, 0.0079, -40.2953, -0.0079, 0.9960, -13.8857, 0.0000, 0.0000, 1.0000); else
        if (k < 7.1) affineMatrix = mat3(1.0000, -0.0025, -65.2022, 0.0025, 1.0000, -2.2906, 0.0000, 0.0000, 1.0000); else
        if (k < 8.1) affineMatrix = mat3(0.9995, -0.0323, 40.3792, 0.0323, 0.9995, -59.6013, 0.0000, 0.0000, 1.0000); else
        if (k < 9.1) affineMatrix = mat3(1.0000, 0.0050, 0.2161, -0.0050, 1.0000, -28.3120, 0.0000, 0.0000, 1.0000); else
        if (k < 10.1) affineMatrix = mat3(1.0049, 0.0100, -40.8590, -0.0100, 1.0049, -24.9784, 0.0000, 0.0000, 1.0000); else
        if (k < 11.1) affineMatrix = mat3(1.0049, 0.0100, -89.9589, -0.0100, 1.0049, -28.8785, 0.0000, 0.0000, 1.0000);
    } else {
        if (k < 0.1) affineMatrix =  mat3(1.0000, 0.0000, -20.3000, 0.0000, 1.0000, -6.4000, 0.0000, 0.0000, 1.0000); else
        if (k < 1.1) affineMatrix = mat3(0.9998, 0.0199, 7.8960, -0.0199, 0.9998, -15.6980, 0.0000, 0.0000, 1.0000); else
        if (k < 2.1) affineMatrix = mat3(1.0000, -0.0000, 27.1001, 0.0000, 1.0000, -19.7000, 0.0000, 0.0000, 1.0000); else
        if (k < 3.1) affineMatrix = mat3(1.0000, -0.0000, 89.0000, 0.0000, 1.0000, -17.0000, 0.0000, 0.0000, 1.0000); else
        if (k < 4.1) affineMatrix = mat3(0.9950, 0.0000, -32.0511, 0.0000, 0.9950, 31.3390, 0.0000, 0.0000, 1.0000); else
        if (k < 5.1) affineMatrix = mat3(1.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 1.0000); else
        if (k < 6.1) affineMatrix = mat3(1.0039, -0.0080, 40.3436, 0.0080, 1.0039, 14.2622, 0.0000, 0.0000, 1.0000); else
        if (k < 7.1) affineMatrix = mat3(1.0000, 0.0025, 65.2077, -0.0025, 1.0000, 2.1286, 0.0000, 0.0000, 1.0000); else
        if (k < 8.1) affineMatrix = mat3(0.9995, 0.0323, -38.4328, -0.0323, 0.9995, 60.8746, 0.0000, 0.0000, 1.0000); else
        if (k < 9.1) affineMatrix = mat3(1.0000, -0.0050, -0.3568, 0.0050, 1.0000, 28.3106, 0.0000, 0.0000, 1.0000); else
        if (k < 10.1) affineMatrix = mat3(0.9950, -0.0099, 40.4075, 0.0099, 0.9950, 25.2576, 0.0000, 0.0000, 1.0000); else
        if (k < 11.1) affineMatrix = mat3(0.9950, -0.0099, 89.2231, 0.0099, 0.9950, 29.6238, 0.0000, 0.0000, 1.0000); 
    }
    
    affineMatrix = transpose(affineMatrix); 
    
	vec2 uv = fragCoord.xy / iResolution.xy;
    if (yFlipped) uv.y = 1.0 - uv.y; 
    uv = uv * SIZE; 
    vec3 affined = affineMatrix * vec3(uv, 1.0);
    uv = affined.xy / SIZE; 
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) fragColor = vec4(0.2); else fragColor = texture2D(iChannel0, uv); 
}