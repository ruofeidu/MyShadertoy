const float PI = 3.14159265358979;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy; 	// [0,1]
	float logmax = log(length(iResolution.xy * 0.5));
        
    vec2 uvv = uv * 2.0 - 1.0;						//[-1, 1] 

            // [1..length(iResolution.xy * 0.5]
    float x = exp(uv.x * logmax) * cos(uv.y * PI * 2.0);
    // x -= 1.0; 
    //x /= (iResolution.x - 1.0) * 0.5;
    x /= iResolution.x * 0.5;
    x = (x + 1.0) * 0.5; 
    float y = exp(uv.x * logmax) * sin(uv.y * PI * 2.0 ); 
  	//y -= 1.0; 
    //y /= (iResolution.y - 1.0) * 0.5;
    y /= iResolution.y * 0.5;
    y = (y + 1.0) * 0.5; 
    
   fragColor = vec4( texture2D(iChannel0, vec2(x, y), 1.0).rgb, 1.0); 
}