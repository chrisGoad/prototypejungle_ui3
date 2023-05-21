//import {rs as addGridMethods} from '/mlib/grid2.mjs';	
//import {rs as addQuadMethods} from '/mlib/rect2quad.mjs';	
import {rs as addMotionMethods} from '/mlib/motion.mjs';	
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addPathMethods} from '/mlib/paths.mjs';

import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();
//addGridMethods(rs);
addMotionMethods(rs);
//addQuadMethods(rs);
addPathMethods(rs);

//addQuadMethods(rs);
addAnimationMethods(rs);

let wd = 200;
let nr = 8;
//
nr =4;
rs.setName('gridSpinner_3');
let topParams = {width:wd,height:wd,framePadding:.1*wd,numSteps:200,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,pauseAtt:[29,30,59,60]}
Object.assign(rs,topParams);

c

rs.shapeConnectorC = function (params) { //,connectJump) {
  let {connectedShapes:cns,numC,randomOffset:rf,lowFade} = this;
  if (typeof lowFade !== 'number') {
    debugger;
    lowFade = .06;
  }
  let {motionGroup:mg,numConnections:ncp,connectIndices:ci} = params;
  let {paths} = mg;
  debugger;
  let shapesPerPath = mg.shapesPerPath;
  let pln = shapesPerPath.length;
  let numPhasesG = mg.numPhases;
  for (let i = 0;i<pln;i++) {
    let shapes = shapesPerPath[i];
    let ln = shapes.length;
    let path = paths[i];
    let pnc = path.numConnections;
    let pnp = path.numPhases;
    let numPhases = pnp?pnp:numPhasesG;
    let numConnections = pnc?pnc:ncp
    for (let j=0;j<numConnections;j++) {
      let cparams = {pathIndex:i,connectIndex:j,numPhases}
   //   debugger;
      let cis =  ci.call(this,cparams); 
      if (!cis) {
        continue;
      }
      let {end0ShapeIndex,end1PathIndex,end1ShapeIndex} = cis;
    
      let sh0 = shapes[end0ShapeIndex];
      let e1shapes = shapesPerPath[end1PathIndex]; 
      if (!e1shapes) {
        debugger;
      }
      let sh1 = e1shapes[end1ShapeIndex];
      //let sh1 = rc?shapes[k]:shapes[(j+connectJump)%ln];
      if (!sh0) {
         debugger;
      }
      let connection = {shape0:sh0,shape1:sh1,path,connectIndex:j,end0ShapeIndex,end1PathIndex,end1ShapeIndex,numConnections,numPhases,cell,lowFade};
      if (this.annotateConnection) {
         this.annotateConnection(connection);
      }
      cns.push(connection);
      //cns.push({shape0:sh0,shape1:sh1,path,randomOffset0,randomOffset1});
    //  cns.push(sh0,sh1,path,randomOffset0,randomOffset1]);
    }
  }
}


rs.shapeConnector = function (mg) {
  let {connectIndices,numConnections:ncg} = this;
  let numConnections = ncg;
  this.shapeConnectorC({motionGroup:mg,numConnections,connectIndices});
}


/*
rs.addMotionsForCell = function (params) {
  let {cell,paths,numPhases,shapeConnector,backwards}  = params;
  let {deltaX,numSteps,circleP,iPolygonP,cycles} = this;
  let duration = numSteps;
 /* let ip = 1/numPhases;
  let phases =[];
  for (let i=0;i<numPhases;i++) {
    phases.push(i*ip);
  }*/
  let {polygon,coords} = cell;
  let {x,y} = coords;
  let shapeP=circleP;
  debugger;
 // this.mkPathMotionGroup({cell,phases,paths,cycles,duration,shapeP,oPoly:polygon,shapeConnector});
  this.mkPathMotionGroup({numPhases,paths,cycles,duration,shapeP,shapeConnector,backwards});
}
*/
 
       

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
  this.hideUnconnectedShapes();
  //this.callIfDefined('afterInitialize');
  debugger;
} 
  //this.updateState();

  

rs.updateState = function () {
  let {stepsSoFar:ssf} =this;
//  debugger;
  this.execMotionGroups(ssf);			
  this.callIfDefined("afterUpdateState");
} 


    

  
export {rs};


