/** 
 * Equirectangular Fibonacci Sphere
 * Link to demo: https://www.shadertoy.com/view/Ms2yDK
 * starea @ ShaderToy
 *
 * Most of the code is forked from:
 * [1] nomadiclizard's Dragon Egg. https://www.shadertoy.com/view/MslyRr
 * Thank you nomadiclizard for sharing!
 * I added the equirectangular part and orange circles to mimic the Kusama style (https://hirshhorn.si.edu/kusama/).
 *
 * Reference: 
 * [1] Keinert, Benjamin, et al. "Spherical fibonacci mapping." ACM Transactions on Graphics (TOG) 34.6 (2015): 193.
       http://lgdv.cs.fau.de/uploads/publications/spherical_fibonacci_mapping.pdf
 * [2] https://www.openprocessing.org/sketch/41142
 * [3] http://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere
 *
 * My Related Shaders:
 * [1] Unified Gnomonic & Stereographic Projections. https://www.shadertoy.com/view/ldBczm
 * [2] Cubemap to Gnomonic Projection. https://www.shadertoy.com/view/4sjcz1
 * [3] [WiP] Halftone Sphere. https://www.shadertoy.com/view/4sSyD1
 *
 **/

#define pi 3.14159265359
#define twoPi 6.28318530718
#define halfPi 1.57079632679
#define infinity 100.0
#define phi 1.61803398875
#define phiMinusOne 0.61803398875
#define twoPiOnPhi 3.88322207745
#define root5 2.2360679775
#define logPhiPlusOne 0.96242365011
#define EQUIRECTANGULAR true
#define KUSAMA_COLOR true
//#define TIME iTime
#define TIME 5.0

// egg definition and colouring
const float maxn = 50.0;
const float growtime = 5.0;
const bool convex = true;
const float f1 = 856.0, s1 = 3.0, a1 = 0.15;
const float f2 = 335.0, s2 = 2.0, a2 = 0.10;

// SIMPLE STUFF THAT WOULD BE COOL IF WEBGL HAD IN A STANDARD LIBRARY :V

vec3 lookat(vec3 p1, vec3 p2)
{
    return normalize(p2 - p1);
}

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec4 rotationQuat(vec3 axis, float angle)
{
    axis = normalize(axis);
    float c = cos(0.5 * angle);
    float s = sqrt(1.0 - c * c);
    return vec4(axis.x * s, axis.y * s, axis.z * s, c);
}

vec3 rotate(vec3 p, vec4 q)
{
	return p + 2.0 * cross(q.xyz, cross(q.xyz, p) + q.w * p);
}

vec3 rotate(vec3 p, vec3 axis, float angle)
{
    return rotate(p, rotationQuat(axis, angle));
}

mat4 translationMatrix(vec3 p)
{
    return mat4(1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                p.x, p.y, p.z, 1.0);
}

mat4 scaleMatrix(float s)
{
    return mat4(s,   0.0, 0.0, 0.0,
                0.0, s,   0.0, 0.0,
                0.0, 0.0, s,   0.0,
                0.0, 0.0, 0.0, 1.0);
}

// k'th fibonacci number
float calcfk(float k)
{
	return round(pow(phi, k) / root5);
}

// calculates a basis vector for fibonacci sphere n
vec2 calcbk(float fk, float n)
{
    return vec2(twoPi * fract((fk + 1.0) * phiMinusOne) - twoPiOnPhi,
                -2.0 * fk / n);
}

// calc point i of n in spherical coordinates
vec2 calcpoint(float i, float n)
{
    return vec2(twoPi * fract(i * phiMinusOne),
                1.0 - (2.0 * i + 1.0) / n);
}

// converts [phi,cos theta] into [x,y,z] for unit sphere
vec3 s2c(vec2 s)
{
    float sinTheta = sqrt(1.0 - s.y * s.y);
    return vec3(cos(s.x) * sinTheta,
                sin(s.x) * sinTheta,
                s.y);
}

// converts [x,y,z] into [phi, cos theta] for unit sphere
vec2 c2s(vec3 c)
{
    return vec2(atan(c.y, c.x),
                c.z);
}

// angle between two points in spherical coords
float angdist(vec2 sp1, vec2 sp2)
{
    float sinTheta1 = sqrt(1.0 - sp1.y * sp1.y);
    float sinTheta2 = sqrt(1.0 - sp2.y * sp2.y);
    return acos(sp1.y * sp2.y + sinTheta1 * sinTheta2 * cos(sp2.x - sp1.x));
}

// calculate new point [phi, cos theta] if walking point sp on bearing ib distance d
vec2 gcircle(vec2 sp, float ib, float d)
{
    float cosd = cos(d);
    float sind = sin(d);
    float sinTheta1 = -sp.y;
    float cosTheta1 = sqrt(1.0 - sp.y * sp.y);
    float sinTheta2 = sinTheta1 * cosd + cosTheta1 * sind * cos(ib);
    float theta2 = asin(sinTheta2);
    float phi2 = sp.x + atan(sin(ib) * sind * cosTheta1, cosd - sinTheta1 * sinTheta2);
    return vec2(mod(phi2, twoPi), cos(theta2 + halfPi));
}

// 0..1 for seed x
float random(float x)
{
    return fract(abs(sin(x * 12.9898) * 43758.5453));
}

// distance to nearest cell on a fibonacci sphere
float fibspheren(vec3 p, float n, out float minidx, out vec3 sn)
{
    // get spherical coords for point p on surface of unit sphere
    vec2 sp = c2s(p);
    float avdist = sqrt(4.0 * pi / n);
    
    // calc the dominant zone number
    float k = max(2.0, floor(log(root5 * n * pi * (1.0 - sp.y * sp.y)) / logPhiPlusOne));   
    
    // calc basis vectors for this zone
    // [could all be precalculated and looked up for k,n]
    vec2 f = vec2(calcfk(k), calcfk(k + 1.0));
    vec2 bk = calcbk(f[0], n);
    vec2 bk1 = calcbk(f[1], n);
    mat2 b = mat2(bk, bk1);
    mat2 invb = inverse(b);
    
    // change of basis for point sp to local grid uv
    float z0 = 1.0 - 1.0 / n;
    vec2 c = floor(invb * (sp - vec2(0.0, z0)));
    
    // for k<=4 paper suggests using (-1,0,+1)^2 offset factors but we'll
    // stick with (0,1)^2 and live with the occasional glitches
    float mindist = pi;
    vec2 minisp;
    for (int s = 0; s < 4; s++) {
        // figure out the point index and generate fib point
        vec2 o = vec2(s - (s/2) * 2, s / 2);
        float idx = dot(f, c + o);
        if (idx > n) continue;        
        vec2 isp = calcpoint(idx, n);
        
        // walk on a random bearing a random distance to make cells move a bit
        //float b = mod((-0.05 + 0.1 * random(idx + 42.39)) * iTime, twoPi);
        //float d = dist * random(idx + 28.93) * cos((-0.5 + 1.0 * random(idx + 42.39)) * iTime);
        //isp = gcircle(isp, b, d);
        
        // closest?
        float dist = angdist(isp, sp);
        if (dist < mindist) {
			mindist = dist;
            minidx = idx;
            minisp = isp;
        }
    }
    
    // use nearest point to calculate surface normal via rotation around cotangent from p -> ip
    // ohhhh wow I can make keeled scales real easy if dist varies by direction!
    vec3 ip = s2c(minisp), cotan;
    if (convex) {
        cotan = cross(ip - p, p);
    } else {
        cotan = cross(p - ip, p);
    }
    sn = rotate(p, cotan, mindist / avdist);
    return mindist;
}

// view stuff
const float fov = radians(50.0);
const vec3 up = vec3(0.0, 1.0, 0.0);
const vec3 right = vec3(1.0, 0.0, 0.0);
const vec3 forward = vec3(0.0, 0.0, -1.0);

// calculates intersection parameters for a ray through a sphere at sp radius r
// return true if the halfray ro + t1.rd is hitting
bool spherehit(vec3 sp, float r, vec3 ro, vec3 rd, out float t1, out float t2)
{
    vec3 rosp = ro - sp;
    float a = dot(rd, rd);
    float b = 2.0 * dot(rd, rosp);
    float c = dot(rosp, rosp) - (r * r);
    float b2m4ac = b * b - 4.0 * a * c;
    if (b2m4ac >= 0.0) {
        float r = sqrt(b2m4ac);
        t1 = (-b - r) / (2.0 * a);
        t2 = (-b + r) / (2.0 * a);
        return t1 >= 0.0 || t2 >= 0.0;
    } else {
        return false;
    }
}


bool spherehitd(vec3 sp, float r, vec3 ro, vec3 rd, out float t1, out float t2)
{
    return true; 
}

// black -> white via red and yellow for 0,1
vec4 falsecolourr(float x, float stretch)
{
    float px = pow(clamp(x, 0.0, 1.0), stretch) * pi;
    return vec4(sin(clamp(px, 0.0, halfPi)),
                sin(clamp(px - pi / 3.0, 0.0, halfPi)),
                sin(clamp(px - 2.0 * pi / 3.0, 0.0, halfPi)),
                1.0);
}

// black -> white via green and cyan for 0,1
vec4 falsecolourg(float x, float stretch)
{
    float px = pow(clamp(x, 0.0, 1.0), stretch) * pi;
    return vec4(sin(clamp(px - 2.0 * pi / 3.0, 0.0, halfPi)),
                sin(clamp(px, 0.0, halfPi)),
                sin(clamp(px - pi / 3.0, 0.0, halfPi)),
                1.0);
}

void render(out vec4 fragColor, in vec2 fragCoord, vec3 ro, vec3 rd)
{
    
    // number of points in fibsphere
    float n = pow(2.0, log(maxn) / log(2.0) * smoothstep(0.0, 1.0, TIME / growtime)); 
    
    // fibsphere location and size
    vec3 sp = vec3(0.0);
	if (!EQUIRECTANGULAR) sp = vec3(0.0, 0.0, -2.0);
    float sr = pow((n / maxn), 0.333) * (1.0 + 0.01 * cos(TIME));
    
    // mouse rotates it
    float r1 = (iMouse.x / iResolution.x - 0.5) * twoPi;
    float r2 = (iMouse.y / iResolution.y - 0.5) * twoPi;
    r1 += TIME * 0.25;
    
    // transform and inverse matrices
    mat4 ms = scaleMatrix(1.0 / sr) *
              translationMatrix(-sp);
    mat4 mr = rotationMatrix(forward, -r1) *
              rotationMatrix(right, -r2);
    mat4 mmr = rotationMatrix(right, r2) *
        	   rotationMatrix(forward, r1);
    
    
    // check if an intersection is possible (in world space)
    float t1, t2;
    if (spherehit(sp, sr, ro, rd, t1, t2)) {
        
        
        vec4 wp = vec4(ro + t1 * rd, 1.0);
    	// calculate hit of fibsphere (back in model space)
        vec3 mp = vec3(mr * ms * wp), msn;
        float idx, ir = fibspheren(mp, n, idx, msn);
        
        // surface normal back in world coords
        vec3 sn = vec3(mmr * vec4(msn, 1.0));
        
        // colour it all pretty - similar to adding octaves of noise
        // overlaying lots of waves gives it a cool mesmerising effect
        float vrange = 0.5 + a1 * cos(f1 * (idx / maxn) + s1 * TIME) +
            			a2 * cos(f2 * (idx / maxn) + s2 * TIME);
        
        vec3 c = vec3(0.0, 1.0, 0.0); 
       // if (idx < 0.5) c = vec3(1.0, 0.0, 0.0); 
        if (KUSAMA_COLOR) c = vec3(0.86, 0.78, 0.1);
        c*=smoothstep(.02, .0 , ir-0.1 + sin(iTime+idx)*.05);
        //if (ir > 0.1 + sin(iTime + idx) * 0.05) c = vec3(0.0); 
        fragColor = vec4(c, 1.0); 
        
        
    	// define the spherical coordinates, [-1, 1]
    	//vec2 s = vec2(acos(sn.z), atan(sn.y, sn.x)) / pi; 
    	//fragColor = texture(iChannel0, s);
        
    } else {
        fragColor = vec4(1.0); 
        //fragColor = 0.3 + 0.3 * vec4(fragCoord.y / iResolution.y);
    }
    
     
}

void mainVR(out vec4 fragColor, in vec2 fragCoord, in vec3 ro, in vec3 rd)
{
    // the VR version does it for us
    render(fragColor, fragCoord, ro, rd);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{    
    // figure out where to look
    vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 ro = vec3(0.0, 0.0, 0.0);
    vec3 rd = lookat(ro, vec3(uv.x * tan(fov), uv.y * tan(fov), -1.0));
    
    if (EQUIRECTANGULAR) {
   		vec2 sph = fragCoord.xy / iResolution.xy * vec2(twoPi, pi);
    	rd = vec3(sin(sph.y) * sin(sph.x), cos(sph.y), sin(sph.y) * cos(sph.x)); 
    }
    render(fragColor, fragCoord, ro, rd);
}