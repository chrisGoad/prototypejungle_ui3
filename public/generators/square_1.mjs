
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicsP.instantiate();
addAnimationMethods(rs);

rs.setName('square_1');
//addGridMethods(rs);
let wd=100;

let topParams = {width:wd,height:wd,fr:.8,y1:150,rDim:wd*.2,framePadding:0.2*wd,frameStroke:'rgb(200,2,2)',numSteps:96,saveAnimation:1,lineLength:1.8,lowStroke:[255,255,255],
  hiStroke:[100,100,100],frvvvv:0,onDiagonals:1,colinear:1};
Object.assign(rs,topParams);




rs.initProtos = function () {	
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP['stroke-width'] = .1;
  polylineP.stroke='white';
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .05;
  lineP.stroke='white';
   let rectP = this.rectP = rectPP.instantiate();
  rectP['stroke-width'] = 0;
  }
rs.initialize = function () {
  let {fr,width,numSegs,rDim,y1} = this;
  debugger;
  let w = 0.5*width*fr;
  this.addFrame();
  this.initProtos();
  let rectP = this.rectP;
  let rect0 = rectP.instantiate();
  let rect1 = rectP.instantiate();
  rect0.width = rDim;
  rect0.height = rDim;
   rect1.width = rDim;
  rect1.height = rDim;
  this.set ('r0',rect0);
  this.set ('r1',rect1);
  rect0.moveto(Point.mk(-rDim,0));
  rect1.moveto(Point.mk(rDim,0));
    rect0.fill = 'rgb(255,255,0)';
  let fill1 = `rgb(${y1},${y1},0)`;
  rect1.fill = fill1;
  rect0.update();
  rect1.update();
}

export {rs};


