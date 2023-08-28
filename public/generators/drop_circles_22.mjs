import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/circleDropsS.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_22');
let ht= 100;
let hht = 0.5*ht;
let xt = Point.mk(hht,hht);
let zone = rs.mkRectFromCenterExtent(Point.mk(0,0),xt);

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white'}

Object.assign(rs,topParams);

//rs.dropParams = {dropTries:150,scale:0.5,radius:50}
rs.dropParams = {zone,dropTries:100000,maxLoops:100000,maxDrops:1000000};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
}

rs.generateCircleDrop= function (p) { 
  let r  = Math.random();
  let f =.5;
  f = 2;
  let cf = 1.1;
  cf=2;
  let drop = {collideRadius:1.1*r*f*cf,dimension:r*f*2,fill:'red'};
  return drop;
}

rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams,width} = this;
  let qwd = 1.005*0.25*width;
  this.addFrame();
  debugger;
  let shapes = this.set('drops',arrayShape.mk());
  let drops =  this.generateCircleDrops(dropParams);
  let dFx = this.dropsFlipX(drops);
  let dFy = this.dropsFlipY(drops);
  let dFxy = this.dropsFlipXY(drops);
  let dUL = this.moveDrops(drops,Point.mk(-qwd,-qwd));
  let dUR = this.moveDrops(dFx,Point.mk(qwd,-qwd));
 // let dLL = this.moveDrops(drops,Point.mk(-qwd,qwd));
  let dLL = this.moveDrops(dFy,Point.mk(-qwd,qwd));
  //let dLR = this.moveDrops(dFx,Point.mk(qwd,qwd));
  let dLR = this.moveDrops(dFxy,Point.mk(qwd,qwd));
  //this.installCircleDrops(shapes,circleP,drops);
  this.installCircleDrops(shapes,circleP,dUL);
  this.installCircleDrops(shapes,circleP,dUR);
  this.installCircleDrops(shapes,circleP,dLL);
  this.installCircleDrops(shapes,circleP,dLR);
}

export {rs};



