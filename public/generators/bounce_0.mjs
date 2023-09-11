import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
let rs = basicP.instantiate();
addAnimationMethods(rs);

rs.setName('bounce_0');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:0.05,stopTime:10,collideWithParticle:1}

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

particle = {ray,mass,startTime,position,shape,radius,collisions,index}

collision = {time,withSegment,withParticle}

where withX =its index

*/


rs.solveForT1 = function (params) {
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
  //return [p0,p1,t0,t1];
  return t0;
}
rs.solveForT = function (particle1,particle2) {
  let {ray:ray1,radius:r1} = particle1;
  let {ray:ray2,radius:r2} = particle2;
  let {initialPosition:ip1,velocity:v1} = ray1;
  let {initialPosition:ip2,velocity:v2} = ray2;
  let rv = v1.difference(v2)
  //let params = {A:ip1,V:v1,P:ip2,r1,r2};
  let params = {A:ip1,V:rv,P:ip2,r1,r2};
  let t = this.solveForT1(params);
  return t;
}
/*
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

*/
rs.lineSegVertical = function (ls) {
  let {end0,end1} = ls;
  let vec = end1.difference(end0);
  let {x:vcx,y:vcy} = vec;
  let ax = Math.abs(vcx);
  let ay = Math.abs(vcy);
  let vertical = ay > ax;
  return vertical;
  }
  
rs.lineSegmentSolveForT = function (particle,ls) {
  let {ray,radius} = particle;
  let {initialPosition:ip,velocity:v} = ray;
  let {end0,end1} = ls;
  let vertical = this.lineSegVertical(ls);
  let low,high;
  if (vertical) {
    let low = end0.y;
    let high = end1.y;
  } else {
    let low = end0.x;
    let high = end1.x;
  }
  let {x,y} = ip;
  let {x:vx,y:vy} = v;
  let slope,islope;
  if (vertical) {
    if (vx===0) {
      return undefined;
    }
    slope = vy/vx;
  } else {
    if  (vy===0) {
      return undefined;
    }
    islope = vx/vy;
  }
  let intsct = vertical?y + ((end0.x-radius)-x)*slope: x + (end0.y-y-radius)*islope;
  if ((intsct < low) || (high < intsct)) {
    return undefined;
  }
  let vln = v.length();
  let nip = vertical?Point.mk(end0.x-radius,intsct):Point.mk(intsct,end0.y-radius);
  let d = (nip.difference(ip)).length();
  let t = d/vln;
  return t;
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
 /// return nv1;
}

rs.collideParticles = function (particle1,particle2) {
  let {ray:ray1,mass:mass1,radius:radius1,position:pos1} = particle1;
  let {ray:ray2,mass:mass2,radius:radius2,position:pos2} = particle2;
  let {velocity:v1} = ray1;
  let {velocity:v2} = ray2;
  let params = {v1,v2,x1:pos1,x2:pos2,m1:mass1,m2:mass2};
  let colres = this.collide(params);
  return colres;
}
rs.collideLineSegment = function (particle,ls) {
  let {ray,radius,position:pos} = particle;
  let {velocity:v} = ray;
  let {x:vx,y:vy} = v;
  let vertical = this.lineSegVertical(ls);
  let a = Math.atan2(vy,vx);
  let na = vertical?Math.PI-a:-a;
  let vln = v.length();
  let nv = Point.mk(Math.cos(na),Math.sin(na)).times(vln);
  return nv;
}
rs.particleIdxCollisions = function (idx,allCols) {
  let {stepsSoFar:ssf,timePerStep,particles,segments} = this;
  let cols = [];
  let prt = particles[idx]
  let pln = particles.length;
  for (let i=idx+1;i<pln;i++) {
    let oprt = particles[i];
    let t= this.solveForT(prt,oprt);
    if (t) {
      let col = {time:t,withParticle:i};
      cols.push(col);
      allCols.push(col);
    }
  }
  let sln = segments.length;
  for (let i=0;i<sln;i++) {
    let seg = segments[i];
    let t= this.lineSegmentSolveForT(prt,seg);
    if (t) {;
      let col = {time:t,withSegment:i};
      cols.push(col);
      allCols.push(col);
    }
  }
  prt.collisions = cols;
  
}

rs.particleCollisions = function () {
  let {particles} = this;
  let pln = particles.length;
  let allCols = [];
  for (let i=0;i<pln;i++) {
    this.particleIdxCollisions(i,allCols);
  }
  let compare = const (c0,c1) => {
    let t0 = c0.time;
    let t1 = c1.time;
    if (t0<t1) {
      return -1;
    }
    if (t0 === t1) {
      return 0;
    }
    return 1;
  };
  allCols.sort(compare);
  this.allCollisions = allCols;
}
  


rs.updatePosition = function (particle,t) {
  debugger;
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

rs.displaySegments = function () {
  let {segments} = this;
  segments.forEach((seg)=>{
    let {end0,end1} = seg;
    this.displayLine(end0,end1);
  });
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
  let {timePerStep,stopTime,collideWithParticle:cwp} = this;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  
  //let av = (Math.PI/180)*4;
  let av = (Math.PI/180)*10;
  let v1 = Point.mk(Math.cos(av),Math.sin(av)).times(5);
  let ip = Point.mk(0,0);
  let ray1 = {initialPosition:ip,velocity:v1};
  let ray3 = {initialPosition:Point.mk(0,-5),velocity:v1};
  let prt1 = {ray:ray1,initialPosition:Point.mk(0,0),startTime:0,mass:0.5,radius:1};
 // let prt1 = {ray:ray1,initialPosition:Point.mk(0,0),initialPosition:Point.mk(0,0),startTime:0,mass:0.5,radius:1};
  let prt2 = {ray:{initialPosition:Point.mk(20,-1.8),velocity:Point.mk(0,1.3)},startTime:0,mass:10,radius:3};
 let prt3 = {ray:ray3,startTime:0,mass:0.5,radius:1};
  let ls = LineSegment.mk(Point.mk(20,-10),Point.mk(20,10));
  this.segments = [ls];
  this.displaySegments();
  let prts = this.particles = [prt1,prt2,prt3];
  debugger;
  this.mkCirclesForParticles(prts);
  debugger;
  this.particleCollisions();
  let t=cwp?this.solveForT(prt1,prt2):this.lineSegmentSolveForT(prt3,ls);
  if (t === undefined) {
    return;
  }
  this.lastColTime=0;
  this.nextColTime=t;
  this.updatePositions(0);
   

 
 
}

rs.updateState = function () {
  let {stepsSoFar:ssf,timePerStep,lastColTime:lct,nextColTime:nct,stopTime,collideWithParticle:cwp} = this;
  let [prt1,prt2,prt3] = this.particles;
  let [ls] = this.segments;
  let ct = ssf*timePerStep;
  debugger;
  if ((ct >= lct) && (ct < nct)) {
    this.updatePositions(ct);
  } else {
    debugger;
    let colres,nv1,nv2;   
    if (cwp) {
      colres = this.collideParticles(prt1,prt2);
      nv1 = colres[0];
      nv2 = colres[1];

    } else {
      nv1 = this.collideLineSegment(prt3,ls);
    }

    this.lastColTime = nct;
    this.nextColTime = stopTime;
    let {ray:ray1} = prt1;
    let {ray:ray2} = prt2;
    let {ray:ray3} = prt3;
    
    if (cwp) {
      ray1.initialPosition=prt1.position;
      ray2.initialPosition=prt2.position;
      prt1.startTime = nct;
      prt2.startTime = nct;
      ray1.velocity = nv1;
      ray2.velocity = nv2;
    } else {
      ray3.initialPosition=prt3.position;
      ray3.velocity = nv1;
      prt3.startTime = nct;
    }
    this.updatePositions(ct);
  }
}


export {rs}
  

  