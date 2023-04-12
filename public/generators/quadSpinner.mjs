
import {rs as addQuadMethods} from '/mlib/rect2quad.mjs';	
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';

import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();
addQuadMethods(rs);
addAnimationMethods(rs);

let wd = 200;
let nr = 20;
//
nr =20;
rs.setName('quad_grid');
let topParams = {width:wd,height:wd,framePadding:.1*wd,stepsPerMove:10,numSteps:200,center:Point.mk(0,0),radius:wd/4,
                 cycles:3,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1}
Object.assign(rs,topParams);
let dim = 100;
let LL = Point.mk(-dim,0);
let UL = Point.mk(0,dim);
let UR = Point.mk(dim,0);
let LR = Point.mk(0,-dim);

rs.corners = [LL,UL,UR,LR];


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  //lineP['stroke-width'] = .8;
  lineP.stroke = 'cyan';
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 5;
  circleP.fill = 'cyan';
}

rs.addDot = function () {
  let {circleP,dotShapes} = this;
  let crc = circleP.instantiate();
  dotShape.push(crc);
  return crc;
}

rs.mkMotion = fuction () {
  let {numSteps,cycles,center,radius} = this;
  let dot = this.addDot();
  let m = {startTime:0,cycles,center,radius,shape:dot,duration:numSteps}
  return m;
}
  

rs.initialize = function() { 
  debugger;
  let {corners} =this;
  this.initProtos();
  this.addFrame();
  //this.set('lines',arrayShape.mk());
  this.set('dotShapes',arrayShape.mk());
   let m = this.mkMotion();
   this.motions =[m];
} 
  //this.updateState();

  

rs.updateState = function () {
  let {stepsSoFar:ssf,numSteps} =this;
  debugger;
  this.execMotions(ssf);
} 


    

  
export {rs};


