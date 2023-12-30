import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addNearestMethods} from '/mlib/nearest_0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);
addNearestMethods(rs);
//import {rs as generatorP} from '/generators/motion_0.mjs'
//let rs = generatorP.instantiate();

rs.setName('motion_6');
let ht=50;
let stt=5023;
stt = 4096;
let ts = 12;
stt=2;
let topParamss = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:1/1024,stopTime:stt,recordingMotion:1,saveAnimation:1,
    shapesPerRing:6,circleRadius:.2,ringRadii:[.5*ht,.45*ht,.4*ht,.35*ht,.3*ht,.25*ht,.2*ht,.15*ht],
                                       speeds:[ts/6, ts/6,  ts/4, ts/4,  ts/3, ts/3,ts/2,ts/2],toAngle:2*Math.PI};
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:1/1024,stopTime:stt,recordingMotion:1,saveAnimation:1,
    shapesPerRing:6,circleRadius:.2,ringRadii:[.5*ht,.45*ht,.4*ht,.35*ht,.3*ht,.25*ht,.2*ht,.15*ht],
                                       speeds:[ts/6, ts/6,  ts/4, ts/4,  ts/3, ts/3,ts/2,ts/2],toAngle:2*Math.PI};

Object.assign(rs,topParams);
let subParams ={speed:2,shapesPerRing:6};

/* particle
{ring,radius,indexInRing,currentAngle,speed,index,initialAngle,initialTime}

// and maybe mass
*/

//rs.speeds = [1,1.1,1.2,1.3,1.4,1.5,1.6,1.7];
rs.ringRadii =[.5*ht,.4*ht]
rs.ringRadii =[.5*ht,.45*ht,.4*ht,.35*ht,.2*ht,.15*ht,.1*ht];
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
    let rnumShapes = spr[i];
    let rias = ias[i];
    let radius = ringRadii[i];
    let colors = ['red','green','blue','yellow','cyan','magenta','white','gray'];
    
    for (let j = 0;j<rnumShapes;j++) {
      let particle = {index:cindex++,ring:i,radius,indexInRing:j,speed:rspeeds[j],initialAngle:rias[j],initialTime:0,fill:colors[j]}
      particles.push(particle);
      ptr.push(particle);
    }
  }
  //return particles;
}
rs.steppedArrayy = function (upTo,n,angles) {
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
  let initialAngles = this.steppedArray(0,2*Math.PI,spr,1);
  //let masses = this.uniformArray(mass,spr);
  let iaa = [];
  //let fn = (i) => i?speed:-speed;
  for (let i=0;i<nr;i++) {
  //  let speeds = speedFunction?this.arrayFromFunction(speedFunction,spr):this.uniformArray(spr,.01);
    let speeds = speedFunction?this.arrayFromFunction(speedFunction,spr):this.uniformArray(i%2?speed:-speed,spr);
    spra.push(spr);
    speeda.push(speeds);
    iaa.push(initialAngles);
  }
  this.shapesPerRing = spra;  
  this.speeds = speeda;  
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

 rs.toMpiPiRangee = function (a) {
  if (a > Math.PI) {
    return a-2*Math.PI;
  }
  if (a<-Math.PI) {
    return a+2*Math.PI;
  }
  return a;
}
  
rs. updateAngle = function (particle,t) {
  let {initialAngle,initialTime,speed} = particle;
  let deltaT = t-initialTime;
  let deltaA = speed*deltaT;
  let ra = this.toMpiPiRange(initialAngle+deltaA);
  particle.currentAngle = ra;
}

rs.updateAngles = function (t) {
  let {particles} = this;   
  particles.forEach( (p) => this.updateAngle(p,t));
}

rs.displayPosition  = function (particle) {
  let {shape,currentAngle:a,radius:r} = particle;
  let p = Point.mk(r*Math.cos(a),r*Math.sin(a));
  this.positions.push(p);
  shape.moveto(p);
}


rs.displayPositions = function () {
  let {particles} = this;   
  particles.forEach( (p) => this.displayPosition(p));
}

rs.initialize = function () {
   debugger;
   let {stopTime:stp,timePerStep:tps} = this;
   this.initProtos();
  this.addFrame();
  this.numSteps =stp/tps;
  this.set('shapes',arrayShape.mk());
  this.set('lines',arrayShape.mk());
 // this.buildUniformArrays({speed:.02,mass:2,shapesPerRing:8,randomSpeeds:1});
  let spr = 6;
  let speed =2;
 // this.buildUniformArrays({speed,mass:2,shapesPerRing:spr,randomSpeeds:6,speedFunction:(i) => i?speed:-speed});
 // this.buildUniformArrays({speed,mass:2,shapesPerRing:spr});
  this.buildUniformArrays(subParams);
  this.particles = [];
  this.particlesByRing = [];
  this.buildParticles();
  this.buildShapes();
  this.colT = Infinity;
  //this.updatePositions(0);
}



rs.updateState = function () {
  debugger;
  let {stepsSoFar:ssf,currentTime:t} = this;
  let positions = this.positions = [];
  console.log('steps',ssf,'time',t);
  //let nrp = this.computeNearestPositions(positions);
  this.updateAngles(t);
  this.displayPositions();
  this.displayNearestPositions(positions);
 // this.enactRingCollisions(0);
 
}




    
 
export {rs};



