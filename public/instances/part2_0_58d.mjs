import {rs as addQuadMethods} from '/mlib/rect2quad.mjs';	

import {rs as generatorP} from '/instances/part2_0_58.mjs';

let rs = generatorP.instantiate();

addQuadMethods(rs);
let wd = rs.width;
rs.setName('part2_0_58d');
let topParams = {center:Point.mk(0,0),radius:.4*wd,cycles:2,saveAnimation:1};
Object.assign(rs,topParams);

let levels = 9;
levels = 1;
//levels = 7;
//topLevels = 6;

rs.partParams.levels = levels;
rs.computeFills = function () {
  const rshade =() => Math.floor(Math.random()*255);
  let aw = this.allWheres(this.partParams.levels,5);
  let af = {};
  
  aw.forEach((w) => {
    let r = rshade();
    let g = rshade();
    let b = rshade();
    let wn = w[0];
    let rcolor = `rgba(${r},${g},${b},.5)`;
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
  let {stepsSoFar:ssf} = this;
  debugger;
  let part = this.topPart.P0;
  let pgon = part.polygon;
  let c = pgon.corners; if (c) {
    this.corners = c;
    this.execMotions(ssf);
  }
  23;

}


rs.mkMotion = function (phase) {
  let {numSteps,cycles,center,radius,toQuad} = this;
  debugger;
  let dot = this.addDot();
  let startPhase = phase?phase:0;
  let m = {startPhase,startTime:0,cycles,center,radius,shape:dot,duration:numSteps,map:toQuad}
  //let m = {startTime:0,cycles,center,radius,shape:dot,duration:numSteps}
  return m;
}

rs.afterInitialize = function () {
  let {circleP} = this;
  debugger;
  23;
  circleP.dimension = 4;
  this.set('dotShapes',arrayShape.mk());
  this.set('lines',arrayShape.mk());
  //let m = this.mkMotion();
  //this.motions = [m];
  this.motions =[];
  this.mkMotions(4,this.mkMotion);

}

rs.loopingSeqOb(rs.buildSeqOb);

rs.updateState();

  
//rs.addToArray(strokeWidths,.1,levels);
export {rs};


