import {rs as linePP} from '/shape/line.mjs';
//import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as basicP} from '/generators/basics.mjs';
//import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addConfigureMethods} from '/mlib/configure_1.mjs';
import {rs as addMutateGridMethods} from '/mlib/mutate_grid_0.mjs';

let rs = basicP.instantiate();
addAnimationMethods(rs);
addConfigureMethods(rs);
addMutateGridMethods(rs);


rs.setName('mutate_5');

let ht=100;
ht=40;
let nr = 32;
nr=8;
let topParams = {numRows:nr,numCols:nr,width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:.1*ht,frameStrokee:'white',frameStrokeWidth:.2,
timePerStep:1/(16*32),stopTime:1,recordingMotion:1,saveAnimation:1,distanceThreshold:3,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:200,speed:1,segsPerCircle:20,radius:.4*ht,numSlices:8,bendRadius:1.5};

Object.assign(rs,topParams);

  
rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .1;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .4; 
}

rs.speedFun = function (i,j) {
  let {numSteps,stepsSoFar:ssf} = this;
  let mssf = (ssf+i+j)%numSteps;
  return mssf;
}
rs.speedFun = function (i,j) {
  let {numSteps,stepsSoFar:ssf} = this;
  let mssf = Math.floor(.5+(i+j)/nr)*ssf%numSteps;
  return mssf;
}


rs.buildParamsArray = function (numLines) {
  let paramsA =this.paramsA =[];
  let LL =10;
  let HLL =LL/2;
  paramsA.push({index:0,center:Point.mk(0,0),lineLength:LL,linePos:HLL});
  paramsA.push({index:0,center:Point.mk(0,0),lineLength:LL,linePos:0});
  paramsA.push({index:0,center:Point.mk(0,0),lineLength:LL,linePos:HLL});
  this.buildParamsAforGrid(paramsA);
}

 
export {rs};



