float gamma = 0.55;
float Cubic (float value) {
    // Possibly slightly faster calculation
    // when compared to Sigmoid

    if (value < 0.5) {
        return value * value * value * value * value * 16.0; 
    }
    
    value -= 1.0;
    return value * value * value * value * value * 16.0 + 1.0;
}

float Sigmoid (float x) {
	//return 1.0 / (1.0 + (exp(-(x * 14.0 - 7.0))));
    return 1.0 / (1.0 + (exp(-(x - 0.5) * 14.0))); 
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 uv = fragCoord.xy / iResolution.xy;
	
    vec4 C = texture2D(iChannel0, uv);
   	vec4 A = C; 
    
   	C = vec4(Cubic(C.r), Cubic(C.g),Cubic(C.b), 1.0); 
   	//C = vec4(Sigmoid(C.r), Sigmoid(C.g),Sigmoid(C.b), 1.0); 
       
   	C = pow(C, vec4(gamma));    
    fragColor = C;
}