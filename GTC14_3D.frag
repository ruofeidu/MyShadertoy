// Ruofei Du https://www.shadertoy.com/view/Xt23WD
// modified from iq's GTC '14 tutorial
// This is an excellent resource on ray marching -> http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm

// compute distance of a sphere and a plane
float map( in vec3 p) {
    // many many
    vec3 q = mod( p + 2.0, 4.0) - 2.0; 
    
	//float d1 = length(p) - 1.0;
	float d1 = length(q) - 1.0; 
    d1 += 0.1 * sin(10.0 * p.x ) * sin(10.0 * p.y + iGlobalTime ) * sin(10.0 * p.x); 
    float d2 = p.y + 1.0; 
    
    
    //return min(d1, d2); 
    float k = 1.5; 
    float h = clamp( 0.5 + 0.5 * (d1 - d2) / k, 0.0, 1.0); 
    return mix( d1, d2, h) - k * h * (1.0-h);
    return mix( d1, d2, h);
}

// compute distance of a sphere
float map_sphere( in vec3 p) {
	float d1 = length(p) - 1.0; 
    return d1; 
}



vec3 calcNormal( in vec3 p) {
    vec2 e = vec2( 0.0001, 0.0 ); 
 	return normalize( vec3( map(p + e.xyy) - map(p - e.xyy),
                            map(p + e.yxy) - map(p - e.yxy),
                            map(p + e.yyx) - map(p - e.yyx) ) ); 
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
    
    // go from -1 to 1.
    vec2 coord = 2.0 * uv - 1.0; 
    coord.x *= iResolution.x / iResolution.y; 
    
    vec3 col = vec3(0.0);
    
    // world ray, origin
    vec3 rayOrigin = vec3( 0.0, 0.0, 2.0);
    vec3 rayDirection = normalize( vec3(coord, -1.0) ); 
    
    float h = 1.0; 
    float t = 0.0; 
    float tmax = 50.0; 
    
    for (int i = 0; i < 100; ++i) {
        if (h < 0.0001 || t > tmax ) break; 
        h = map( rayOrigin + t * rayDirection );
        t += h; 
    }
    
    vec3 lig = vec3(0.5773); 
    
    if (t < tmax) {
        col = vec3(1.0); 
        vec3 pos = rayOrigin + t * rayDirection; 
        vec3 nor = calcNormal( pos ); 
        col = vec3(1.0); 
        //col *= nor.x; 
        col = vec3(1.0, 0.8, 0.5) * clamp( dot(nor, lig), 0.0, 1.0 ); 
        col += vec3( 0.2, 0.3, 0.4) * clamp( nor.y, 0.0, 1.0 ); 
        col += 0.1; 
        
        col += vec3(1.0, 0.7, 0.2) * clamp (1.0 + dot(rayDirection, nor), 0.0, 1.0); 
        
        col *= exp( -0.1 * t ); // fog 
    }
    
	fragColor = vec4(col, 1.0);
}