debugger;
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as gonPP} from '/shape/polygon.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
//import {rs as addDropMethods} from '/mlib/circleDrops.mjs';
//import {rs as addPlaceDropMethods} from '/mlib/placeDrops.mjs';

let rs = basicP.instantiate();
addAnimationMethods(rs);
//addDropMethods(rs);
//addPlaceDropMethods(rs);

rs.setName('gons_0');
let wd=100;
let topParams = {width:wd,height:wd,frameStroke:'white',frameStrokeWidth:0.1,framePadding:.2*wd,stepsPerMove:10,numStepss:24,numSteps:300, numCubes:15,
  focalPoint:Point3d.mk(100,0,0),
  focalLength:100,
  cameraScaling:1,
  cameraAxis:'x',
  saveAnimation:1,
  cubeDim:0.5*wd,
  includeLines:1,
  gridDim:8,
  gridWid:0.5*wd
  };
  


Object.assign(rs,topParams);


rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension = 0.5;
  circleP.fill = 'red';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
   let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
   let gonP = this.gonP = gonPP.instantiate();
  gonP.fill = 'white';
  gonP.stroke = 'white';
  gonP['stroke-width'] = .2;
}

rs.genLine = function (extent,d) {
debugger;
  let {x,y} = extent;
  let hx = 0.5 * x;
  let theta = Math.atan(hx/d);
  let r = hx/Math.sin(theta);
  let b = r - d;
  let e0 = Point.mk(0,hx-d);
  let e1 = Point.mk(0,r+hx-d);
  let line = this.lineP.instantiate();
  this.set('vline',line);
  line.setEnds(e0,e1);
}
  
rs.genRectGon = function (extent,nsegs,d) {
  let {x,y} = extent;
  let hx = 0.5*x;
  let hy = 0.5*y;
  let UL = Point.mk(-hx,-hy);
  let UR = Point.mk(hx,-hy);
  let LR = Point.mk(hx,hy);
  let LL = Point.mk(-hx,hy);
  let gon = this.gonP.instantiate();
  gon.corners = [UL,UR,LR,LL];
  return gon;
 }
   
/*
tan(theta) = hd/d;
theta = atan(hd/d);
hd = r*sin(theta)
r = hd/sin(theta)
b + d = r;
b = r -d;
*/



     
rs.initialize = function () {
  debugger;
  this.initProtos();
  this.addFrame();
  let dim = 40;
  let disp  = 21;
  const addGon = (nm,ps,clr) => {
    let gon = this.genRectGon(Point.mk(dim,dim));
    this.set(nm,gon);
    gon.moveto(ps);
    let fill = `rgb(${clr.r},${clr.g},${clr.b})`;
    gon.fill = fill;
  }
  let gray = 100;
  let delta =50;
  addGon('gon',Point.mk(0,0),{r:gray,g:gray,b:gray});
  this.genLine(Point.mk(dim,dim),20);
  return;
  addGon('gonUL',Point.mk(-disp,-disp),{r:gray,g:gray,b:gray});
  addGon('gonUR',Point.mk(disp,-disp),{r:gray+delta,g:gray,b:gray});
  addGon('gonLR',Point.mk(disp,disp),{r:gray,g:gray+delta,b:gray});
  addGon('gonLL',Point.mk(-disp,disp),{r:gray,g:gray,b:gray+delta});
 
  

}

export {rs};




