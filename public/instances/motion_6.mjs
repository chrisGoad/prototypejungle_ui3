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
    shapesPerRing:4,circleRadius:.3,ringRadii:[],nearestCount:2,nearestFadeFactor:40};
    
    
 //   shapesPerRing:6,circleRadius:.5,ringRadii:[],nearestCount:3,nearestFadeFactor:40};
 //                                      speedss:[ts/6, ts/6,  ts/4, ts/4,  ts/3, ts/3,ts/2,ts/2],toAngle:2*Math.PI};

Object.assign(rs,topParams);
let subParams ={speed:2,shapesPerRing:6};

/* particle
{ring,radius,indexInRing,currentAngle,speed,index,initialAngle,initialTime}

// and maybe mass
*/



rs.buildParameterArrays  = function () {

//  this.ringRadii =[.5*ht,.45*ht,.4*ht,.35*ht,.2*ht,.15*ht,.1*ht];
  this.ringRadii =[.5*ht,.45*ht,.4*ht,.2*ht,.15*ht,.1*ht];
  let nr = this.ringRadii.length;
  let spr = 6;
  let rspeed = 2;
  this.shapesPerRing = this.uniformArray(spr,nr);
  this.ringCenters = rs.uniformArray(Point.mk(0,0),nr);
  //let ringSpeeds = rs.cyclingArray([rspeed,-rspeed],spr);
  let speeds0 = rs.uniformArray(rspeed,spr);
  let speeds1 = rs.uniformArray(-rspeed,spr);
  this.speeds = rs.cyclingArray([speeds0,speeds1],nr);
  debugger;
  let iar =  this.steppedArray(0,2*Math.PI,spr+1,1);//initial angles per ring
  let sta2 = this.steppedArray(0,1,2);
  let sta2o = this.steppedArray(0,1,2,1);
  let sta3o = this.steppedArray(0,1,3,1);
  let sta3 = this.steppedArray(0,1,3);
  this.initialAngles = this.uniformArray(iar,nr);
}
//rs.shapesPerRing = rs.uniformArray(6,rs.ringRadii.length);
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
  this.buildParameterArrays(subParams);
  let particles = this.particles = [];
  this.particlesByRing = [];
  this.buildParticles();
  /*
  for (let  k =0;k<7;k++) {
    particles[k].fill = 'red';
  }
  */
  particles[0].fill = 'red'
  particles[1].fill = 'red'
  particles[2].fill = 'red'
  particles[3].fill = 'red'
 // particles[4].fill = 'red'
 // particles[5].fill = 'red'
  particles[6].fill = 'cyan'
  particles[7].fill = 'yellow'
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



