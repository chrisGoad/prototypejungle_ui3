
import {rs as addQuadGridMethods} from '/mlib/quad_grid.mjs';	
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';

import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();
addQuadGridMethods(rs);
addAnimationMethods(rs);

let wd = 200;
let nr = 20;
//
nr =20;
rs.setName('quad_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numSteps:200,duration:200,
                 smooth:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1}
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

rs.addDots = function () {
  let {numCols:nc,numRows:nr} = this;
  let intv = 20;
  for (let i=1;i<nc;i=i+2) {
    for (let t=0;t<10;t++)
       this.addVdot(i,intv*t);
    }
   for (let j=1;j<nc;j++) {
    for (let r=2;r<19;r=r+2) {
      this.addHdot(r,j*intv);
    }
  
   // this.addHdot(14,j*intv);
    //this.addHdot(16,j*intv);
  }
}

rs.initialize = function() { 
  debugger;
  let {corners} =this;
  this.initProtos();
  this.addFrame();
  this.initGrid();
  //this.set('lines',arrayShape.mk());
  this.set('dotShapes',arrayShape.mk());
  this.dots = [];
  //this.addLines();
  //this.updateLines(corners);
  //this.updateLines();
 this.addDots();
} 
  //this.updateState();

  

rs.updateState = function () {
  let {stepsSoFar:ssf,numSteps} =this;
  debugger;
  this.execMotions(ssf);
} 


    

  
export {rs};


