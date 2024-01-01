import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addNearestMethods} from '/mlib/nearest_0.mjs';
import {rs as generatorP} from '/generators/motion_1.mjs'

let rs = generatorP.instantiate();
addNearestMethods(rs);

rs.setName('motion_6');
let ht=50;
let stt=5023;
stt = 4096;
let ts = 12;
stt=2;
let topParamss = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:1/1024,stopTime:stt,recordingMotion:1,saveAnimation:1,
    shapesPerRing:6,circleRadius:.2,ringRadii:[.5*ht,.45*ht,.4*ht,.35*ht,.3*ht,.25*ht,.2*ht,.15*ht],
                                       speeds:[ts/6, ts/6,  ts/4, ts/4,  ts/3, ts/3,ts/2,ts/2],toAngle:2*Math.PI};
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:1/512,stopTime:stt,recordingMotion:1,saveAnimation:1,
    shapesPerRing:6,circleRadius:.5,ringRadii:[],nearestCount:6,nearestFadeFactor:40};
 //   shapesPerRing:6,circleRadius:.5,ringRadii:[],nearestCount:6,nearestFadeFactor:40};
 //                                      speedss:[ts/6, ts/6,  ts/4, ts/4,  ts/3, ts/3,ts/2,ts/2],toAngle:2*Math.PI};

Object.assign(rs,topParams);
let subParams ={speed:2,shapesPerRing:6};

/* particle
{ring,radius,indexInRing,currentAngle,speed,index,initialAngle,initialTime}

// and maybe mass
*/

//rs.speeds = [1,1.1,1.2,1.3,1.4,1.5,1.6,1.7];
rs.ringRadii =[.5*ht,.4*ht]
rs.ringRadii =[.5*ht,.45*ht,.4*ht,.35*ht,.2*ht,.15*ht,.1*ht];
let c0 = Point.mk(-.3*ht,0);
let c1 = Point.mk(.3*ht,0);
rs.ringCenterss = [c0,c1,c0,c1,c0];

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



rs.buildParameterArrays  = function (params) {
  let {ringRadii} = this;
  debugger;
  let {speed,mass,shapesPerRing:spr,randomSpeeds,speedFunction} =params;
  let nr = ringRadii.length;
  let speedPerRing = this.speedPerRing = this.arrayFromFuntion((i)=>i%2?speed:-speed,spr);
  let spra = [];
  let speeda = [];
  let initialAngles =  this.steppedArray(0,2*Math.PI,spr,1);
  //let masses = this.uniformArray(mass,spr);
  let iaa = [];
  //let fn = (i) => i?speed:-speed;
  for (let i=0;i<nr;i++) {
  //  let speeds = speedFunction?this.arrayFromFunction(speedFunction,spr):this.uniformArray(spr,.01);
    let sptr = speedPerRing[i]; //speed this ring
    let speeds = speedFunction?this.arrayFromFunction(speedFunction,spr):this.uniformArray(sptr,spr);
    spra.push(spr);
    speeda.push(speeds);
    iaa.push(initialAngles);
  }
  this.shapesPerRing = spra;  
  this.speeds = speeda;  
  this.initialAngles = iaa;
}


rs.initialize = function () {
   debugger;
   let {stopTime:stp,timePerStep:tps} = this;
   this.initProtos();
  this.addFrame();
  this.numSteps =stp/tps;
  this.numSteps =2*159+3;
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
  let {stepsSoFar:ssf,currentTime:t,nearestCount,nearestFadeFactor:nff} = this;
  let positions = this.positions = [];
  console.log('steps',ssf,'time',t);
  //let nrp = this.computeNearestPositions(positions);
  this.updateAngles(t);
  this.displayPositions();
  this.displayNearestPositions(positions,nearestCount,nff);
 // this.enactRingCollisions(0);
 
}




    
 
export {rs};



