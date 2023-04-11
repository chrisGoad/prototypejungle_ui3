
import {rs as addQuadGridMethods} from '/mlib/quad_grid.mjs';	

import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';

import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();
addQuadGridMethods(rs);

let wd = 200;
let nr = 20;
//
nr =20;
rs.setName('quad_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numSteps:100,
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
  circleP.dimension= 2;
  circleP.fill = 'cyan';
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
  this.updateLines(corners);
  this.updateLines();
//  this.addDots();
} 
  //this.updateState();

  

rs.updateState = function () {
  let {stepsSoFar:ssf,numSteps,stepsPerMove} =this;
  let stinm = ssf%stepsPerMove;
  let fr = stinm/stepsPerMove;
  if ((ssf%(stepsPerMove*2)) === 0) {
    debugger;
    this.addDots();
  }
//  debugger;
  if (stinm === 0) {
    //debugger;
    if (ssf>0) {
      this.moveDots();
    }
    this.clearOccupants();
    this.resetDots();
    this.placeDotsInNextGrid();
    for (let i=0;i<4;i++) {
      let stopped =this.stopDots(0);
      console.log('stopped',stopped);
    }
    
  }
  this.performMove(fr);    
} 


    

  
export {rs};


