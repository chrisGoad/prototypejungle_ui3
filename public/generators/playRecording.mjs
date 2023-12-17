import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);

rs.setName('playRecording');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:0.05,stopTime:100,collideWithParticle:1}

Object.assign(rs,topParams);

rs.updatePosition = function (shape,[) {
  let {currentFrame:cf} = this;
  let {ray,mass,startTime,shape,index} = particle;
  let {initialPosition:ip,velocity:v} = ray;
  let deltaT = t-startTime;
  let np = ip.plus(v.times(deltaT));
  particle.position = np;
  let pnm = 'p_'+index;
  cf[pnm] = np;
  if (shape && moveShape) {
    shape.moveto(np);
    shape.update();
  }
}


rs.updatePositions = function (shapes,positions) {
  debugger;
  let ln = shapes.length;
  for (i=0;i<ln;i++) {
    let pos = positions[i];
    let shape = shapes[i];
    shape.moveto(pos);
  }
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
  let {radius,stroke,fillStructure} = particle;
  let dradius = dradiusi?dradiusi:radius;

  let circ = circleP.instantiate();
  let nm = 'circle_'+ccnt;
  this.circleCount = ccnt+1;
  this.set(nm,circ);
  circ.dimension = 2*dradius;
  if (stroke) {
    circ.stroke = stroke;
  }
  let fill;
  if (fillStructure) {
    fill = this.fillStructure2fill(fillStructure);
  } else {
    fill = this.fillStructure2fill(randomFill);
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
 
rs.particleArray =function (enclosures) {
  let pa = [];
  let eln = enclosures.length;
  for (let i=0;i<eln;i++) {
//  enclosures.forEach( (enclosure) => { Doesn't work!! I have no idea why.
    let enclosure = enclosures[i];
    let {contents}=enclosure;
    if (!contents) {
      enclosure.index = pa.length
      return [enclosure];
    }
    contents.forEach((prt) => {
      prt.inside = enclosure;
      let prtpa = this.particleArray([prt]);
      prtpa.forEach( (sprt) => {
        sprt.index = pa.length;
        pa.push(sprt);
      });
    });
    enclosure.index = pa.length;
    pa.push(enclosure);
  }
  return pa;
}

rs.playTone = function (freq,dur) {
  let {audioContext:context,mediaRecorder:mr} = this;
  let now = context.currentTime;
  const ts = context.getOutputTimestamp();
  const ct = ts.contextTime;
  const pt = ts.performanceTime;
  console.log('playing tone at currentTime', now,'contextTime',ct,'performanceTime',pt);
  
  //if (!oscillator) {
     let oscillator = this.oscillator = context.createOscillator();
    oscillator.type = 'sine';
    console.log('freq',freq);
     oscillator.frequency.value = freq;
    oscillator.connect(context.destination);
    oscillator.connect(this.audioDest);

  //}
  oscillator.start(now); 
  oscillator.stop(now+dur); 
  
}

rs.stopMediaRecorder = function () {
  let {mediaRecorder:mr} = this;
  mr.stop();
}

    
rs.updateState = function () {
  let {stepsSoFar:ssf,timePerStep,lastCollision,nextC,stopTime,segments,particles,mediaRecorder:mr,motionHistory:mh} = this;
  //console.log('motionHistory:',JSON.stringify(mh));
  this.initAudio();
  if ((ssf%20)===19) {
    //console.log('playtone');
    
  //this.playTone();
  }
  let ct = ssf*timePerStep;
  let nct = nextC.time;
  let onUp = this.onUpdate;
 // debugger;
  if (ct<nct) {
    this.updatePositions(ct,1);
    if (onUp) {
      this.onUpdate();
    }
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
      if (ctat >= ct) {
       this.updatePositions(ct,1);
       
        return;
      }
      this.updatePositions(ctat,0);
      if (onUp) {
        this.onUpdate();
      }
      loopCnt++;
      if (loopCnt > 100) {
        debugger;
       // return;
      }
      
    }
  }
}
  



export {rs}
  

  