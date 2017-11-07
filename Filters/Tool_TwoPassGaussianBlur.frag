const int mSize = 11;
const int kSize = (mSize-1)/2;
const float sigma = 7.0;
float kernel[mSize];
#define TWO_PASS_GAUSSIAN

float normpdf(in float x, in float sigma)
{
	return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
#ifndef TWO_PASS_GAUSSIAN
    vec3 final_colour = vec3(0.0);

    float Z = 0.0;
    for (int j = 0; j <= kSize; ++j)
    {
        kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);
    }

    for (int j = 0; j < mSize; ++j)
    {
        Z += kernel[j];
    }

    for (int i=-kSize; i <= kSize; ++i)
    {
        for (int j=-kSize; j <= kSize; ++j)
        {
            final_colour += kernel[kSize+j]*kernel[kSize+i]*texture2D(iChannel0, (fragCoord.xy+vec2(float(i),float(j))) / iResolution.xy).rgb;

        }
    }

    fragColor = vec4(final_colour/(Z*Z), 1.0);
#else
    vec3 final_colour = vec3(0.0);
    float sigma = 7.0;
    float Z = 0.0;
    for (int j = 0; j <= kSize; ++j)
    {
        kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);
    }

    for (int j = 0; j < mSize; ++j)
    {
        Z += kernel[j];
    }

    for (int i=-kSize; i <= kSize; ++i)
    {
        final_colour += kernel[kSize+i]*texture2D(iChannel1, (fragCoord.xy+ vec2(0.0,float(i)) ) / iResolution.xy).rgb;
    }
    
    
    fragColor = vec4(final_colour / Z, 1.0);
#endif
}