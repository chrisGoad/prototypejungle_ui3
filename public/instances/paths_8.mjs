

debugger;

import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
addAnimationMethods(rs);
import {rs as generatorP} from '/instances/paths_7.mjs';
let eye0 = generatorP.instantiate();
let eye1 = generatorP.instantiate();
rs.hoff = 300;

rs.set('eye0',eye0);
rs.set('eye1',eye1);



let ht = 630;
let wd=1200;
//wd =220;
let nr = 8;
//
nr =3;
rs.setName('paths_8');
let topParams = {width:wd,height:ht,framePadding:.1*wd,numSteps:200,
                 frameStrokee:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,scaling:1,
                }
Object.assign(rs,topParams);

rs.initialize = function () {
  debugger;
  let {eye0,eye1,hoff} = this;
  this.addFrame();
  this.eye0.initialize();
  this.eye1.initialize();
  this.eye0.saveAnimation =0;
  this.eye1.saveAnimation =0;
  eye0.moveto(Point.mk(-hoff,0));
  eye1.moveto(Point.mk(hoff,0));
}

rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = 2;
  lineP.stroke = 'white';
  
}
rs.updateState = function () {
   debugger;
   this.eye0.oneStep(1);
   this.eye1.oneStep(1);
   //this.eye0.updateState();
   //this.eye1.updateState();
}
  

  
  
export {rs};

