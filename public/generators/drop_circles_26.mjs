import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/circleDropsS.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_26');
let ht= 100;
let hht = 0.5*ht;
let xt = Point.mk(ht,ht);
let zone = rs.mkRectFromCenterExtent(Point.mk(0,0),xt);
let rd = 1;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',origRad:rd,radNow:rd}

Object.assign(rs,topParams);

//rs.dropParams = {dropTries:150,scale:0.5,radius:50}
rs.dropParams = {zone,dropTries:100000,maxLoops:100000,maxDrops:60};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
}

rs.generateCircleDrop= function (p) { 
  let {origRad}  = this;
  let r = Math.random()*origRad;
  let cf = 3;
  let drop = {collideRadius:2*r*cf,dimension:r*2,fill:'white',orad:r};
  return drop;
}
rs.expandCircles = function () {
  let {drops} = this;
}

rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams,width} = this;
  let qwd = 1.005*0.25*width;
  this.addFrame();
  debugger;
  let shapes = this.set('dropShapes',arrayShape.mk());
  let drops =  this.drops = this.generateCircleDrops(dropParams);
  
  this.installCircleDrops(shapes,circleP,drops);

}

export {rs};



