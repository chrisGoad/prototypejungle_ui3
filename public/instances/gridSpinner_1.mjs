
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
nr =8;
rs.setName('gridSpinner_1');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numSteps:200,center:Point.mk(0,0),radius:wd/4,
                 cycles:10,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1}
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
  let {cells,deltaX,numSteps,circleP,iPolygonP,cycles} = this;
  //let radius = 0.4*0.5*deltaX;
  let duration = numSteps;
  let d =0.25;
  let p0 = Point.mk(d,0.5);
  let p1 = Point.mk(d+.5,0.5);
  let p0s = [];
  let p1s = [];
  let oPolys = [];
  cells.forEach((cell) =>{
    let {polygon,coords} = cell;
    let {x,y} = coords;
    p0s.push(p0);
    p1s.push(p1);
    oPolys.push(polygon);
    //if ((x+y)%2) {
  });
  this.mkP2PmotionGroup({cycles,duration,p0s,p1s,shapeP:circleP,oPolys});
}
       

rs.testPath = function () {
  debugger;
  let p0=Point.mk(0,0);
  let p1=Point.mk(1,0);
  let p2=Point.mk(1,1);
  let path = [p0,p1,p2];
  let pln = this.pathLength(path);
  let t0 = this.alongPath(path,0.25);
  let t1 = this.alongPath(path,0.75);
}
rs.initialize = function() { 
  debugger;
  this.testPath();
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


