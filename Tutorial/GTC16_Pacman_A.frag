// data buffer
const float KEY_LEFT = 37.5;
const float KEY_DOWN = 38.5;
const float KEY_RIGHT = 39.5;
const float KEY_UP = 40.5;
const float KEY_ALL = 256.0;
const vec2 PACMAN_INIT_POS = vec2(13.0);
const float GRID_WIDTH = 27.0;
const float GRID_HEIGHT = 31.0;

// find what kind of tile is the position x, y
#define _ 0. // empty
#define W 1. // wall
#define P 2. // point
#define B 3. // ball
#define PA(a,b,c,d,e,f,g) (a+4.*(b+4.*(c+4.*(d+4.*(e+4.*(f+4.*(g)))))))
#define DD(id,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13) if(y==id) m=(x<7)?PA(c0,c1,c2,c3,c4,c5,c6):PA(c7,c8,c9,c10,c11,c12,c13);

// map of walls and points and spaces
float map( in vec2 p ) 
{
    ivec2 q = ivec2( p );
    if( q.x>13 ) q.x = q.x = 26-q.x;
	int x = q.x;
	int y = q.y;
	float m = 0.0;
    DD(30, W,W,W,W,W,W,W,W,W,W,W,W,W,W)
    DD(29, W,P,P,P,P,P,P,P,P,P,P,P,P,W)
    DD(28, W,P,W,W,W,W,P,W,W,W,W,W,P,W)
    DD(27, W,B,W,W,W,W,P,W,W,W,W,W,P,W)
    DD(26, W,P,W,W,W,W,P,W,W,W,W,W,P,W)
    DD(25, W,P,P,P,P,P,P,P,P,P,P,P,P,P)
    DD(24, W,P,W,W,W,W,P,W,W,P,W,W,W,W)
    DD(23, W,P,W,W,W,W,P,W,W,P,W,W,W,W)
    DD(22, W,P,P,P,P,P,P,W,W,P,P,P,P,W)
    DD(21, W,W,W,W,W,W,P,W,W,W,W,W,_,W)
    DD(20, _,_,_,_,_,W,P,W,W,W,W,W,_,W)
    DD(19, _,_,_,_,_,W,P,W,W,_,_,_,_,_)
    DD(18, _,_,_,_,_,W,P,W,W,_,W,W,W,_)
    DD(17, W,W,W,W,W,W,P,W,W,_,W,_,_,_)
    DD(16, _,_,_,_,_,_,P,_,_,_,W,_,_,_)
    DD(15, W,W,W,W,W,W,P,W,W,_,W,_,_,_)
    DD(14, _,_,_,_,_,W,P,W,W,_,W,W,W,W)
    DD(13, _,_,_,_,_,W,P,W,W,_,_,_,_,_)
    DD(12, _,_,_,_,_,W,P,W,W,_,W,W,W,W)
    DD(11, W,W,W,W,W,W,P,W,W,_,W,W,W,W)
    DD(10, W,P,P,P,P,P,P,P,P,P,P,P,P,W)
    DD( 9, W,P,W,W,W,W,P,W,W,W,W,W,P,W)
    DD( 8, W,P,W,W,W,W,P,W,W,W,W,W,P,W)
    DD( 7, W,B,P,P,W,W,P,P,P,P,P,P,P,_)
    DD( 6, W,W,W,P,W,W,P,W,W,P,W,W,W,W)
    DD( 5, W,W,W,P,W,W,P,W,W,P,W,W,W,W)
    DD( 4, W,P,P,P,P,P,P,W,W,P,P,P,P,W)
    DD( 3, W,P,W,W,W,W,W,W,W,W,W,W,P,W)
    DD( 2, W,P,W,W,W,W,W,W,W,W,W,W,P,W)
    DD( 1, W,P,P,P,P,P,P,P,P,P,P,P,P,P)
    DD( 0, W,W,W,W,W,W,W,W,W,W,W,W,W,W)
	return mod(floor(m/pow(4.,mod(float(x),7.0))),4.);
}

bool getKeyDown(float key) {
    return texture2D(iChannel1, vec2(key / KEY_ALL, 0.5)).x > 0.1;
}

vec2 getAPoint() {
    return vec2(50.5 / iChannelResolution[0].xy);    
}

vec2 getPreviousPos(){
    return texture2D(iChannel0, getAPoint()).xy;
}



// Data Buffer from keyboard
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 pacmanPos = vec2(0.0, 0.0); 
    float cell = 0.0; 
    
    if ( iFrame == 0 )
    {
        pacmanPos = PACMAN_INIT_POS;
        if (fragCoord.x < 27.0 && fragCoord.y < 31.0)
        cell = map( fragCoord - 0.5 ); 
        
    }
    else 
    {
        cell = texture2D(iChannel0, fragCoord / iChannelResolution[0].xy).x;
        vec2 previousPos = getPreviousPos();
    	pacmanPos = previousPos; 
        if ( getKeyDown(KEY_LEFT) )  pacmanPos.x--;
        if ( getKeyDown(KEY_DOWN) )  pacmanPos.y++;
        if ( getKeyDown(KEY_RIGHT) ) pacmanPos.x++;
        if ( getKeyDown(KEY_UP) )    pacmanPos.y--;
        
        float tt = texture2D(iChannel0, (pacmanPos + 0.5) / iChannelResolution[0].xy).x;
        if ( abs(tt - P) < 0.1 || abs(tt - B) < 0.1 )
        {
            if (abs(pacmanPos.x - fragCoord.x + 0.5) < 0.1 && 
                abs(pacmanPos.y - fragCoord.y + 0.5) < 0.1
                )
                cell = _;
        } else 
        if ( abs(tt - W) < 0.1) 
        {
        	pacmanPos = previousPos;     
        }
    }
    
    fragColor = vec4(pacmanPos, 0.0, 1.0);
    if (fragCoord.x < GRID_WIDTH && fragCoord.y < GRID_HEIGHT)
        fragColor = vec4(cell, 0.0, 0.0, 0.0); 
}