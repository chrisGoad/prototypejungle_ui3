import {rs as circlePP} from '/shape/circle.mjs';
import {rs as generatorP} from '/generators/drop_circles_25.mjs';
let rs = generatorP.instantiate();

rs.setName('drop_circles_25');
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

rs.tableParams = function () {
  let {width} = this;
  let ewd = 1.5*0.125*width;
  let qwd = 2.005*0.25*width;
  return {ewd,qwd};
}


rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams,width} = this;
  this.addFrame();
  debugger;
  let shapes = this.set('drops',arrayShape.mk());
 
   this.buildPnts();
   let {A,Ax,Ay,Axy,B,Bx,By,Bxy} =this.theDrops(this.dropParams);
  
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



