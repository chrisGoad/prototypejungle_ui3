
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
  debugger;
  let v0 = {x:2,y:3};
  let v1 = {x:4,y:6};
  let sum = this.deepSum(v0,v1);
  let dim = width/4;
  let UL= Point.mk(-dim,-dim);
  let UR =Point.mk(dim,-dim);
  let LR =  Point.mk(dim,dim);
  let LL =  Point.mk(-dim,dim);
  let gon = Polygon.mk([UL,UR,LR,LL]);
  let sides = gon.sides();
  let red = {r:255,g:0,b:0};
  let  green= {r:0,g:255,b:0};
  let  blue= {r:0,g:0,b:255};
  let  black= {r:0,g:0,b:0};
  let values = [red,green,blue,black];
  let params = {gon,sides,values,p:Point.mk(0,0)};
  let iv=this.interpolateInPolygon(params);
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


