import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/circleDropsS.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_23');
let ht= 100;
let qht = 0.25*ht;
let xt = Point.mk(qht,qht);
let zone = rs.mkRectFromCenterExtent(Point.mk(0,0),xt);

let topParams = {width:ht,height:ht,framePadding:0.35*ht,frameStrokee:'white'}

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
  //r=2;
  let f =.5;
  f = 2;
  let cf = 1.1;
  cf=2;
  let drop = {collideRadius:1.1*r*f*cf,dimension:r*f*2,fill:'red'};
  return drop;
}

rs.buildPnts = function () {
  let {width} = this;
  let ewd = 1.5*0.125*width;
  let qwd = 2.005*0.25*width;
  let p00 = Point.mk(-qwd,-qwd);
  let p10 = Point.mk(-ewd,-qwd);
  let p20 = Point.mk(+ewd,-qwd);
  let p30 = Point.mk(+qwd,-qwd);
  
  let p01 = Point.mk(-qwd,-ewd);
  let p11 = Point.mk(-ewd,-ewd);
  let p21 = Point.mk(+ewd,-ewd);
  let p31 = Point.mk(+qwd,-ewd);
  
  let p02 = Point.mk(-qwd,+ewd);
  let p12 = Point.mk(-ewd,+ewd);
  let p22 = Point.mk(+ewd,+ewd);
  let p32 = Point.mk(+qwd,+ewd);
  
  let p03 = Point.mk(-qwd,+qwd);
  let p13 = Point.mk(-ewd,+qwd);
  let p23 = Point.mk(+ewd,+qwd);
  let p33 = Point.mk(+qwd,+qwd);
  
  this.pnts= [p00,p10,p20,p30,p01,p11,p21,p31,p02,p12,p22,p32,p03,p13,p23,p33];
}

rs.buildPnts();

rs.buildTable = function (occupants,pnts) {
  let ln=pnts.length;
  let tb = [];
  for (let i=0;i<ln;i++) {
    let p = pnts[i];
    let occ = occupants[i];
    tb.push(this.moveDrops(occ,p));
  }
  return tb;
}
rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams,width} = this;
  let ewd = 1.5*0.125*width;
  let qwd = 2.005*0.25*width;
  this.addFrame();
  debugger;
  let shapes = this.set('drops',arrayShape.mk());
 
  
  let A =  this.generateCircleDrops(dropParams);
  let B =  this.generateCircleDrops(dropParams);
  let Ax = this.dropsFlipX(A);
  let Ay = this.dropsFlipY(A);
  let Axy = this.dropsFlipXY(A);
  let Bxy = this.dropsFlipXY(B);
  let By = this.dropsFlipY(B);
  let Bx = this.dropsFlipX(B);
  
  /*the structure:
  A    Ax   A    Ax
  Ay   Axy  Ay   Axy
  A    Ax   Ax   Ax
  Ay   Axy  Ay   Axy
  */
 
  let occupants = [
  A  ,Ax ,A  ,Ax ,
  Ay ,Axy,Ay ,Axy,
  A  ,Ax ,A  ,Ax ,
  Ay ,Axy,Ay ,Axy];

  let table = this.buildTable(occupants,this.pnts);

  table.forEach( (d) =>  this.installCircleDrops(shapes,circleP,d));
}


export {rs};



