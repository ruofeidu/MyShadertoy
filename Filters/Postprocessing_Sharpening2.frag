void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    
	vec2 step = 1.0 / iResolution.xy;
	
	vec3 texA = texture2D( iChannel0, uv + vec2(-step.x, -step.y) * 1.5 ).rgb;
	vec3 texB = texture2D( iChannel0, uv + vec2( step.x, -step.y) * 1.5 ).rgb;
	vec3 texC = texture2D( iChannel0, uv + vec2(-step.x,  step.y) * 1.5 ).rgb;
	vec3 texD = texture2D( iChannel0, uv + vec2( step.x,  step.y) * 1.5 ).rgb;
   
    vec3 around = 0.25 * (texA + texB + texC + texD);
	vec3 center  = texture2D( iChannel0, uv ).rgb;
	vec3 col = center + (center - around);
    fragColor = vec4(col,1.0);
}
