// credit: https://www.shadertoy.com/view/4ldSD2
// The familiar cubic smoothstep function is widely used in computer graphics. The smooth arrival
// at the endpoints often makes for more natural looking blends than simple linear interpolation.

// Smoothstep has the following constraints: f(0)=0, f(1)=1, df/dx(0)=0 and df/dx(1)=0.
// These 4 constraints uniquely determine the 4 parameters of the cubic.
// f(x) = 3x^2 - 2x^3 = x^2(3 - 2x)
// This can be evaluated efficiently on most platforms with 3 instructions: MAD, MUL, MUL.

// Perhaps counter to intuition, one instruction can be saved by instead evaluating
// a quartic polynomial satisfying the same constraints:
// g(x) = 1 - (1 - x^2)^2.
// g can be evaluated in just two MAD instructions.

// The following code plots the two curves against each other. The cubic smoothstep is green
// and the quartic alternative 'cheapstep' is red.

// Chances are this is already known and documented somewhere, I just haven't been able to find it :)

float smoothstep(float x)
{
    return x*x*(3.0 - 2.0*x);	//MAD, MUL, MUL
}

float cheapstep(float x)
{
    x = 1.0 - x*x;	// MAD
    x = 1.0 - x*x;	// MAD
    return x;
}

vec3 blendCurve(vec3 backgroundColor, vec3 curveColor, float delta)
{
    delta *= iResolution.y * 0.7;
    float alpha = exp2(-delta*delta);
    return mix(backgroundColor, curveColor, alpha);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (fragCoord.xy - vec2((iResolution.x-iResolution.y)*0.5, 0.0)) / iResolution.y;
    uv = (uv - 0.5) * 1.1 + 0.5;
    vec3 col = vec3(1.0);
    float clamped_x = clamp(uv.x, 0.0, 1.0);
    
    vec2 smallGrid = abs(0.5-fract(uv*10.0-0.5))*0.4;
    vec2 bigGrid = abs(0.5-fract(uv-0.5))*2.0;
    
    col = blendCurve(col, vec3(0.8, 0.8, 0.8), min(smallGrid.x, smallGrid.y));
    col = blendCurve(col, vec3(0.0, 0.0, 0.0), min(bigGrid.x, bigGrid.y));
    col = blendCurve(col, vec3(0.0, 1.0, 0.05), smoothstep(clamped_x) - uv.y);
    col = blendCurve(col, vec3(1.0, 0.1, 0.05), cheapstep(clamped_x) - uv.y);
    
	fragColor = vec4(col, 1.0);
}