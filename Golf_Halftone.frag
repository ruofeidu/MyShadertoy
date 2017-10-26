// forked from my: https://www.shadertoy.com/view/lsSfWV
// taken Dr. Neyret and coyote's advices

void mainImage( out vec4 O, vec2 u )
{
    vec2 R = iResolution.xy, 
         M = iMouse.xy / R,
         S = ( M.y < 1e-3 ? 6.
                          : mix(3., 5.5, M.x/M.y) ) / R;
      
    O = vec4( length( M= mod( u/R, S) - S*.5 ) <
               dot( texture(iChannel0, u/R - M),  vec4( .21, .72, .07, 0) ) *
                S.x * ( 1. + .3 * sin(iTime) ) );
}
