import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
let rs = basicP.instantiate();
debugger;
addAnimationMethods(rs);

rs.setName('bounce_0');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:0.1,stopTime:100,collideWithParticle:1}

Object.assign(rs,topParams);

/*

A = particle1 initial position
P = particle2 initial position
V = particle1 velocity vector (particle2 is stationary]
r1 = particle1 radius
r2 = particle1 radius
t = time of collision

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

collision = {particleIndex,time,withSegment,withParticle}

where withX =its index

*/


rs.solveForT1 = function (params) {
  let {A,V,P,r1,r2} = params;
  let {x:Ax,y:Ay} = A;  
  let {x:Vx,y:Vy} = V;
  let {x:Px,y:Py} = P;
  let vPA = A.difference(P);
  let ln = vPA.length();
  if (ln <0.01) {
     console.log('return undefined because ln = ',ln);
  }
  let vAP = vPA.times(-1);
  let dp = V.dotp(vAP);
  let A3d  = this.v2s(A);
  let vPA3d  = this.v2s(A);
  console.log('A',A3d,'vPA',vPA3d,'dotp',dp);
  if (dp<=0) { 
    console.log('return undefined');
    return undefined;
  }
  let {x:Cx,y:Cy} = vPA;
  //let a = Vx+Vy;
  let a = Vx*Vx+Vy*Vy;
  let b =2*(Cx*Vx+Cy*Vy); 
  let r = r1+r2;
  let c = Cx*Cx+Cy*Cy-r*r; 
//  t = (-b +- sqrt(b**2-4*a*c))/(2*a)

  
  let itrm = b*b-4*a*c;
  if (itrm < 0) {
    console.log('return undefined');
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
  console.log('return ',t0);
  return t0;
}

rs.v2s = function (v) {
  let {x,y} = v;
  let x3d = Math.floor(1000*x)*0.001;
  let y3d = Math.floor(1000*y)*0.001;
  let s = '['+x3d+','+y3d+']';
  return s;
}

rs.solveForT = function (particle1,particle2) {
  debugger;
  let {currentTime:ct}=this;
  particle1.startTime=ct;
  particle2.startTime=ct;
  let {ray:ray1,radius:r1,position:cp1} = particle1;
  let {ray:ray2,radius:r2,position:cp2} = particle2;
  ray1.initialPosition = cp1;
  ray2.initialPosition = cp2;
  let {velocity:v1} = ray1;
  let {velocity:v2} = ray2;
  let cp1s = this.v2s(cp1);
  let cp2s = this.v2s(cp2);
  let v1s = this.v2s(v1);
  let v2s = this.v2s(v2);
  console.log('idx1',particle1.index,'idx2',particle2.index,'cp1',cp1s,'cp2',cp2s,'v1',v1s,'v2',v2s);
  let rv = v1.difference(v2)
  //let params = {A:ip1,V:v1,P:ip2,r1,r2};
  let params = {A:cp1,V:rv,P:cp2,r1,r2};
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
  let {currentTime:ct}=this;
  particle.startTime=ct;
  let {ray,radius,position:cp} = particle;
  debugger;
  ray.initialPosition = cp;
  //let {initialPosition:ip,velocity:v} = ray;
  let {velocity:v} = ray;
  let {end0,end1} = ls;
  let vertical = this.lineSegVertical(ls);
  let low,high;
  let {x,y} = cp;
  let {x:vx,y:vy} = v;
  let deltaP,vP;
  if (vertical) {
    let low = end0.y;
    let high = end1.y;
    deltaP = (end0.x - x)>0;
    vP = vx>0;
   
  } else {
    let low = end0.x;
    let high = end1.x;
    deltaP = (end0.y - y)>0;
    vP = vy >0;
  }
  if (deltaP !== vP) {
    return undefined;
  }
  let rtu = vP?-radius:radius;
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
  let intsct = vertical?y + (end0.x+rtu-x)*slope: x + (end0.y+rtu-y)*islope;
 // let intsct = vertical?y + ((end0.x-radius)-x)*slope: x + (end0.y-y-radius)*islope;
  if ((intsct < low) || (high < intsct)) {
    return undefined;
  }
  let vln = v.length();
 // let nip = vertical?Point.mk(end0.x-radius,intsct):Point.mk(intsct,end0.y-radius);
  let nip = vertical?Point.mk(end0.x+rtu,intsct):Point.mk(intsct,end0.y+rtu);
  let d = (nip.difference(cp)).length();
  let t = d/vln;
  return t;
}

rs.collideParticle = function (params) {
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
// only computes new velocities, does not install them

rs.collide2particles = function (particle1,particle2) {
  debugger;
  let {ray:ray1,mass:mass1,radius:radius1,position:pos1} = particle1;
  let {ray:ray2,mass:mass2,radius:radius2,position:pos2} = particle2;
  let {velocity:v1} = ray1;
  let {velocity:v2} = ray2;
  let params = {v1,v2,x1:pos1,x2:pos2,m1:mass1,m2:mass2};
  //console.log('indx1',particle1.index,'indx2',particle2.index,
  let colres = this.collideParticle(params);
  return colres;
}

rs.enactCollide2Particles = function (particle1,particle2,t) {
  let prt1 = particle1;
  let prt2 = particle2;
  let colres = this.collide2particles(prt1,prt2);
  let [nv1,nv2] = colres;
  let {ray:ray1} = prt1;
  let {ray:ray2} = prt2;    
  ray1.initialPosition=prt1.position;
  ray2.initialPosition=prt2.position;
  prt1.startTime = t;
  prt2.startTime = t;
  ray1.velocity = nv1;
  ray2.velocity = nv2;
}

rs.collideLineSegment = function (particle,ls) {
  let {ray,radius,position:pos} = particle;
  let {velocity:v} = ray;
  let {x:vx,y:vy} = v;
  let vertical = this.lineSegVertical(ls);
  debugger;
  let a = Math.atan2(vy,vx);
  let rtd = 180/Math.PI;
  let ad = rtd*a;
  let na = vertical?Math.PI-a:-a;
  let vln = v.length();
  let nv = Point.mk(Math.cos(na),Math.sin(na)).times(vln);
  return nv;
}

rs.enactCollideLineSegment = function (particle,ls,t) {
  let prt = particle;
  let nv = this.collideLineSegment(prt,ls);
  let {ray:ray} = prt;
  ray.initialPosition=prt.position;
  ray.velocity = nv;
  prt.startTime = t;
}

rs.nextCollision = function (particle) {
  let {particles,segments,currentTime:ct} = this;
  let st = particle.startTime;
  let pi = particle.index;
  let nt = undefined;
  let withP,withS;
  let pln = particles.length;
  for (let i=0;i<pln;i++) {
    let oprt = particles[i];
    if (i !== pi) {
      let t = this.solveForT(particle,oprt);
      if ((t!==undefined) && ((nt === undefined) || (t < nt))) {
        nt = t;
        withP = i;
      }
    }
  }
  let sln = segments.length;
  for (let i=0;i<sln;i++) {
    let seg = segments[i];
    let t = this.lineSegmentSolveForT(particle,seg);
    if ((t!== undefined) && ((nt===undefined) || (t < nt))) {
      nt = t;
      withP = undefined;
      withS = i;
    }
  }
  if (nt !== undefined) {
    let col = {particleIndex:pi,time:ct+nt,withParticle:withP,withSegment:withS};
    return col;
  }
}

/*       
rs.particleIdxCollisions = function (idx,allCols) {
  let {stepsSoFar:ssf,timePerStep,particles,segments,currentTime:ct} = this;
  let cols = [];
  let prt = particles[idx]
  let pln = particles.length;
  for (let i=idx+1;i<pln;i++) {
    let oprt = particles[i];
    let t= this.solveForT(prt,oprt);
    if (t) {
      let col = {particleIndex:idx,time:ct+t,withParticle:i};
      cols.push(col);
      allCols.push(col);
    }
  }
  let sln = segments.length;
  for (let i=0;i<sln;i++) {
    debugger;
    let seg = segments[i];
    let t= this.lineSegmentSolveForT(prt,seg);
    if (t) {;
      let col = {particleIndex:idx,time:ct+t,withSegment:i};
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
  let compare = (c0,c1) => {
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
  debugger;
  this.allCollisions = allCols;
}
*/
rs.particleCollisions = function () {
  debugger;
  let {particles} = this;
  let pln = particles.length;
  let allCols = [];
  for (let i=0;i<pln;i++) {
    let prt = particles[i];
    let col = this.nextCollision(prt);
    prt.nextC = col;
    allCols.push(col);
  }
  let compare = (c0,c1) => {
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
  debugger;
  this.allCollisions = allCols;
}
  
/*  
rs.updateParticleCollisions = function (lastCol) {
  let {particles} = this;
  let {particleIndex:pi,time:t,withParticle:wp,withSegment:ws} = lastCol;
  let prt1 = particles[pi];
  let prt2 = (wp===undefined)?undefined:particles[wp];
  let nct = 0;
  let nxtcol;
  let nct =1000000;
  let col;
  particles.forEach( (prt) => {
    let prti = prt.index;
    let col;
    if ((prti === pi) || (prti === wp)) { 
      col = this.nextCollision(prt);
      prt.nextC = col;
    } else {
      let t1 = this.solveForT(prt,prt1);
      let t2 = prt2?this.solveForT(prt,prt2):1000000;
      col = prt.nextC;
      let  t3 = col?col.time:1000000;
      let t1smallest,t2smallest,t3smallest;
      if (t1<t2) {
        if (t1<t3) {
          t1smallest = 1;
        } else {
          t3smallest = 1;
        }
      } else {
        if (t2 < t3) {
          t2smallest = 1;
        } else {
          t3smallest = 1;
        }
      }
      if (t1smallest) {
        col = {particleIndex:pi,time:t1,withParticle:prt1.index,withSegment:undefined};
      } 
      if (t2smallest) {
        col = {particleIndex:pi,time:t2,withParticle:prt2.index,withSegment:undefined};
      }
      prt.nextC = col;
      
    }
    if (col) {
      let t = col.time;
      if (t < nct)) {
        nct = t;
        nxtcol = col;
      }
    }
  });
  this.nextC = nxtcol;
}

*/

rs.updatePosition = function (particle,t,moveShape) {
  let {ray,mass,startTime,shape} = particle;
  let {initialPosition:ip,velocity:v} = ray;
  let deltaT = t-startTime;
  let np = ip.plus(v.times(deltaT));
  particle.position = np;
  if (shape && moveShape) {
    shape.moveto(np);
    shape.update();
  }
}

rs.updatePositions = function (t,moveShapes) {
  this.currentTime = t;
  let {particles} = this;
  particles.forEach( (p) => {
    this.updatePosition(p,t,moveShapes);
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
  let ln = particles.length;
  for (let i=0;i<ln;i++) {
    let p = particles[i];
    p.index = i; 
    this.mkCircleForParticle(p);
  }
}

rs.initializee = function () {
  debugger;
  let {timePerStep,stopTime,collideWithParticle:cwp} = this;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  
  //let av = (Math.PI/180)*4;
  let av1 = (Math.PI/180)*10;
  let v1 = Point.mk(Math.cos(av1),Math.sin(av1)).times(5);
  let av3 = (Math.PI/180)*30;
  let v3 = Point.mk(Math.cos(av1),Math.sin(av1)).times(5);
  let ip = Point.mk(0,0);
  let ray1 = {initialPosition:ip,velocity:v1};
  let ray3 = {initialPosition:Point.mk(0,-4.5),velocity:v3};
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

rs.updateCollisions = function (firstTime) {
    let {nextC,stopTime} = this;
    debugger;
    this.particleCollisions();
    let cols = this.allCollisions;
    if (firstTime) {
      this.lastCollision = {time:0};
    } else {
      this.lastCollision = nextC;
    }
    if (cols.length) {
      this.nextC = cols[0];
    } else {
      this.nextC = {time:stopTime}
    }
}


rs.genBox = function (boxD) {
  let lsL = LineSegment.mk(Point.mk(-boxD,-boxD),Point.mk(-boxD,boxD));
  let lsR = LineSegment.mk(Point.mk(boxD,-boxD),Point.mk(boxD,boxD));
  let lsT = LineSegment.mk(Point.mk(-boxD,-boxD),Point.mk(boxD,-boxD));
  let lsB = LineSegment.mk(Point.mk(-boxD,boxD),Point.mk(boxD,boxD));
  this.segments = [lsL,lsR,lsT,lsB];
  this.boxD = boxD;
}

rs.boxToRect = function (pad) {
   let ibox = this.boxD - pad;
   let c = Point.mk(-ibox,-ibox);
   let xt = Point.mk(2*ibox,2*ibox);
   let rect = Rectangle.mk(c,xt);
   this.ibox = rect;
   return rect;
}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
}
rs.initialize = function () {
  debugger;
  let {timePerStep,stopTime,collideWithParticle:cwp} = this;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  
  //let av = (Math.PI/180)*4;
  //let av1 = (Math.PI/180)*10;
  let av1 = (Math.PI/180)*44;
  let v1 = Point.mk(Math.cos(av1),Math.sin(av1)).times(5);
  let av3 = (Math.PI/180)*25;
  let v3 = Point.mk(Math.cos(av3),Math.sin(av3)).times(5);
  let ip = Point.mk(0,0);
  let ray1 = {initialPosition:ip,velocity:v1.times(-1)};
  //let ray3 = {initialPosition:Point.mk(0,-8),velocity:v1};
  let ray3 = {initialPosition:Point.mk(0,-8),velocity:v3};
  let prt1 = {ray:ray1,initialPosition:Point.mk(0,0),startTime:0,mass:0.5,radius:1};
  let prt2 = {ray:{initialPosition:Point.mk(16,-1.8),velocity:Point.mk(0,1.3)},startTime:0,mass:10,radius:3};
  let prt3 = {ray:ray3,startTime:0,mass:0.5,radius:1};
  this.genBox(21);
 /*  let boxD = 21;
  let lsL = LineSegment.mk(Point.mk(-boxD,-boxD),Point.mk(-boxD,boxD));
  let lsR = LineSegment.mk(Point.mk(boxD,-boxD),Point.mk(boxD,boxD));
  let lsT = LineSegment.mk(Point.mk(-boxD,-boxD),Point.mk(boxD,-boxD));
  let lsB = LineSegment.mk(Point.mk(-boxD,boxD),Point.mk(boxD,boxD));
  this.segments = [lsL,lsR,lsT,lsB];*/
 // this.segments = [];
  this.displaySegments();
  let prts = this.particles = [prt1];
  //let prts = this.particles = [prt1,prt2,prt3];
  //let prts = this.particles = [prt1,prt2];
  this.mkCirclesForParticles(prts);
  debugger;
  this.currentTime = 0;
  this.updatePositions(0);
  this.updateCollisions(1);
    
}


rs.updateStatee = function () {
  let {stepsSoFar:ssf,timePerStep,lastColTime:lct,nextColTime:nct,stopTime,collideWithParticle:cwp} = this;
  let [prt1,prt2,prt3] = this.particles;
  let [ls] = this.segments;
  let ct = ssf*timePerStep;
  if ((ct >= lct) && (ct < nct)) {
    this.updatePositions(ct,1);
  } else {
    debugger;
    let colres,nv1,nv2; 
    this.updatePositions(nct,0);
    if (cwp) {
      this.enactCollide2Particles(prt1,prt2,nct);
      //nv1 = colres[0];
      //nv2 = colres[1];

    } else {
      this.enactCollideLineSegment(prt3,ls,nct);
    }

    this.lastColTime = nct;
    this.nextColTime = stopTime;
    this.updatePositions(ct,1);
  }
}

rs.collisionsBefore = function (t) {
  let {allCollisions:allCols} = this;
  let nCols = []
  let ln = allCols.length;
  for (let i=0;i<ln;i++) {
    let ccol = allCols[i];
    if (ccol.time <= t) {
      nCols.push(ccol);
    }
  }
  return nCols;   
}

rs.enactCollision  = function (col) {
  let {particles,segments} = this;
  let {particleIndex:pi,time:cct,withSegment:ws,withParticle:wp} = col;
  this.updatePositions(cct,0);
  let prt = particles[pi];
  if (wp) {
    this.enactCollide2Particles(prt,particles[wp],cct);
  } else {
    this.enactCollideLineSegment(prt,segments[ws],cct);
  }
}
rs.firstColBefore = function (t) {
  let {allCollisions:allCols} = this;
  if (allCols.length) {
    let ccol = allCols[0];
    let cct = ccol.time;
    if (cct <= t) {
      return ccol;
    }
  }
}
       
 
rs.updateStatee = function () {
  let {stepsSoFar:ssf,timePerStep,lastCollision,nextC,stopTime,segments,particles} = this;
  //let [prt1,prt2,prt3] = this.particles;
  let ct = ssf*timePerStep;
  let {particleIndex:pi,time:nct,withSegment:ws,withParticle:wp} = nextC;
    let lct = lastCollision.time;

  if ((ct >= lct) && (ct < nct)) {
    this.updatePositions(ct,1);
  } else {
    debugger;
    this.updatePositions(nct,0);
    let prt = particles[pi];
    if (wp) {
      this.enactCollide2Particles(prt,particles[wp],nct);
      //nv1 = colres[0];
      //nv2 = colres[1];

    } else {
      this.enactCollideLineSegment(prt,segments[ws],nct);
    }
    this.updateCollisions(0);
    this.particleCollisions();
    this.updatePositions(ct,1);
  }
}
  
rs.updateState = function () {
  let {stepsSoFar:ssf,timePerStep,lastCollision,nextC,stopTime,segments,particles} = this;
  //let [prt1,prt2,prt3] = this.particles;
  let ct = ssf*timePerStep;
  let {time:nct} = nextC;
  let lct = lastCollision.time;
  if ((ct >= lct) && (ct < nct)) {
    this.updatePositions(ct,1);
  } else {
    let cta = nextC;
    if (!cta) {
      return undefined;
    }
    while (cta) {
      this.enactCollision(cta);
      this.updateCollisions(0);
      this.particleCollisions();
      cta = this.firstColBefore(ct);
      if (cta) {
        let nct = cta.time;
        this.updatePositions(nct,1);
      }
    }
  }
  let allCols = this.allCollisions;
  this.nextC = (allCols.length)?allCols[0]:undefined;
}


export {rs}
  

  