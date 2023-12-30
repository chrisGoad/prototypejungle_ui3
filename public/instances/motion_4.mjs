import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as generatorP} from '/generators/motion_0.mjs'
let rs = generatorP.instantiate();

rs.setName('motion_4');
let ht=50;

let topParamss = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:1,stopTime:5023,recordingMotion:1,
    shapesPerRing:[],circleRadius:.2,currentTime:0,
    ringRadii:[.5*ht,.45*ht,.4*ht,.35*ht,.3*ht,.25*ht,.2*ht,.15*ht],
    speeds:[[]],masses:[[]],initialAngles:[[]],toAngle:2*Math.PI};
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:1,stopTime:5023,recordingMotion:1,
    shapesPerRing:[],circleRadius:2,currentTime:0,
    ringRadii:[.5*ht],
    speeds:[[]],masses:[[]],initialAngles:[[]],toAngle:2*Math.PI};
    


Object.assign(rs,topParams);

/* particle
{ring,radius,indexInRing,currentAngle,speed,mass,index,initialAngle,initialTime}

for each ring, a nextCollision is maintained of the form
{index0,index1,time}
it is updated at each step where the collision on that ring occurs before the next step
*/




rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2; 
}

rs.buildParticles = function () {
  let {ringRadii,shapesPerRing:spr,speeds,masses,initialAngles:ias,particles,particlesByRing:pbr}= this;
  let nr = ringRadii.length;
  let cindex = 0;
  for (let i=0;i<nr;i++) {
    let ptr = []; // particles this ring
    pbr[i] = ptr;
    let rspeeds = speeds[i];
    let rmasses = masses[i];
    let rnumShapes = spr[i];
    let rias = ias[i];
    let radius = ringRadii[i];
    let colors = ['red','green','blue','yellow','cyan','magenta','white','gray'];
    
    for (let j = 0;j<rnumShapes;j++) {
      let particle = {index:cindex++,ring:i,radius,indexInRing:j,speed:rspeeds[j],mass:rmasses[j],initialAngle:rias[j],initialTime:0,fill:colors[j]}
      particles.push(particle);
      ptr.push(particle);
    }
  }
  //return particles;
}

rs.uniformArray = function (v,n) {
  let a =  [];
  for (let i=0;i<n;i++) {
    a.push(v);
  }
  return a;
}



rs.randomArray = function (lb,ub,n) {
  let a =  [];
  let delta = ub-lb;
  for (let i=0;i<n;i++) {
    let v = Math.random()*delta + lb;
    a.push(v);
  }
  return a;
}
rs.steppedArray = function (upTo,n,angles) {
  let inc = upTo/n;
  let a = [];
  for (let i=0;i<n;i++) {
    let v = angles?this.toMpiPiRange(inc*i):inc*i
    a.push(v);
  }
  return a;
}
rs.buildUniformArrays  = function (params) {
  let {ringRadii} = this;
  debugger;
  let {speed,mass,shapesPerRing:spr,randomSpeeds,speedFunction} =params;
  let nr = ringRadii.length;
  let spra = [];
  let speeda = [];
  let massa = [];
  let initialAngles = this.steppedArray(2*Math.PI,spr,1);
  let masses = this.uniformArray(mass,spr);
  let iaa = [];
  //let fn = (i) => i?speed:-speed;
  for (let i=0;i<nr;i++) {
  //  let speeds = randomSpeeds?this.randomArray(-speed,speed,spr):this.uniformArray(.01,spr);
    let speeds = speedFunction?this.arrayFromFunction(speedFunction,spr):this.uniformArray(.01,spr);
    spra.push(spr);
    speeda.push(speeds);
    massa.push(masses);
    iaa.push(initialAngles);
  }
  this.shapesPerRing = spra;  
  this.speeds = speeda;  
  this.masses = speeda;  
  this.initialAngles = iaa;
}

   
rs.buildShapes = function () {
  let {shapes,particles,circleP} = this;
  let np = particles.length;
  for (let i = 0;i<np;i++) {
    let p = particles[i]
    let crc = circleP.instantiate();
    crc.particle = p;
    crc.fill = p.fill;
    p.shape = crc;
    shapes.push(crc);
  }
}
rs.toMpiPiRange = function (a) {
  if (a > Math.PI) {
    return a-2*Math.PI;
  }
  if (a<-Math.PI) {
    return a+Math.PI;
  }
  return a;
}
  
rs. updateAngle = function (particle,t) {
  let {initialAngle,initialTime,speed} = particle;
  let deltaT = t-initialTime;
  let deltaA = speed*deltaT;
  particle.currentAngle = this.toMpiPiRange(initialAngle+deltaA);
}

rs.updateAngles = function (t) {
  let {particles} = this;   
  particles.forEach( (p) => this.updateAngle(p,t));
}

rs.displayPosition  = function (particle) {
  let {shape,currentAngle:a,radius:r} = particle;
  let p = Point.mk(r*Math.cos(a),r*Math.sin(a));
  shape.moveto(p);
}


rs.displayPositions = function () {
  let {particles} = this;   
  particles.forEach( (p) => this.displayPosition(p));
}
rs.angularDistance = function (a0,a1) {
  let ca = a1 - a0;
  while (1) {
    if (ca > Math.PI) {
      ca = ca - 2*Math.PI;
    }
    if (ca < -Math.PI) {
      ca = ca+2*Math.PI;
    }
    return ca;
  }
}
rs.timeToCollision  = function (p0,p1) {
  let {speed:sp0,currentAngle:ca0} = p0;
  let {speed:sp1,currentAngle:ca1} = p1;
  let deltaS = sp0-sp1;
  let deltaA = ca1-ca0;
 // let deltaA = this.angularDistance(ca0,ca1);
  let deltaT = deltaA?deltaA/deltaS:undefined;
  let deltaTa = Math.abs(deltaT)>0.001?deltaT:undefined;
  return deltaTa;
}
/*
rs.nextParticleCollision = function (ring,indexInRing) {
  let iir = indexInRing;
  let {currentTime:t,shapesPerRing,particles,particlesByRing:pbr}  = this;
  let rps=pbr[ring];
  let particle = rps[iir];
  let {speed,mass,currentAngle:ca} = particle;
  let str = shapesPerRing[ring];// shapes this ring
  let ptr = pbr[ring];// particles this ring
  let nxti = (iir+1)%str;
  //let prvi = iir?iir-1?str-1;
  let nxtp = ptr[nxti];
  //prvp = ptr[prvi];
 // let deltaTprv = this.timeToCollision(particle,prvp);
  let deltaTnxt = this.timeToCollision(particle,nxtp);
  if ((deltaTnxt !== undefined)  && (deltaTnxt>0)) {
    let nextC  = {p0i:iir,p1i:nxti,time:t+deltaTnxt};
    return nextC;
  }
}
*/
rs.nextParticleCollision = function (ring,indexInRing) {
  let iir = indexInRing;
  let {currentTime:t,shapesPerRing,particles,particlesByRing:pbr}  = this;
  let rps=pbr[ring];
  let particle = rps[iir];
  let {speed,mass,currentAngle:ca} = particle;
  let str = shapesPerRing[ring];// shapes this ring
  let ptr = pbr[ring];// particles this ring
  let minT = Infinity;
  let nextC;
  for (let i=0;i<str;i++) {
    if (i!==iir) {
      if ((iir === 5)&&(i===6)) {
         debugger;
      }
      let op = ptr[i];
      let deltaTop = this.timeToCollision(particle,op);
      if ((deltaTop !== undefined)  && (deltaTop>0)) {
        let tm = t+deltaTop;
        if (tm < minT) {
          nextC  = {p0i:iir,p1i:i,time:tm};
          minT = tm;
        }
      }
    }
  }
  return nextC;
}

rs.enactRingCollision = function (ring) {
  let {shapesPerRing:spr,stepsSoFar:ssf,particlesByRing:pbr,debug1}  = this;
  let pbtr = pbr[ring]; //particles by this ring
  let nshapes = spr[ring];
  if (debug1) {
    debugger;
  }
  let cols = [];
  let minT = Infinity;
  let minTcol;
  for (let i=0;i<nshapes;i++) {
    let col = this.nextParticleCollision(ring,i);
    if (col) {
      let {time} = col;
      if (time < minT) {
        minTcol = col;
        minT = time;
      }
    } 
  }
  if (minT<=(ssf+1)) {
    debugger;
    let p0 = pbtr[minTcol.p0i];
    let p1 = pbtr[minTcol.p1i];
    this.updateAngle(p0,minT);
    this.updateAngle(p1,minT);
    p0.initialTime = minT;
    p1.initialTime = minT;

    p0.initialAngle =p0.currentAngle;
    p1.initialAngle =p1.currentAngle;
    let sp0 = p0.speed;
    let sp1 = p1.speed;
    let m = (sp0 +sp1)/2;
    let rsp0 = sp0-m;
    let rsp1 = sp1-m;
    let nsp0 = m - rsp0;
    let nsp1 = m - rsp1;
    p0.speed = nsp0;
    p1.speed = nsp1;
    return 1;
  }
}

rs.enactRingCollisions = function (ring) {
  let k = 1; // keep on going
  while (k) {
    k = this.enactRingCollision(ring);
  }
}
  

/*

rs.onUpdate = function () {
  let {stepsSoFar:ssf,currentTime:t} = this;
  console.log('steps',ssf,'time',t);
  //let nrp = this.computeNearestPositions(positions);
  this.updateAngles(t);
  this.displayPositions();
  this.nextParticleCollisions(0);
}
  */ 
rs.initialize = function () {
   debugger;
   let {stopTime:stp,timePerStep:tps} = this;
   this.initProtos();
  this.addFrame();
  this.numSteps =stp/tps;
  this.set('shapes',arrayShape.mk());
  this.set('lines',arrayShape.mk());
 // this.buildUniformArrays({speed:.02,mass:2,shapesPerRing:8,randomSpeeds:1});
  let spr = 2;
  let speed =.2;
  this.buildUniformArrays({speed,mass:2,shapesPerRing:spr,randomSpeeds:6,speedFunction:(i) => i?Math.random()*speed:-Math.random()*speed});
  this.particles = [];
  this.particlesByRing = [];
  this.buildParticles();
  this.buildShapes();
  this.colT = Infinity;
  //this.updatePositions(0);
}


rs.updateState = function () {
//  debugger;
  let {stepsSoFar:ssf,currentTime:t,colT} = this;
  
 // let t =  this.currentTime = ssf;
 if (t>colT) {
   return;
  }
  console.log('steps',ssf,'time',t);
  //let nrp = this.computeNearestPositions(positions);
  this.updateAngles(t);
  this.displayPositions();
  this.enactRingCollisions(0);
 /* let {time} = nrc;
  console.log('next Collision',time);
  if (time<colT) {
    this.colT = time;
  }
  */

}
export {rs};



