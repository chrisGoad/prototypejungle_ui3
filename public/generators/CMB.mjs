

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
  sphereCenter:Point3d.mk(0,0,-20),sphereDiameter:35,focalPoint:Point3d.mk(0,0,5000),focalLength:1000,cameraScaling:10,numSegs:40
}
Object.assign(rs,topParams);

rs.initProtos = function () {
  let polylineP = this.set('polylineP',polylinePP.instantiate()).hide();
  polylineP['stroke-width'] = 0.05;
  polylineP.stroke  = 'white';
}


rs.initialize = function () {
 let {focalPoint,focalLength,cameraScaling} = this;
 debugger;
 this.initProtos();
 this.addFrame();
 this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,'z');
 let xy =.4;
 let dir0 = Point3d.mk(xy,0,1).normalize();
 let dir1 = Point3d.mk(0,xy,1).normalize();
 let dir2 = Point3d.mk(-xy,0,1).normalize();
 let dir3 = Point3d.mk(0,-xy,1).normalize();
 let poly0 = this.circleAtDir({dir:dir0,circleRadius:1});
 this.set('poly0',poly0);
 let poly1 = this.circleAtDir({dir:dir1,circleRadius:1});
 this.set('poly1',poly1);
 let poly2 = this.circleAtDir({dir:dir2,circleRadius:1});
 this.set('poly2',poly2);
 let poly3 = this.circleAtDir({dir:dir3,circleRadius:1});
 this.set('poly3',poly3);
 let d2r = Math.PI/180;
 for (let i=0;i<9;i++) {
   let nm = 'lat'+i+'0';
   let lat = this.latitudeLine(i*10*d2r);
   this.set(nm,lat);
 }
}

/* a normal to x,y,z is <-(y+z)/x,1,1>
/* a normal to x,y,z 
  the dot product is 
  x*a + y + z = (-(y+z)/x)*x + y + z = 0;

another is <1,1,-(y+x)/z>


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
  let r2d = 180/Math.PI;
  let d = theta*r2d
 
  let fr = Math.cos(theta);
  let sn = Math.sin(theta);
  console.log('d',d,'fr',fr);
  return fr;
}


rs.coordinateSystemAtDir = function (zdir) {
  let {x,y,z} = zdir;
 /* let a=-(y+z)/x;
  let b = 1;
  let c = 1;*/
  let a=1;
  let b = 1;
  let c = -(x+y)/z;
  let xdir = Point3d.mk(a,b,c).normalize();
  //let ydir =Point3d.mk(y*c-z*b,z*a-x*b,x*b-y*a);
  //let ydir =this.crossProduct(zdirxdir);
  let ydir =zdir.crossP(xdir);
  console.log('xdir.dotp(ydir)',xdir.dotp(ydir));
  console.log('xdir.dotp(zdir)',xdir.dotp(zdir));
  console.log('ydir.dotp(zdir)',ydir.dotp(zdir));
  console.log('lnx',xdir.length());
  console.log('lny',ydir.length());
  console.log('lnz',zdir.length());
  let cs ={xdir,ydir,zdir};
  return cs;
}

rs.getOrigin = function (dir) {
  let  {sphereDiameter:sd,polylineP,numSegs:ns} = this;
  let sr = sd/2;
  let o = dir.times(sr*fr);
  let p = this.camera.project(p3d)
  return p;
}
rs.circleAtDir = function (params) {
  let {circleRadius:cr,dir} = params;
  let {sphereDiameter:sd,polylineP,numSegs:ns} = this;
  let sr = sd/2;
  let fr = this.circleRadiusToFr(cr);
 // fr=1;
  let cs = this.coordinateSystemAtDir(dir);
  let {xdir,ydir,zdir} = cs;
  let o = zdir.times(sr*fr);
  let inc = (2*Math.PI)/ns;
  let wps = [];
  for (let i=0;i<ns;i++) {
    let x = Math.cos(i*inc);
    let y = Math.sin(i*inc);
    let ofs =  xdir.times(cr*x);
    ofs = ofs.plus(ydir.times(cr*y));
    let p3d = o.plus(ofs);
    let p = this.camera.project(p3d)
    wps.push(p);
  }
  wps.push(wps[0]);
  let poly = this.polylineP.instantiate();
  poly.wayPoints = wps;
  poly.show();
  poly.update();
  return poly;
}

rs.latitudeLine = function (lat) {
  let {sphereDiameter:sd,numSegs} = this;
  let sr = sd/2;
  let cr = sr*Math.cos(lat);
  let inc = (2*Math.PI)/numSegs;
  let z = sr*Math.sin(lat);
  let wps = [];
  for (let i=0;i<numSegs;i++) {
    let a = inc*i;
    let x = cr*Math.cos(a);
    let y = cr*Math.sin(a);
    let p3d = Point3d.mk(x,y,z);
    let p = this.camera.project(p3d);
    wps.push(p);
  }
  wps.push(wps[0]);
  let poly = this.polylineP.instantiate();
  poly.wayPoints = wps;
  poly.show();
  poly.update();
  return poly;
}
    
  
  
    
  

export {rs}



