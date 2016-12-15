// forked and remixed from Prof. Neyret's https://www.shadertoy.com/view/ltBSDV
// Foveated Rendering via Quadtree: https://www.shadertoy.com/view/Ml3SDf#

void mainImage( out vec4 o,  vec2 U )
{
    float r = 0.1, t = iGlobalTime, H = iResolution.y;
    vec2 V = U.xy / iResolution.xy;
    
    U /=  H;                              // foveated region : disc(P,r)
    vec2 P = .5 + .5 * vec2(cos(t), sin(t * 0.7)), fU;  
    U *= .5; P *= .5;                         // unzoom for the whole domain falls within [0,1]^n
    
    float mipmapLevel = 4.0; 
    for (int i = 0; i < 7; ++i) {             // to the infinity, and beyond ! :-)
        //fU = min(U,1.-U); if (min(fU.x,fU.y) < 3.*r/H) { o--; break; } // cell border
    	if (length(P - vec2(0.5)) - r > 0.7) break; // cell is out of the shape
        // --- iterate to child cell
        fU = step(.5, U);                  // select child
        U = 2.0 * U - fU;                    // go to new local frame
        P = 2.0 * P - fU;  
        r *= 2.0;
        mipmapLevel -= 0.5;
    }
    o = texture2D(iChannel0, V, mipmapLevel); 
}