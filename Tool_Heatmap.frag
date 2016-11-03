vec3 heatMap(float greyValue) {   
	vec3 heat;      
    heat.r = smoothstep(0.5, 0.8, greyValue);
    if(greyValue >= 0.90) {
    	heat.r *= (1.1 - greyValue) * 5.0;
    }
	if(greyValue > 0.7) {
		heat.g = smoothstep(1.0, 0.7, greyValue);
	} else {
		heat.g = smoothstep(0.0, 0.7, greyValue);
    }    
	heat.b = smoothstep(1.0, 0.0, greyValue);          
    if(greyValue <= 0.3) {
    	heat.b *= greyValue / 0.3;     
    }
	return heat;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
	//fragColor = vec4(texture2D(iChannel0, uv).rgb, 1.0); 
	fragColor = vec4(heatMap(texture2D(iChannel0, uv).r), 1.0); 
}