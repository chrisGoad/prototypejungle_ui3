import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
let rs = basicP.instantiate();

addAnimationMethods(rs);

rs.setName('bounce_0');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:0.05,stopTime:100,collideWithParticle:1}

Object.assign(rs,topParams);

/*
For particle1 outside particle1
A = particle1 initial position
P = particle2 initial position
V = particle1 velocity vector (particle2 is stationary]
r1 = particle1 radius
r2 = particle2 radius
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


For particle1 inside particle2
A = particle1 initial position
P = particle2 initial position
V = particle1 velocity vector (particle2 is stationary]
r1 = particle1 radius
r2 = particle2 radius
t = time of collision

at t, this holds:

let B = position of particle1 at t = A + v*t*
let R = r2 -r1
then distance(P,B) = r2 - r1 = R
so distance(P,A+v*t) = R



particle = {ray,mass,startTime,position,shape,radius,collisions,index,fillStructure,inside,contains}//fillStructure has the form {r:12,g:44,b:99}
ray =  {initialPosition:Point,velocity:Point}
collision = {particleIndex,time,withSegment,withParticle}

where withX =its index

*/

rs.fillStructure2fill = function (fs) {
  let {r,g,b} = fs;
  let fill = `rgb(${r},${g},${b})`;
  return fill;
}

rs.solveForT1 = function (params) {
  let {A,V,P,r1,r2,inside} = params;
  let {x:Ax,y:Ay} = A;  
  let {x:Vx,y:Vy} = V;
  let {x:Px,y:Py} = P;
  let vPA = A.difference(P);
  let ln = vPA.length();
  if (ln <0.01) {
     console.log('return undefined because ln = ',ln);
  }
  let R = inside?r2-r1:r1+r2;
  let vAP = vPA.times(-1);
  let dp = V.dotp(vAP);
  let As  = this.v2s(A);
  let Ps  = this.v2s(P);
  let Vs  = this.v2s(V);
  if (dp<=0 && (!inside)) { 
    //console.log('return undefined');
    return undefined;
  }
  let {x:Cx,y:Cy} = vPA;
  //let a = Vx+Vy;
  let a = Vx*Vx+Vy*Vy;
  let b =2*(Cx*Vx+Cy*Vy); 
  //let r = r1+r2;
  let c = Cx*Cx+Cy*Cy-R*R; 
//  t = (-b +- sqrt(b**2-4*a*c))/(2*a)

  
  let itrm = b*b-4*a*c;
  if (itrm < 0) {
    //console.log('return undefined');
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
     	console.log('A',As,'P',Ps,'V',Vs,'inside',inside,'r1',r1,'r2',r2,'t0',t0,'t1',t1);
  let t = inside?Math.max(t0,t1):t0;
  //return [p0,p1,t0,t1];
 // console.log('return ',t);
  return t;
}

rs.v2s = function (v) {
  let {x,y} = v;
  let x3d = Math.floor(1000*x)*0.001;
  let y3d = Math.floor(1000*y)*0.001;
  let s = '['+x3d+','+y3d+']';
  return s;
}

rs.hasNaN = function (p) {
 let {x,y} = p;
 if (isNaN(x) || isNaN(y)) {
   console.log('hasNaN');
   //debugger;
  }
}

rs.solveForT = function (particle1,particle2,inside) {
  let {currentTime:ct}=this;
  particle1.startTime=ct;
  particle2.startTime=ct;
  let {ray:ray1,radius:r1,position:cp1} = particle1;
  let {ray:ray2,radius:r2,position:cp2} = particle2;
  ray1.initialPosition = cp1;
  ray2.initialPosition = cp2;
  let {velocity:v1} = ray1;
  let {velocity:v2} = ray2;
  this.hasNaN(v1);
  this.hasNaN(v2);
  
  let cp1s = this.v2s(cp1);
  let cp2s = this.v2s(cp2);
  let v1s = this.v2s(v1);
  let v2s = this.v2s(v2);
  //console.log('idx1',particle1.index,'idx2',particle2.index,'cp1',cp1s,'cp2',cp2s,'v1',v1s,'v2',v2s);
  let rv = v1.difference(v2)
  let params = {A:cp1,V:rv,P:cp2,r1,r2,inside};
  let t = this.solveForT1(params);
  return t;
}

rs.lineSegVertical = function (ls) {
  if (!ls) {
    debugger;
  }
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
  ray.initialPosition = cp;
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
  if ((intsct < low) || (high < intsct)) {
    return undefined;
  }
  let vln = v.length();
  let nip = vertical?Point.mk(end0.x+rtu,intsct):Point.mk(intsct,end0.y+rtu);
  let d = (nip.difference(cp)).length();
  let t = d/vln;
  return t;
}

rs.toCardinalDirection = function (v) {
  let {x,y} = v;
  let ln = v.length();
  let eps = 0.1;
  let axs = Math.abs(x);
  let ays =Math.abs(y);
  if (!(axs && ays)) {
    console.log('non cardinal');
  }
  let nx = axs?0:x;
  let ny = ays?0:y;
  let nv =Point.mk(nx,ny);
  let nln = nv.length();
  let anln = Math.abs(nln);
  if (anln < 0.01) {
    return v;
  }
  let rt = ln/nln;
  console.log('rt',rt);
  return nv.times(rt);
}
rs.matchVelocities = function (v,nv) {
//  return nv;
  let eps = 0.01;
  let {x:vx,y:vy} = v;
  let {x:nvx,y:nvy} = nv;
  let diffx = Math.abs(nvx-vx)<eps;
  let diffmx = Math.abs(nvx+vx)<eps;
  let nx,ny;
  if (diffx) {
    nx = vx;
  } else if (diffmx) {
    nx = -vx;
  } else {
    nx = nvx
  }
  let diffy = Math.abs(nvy-vy)<eps;
  let diffmy = Math.abs(nvy+vy)<eps;
  if (diffy) {
    ny = vy;
  } else if (diffmy) {
    ny = -vy;
  } else {
    ny = nvy;
  }
  return Point.mk(nx,ny);
}
 
rs.collideParticle = function (params) {
  let {speedup} = this;
  let  {v1,v2,x1,x2,m1,m2} =params;
  let x1mx2ln = (x1.difference(x2)).length();
  let sqx1mx2ln = x1mx2ln*x1mx2ln;
  let itrm1 = (2*m2/(m1+m2))* (v1.difference(v2).dotp(x1.difference(x2))/sqx1mx2ln);
  let nv1 = v1.difference(x1.difference(x2).times(itrm1));
  let itrm2 = (2*m1/(m1+m2))* (v2.difference(v1).dotp(x2.difference(x1))/sqx1mx2ln);
  let nv2 = v2.difference(x2.difference(x1).times(itrm2));
  //let cv1 = this.toCardinalDirection(nv1);
  let cv1 = this.matchVelocities(v1,nv1);
  let cv2 = this.matchVelocities(v2,nv2);
  //let cv2 = this.toCardinalDirection(nv2);
  this.hasNaN(nv1);
  this.hasNaN(nv2);
 // return [nv1.times(speedup),nv2.times(speedup)];
  return [cv1.times(speedup),cv2.times(speedup)];
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
rs.theOtherFill = function (fill) {
  let {fills} = this;
  let ofill;
  if (fill === fills[0]) {
    ofill = fills[1];
  } else {
    ofill = fills[0];
  }
  return ofill;
}
rs.fillsOf = function (prt) {
  let pfill = this.fillStructure2fill(prt.fillStructure);
  let sfill = prt.shape.fill;
  return 'pfill:'+pfill+' sfill:'+sfill;
}
rs.updateFill = function (prt) {
  let fs = prt.fillStructure;
  let shp = prt.shape;
  if (fs && shp) {
    let fill = this.fillStructure2fill(fs);
    shp.fill = fill;
  }
}



rs.exchangeColors = function (prt1,prt2) {
  let {swp} = this;
  let {fillStructure:FS1,shape:shape1} = prt1;
  let {fillStructure:FS2,shape:shape2} = prt2; 
  if (FS1 && (Math.random() < swp)) {
    if (FS1 === FS2) {
      let oFS = this.theOtherFill(FS1);
      FS1 = oFS;
      FS2 = oFS;
    }    
    prt1.fillStructure = FS2;
    this.updateFill(prt1);
    prt2.fillStructure = FS1;
    this.updateFill(prt2); 
  }    
}

rs.nextColor = function (prt) {
  let {fills} = this;
  let {fillNumber:IFN,shape} = prt;
  let FN = (IFN===undefined)?0:IFN;
  let fln = fills.length;
  let nxtn = (FN+1)%fln;
  prt.fillNumber = nxtn;
  let FS = fills[nxtn];
  prt.fillStructure = FS;
  this.updateFill(prt);
}

rs.nextColors = function (prt1,prt2) {
  this.nextColor(prt1);
  this.nextColor(prt2);
}

  
  

rs.flipColor = function (prt) {
  let {swp} = this;
  let {fillStructure:FS} = prt;
  if (FS && (Math.random() < swp)) {
    let oFS = this.theOtherFill(FS);
    prt.fillStructure = oFS;
    this.updateFill(prt);
  }    
}
rs.enactCollide2Particles = function (particle1,particle2,t) {
  let {swp} = this;
  let prt1 = particle1;
  let prt2 = particle2;
  let colres = this.collide2particles(prt1,prt2);
  let [nv1,nv2] = colres;
  let {ray:ray1,fillStructure:FS1,shape:shape1} = prt1;
  let {ray:ray2,fillStructure:FS2,shape:shape2} = prt2; 
  ray1.initialPosition=prt1.position;
  ray2.initialPosition=prt2.position;
  prt1.startTime = t;
  prt2.startTime = t;
  ray1.velocity = nv1;
  ray2.velocity = nv2;
  if (this.updateColorsOnCollideP) {
    this.updateColorsOnCollideP(prt1,prt2); 
  }
}

rs.collideLineSegmentt = function (particle,ls) {
  let {ray,radius,position:pos} = particle;
  let {velocity:v} = ray;
  let {x:vx,y:vy} = v;
  let vertical = this.lineSegVertical(ls);
  let a = Math.atan2(vy,vx);
  let rtd = 180/Math.PI;
  let ad = rtd*a;
  let na = vertical?Math.PI-a:-a;
  let vln = v.length();
  let nv = Point.mk(Math.cos(na),Math.sin(na)).times(vln);
  let cv = this.toCardinalDirection(nv);
  return cv;
  return nv;
}

rs.collideLineSegment = function (particle,ls) {
  let {ray,radius,position:pos} = particle;
  let {velocity:v} = ray;
  
  let {x:vx,y:vy} = v;
  //let newv = Point.mk(vx,-vy);
  //return newv;
  let vertical = this.lineSegVertical(ls);
  let a = Math.atan2(vy,vx);
  let rtd = 180/Math.PI;
  let ad = rtd*a;
  let na = vertical?Math.PI-a:-a;
  let vln = v.length();
  let nv = Point.mk(Math.cos(na),Math.sin(na)).times(vln);
 // let cv = this.toCardinalDirection(nv);
  let cv = this.matchVelocities(v,nv);
  return cv;
  return nv;
}

rs.enactCollideLineSegment = function (particle,ls,t) {
  let {swp} = this;
  let prt = particle;
  let FS = prt.fillStructure;
  let nv = this.collideLineSegment(prt,ls);
  let {ray:ray} = prt;
  ray.initialPosition=prt.position;
  ray.velocity = nv;
  prt.startTime = t;
  if (this.updateColorsOnCollideLS) {
    this.updateColorsOnCollideLS(prt);
  }
 
}

rs.nextCollision = function (particle) {
  let {particles,segments,currentTime:ct} = this;
  debugger;
  let st = particle.startTime;
  let pi = particle.index;
  let nt = undefined;
  let withP,withS;
  let pln = particles.length;
  for (let i=pi+1;i<pln;i++) {
    let oprt = particles[i];
    let {inside} = particle;
    let {inside:oinside} = oprt;
    let pio = inside === oprt; // particle is inside oprt
   // let oip = oinside === prt;
    if ((i !== pi) && ((inside === oinside) || pio))  {
      let t = this.solveForT(particle,oprt,pio);
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


rs.particleCollisions = function () {
  let nct = 1000000;
  let nextCol;
  let {particles} = this;
  let pln = particles.length;
  for (let i=0;i<pln;i++) {
    let prt = particles[i];
    let col = this.nextCollision(prt);
    prt.nextC = col;
    if (col) {
      let t = col.time;
      if (t<nct) {
        nct = t;
        nextCol = col;
      }
    }
  }
  this.nextC = nextCol;
  return nextCol;
}
  
 
rs.updateParticleCollisions = function (lastCol) {
  let {particles,currentTime:ct} = this;
  let {particleIndex:pi,time:t,withParticle:wp,withSegment:ws} = lastCol;
  let prt1 = particles[pi];
  let prt2 = (wp===undefined)?undefined:particles[wp];
  let nxtcol;
  let nct =1000000;
  let col;
  let lct = lastCol.time;
  let pln = particles.length;
  for (let i=0;i<pln;i++) {
    let prt = particles[i];
 // particles.forEach( (prt) => {
    let prti = prt.index;
    let col;
    if ((prti === pi) || (prti === wp)) { 
      col = this.nextCollision(prt);
      prt.nextC = col;
    } else {
      let rt1 = undefined;
      let rt2 =undefined;
      if (prt.index !== prt1.index) {
        rt1 = this.solveForT(prt,prt1);
      }
      if (prt2 && (prt.index !== prt2.index)) {
         rt2 = this.solveForT(prt,prt2);
      } else {
        rt2=100000;
      }
      let t1,t2;
      if (rt1) {
        t1 = rt1+ct;
      }
       if (rt2) {
        t2 = rt2+ct;
      }
      col = prt.nextC;
      if (!col) {
        return;
      }
      let  t3 = col?col.time:1000000;
      let t1smallest,t2smallest,t3smallest;
      if (t1 === undefined) {
        t1 = 1000000;
      }
      if (t2 === undefined) {
        t2 = 1000000;
      }
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
        col = {particleIndex:prti,time:t1,withParticle:prt1.index,withSegment:undefined};
        if (prti===prt1.index) {
          debugger;
        }
      } 
      if (t2smallest) {
        if (!prt2) {
          debugger;
        }
        col = {particleIndex:prti,time:t2,withParticle:prt2.index,withSegment:undefined};
        if (pi===prt2.index) {
          debugger;
        }
      }
      
      prt.nextC = col;
      if (col.time === lct) {
        debugger;
      }
      
    }
    if (col) {
      let t = col.time;
      if (t < nct) {
        nct = t;
        nxtcol = col;
      }
    }
  };
  this.nextC = nxtcol;
  return nxtcol;
}



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
  let {radius,stroke,fillStructure} = particle;
  let circ = circleP.instantiate();
  let nm = 'circle_'+ccnt;
  this.circleCount = ccnt+1;
  this.set(nm,circ);
  circ.dimension = 2*radius;
  if (stroke) {
    circ.stroke = stroke;
  }
  if (fillStructure) {
    circ.fill = this.fillStructure2fill(fillStructure);
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

rs.genBox = function () {
  let {boxD} = this;
  let hbd = 0.5*boxD;
  let lsL = LineSegment.mk(Point.mk(-hbd,-hbd),Point.mk(-hbd,hbd));
  let lsR = LineSegment.mk(Point.mk(hbd,-hbd),Point.mk(hbd,hbd));
  let lsT = LineSegment.mk(Point.mk(-hbd,-hbd),Point.mk(hbd,-hbd));
  let lsB = LineSegment.mk(Point.mk(-hbd,hbd),Point.mk(hbd,hbd));294
  this.segments = [lsL,lsR,lsT,lsB];
}

rs.boxToRect = function (pad) {
   let hbd = 0.5*this.boxD;
   let ibox = hbd - pad;
   let c = Point.mk(-ibox,-ibox);
   let xt = Point.mk(2*ibox,2*ibox);
   let rect = Rectangle.mk(c,xt);
   this.ibox = rect;
   return rect;
}

rs.enactCollision  = function (col) {
  let {particles,segments} = this;
  let {particleIndex:pi,time:cct,withSegment:ws,withParticle:wp} = col;
  this.updatePositions(cct,0);
  let prt = particles[pi];
  if (wp !== undefined) {
    this.enactCollide2Particles(prt,particles[wp],cct);
  } else {
    this.enactCollideLineSegment(prt,segments[ws],cct);
  }
}

  
rs.updateState = function () {
  let {stepsSoFar:ssf,timePerStep,lastCollision,nextC,stopTime,segments,particles} = this;
  let ct = ssf*timePerStep;
  let nct = nextC.time;
 // debugger;
  if (ct<nct) {
    this.updatePositions(ct,1);
  } else {
    let cta = nextC;
    if (!cta) {
      return undefined;
    }
    let loopCnt = 0;
    while (cta) {
      this.enactCollision(cta);
     // this.nextC = cta = this.updateParticleCollisions(cta);
      this.nextC = cta = this.particleCollisions(cta);
      let ctat = cta.time;
      //console.log('ctat',ctat);
      if (ctat > ct) {
       this.updatePositions(ct,1);
       
        return;
      }
      this.updatePositions(ctat,0);
      loopCnt++;
      if (loopCnt > 100) {
        debugger;
      }
      
    }
  }
}
  



export {rs}
  

  