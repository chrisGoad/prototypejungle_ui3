import {rs as linePP} from '/shape/line.mjs';
//import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as basicP} from '/generators/basics.mjs';
//import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addConfigureMethods} from '/mlib/configure_2.mjs';
import {rs as addMutateGridMethods} from '/mlib/mutate_grid_0.mjs';

let rs = basicP.instantiate();
addAnimationMethods(rs);
addConfigureMethods(rs);
addMutateGridMethods(rs);


rs.setName('mutate_6');

let ht=100;
ht=80;
ht=60;
let nr = 32;
nr=8;
nr=12;
let topParams = {numRows:nr,numCols:nr,width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:.1*ht,frameStrokee:'white',frameStrokeWidth:.2,
timePerStep:1/(16*32),stopTime:1,recordingMotion:1,saveAnimation:1,distanceThreshold:3,twice:1,numSteps:256,whereToPause:16,
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
  let {numSteps,stepsSoFar:ssf,twice,numRows:nr} = this;
  //debugger;
  let hnumSteps = numSteps/2;
  let mssf;
  if (ssf>=hnumSteps) {
    mssf = Math.floor(.5+(i+j)/nr)*ssf%(twice?hnumSteps:numSteps);
  } else {
    mssf = Math.floor(.5+(i+(nr-j-1))/nr)*ssf%(twice?hnumSteps:numSteps);
  }
  return mssf;
}
rs.speedFunn = function (i,j) {
  let {numSteps,stepsSoFar:ssf,numRows:nr,twice} = this;
  let hnumSteps = numSteps/2;
  let mssf;
  let md = twice?hnumSteps:numSteps;
  if (ssf>=hnumSteps) {
     mssf = (ssf+i+j)%md;
  } else {
      mssf = (ssf+i+nr-j-1)%md;
  }
  return mssf;
}


rs.speedFunn = function (i,j) {
  let {numSteps,stepsSoFar:ssf,twice,numRows:nr} = this;
  return ssf;
  //debugger;
 
}


rs.speedFunn = function (i,j) {
  let {numSteps,stepsSoFar:ssf} = this;
  let mssf = (ssf+i+j)%numSteps;
  return mssf;
  }

rs.buildParamsArray = function (numLines) {
  let paramsA =this.paramsA =[];
  let LN =10;
  let HLN =LN/2;
  let UL = Point.mk(-HLN,-HLN);
  let UR= Point.mk(HLN,-HLN);
  let LR= Point.mk(HLN,HLN);
  let LL = Point.mk(-HLN,HLN);
  paramsA.push({index:0,center:Point.mk(0,0),points:[UL,UR,LR,LL]});
  paramsA.push({index:0,center:Point.mk(0,0),points:[LL,UL,UR,LR]});
  paramsA.push({index:0,center:Point.mk(0,0),points:[LR,LL,UL,UR]});
  paramsA.push({index:0,center:Point.mk(0,0),points:[UR,LR,LL,UL]});
  paramsA.push({index:0,center:Point.mk(0,0),points:[UL,UR,LR,LL]});
  this.buildParamsAforGrid(paramsA);
}

 
export {rs};



