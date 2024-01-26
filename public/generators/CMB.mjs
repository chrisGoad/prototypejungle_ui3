

import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
//import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addSphereMethods} from '/mlib/sphere.mjs';
//import {rs as addPowerGridMethods} from '/mlib/powerGrid.mjs';
let rs = basicsP.instantiate();

//addGridMethods(rs);
addSphereMethods(rs);
//addPowerGridMethods(rs);
	
rs.setName('CMB');

let opa = 0.3;
let r = 255;
let b = 255;



let ht=50;
let topParams = {width:ht,height:ht,framePadding:-0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:1/(8*32),stopTime:1,saveAnimation:1,
  sphereCenter:Point3d.mk(0,0,-20),sphereDiameter:35,focalPoint:Point3d.mk(0,0,50),focalLength:10,cameraScaling:100
}
Object.assign(rs,topParams);

rs.initProtos = function () {
  let polylineP = this.set('polylineP',polylinePP.instantiate()).hide();
  polylineP['stroke-width'] = 0;
}


rs.initialize = function () {
 let {focalPoint,focalLength,cameraScaling} = this;
 this.initProtos();
 this.addFrame();
 this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,'z');
}

/* a normal to x,y,z is <-(y+z)/x,1,1>
  the dot product is 
  x*a + y + z = (-(y+z)/x)*x + y + z = 0;
  
  Then the cross product of x,y,z and a,b,c is a2*b3-a3*b2 , a3*b1-a1*b2, a1*b2-a2*b1  where a1 =x,a2=y,a3=z and b1=a, b2= b,b3 = c
  
  that is <y*c-z*b, z*a-x*b, x*b-y*a> = 
  
  <y-z , z*(-(y+z)/x)-x, x-y*(-(y+z)/x)>
  dotp(<y*1-z*1 , z*(-(y+z)/x)-x*1, x*1-y*(-(y+z)/x)>, <x,y,z>) = 
  
 ( x*y-x*z) + ( y*z*(-(y+z)/x)-y*x)-y*x) + z*x-z*y*(-(y+z)/x)
  (x*y-x*z ) + (-y*z*y/x  -y*z*z/x - y*x) +(z*x + z*y*y/x + z*y*z/x)
  (-y*z*y/x  -y*z*z/x) +( z*y*y/x + z*y*z/x)

  (-y*y*z/x  -y*z*z/x) + y*y*z/x + y*z*z/x)=0!
  
  dotp(<y*1-z*1 , z*(-(y+z)/x)-x*1, x*1-y*(-(y+z)/x)>, <a,b,c>)=
  (y*(-(y+z)/x)-z*(-(y+z)/x)) + z*(-(y+z)/x)-x*1+x*1-y*(-(y+z)/x)=
  -y*y/x-y*z/x+z*y/x+z*z/x-z*y/x-z*z/x-x+z+y*y/x+y*z/x=
  (-y*y/x+y*y/x) + (-y*z/x+y*z/x) + (z*y/x-z*y/x)+(z*z/x-z*z/x)=0!
  */
  
  
rs.pointAtDir = function (dir3d,fr) { //fr = fraction of radius of sphere, dir3d assumed normalized
  let ndir = dir3d.normalize();
  let {sphereDiameter:sd} = this;
  let sr = sd/2;
  let pad = ndir.times(sr);
}

rs.circleRadiusToFr = function (cr) {
  let {sphereDiameter:sd} = this;
  let sr = sd/2;
  let ncr = cr/sr; //circle radius normalized as fraction of unit sphere
  let theta = Math.asin(ncr);
  let fr = Math.cos(theta);
  return fr;
}

rs.coordSystemAtDir = function (zdir) {
  let {x,y,z} = dir3d;
  let a=-(y+z)/x;
  let b = 1;
  let c = 1;
  let xdir = Point3d.mk(a,b,c).normalize();
  let ydir =Point3d.mk(y*c-z*b,z*a-x*b,x*b-y*a);
  let ln = ydir.length();
  console.log('ln',ln);
  let cs ={xdir,ydir,zdir};
  return cs;
}

export {rs}



