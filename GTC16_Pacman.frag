// https://www.shadertoy.com/view/XlVGzR
// learning from GTC' 16 iq and pol's talk: http://on-demand.gputechconf.com/gtc/2016/video/S6717.html
#define EMPTY 0. // empty
#define WALL 1. // wall
#define POINT 2. // point
#define BALL 3. // ball
#define TH 0.5

const float GRID_WIDTH = 27.0;
const float GRID_HEIGHT = 31.0;
const float GRID_LENGTH = GRID_HEIGHT;
const vec3 PACMAN_COLOR = vec3(1.0, 1.0, 0.0);
const vec3 CELL_COLOR = vec3(1.0, 1.0, 0.0);
const vec3 WALL_COLOR = vec3(0.0, 0.0, 1.0);
const vec3 POINT_COLOR = vec3(1.0, 0.0, 1.0);
const vec3 BALL_COLOR = vec3(1.0, 0.0, 1.0);
const float PACMAN_SIZE = 0.50; 
const float PACMAN_FADE_RADIUS = 0.01; 
const float BALL_SIZE = 0.10; 
const float BALL_FADE_RADIUS = 0.01; 
const float GHOST_SIZE = 0.50; 
const float GHOST_FADE_RADIUS = 0.01; 

vec2 getAPoint() {
    return vec2(50.5 / iChannelResolution[0].xy);    
}

vec2 getPreviousPos(){
    return texture2D(iChannel0, getAPoint()).xy + 0.5;
}

vec2 getGridPosition(in vec2 fragCoord)
{
    return GRID_LENGTH * fragCoord / iResolution.y; 
}

float sdCircle(vec2 gridPos, vec2 renderPos, float size, float radius)
{
    float r = length( gridPos - renderPos );
    return 1.0 - smoothstep( size, size + radius, r ); 
}

float sdCircle(float r, float size, float radius)
{
    return 1.0 - smoothstep( size, size + radius, r ); 
}


float sdBox( vec2 p, vec2 b )
{
    vec2 d = abs(p) - b;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdBox( vec2 p, vec2 a, vec2 b )
{
    p -= (a+b)*0.5;
    vec2 d = abs(p) - 0.5*(b-a);
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCircle( in vec2 p, in float r )
{
    return length( p ) - r;
}

vec3 drawMap( vec3 col, in vec2 fragCoord)
{
    vec2 pp = getGridPosition(fragCoord); 
    vec2 pi = floor(pp); 
    vec2 pf = fract(pp); 
    
    float cell = texture2D(iChannel0, vec2((pi + 0.5) / iChannelResolution[0].xy)).x;
    
    if (pi.x < GRID_WIDTH) 
    {
        if (cell < EMPTY + TH)
        {
            
        }
        else if (cell < WALL + TH )
        {
            //col = WALL_COLOR; 
            float lc = texture2D(iChannel0, vec2((pi + 0.5 + vec2(-1.0, 0.0)) / iChannelResolution[0].xy)).x;
            float rc = texture2D(iChannel0, vec2((pi + 0.5 + vec2( 1.0, 0.0)) / iChannelResolution[0].xy)).x;
            float bc = texture2D(iChannel0, vec2((pi + 0.5 + vec2( 0.0,-1.0)) / iChannelResolution[0].xy)).x;
            float tc = texture2D(iChannel0, vec2((pi + 0.5 + vec2( 0.0, 1.0)) / iChannelResolution[0].xy)).x;
            
            float lw = step(0.1, abs(lc - 1.0)); 
            float rw = step(0.1, abs(rc - 1.0)); 
            float bw = step(0.1, abs(bc - 1.0)); 
            float tw = step(0.1, abs(tc - 1.0)); 
            
            
            float ls = 0.5 - 0.4 * lw; 
            float bs = 0.5 - 0.4 * bw; 
            float rs = 0.5 - 0.4 * rw; 
            float ts = 0.5 - 0.4 * tw; 
            
			float r = sdBox( pf - 0.5, vec2(-ls, -bs), vec2(rs, ts) );
            float f = 1.0 - smoothstep( 0.10, 0.11, r);
            // vec3 wco = 0.5 + 0.5 * cos( (lw + rw + bw + tw) + vec3(0.0, 1.0, 2.0) ); 
            vec3 wco = 0.5 + 0.5 * cos( 3.5 + 0.25 * (lw + rw + bw + tw) + vec3(0.0, 1.0, 2.0) ); 
            wco += 0.1 * cos(300.0 * r); 
            col = mix(col, wco, f); 
        }
        else if (cell < POINT + TH)
        {
            float r = length(pf - 0.5);
            float f = sdCircle(r, BALL_SIZE, BALL_FADE_RADIUS );
            col = mix(col, BALL_COLOR, f); 
            
            col += vec3(1.0, 0.0, 1.0) * exp( -10.0 * r * r ); // glow
        }
        else 
   		// GHOST
        {
            float r = length(pf - 0.5);
            float f = sdCircle(r, GHOST_SIZE, GHOST_FADE_RADIUS );
            f *= sin(iGlobalTime * 10.0); 
            col = mix(col, BALL_COLOR, f); 
        }
    }
    
    return col; 
}

vec3 drawPacman( vec3 col, in vec2 fragCoord)
{
    vec2 pp = getGridPosition(fragCoord);
    vec2 pacmanPos = getPreviousPos();
    
    float r = length(pp - pacmanPos); 
    float f = sdCircle(r, PACMAN_SIZE, PACMAN_FADE_RADIUS); 
    col = mix( col, PACMAN_COLOR, f );
            
    col += 0.5 * PACMAN_COLOR * exp( -1.0 * r * r ); // glow
    return col; 
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    
    vec3 col = vec3(0.0);
    
    col = drawMap( col, fragCoord ); 
    col = drawPacman( col, fragCoord ); 
    
	fragColor = vec4(col, 1.0);
	// fragColor = vec4(texture2D(iChannel0, uv * 0.1).xyz, 1.0);
	//fragColor = vec4(texture2D(iChannel0, uv).xyz, 1.0);
}