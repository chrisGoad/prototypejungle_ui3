import {rs as addQuadMethods} from '/mlib/rect2quad.mjs';	
import {rs as addMotionMethods} from '/mlib/motion.mjs';	

import {rs as generatorP} from '/instances/part2_0_58.mjs';

let rs = generatorP.instantiate();

addQuadMethods(rs);
addMotionMethods(rs);
let wd = rs.width;
rs.setName('part2_0_58d');
let topParams = {center:Point.mk(0,0),radius:.4*wd,cycles:1,saveAnimation:1};
Object.assign(rs,topParams);

let levels = 9;
levels = 1;

rs.partParams.levels = levels;

rs.randomColor = function () {
  const rshade =() => Math.floor(Math.random()*255);
    let r = rshade();
    let g = rshade();
    let b = rshade();
    let rcolor = `rgba(${r},${g},${b},.5)`;
    return rcolor;
}
rs.computeFills = function () {
  let aw = this.allWheres(this.partParams.levels,5);
  let af = {};
  
  aw.forEach((w) => {
    let rcolor = this.randomColor();
    let wn = w[0];
    af[wn] = rcolor;
    //af[wn] = 'transparent';
  });
  this.colors = af;
  debugger;
}

rs.partStroke = function () {
 return 'white';
}

rs.computeFills();



rs.duration = 20;//duration of one path
rs.pauseDuration = 4;
rs.numCycles = 8;
rs.saveAnimation = 1;
rs.partParams.levels = levels;
rs.partParams.rectangular = 1;
rs.saveAnimation = 1;

for (let i=0;i<4;i++) {
  rs.addPath('q',i);
}
for (let i=0;i<4;i++) {
  rs.addPath('o',i);
}

for (let i=0;i<2;i++) {
  rs.addPath('t',i);
}
debugger;

rs.buildSeqOb = function () {
  let {pstate,numCycles} = this;
  let {pspace} = pstate;
  let props = Object.getOwnPropertyNames(pspace);
  return this.randomSeqOb({props,lb:-0.4,ub:0.4,numCycles:numCycles-1});
}

rs.afterUpdateState = function () {
  let {stepsSoFar:ssf,topPart} =this;
  let pgon = topPart.P0.polygon;
  this.corners = pgon.corners;
  debugger;
  this.execMotionGroups(ssf);
}


rs.addMotion = function () {
  let {numSteps,polygonP,center,radius,cycles,toQuad} = this;
  this.mkCircularMotionGroup(6,{center,radius,cycles,duration:numSteps,shapeP:null,polyP:polygonP,map:toQuad}); //only polygons
}
       

rs.mkMotionn = function (phase) {
  let {numSteps,cycles,center,radius,toQuad} = this;
  debugger;
  let dot = this.addDot();
  let startPhase = phase?phase:0;
  let m = {startPhase,startTime:0,cycles,center,radius,shape:dot,duration:numSteps,map:toQuad}
  //let m = {startTime:0,cycles,center,radius,shape:dot,duration:numSteps}
  return m;
}

rs.afterInitialize = function () {
 /* let {circleP,polygonP,topPart} = this;
  let pgon = topPart.P0.polygon;
  this.corners = pgon.corners;*/
  this.motionGroups = [];
  this.set('mshapes',arrayShape.mk());
  this.addMotion();
  
  //pgon.fill = this.randomColor();
 

}

rs.loopingSeqOb(rs.buildSeqOb);

rs.updateState();

  
//rs.addToArray(strokeWidths,.1,levels);
export {rs};


