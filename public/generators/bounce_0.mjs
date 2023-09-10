import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
let rs = basicP.instantiate();
addAnimationMethods(rs);

rs.setName('bounce_0');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:0.2,stopTime:10}

Object.assign(rs,topParams);

/*
(Ax + Vx*t-Px)**2+ (Ay + Vy*t-Py)**2 = r1+r2;

Cx = Ax-Px;
Cy = Ay-Py;

(Cx+Vx*t)**2+(Cy+Vy*t)**2 = r1+r2;
(Cx**2 +2*Cx*Vx*t + (Vx*t)**2)+(Cy**2 +2*Cy*Vy*t + (Vy*t)**2) = r1+r2;
(Cx**2+Cy**2 - r1-r2)+t*(2*Cx*Vx+2*Cy*Vy) + (t**2)*(Vx+Vy) = 0;

a=Vx+Vy;
b = 2*Cx*Vx+2*Cy*Vy;
c = Cx**2+Cy**2-r1-r2;

t = (-b +- sqrt(b**2-4*a*c))/(2*a)
*/


rs.solveForT1 = function (params) {
  debugger;
  let {A,V,P,r1,r2} = params;
  let {x:Ax,y:Ay} = A;  
  let {x:Vx,y:Vy} = V;
  let {x:Px,y:Py} = P;
  let vAP = A.difference(P);
  let {x:Cx,y:Cy} = vAP;
  //let a = Vx+Vy;
  let a = Vx*Vx+Vy*Vy;
  let b =2*(Cx*Vx+Cy*Vy); 
  let r = r1+r2;
  let c = Cx*Cx+Cy*Cy-r*r; 
//  t = (-b +- sqrt(b**2-4*a*c))/(2*a)

  
  let itrm = b*b-4*a*c;
  if (itrm < 0) {
    return undefined;
  }
  let itrm1 = Math.sqrt(itrm);
  let t1 = (itrm1 -b)/(2*a);
  let t0 = -(itrm1 +b)/(2*a);
  const tpos=  (t) => {
     return A.plus(V.times(t));
  }
   const check0 =  (t) => {
     let p = tpos(t);
     return p.distance(P);
  }
   const check1 =  (t) => {
     return a*t*t+b*t+c;
  }
  let p0 = tpos(t0);
  let p1 = tpos(t1);
  let ckp0  = check0(t0);
  let ckp1  = check0(t1);
  let ck0 = check1(t0);
  let ck1 = check1(t1);
  debugger;
  //return [p0,p1,t0,t1];
  return t0;
}
rs.solveForT = function (particle1,particle2) {
  let {ray:ray1,radius:r1} = particle1;
  let {ray:ray2,radius:r2} = particle2;
  let {initialPosition:ip1,velocity:v1} = ray1;
  let {initialPosition:ip2,velocity:v2} = ray2;
  let params = {A:ip1,V:v1,P:ip2,r1,r2};
  let t = this.solveForT1(params);
  return t;
}

rs.bounceOffXY = function (ray,xyv,offY) {
  let {initialPosition:ip,velocity:v} = ray;
  let {x,y} = ip;
  let {x:vx,y:vy} = v;
  let slope = vy/vx;
  let intsct = offY?y + xyv*slope:x + xyv*1/slope;
  let a = Math.atan2(vy,vx);
  let na = offY?Math.PI-a:-a;
  let nv = Point.mk(Math.cos(na),Math.sin(na));
  let nip = offY?Point.mk(xyv,intsct):Point.mk(intsct,xyv);
  let nray = {initialPosition:nip,velocity:nv};
  return nray;
}

rs.collide = function (params) {
  let  {v1,v2,x1,x2,m1,m2} =params;
//  debugger;
  let x1mx2ln = (x1.difference(x2)).length();
  let sqx1mx2ln = x1mx2ln*x1mx2ln;
  let itrm1 = (2*m2/(m1+m2))* (v1.difference(v2).dotp(x1.difference(x2))/sqx1mx2ln);
  let nv1 = v1.difference(x1.difference(x2).times(itrm1));
  
  //let x1mx2ln = (x1.difference(x2)).length();
  //let sqx1mx2ln = x1mx2ln*x1mx2ln;
  let itrm2 = (2*m1/(m1+m2))* (v2.difference(v1).dotp(x2.difference(x1))/sqx1mx2ln);
  let nv2 = v2.difference(x2.difference(x1).times(itrm2));
  return [nv1,nv2];
}
// p2 assumed stationary, 
rs.collideParticles = function (particle1,particle2) {
  let {ray:ray1,mass:mass1,radius:radius1,position:pos1} = particle1;
  let {ray:ray2,mass:mass2,radius:radius2,position:pos2} = particle2;
  let {velocity:v1} = ray1;
  let {velocity:v2} = ray2;
  let params = {v1,v2,x1:pos1,x2:pos2,m1:mass1,m2:mass2};
  let colres = this.collide(params);
  return colres;
}
/*
particle = {ray,mass,startTime,position,shape,radius}
*/

rs.updatePosition = function (particle,t) {
  let {ray,mass,startTime,shape} = particle;
  let {initialPosition:ip,velocity:v} = ray;
  let deltaT = t-startTime;
  let np = ip.plus(v.times(deltaT));
  particle.position = np;
  if (shape) {
    shape.moveto(np);
    shape.update();
  }
}

rs.updatePositions = function (t) {
  let {particles} = this;
  particles.forEach( (p) => {
    this.updatePosition(p,t);
  });
}
    





rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
}

rs.dpyLineCnt = 0;
rs.displayLine = function(e0,e1,stroke) {
  let {lineP,dpyLineCnt} = this;
  let nm = 'line_'+dpyLineCnt;
  this.dpyLineCnt = dpyLineCnt+1;
  let line = lineP.instantiate();
  this.set(nm,line);
  line.setEnds(e0,e1);
  if (stroke) { 
    line.stroke = stroke;
  }
  line.update();
}

rs.circleCount = 0;
rs.mkCircleForParticle = function (particle) {
  let {circleCount:ccnt,circleP} = this;
  let {radius,stroke} = particle;
  let circ = circleP.instantiate();
  let nm = 'circle_'+ccnt;
  this.circleCount = ccnt+1;
  this.set(nm,circ);
  circ.dimension = 2*radius;
  if (stroke) {
    circ.stroke = stroke;
  }
  particle.shape = circ;
  return circ;
}
 
rs.mkCirclesForParticles = function (particles) {
  particles.forEach((p) => {
    
    this.mkCircleForParticle(p);
  });
}

rs.initialize = function () {
  debugger;
  let {timePerStep,stopTime} = this;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  
  let av = (Math.PI/180)*4;
  let v1 = Point.mk(Math.cos(av),Math.sin(av)).times(5);
  let ip = Point.mk(0,0);
  let ray1 = {initialPosition:ip,velocity:v1};
  
  /*let nray = this.bounceOffXY(ray1,20,1);
  let {initialPosition:nip,velocity:nv} = nray;
  this.displayLine(ip,nip,'yellow');
  this.displayLine(nip,nip.plus(nv.times(10)),'magenta');*/
   
  let prt1 = {ray:ray1,initialPosition:Point.mk(0,0),startTime:0,mass:0.5,radius:1};
  let prt2 = {ray:{initialPosition:Point.mk(20,0),velocity:Point.mk(0,0)},startTime:0,mass:1,radius:3};
  let prts = this.particles = [prt1,prt2];
  this.mkCirclesForParticles(prts);
  let {radius:radius1} = prt1;
  let {ray:ray2,radius:radius2} = prt2;
  let {initialPosition:ip1} = ray1;
  let {initialPosition:ip2,velocity:v2} = ray2;
  let t = this.solveForT(prt1,prt2);
  if (t === undefined) {
    return;
  }
  this.lastColTime = 0;
  this.nextColTime =t;
  return;
  this.updatePositions(t);
  let colres = this.collideParticles(prt1,prt2);
  let [nv1,nv2] = colres;
  let nv1ln = nv1.length();
  let nv2ln = nv2.length();
  let cp1 = prt1.position;
  let cp2 = prt2.position;
  let o1end1 = cp1.plus(nv1.times(2*nv1ln));
  this.displayLine(cp1,o1end1,'green');
  let o2end1 = cp2.plus(nv2.times(2*nv2ln));
  this.displayLine(cp2,o2end1,'cyan');
 
}

rs.updateState = function () {
  let {stepsSoFar:ssf,timePerStep,lastColTime:lct,nextColTime:nct,stopTime} = this;
  let [prt1,prt2] = this.particles;
  let ct = ssf*timePerStep;
  if ((ct >= lct) && (ct < nct)) {
    this.updatePositions(ct);
  } else {
    debugger;
    let colres = this.collideParticles(prt1,prt2);
    let [nv1,nv2] = colres;
    this.lastColTime = nct;
    this.nextColTime = stopTime;
    let {ray:ray1} = prt1;
    let {ray:ray2} = prt2;
    ray1.initialPosition=prt1.position;
    ray2.initialPosition=prt2.position;
    ray1.velocity = nv1;
    ray2.velocity = nv2;
    prt1.startTime = nct;
    prt2.startTime = nct;
    this.updatePositions(ct);
  }
}


export {rs}
  

  