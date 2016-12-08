float rand1(vec3 s) {
    //Thanks to Shane for the improved random function
    return fract(cos(dot(s, vec3(7, 157, 113)))*43958.5453);

}

//from here - https://www.shadertoy.com/view/XtGGzz
float rand2(vec3 p) {
	p = fract(p * vec3(443.897, 441.423,392.987));
    p += dot(p, p.yxz+19.19);
    return fract((p.x+p.y)*p.z);

}

#define rand rand2

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    if (iFrame < 10) {
        fragColor = vec4(0.);
    } else {
        vec2 uv = fragCoord/iResolution.xy;
        fragColor = texture2D(iChannel0, uv)+vec4(rand(vec3(uv,float(iFrame)/4096.)),1.,0.,0.);
    }
}

// Test
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec4 samp = texture2D(iChannel0, uv);
	fragColor = vec4(clamp(.5+(samp.x/samp.y-0.5)*(pow(10.,2.*uv.x)),0.,1.));
}