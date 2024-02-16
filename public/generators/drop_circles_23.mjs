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
  let drop = {collideRadius:1.1*r*f*cf,dimension:r*f*2,fill:'white'};
  return drop;
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
 // let B =  this.generateCircleDrops(dropParams);
  let B = A; 
  let Ax = this.dropsFlipX(A);
  let Ay = this.dropsFlipY(A);
  let Axy = this.dropsFlipXY(A);
  let Bxy = this.dropsFlipXY(B);
  let By = this.dropsFlipY(B);
  let Bx = this.dropsFlipX(B);
  
  /*the structure:
  A    Ax   A    Ax
  Ay   B    Bx   Axy
  A    By   Bxy  Ax
  Ay   Axy  Ay   Axy
  */
  
  
  let d00 = this.moveDrops(A,Point.mk(-qwd,-qwd));
  let d10 = this.moveDrops(Ax,Point.mk(-ewd,-qwd));
  let d20 = this.moveDrops(A,Point.mk(ewd,-qwd));
  let d30 = this.moveDrops(Ax,Point.mk(qwd,-qwd));
  
  let d01 = this.moveDrops(Ay,Point.mk(-qwd,-ewd));
  let d11 = this.moveDrops(B,Point.mk(-ewd,-ewd));
  let d21 = this.moveDrops(Bx,Point.mk(ewd,-ewd));
  let d31 = this.moveDrops(Axy,Point.mk(qwd,-ewd));
 
  let d02 = this.moveDrops(A,Point.mk(-qwd,ewd));
  let d12 = this.moveDrops(By,Point.mk(-ewd,ewd));
  let d22 = this.moveDrops(Bxy,Point.mk(ewd,ewd));
  let d32 = this.moveDrops(Ax,Point.mk(qwd,ewd));
 
  let d03 = this.moveDrops(Ay,Point.mk(-qwd,qwd));
  let d13 = this.moveDrops(Axy,Point.mk(-ewd,qwd));
  let d23 = this.moveDrops(Ay,Point.mk(ewd,qwd));
  let d33 = this.moveDrops(Axy,Point.mk(qwd,qwd));
  
  let ds = [d00,d10,d20,d30,d01,d11,d21,d31,d02,d12,d22,d32,d03,d13,d23,d33];
  ds.forEach( (d) =>  this.installCircleDrops(shapes,circleP,d));
 
}

/*
  let dF =  this.generateCircleDrops(dropParams);
  let dG =  this.generateCircleDrops(dropParams);
  let dFx = this.dropsFlipX(dF);
  let dFy = this.dropsFlipY(dF);
  let dFxy = this.dropsFlipXY(dF);
  let dGxy = this.dropsFlipXY(dG);
  let dGy = this.dropsFlipY(dG);
  let dGx = this.dropsFlipX(dG);
  let d00 = this.moveDrops(dF,Point.mk(-qwd,-qwd));
  let d10 = this.moveDrops(dFx,Point.mk(-ewd,-qwd));
  let d20 = this.moveDrops(dF,Point.mk(ewd,-qwd));
  let d30 = this.moveDrops(dFx,Point.mk(qwd,-qwd));
  let d01 = this.moveDrops(dFy,Point.mk(-qwd,-ewd));
  //let d11 = this.moveDrops(dFxy,Point.mk(-ewd,-ewd));
  let d11 = this.moveDrops(dGxy,Point.mk(-ewd,-ewd));
  //let d21 = this.moveDrops(dFy,Point.mk(ewd,-ewd));
  let d21 = this.moveDrops(dGy,Point.mk(ewd,-ewd));
  let d31 = this.moveDrops(dFxy,Point.mk(qwd,-ewd));
  
   let d02 = this.moveDrops(dF,Point.mk(-qwd,ewd));
  //let d12 = this.moveDrops(dFx,Point.mk(-ewd,ewd));
  let d12 = this.moveDrops(dGx,Point.mk(-ewd,ewd));
  //let d22 = this.moveDrops(dF,Point.mk(ewd,ewd));
  let d22 = this.moveDrops(dG,Point.mk(ewd,ewd));
  let d32 = this.moveDrops(dFx,Point.mk(qwd,ewd));
  let d03 = this.moveDrops(dFy,Point.mk(-qwd,qwd));
  let d13 = this.moveDrops(dFxy,Point.mk(-ewd,qwd));
  let d23 = this.moveDrops(dFy,Point.mk(ewd,qwd));
  let d33 = this.moveDrops(dFxy,Point.mk(qwd,qwd));
  let ds = [d00,d10,d20,d30,d01,d11,d21,d31,d02,d12,d22,d32,d03,d13,d23,d33];
*/

export {rs};



