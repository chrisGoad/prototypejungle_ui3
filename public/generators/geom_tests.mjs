
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';

let rs = basicsP.instantiate();

rs.setName('geom_tests');
let wd = 100;
let topParams = {width:wd,height:wd};
Object.assign(rs,topParams);


rs.initProtos = function () {
  this.lineP  = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 1;
}  
rs.initialize = function () {
  this.initProtos();
  let {width,lineP} = this;
  this.addFrame();
  let dim = width/4;
  let UL= Point.mk(-dim,-dim);
  let UR =Point.mk(dim,-dim);
  let LR =  Point.mk(dim,dim);
  let LL =  Point.mk(-dim,dim);
  let vline0 = lineP.instantiate();
  this.set('vline0',vline0);
  vline0.setEnds(UL,LR); 
  let vline1 = lineP.instantiate();
  this.set('vline1',vline1);
  vline1.setEnds(LL,UR);    
  let vec0= LR.normalize();
  let vec1= UR.normalize();
  let line0= Line.mk(UL,vec0);
  let line1= Line.mk(LL,vec1);
  debugger
  let p = line0.intersectLine(line1);
  
}

export {rs};


