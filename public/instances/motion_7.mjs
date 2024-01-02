import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addNearestMethods} from '/mlib/nearest_0.mjs';
import {rs as generatorP} from '/generators/motion_1.mjs'

let rs = generatorP.instantiate();
addNearestMethods(rs);

rs.setName('motion_7');
let ht=50;
let stt=5023;
stt = 4096;
let ts = 12;
stt=2;
let topParamss = {width:ht,height:ht,framePadding:0.15*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:1/102,stopTime:stt,recordingMotion:1,saveAnimation:1,
    shapesPerRing:6,circleRadius:.2,ringRadii:[.5*ht,.45*ht,.4*ht,.35*ht,.3*ht,.25*ht,.2*ht,.15*ht],
                                       speeds:[ts/6, ts/6,  ts/4, ts/4,  ts/3, ts/3,ts/2,ts/2],toAngle:2*Math.PI};


let topParams = {width:ht,height:ht,framePadding:0.3*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/512,stopTime:stt,recordingMotion:1,saveAnimation:1,
    circleRadius:.2,ringRadii:[],nearestCount:6,nearestFadeFactor:20,toAngle:2*Math.PI};

Object.assign(rs,topParams);
let subParams ={speed:10,shapesPerRing:2};

/* particle
{ring,radius,indexInRing,currentAngle,speed,index,initialAngle,initialTime}

// and maybe mass
*/
const generateGrid = function (nppr,wd) {
  let inc = wd/(nppr-1);
  let a = [];
  let lvl = -wd/2;
  for (let i = 0;i<nppr;i++) {
    let x = lvl+inc*i
    for (let j =0 ;j<nppr;j++) {
      let p = Point.mk(x,lvl+inc*j);
      a.push(p);
    }
  }
  return a;
}
let pointsPerRow = 5;
debugger;
rs.ringCenters = generateGrid(pointsPerRow,0.8*ht).concat([Point.mk(0,0)]);

let numPoints = pointsPerRow*pointsPerRow+1;

rs.ringRadii = rs.uniformArray(.04*ht,numPoints);
rs.ringRadii = rs.uniformArray(.04*ht,numPoints);
rs.ringRadii = rs.uniformArray(.2*ht,numPoints-1).concat([0.3*ht]);
rs.speedPerRing = rs.steppedArray(10,20,numPoints);
rs.speedPerRing = rs.steppedArray(16,16,numPoints);
rs.shapesPerRing = rs.uniformArray(2,numPoints-1).concat([4]);
//rs.shapesPerRing = rs.uniformArray(2,numPoints);

  
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
  let {ringRadii,speedPerRing,shapesPerRing} = this;
  debugger;
  let {speed,mass,randomSpeeds,speedFunction} =params;
  let nr = ringRadii.length;
 // let speedPerRing = this.speedPerRing = this.arrayFromFunction((i)=>i%2?speed:-speed,nr);
  let spra = [];
  let speeda = [];
  let tpi = 2*Math.PI;
  //let masses = this.uniformArray(mass,spr);
  let iaa = [];
  //let fn = (i) => i?speed:-speed;
  for (let i=0;i<nr;i++) {
    let str =  shapesPerRing[i]; //shapes this ring
    let initialAngles =  this.steppedArray(0,tpi - tpi/str,str,1);

  //  let speeds = speedFunction?this.arrayFromFunction(speedFunction,spr):this.uniformArray(spr,.01);
    let sptr = speedPerRing[i]; //speed this ring
    let speeds = speedFunction?this.arrayFromFunction(speedFunction,str):this.uniformArray(sptr,str);
  //  spra.push(spr);
    speeda.push(speeds);
    iaa.push(initialAngles);
  }
 // this.shapesPerRing = spra;  
  this.speeds = speeda;  
  this.initialAngles = iaa;
}


rs.initialize = function () {
   debugger;
   let {stopTime:stp,timePerStep:tps} = this;
   this.initProtos();
  this.addFrame();
  this.numSteps =stp/tps;
  this.numSteps = 101;
  let cs=100;
  this.stepArrayy = [0].concat(this.sequentialArray(102,120));
  this.set('shapes',arrayShape.mk());
  this.set('lines',arrayShape.mk());
 // this.buildUniformArrays({speed:.02,mass:2,shapesPerRing:8,randomSpeeds:1});
  let spr = 6;
  let speed =2;
 // this.buildUniformArrays({speed,mass:2,shapesPerRing:spr,randomSpeeds:6,speedFunction:(i) => i?speed:-speed});
 // this.buildUniformArrays({speed,mass:2,shapesPerRing:spr});
  this.buildParameterArrays(subParams);
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



