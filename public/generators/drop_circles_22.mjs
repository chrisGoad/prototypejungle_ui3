import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/circleDropsS.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_22');
let ht= 100;
let topParams = {width:ht,height:ht,framePadding:0.1*ht}
Object.assign(rs,topParams);

//rs.dropParams = {dropTries:150,scale:0.5,radius:50}
rs.dropParams = {dropTries:100000,maxLoops:100000,maxDrops:1000000};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
}

rs.generateCircleDrop= function (p) { 
  let r  = Math.random();
  let f =0.2;
  let drop = {collideRadius:5*r*f*1.1,dimension:r*f*2,fill:'red'};
  return drop;
}

rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams} = this;
  this.addFrame();
  debugger;
  let shapes = this.set('drops',arrayShape.mk());
  let drops =  this.generateCircleDrops(dropParams);
  this.installCircleDrops(shapes,circleP,drops);
}

export {rs};



