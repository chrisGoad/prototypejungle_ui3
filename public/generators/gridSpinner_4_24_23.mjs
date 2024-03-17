debugger;
import {rs as addGridMethods} from '/mlib/grid2.mjs';	
import {rs as addQuadMethods} from '/mlib/rect2quad.mjs';	
import {rs as addMotionMethods} from '/mlib/motion_4_24_23.mjs';	
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addPathMethods} from '/mlib/paths_4_24_23.mjs';

import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();
addGridMethods(rs);
addMotionMethods(rs);
addQuadMethods(rs);
addPathMethods(rs);

//addQuadMethods(rs);
addAnimationMethods(rs);

let wd = 200;
let nr = 8;
//
nr =4;
rs.setName('gridSpinner_3');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:200,center:Point.mk(0,0),radius:wd/4,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,pauseAtt:[29,30,59,60]}
Object.assign(rs,topParams);




rs.toQuad = function(p) {
  let {corners} = this;
  let qp = this.rc2qpoint(p,corners);
  return qp;
}


//rs.shapeConnectorC = function (mg,cell,numConnections,selj,selk) { //,connectJump) {
rs.shapeConnectorC = function (params) { //,connectJump) {
  let {connectedShapes:cns,numC} = this;
  let {motionGroup:mg,cell,numConnections,selj,selk} = params;
  debugger;
  let shapes = mg.shapes;
  let ln = shapes.length;
  for (let i=0;i<numConnections;i++) {
    let j = selj.call(this,cell,i,ln);
    let k = selk.call(this,cell,j,ln);
   // let j = Math.floor(Math.random()*ln);
   // let k = Math.floor(Math.random()*ln);
    let sh0 = shapes[j];
    let sh1 = shapes[k];
    //let sh1 = rc?shapes[k]:shapes[(j+connectJump)%ln];
    cns.push([sh0,sh1]);
  }
}


rs.addMotionsForCell = function (cell,paths,numPhases,shapeConnector) {
  let {deltaX,numSteps,circleP,iPolygonP,shapeConnectorr,cycles} = this;
  let duration = numSteps;
  let ip = 1/numPhases;
  let phases =[];
  for (let i=0;i<numPhases;i++) {
    phases.push(i*ip);
  }
  let {polygon,coords} = cell;
  let {x,y} = coords;
  let shapeP=circleP;
  this.mkPathMotionGroup({cell,phases,paths,cycles,duration,shapeP,oPoly:polygon,shapeConnector});
}

 
       

rs.initialize = function() { 
  debugger;
  this.initProtos();
  let {corners,polygonP,showThePath} =this;
  this.addFrame();
 
  this.initGrid();
  this.motionGroups = [];
  this.connectedShapes = [];

  this.set('mshapes',arrayShape.mk());
  this.addMotions();
  if (showThePath) {
    this.showPaths();
    return;
  }
  this.connectShapes();
  //this.hideUnconnectedShapes();
  //this.callIfDefined('afterInitialize');
  debugger;
} 
  //this.updateState();

  

rs.updateState = function () {
  let {stepsSoFar:ssf} =this;
//  debugger;
  this.execMotionGroups(ssf);
} 


    

  
export {rs};

