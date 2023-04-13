
import {rs as addQuadMethods} from '/mlib/rect2quad.mjs';	
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

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
let hdim = 0.5*dim;
let LL = Point.mk(-hdim,0);
let UL = Point.mk(0,dim);
let UR = Point.mk(hdim,0);
let LR = Point.mk(0,-dim);

rs.corners = [LL,UL,UR,LR];


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke = 'cyan';
  let polygonP = this.polygonP = polygonPP.instantiate();
  polygonP['stroke-width'] = .4;
  polygonP.stroke = 'cyan';
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 5;
  circleP.fill = 'cyan';
}

rs.addDot = function () {
  let {circleP,dotShapes} = this;
  let crc = circleP.instantiate();
  dotShapes.push(crc);
  return crc;
}

rs.toQuad = function(p) {
  let {corners} = this;
  let qp = this.rc2qpoint(p,corners);
  return qp;
}

rs.mkMotion = function (phase) {
  let {numSteps,cycles,center,radius,toQuad} = this;
  let dot = this.addDot();
  let startPhase = phase?phase:0
  let m = {startPhase,startTime:0,cycles,center,radius,shape:dot,duration:numSteps,map:toQuad}
  return m;
}
  

rs.initialize = function() { 
  debugger;
  this.initProtos();
  let {corners,polygonP} =this;
  this.addFrame();
  //this.set('lines',arrayShape.mk());
  this.set('dotShapes',arrayShape.mk());
  let pgon = polygonP.instantiate();
  pgon.corners = corners;
  this.set('pgon',pgon);
  this.motions = [];
  // let m = this.mkMotion();
  // this.motions =[m];
  this.mkMotions(8,this.mkMotion);
} 
  //this.updateState();

  

rs.updateState = function () {
  let {stepsSoFar:ssf,numSteps} =this;
  debugger;
  this.execMotions(ssf);
} 


    

  
export {rs};


