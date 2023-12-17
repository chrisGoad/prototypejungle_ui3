import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);

rs.setName('bounce_2');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:0.05,stopTime:100,collideWithParticle:1}

Object.assign(rs,topParams);

/*
particle = {ray,startTime,position,shape,radius,collisions,index,inside,contains}//fillStructure has the form {r:12,g:44,b:99}
ray =  {initialPosition:Point,velocity:Point}
collision = {particleIndex,time,withSegment,withParticle}

where withX =its index

*/



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

 
rs.collide2particles = function (particle1,particle2) {
  let {timePerStep:tps,stepsSoFar:ssf} = this;
  let time = ssf*tps;
  let {ray:ray1,position:pos1} = particle1;
  let {ray:ray2,position:pos2} = particle2;
  let dist = pos2.distance(pos1);
  if ((dist>5) &&(dist<20)){
    particle1.collided =0;
    particle2.collided =0;
    return null;
  }
  if (particle1.collided || particle2.collided) {
    return null;
  }
  let {velocity:v1} = ray1;
  let {velocity:v2} = ray2;
  let speed1 = v1.length();
  let speed2 = v2.length();
  if  (Math.max(speed1,speed2) < .00001) {
    return null;
  }
  let sp2H = speed2>speed1;
  let particleStill = sp2H?particle1:particle2;
  let particleMoving = sp2H?particle2:particle1;
  let ray = particleMoving.ray;
  let speed = sp2H?speed2:speed1;
  let coltime = dist/speed;
  if (coltime > tps) {
    return null;
  }
  debugger;
  this.collided = 1;
  particle1.collided = 1;
  particle2.collided = 2;
  let colpos = particleStill.position;
 // ray.initialPosition = particleMoving.position;
  particleStill.ray = {initialPosition:particleMoving.position,velocity:ray.velocity};
  particleStill.startTime = time-coltime;
  particleMoving.ray.velocity = Point.mk(0,0);
  particleMoving.ray.initialPosition = colpos;
  particleMoving.startTime = time-coltime;
  return 1;
}

rs.collideWithSegment = function (particle,ls) {
  let {timePerStep:tps,stepsSoFar:ssf} = this;
  let t = tps*ssf;
  let vrt = this.lineSegVertical(ls);
  let {ray,position:prtp} = particle;
  let {velocity:vel} = ray; 
  let vels = vrt?vel.x:vel.y;  //scalar velocity in the dimension that's relevant
  let prtsp = vrt?prtp.x:prtp.y; //scalar position in the dimension that's relevant
  let {end0:e0,end1:e1} = ls
  let lssp = vrt?e0.x:e0.y;//scalar position in the dimension that's relevant
  let away = vels*lssp <= 0;
  let dist = Math.abs(lssp - prtsp);

  if (away || (dist>1)) {
    return 0;
  }
  let coltime = dist/vels;
  let midpoint = e0.plus(e1.difference(e0).times(0.5))
  ray.initialPosition = midpoint;
  particle.startTime = t+coltime;
  if (vrt) {
    vel.x = -vels;
  } else {
    vel.y = -vels;
  }
  //particle.ray.velocity = Point.mk(0,0);
}

rs.collideWithSegments = function (particle){
  let {segments} = this;
  for (let i=0;i<4;i++) {
    let ls = segments[i]
    this.collideWithSegment(particle,ls);
  }
}
  
  
rs.collideAllParticles = function () {
  let {particles} = this;
  let ln = particles.length;
  for (let i=0;i<ln;i++) {
    let pi = particles[i];
    this.collideWithSegments(pi);
    for (let j=i+1;j<ln;j++) {
      let pj = particles[j];
      let col = this.collide2particles(pi,pj);
      if (col) {
        console.log('particles ',i,' and ',j,' collided');
      }
    }
  }
}
rs.updatePosition = function (particle,t) {
  let {currentFrame:cf} = this;
  let {startTime:st,ray,shape,index} = particle;
  let {initialPosition:ip,velocity:vel} = ray;
 // let {timePerStep:tps,stepsSoFar:ssf} = this;
//  let time = ssf*tps;
  let et = t-st;
  let np = ip.plus(vel.times(et));
  particle.position = np;
  shape.moveto(np);
  let pnm = 'p_'+index;
  cf[pnm] = np;
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


  

rs.updatePositions = function () {
  let {timePerStep:tps,stepsSoFar:ssf,motionHistory:mh,recordingMotion:rm,lastTime:lt,collided}=this;
  let t = ssf*tps;

  this.currentTime = t;
  let {particles} = this;
  let cf = this.currentFrame = {time:t};
  if (rm) {
    if (!mh) {
      mh = this.motionHistory = [];
    }
    if (Math.abs(t-lt) > .1) {
      mh.push(cf);
    }
    this.lastTime = t;
  }
  if (collided) {
  }
  particles.forEach( (p) => {
    this.updatePosition(p,t);
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
  line.show();
  line.update();
  return line;
}

rs.displaySegments = function (istroke) {
  let stroke = istroke?istroke:'white';
  let {segments} = this;
  segments.forEach((seg)=>{
    let {end0,end1} = seg;
    this.displayLine(end0,end1,stroke);
  });
}

rs.setBoxStroke = function (stroke) {
  let {dpyLineCnt:n} = this;
  for (let i=0;i<n;i++) {
    let nm = 'line_'+i;
    let ln  = this[nm];
    ln.stroke = stroke;
    ln.update();
  }
}

rs.circleCount = 0;
rs.mkCircleForParticle = function (particle,dradiusi) {
  let {circleCount:ccnt,circleP} = this;
 // debugger;
  const randomFill = {r:150*Math.random()+100,g:150*Math.random()+100,b:150*Math.random()+100};
  let {radius,stroke,fill} = particle;
  let dradius = dradiusi?dradiusi:radius;

  let circ = circleP.instantiate();
  let nm = 'circle_'+ccnt;
  this.circleCount = ccnt+1;
  this.set(nm,circ);
  circ.dimension = 2*dradius;
  if (stroke) {
    circ.stroke = stroke;
  }
  circ.fill = fill;

  particle.shape = circ;
  return circ;
}
 
rs.mkCirclesForParticles = function (particles,dradius) {
  let ln = particles.length;
  for (let i=ln-1;i>=0;i--) {
    let p = particles[i];
    if (p.index === undefined) {
      p.index = i; 
    }
    this.mkCircleForParticle(p,dradius);
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
 // this.playTone();
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

rs.mkEnclosure = function (params) {
  let {emass,eradius,evelocityI,eInitialPositionI:eipi,cmass,cradius,initialPositions,velocities} = params;
  let contents = [];
  let evelocity = evelocityI?evelocityI:Point.mk(0,0);
  let eip = eipi?eipi:Point.mk(0,0);
  let ips = initialPositions;
  let vs = velocities;
  let nc = initialPositions.length;
  let eray = {initialPosition:Point.mk(0,0),velocity:evelocity};
  let enc = {ray:eray,mass:emass,radius:eradius,startTime:0};
  for (let i=0;i<nc;i++) {
    let ray = {initialPosition:ips[i],velocity:vs[i]}
    let prt = {mass:cmass,radius:cradius,startTime:0,ray,inside:enc};
    contents.push(prt);
  }
  enc.contents = contents;
  return enc;
}
  


 

rs.moveParticleBy = function (prt,pnt) {
  let {ray} = prt;
  let {initialPosition:ip} = ray;
  let np = ip.plus(pnt);
  ray.initialPosition = np;
}
rs.moveEnclosureBy = function (enc,pnt) {
  this.moveParticleBy(enc,pnt);
  let {contents} = enc;
  if (contents) {
    contents.forEach((cn) => {
      this.moveEnclosureBy(cn,pnt);
    });
  }
}
rs.vels = function () {
  let {particles} = this;
  const vOf = (prt) =>  {
    let v = prt.ray.velocity;
    let vs = '('+v.x+','+v.y+')';
    return vs;
  }
  let pln = prts.length;
  let vls = '';
  for (let i = 0;i<pln;i++) {
    let v = vOf(prts[i]);
    let nm = i+' '+vs;
    let vls  = vls+nm;
  }
  return vls;
}
 


    
rs.updateState = function () {
  let {stepsSoFar:ssf,timePerStep,lastCollision,nextC,stopTime,segments,particles,mediaRecorder:mr,motionHistory:mh} = this;
  //console.log('motionHistory:',JSON.stringify(mh));
  let ct = ssf*timePerStep;
  let onUp = this.onUpdate;
 // debugger;
  this.updatePositions();
  this.collideAllParticles();
  if (onUp) {
    this.onUpdate();
    
  }
}
  
rs.onCompleteAnimation = function () {
  let {mediaRecorder:mr,motionHistory:mh} = this;
  console.log('Animation complete');
  
  //mr.stop();
  if (mh) {
    console.log('motion history length =',mh.length);
    let  destPath = '/motionHistory.mjs';
    let str = 'let rs = '+JSON.stringify(mh)+'; export {rs};';
    debugger;
     core.httpPost(destPath,str,function (rs) { 
		   debugger;
			
		});
  }
  
}


export {rs}
  

  