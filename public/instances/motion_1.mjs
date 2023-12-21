import {rs as circlePP} from '/shape/circle.mjs';
import {rs as generatorP} from '/generators/motion_0.mjs'
let rs = generatorP.instantiate();

rs.setName('motion_1');
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:1,stopTime:256,recordingMotion:1,
    numShapes:4,circleRadius:1,ringRadius:ht*5};

Object.assign(rs,topParams);



rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  
}

   
rs.buildShapes = function (params) {
  let {circleRadius:cr,ringRadius:rr,numShapes:ns,circleP,shapes}= this;
  for (let i = 0;i<ns;i++) {
    let crc = circleP.instantiate();
    crc.show();
    crc.index = i;
    shapes.push(crc);
  }
}

rs. computePosition = function (shape,t) {
  let {ringRadius:rr,numShapes:ns,stopTime} = this;
  debugger;
  let index = shape.index;
  let frs = index/ns;
  let fr = t/stopTime;
  let a = -((fr+frs) * Math.PI*2);
  let p = Point.mk(Math.cos(a),Math.sin(a)).times(rr);
  return p;
}
   
    
   

rs.onUpdate = function () {
  let {stepsSoFar:ssf,currentTime:t} = this;
  console.log('steps',ssf,'time',t);
}
   
rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP} = this;
  this.numSteps = Math.floor(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  this.set('shapes',arrayShape.mk());
  this.buildShapes();
  this.updatePositions(0);
}

export {rs};



