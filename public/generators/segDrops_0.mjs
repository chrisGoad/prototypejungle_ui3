import {rs as addDropMethods} from '/mlib/segDrops.mjs';
import {rs as linePP} from '/shape/line.mjs';

import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();

addDropMethods(rs);
debugger;
let wd = 200;
rs.setName('segDrops_0');
let topParams = {width:wd,height:wd,framePadding:.1*wd,numSteps:200,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,maxFindUntried:10,maxCheckIntersect:10000,
                 maxTargets:20}
Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke = 'cyan';
}
  
rs.initialize = function () {
  let {maxTargets} = this;
  this.initProtos();
  this.addFrame();

  debugger;
  this.initDrop();
  let targets = this.targets;
  for (let i=0;i<maxTargets;i++) {
    let rp = this.genRandomPoint();
    targets.push(rp);
  }
  this.dropLoop();
  this.installDrops(this.lineP);
}

export {rs};
