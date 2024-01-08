import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);
//import {rs as generatorP} from '/generators/motion_0.mjs'
//let rs = generatorP.instantiate();

rs.setName('motion_1');
let ht=50;
let stt=5023;
stt = 4096;
let ts = 12;
stt=2;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:1/1024,stopTime:stt,recordingMotion:1,saveAnimation:1,
    shapesPerRing:6,circleRadius:.2,ringRadii:[.5*ht,.45*ht,.4*ht,.35*ht,.3*ht,.25*ht,.2*ht,.15*ht],ringCenters:[],
                                       speeds:[ts/6, ts/6,  ts/4, ts/4,  ts/3, ts/3,ts/2,ts/2],toAngle:2*Math.PI};

Object.assign(rs,topParams);
let subParams ={speed:2,shapesPerRing:6};

/* particle
{ring,radius,indexInRing,currentAngle,speed,index,initialAngle,initialTime,position}

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
  let {ringRadii,ringCenters,shapesPerRing:spr,speeds,masses,initialAngles:ias,particles,particlesByRing:pbr,particleColor:pc,particleColors:pcs}= this;
  let nr = ringRadii.length;
  let cindex = 0;
  debugger;
  for (let i=0;i<nr;i++) {
    let ptr = []; // particles this ring
    pbr[i] = ptr;
    let rspeeds = speeds[i];
    let rnumShapes = spr[i];
    let rias = ias[i];
    let radius = ringRadii[i];
    let center = ringCenters[i];
   // let particleColors = ['red','green','blue','yellow','cyan','magenta','white','gray'];
   // let particleColors = this.uniformArray('blue',nr);
    
    for (let j = 0;j<rnumShapes;j++) {
      let color = pcs?(pcs[j]?pcs[j]:pc):pc;
      let particle = {index:cindex++,ring:i,radius,center,indexInRing:j,speed:rspeeds[j],initialAngle:rias[j],initialTime:0,fill:color}
      particles.push(particle);
      ptr.push(particle);
    }
  }
  //return particles;
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
  let {shapes,particles,circleP,positions} = this;
  let np = particles.length;
  for (let i = 0;i<np;i++) {
    let p = particles[i];
    let pos = Point.mk(0,0);
    p.position = pos;
    positions.push(pos);
    let crc = circleP.instantiate();
    crc.particle = p;
    crc.fill = p.fill;
    p.shape = crc;
    shapes.push(crc);
  }
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
  let pos = particle.position;
  let {shape,currentAngle:a,radius:r,center,position} = particle;
  let p0 = Point.mk(r*Math.cos(a),r*Math.sin(a));
  let p1 = center?p0.plus(center):p0;
  pos.copyto(p1);
  shape.moveto(p1);
}


rs.displayPositions = function () {
  let {particles} = this;   
  particles.forEach( (p) => this.displayPosition(p));
}



    
 
export {rs};



