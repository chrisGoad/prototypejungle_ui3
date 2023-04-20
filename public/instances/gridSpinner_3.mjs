
import {rs as addGridMethods} from '/mlib/grid2.mjs';	
import {rs as addQuadMethods} from '/mlib/rect2quad.mjs';	
import {rs as addMotionMethods} from '/mlib/motion.mjs';	
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();
addGridMethods(rs);
addMotionMethods(rs);
addQuadMethods(rs);

//addQuadMethods(rs);
addAnimationMethods(rs);

let wd = 200;
let nr = 8;
//
nr =2;
rs.setName('gridSpinner_0');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numSteps:200,center:Point.mk(0,0),radius:wd/4,
                 cycles:3,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1}
Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke = 'cyan';
  let gridPolygonP = this.gridPolygonP = polygonPP.instantiate();
  gridPolygonP['stroke-width'] = .4;
  gridPolygonP.stroke = 'cyan';
  gridPolygonP.fill = 'red';
  let iPolygonP = this.iPolygonP = polygonPP.instantiate();
  iPolygonP['stroke-width'] = 0;
  iPolygonP.fill = 'green'; 
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 2;
  circleP.fill = 'white';
}


rs.toQuad = function(p) {
  let {corners} = this;
  let qp = this.rc2qpoint(p,corners);
  return qp;
}

rs.addMotions = function () {
  let {cells,deltaX,numSteps,circleP,iPolygonP} = this;
  //let radius = 0.4*0.5*deltaX;
  let radius = 0.2;
  let cycles = 2;
  let duration = numSteps;
  cells.forEach((cell) =>{
    debugger;
    let {polygon,coords} = cell;
    let {x,y} = coords;
    let shapeP,polyP,numSides;
    if ((x+y)%2) {
      numSides = 4;
      radius = .4;
      polyP = iPolygonP;
      shapeP = null;
    } else {
      radius = .2;
      numSides = 8;
      polyP = null;
      shapeP = circleP;
    }
    this.mkCircularMotionGroup(numSides,{radius,cycles,duration,shapeP,polyP,oPoly:polygon});
  });
}
       

rs.initialize = function() { 
  debugger;
  this.initProtos();
  let {corners,polygonP} =this;
  this.addFrame();
  this.initGrid();
  this.motionGroups = [];
  this.set('mshapes',arrayShape.mk());
  this.addMotions();
} 
  //this.updateState();

  

rs.updateState = function () {
  let {stepsSoFar:ssf} =this;
  debugger;
  this.execMotionGroups(ssf);
} 


    

  
export {rs};


