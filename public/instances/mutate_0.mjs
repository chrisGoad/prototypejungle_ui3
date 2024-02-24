import {rs as linePP} from '/shape/line.mjs';
//import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
//import {rs as basicP} from '/generators/basics.mjs';
//import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as generatorP} from '/generators/mutate.mjs'

let rs = generatorP.instantiate();

rs.setName('mutate_0');


rs.setName('mutate');
let ht=25;
ht=100;;
let nr = 16;
//nr=8;
let topParams = {numRows:nr,numCols:nr,width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:.1*ht,frameStroke:'white',frameStrokeWidth:.2,
timePerStep:1/(16*32),stopTime:1,recordingMotion:1,saveAnimation:1,distanceThreshold:3,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:200,speed:1,segsPerCircle:20,radius:.4*ht,numSlices:8,bendRadius:1.5};

Object.assign(rs,topParams);

  
rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .4; 
}
   
rs.speedFun = function (i,j) {
  let {numSteps,stepsSoFar:ssf} = this;
  let mssf = (ssf+i+j)%numSteps;
  return mssf;
}
 
export {rs};



