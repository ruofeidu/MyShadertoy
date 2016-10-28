#define GAMMA 2.2
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    /*
	float filter[5][5] = {
		-1, -1, -1, -1, -1,
		-1,  2,  2,  2, -1,
		-1,  2,  8,  2, -1,
		-1,  2,  2,  2, -1,
		-1, -1, -1, -1, -1,
	};

	*/
    
    float filter[25];
    for (int i = 0; i < 25; ++i) filter[i] = -1.0;
    for (int i = 1; i < 4; ++i) for (int j = 1; j < 4; ++j) filter[i*5+j] = 2.0;
    filter[2*5+2] = 8.0;
    
    float weight_sum = 0.0;
    vec3 sum = vec3(0.0); 
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    float px = 1.0 / 512.0;
    float py = 1.0 / 512.0;
    
    for (int x = -2; x <= 2; ++x) {
        for (int y = -2; y <= 2; ++y) {
        	float w = filter[(x + 2) * 5 + y + 2]; 
            sum += w * pow(texture2D(iChannel0, uv + vec2(px * float(x), py * float(y))).rgb, vec3(GAMMA)); 
            weight_sum += w; 
        }
    }
    
	fragColor = vec4(pow(sum / weight_sum, vec3(1.0/GAMMA)),1.0);
}