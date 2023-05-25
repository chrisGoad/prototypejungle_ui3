import {rs as addDropMethods} from '/mlib/segDrops.mjs';

import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();

addDropMethods(rs);

let wd = 200;
rs.setName('segDrops_0');
let topParams = {width:wd,height:wd,framePadding:.1*wd,numSteps:200,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,maxFindUntried:10,maxCheckIntersect:10,
                 maxTargets:10}
Object.assign(rs,topParams);

rs.initialize = function () {
  let {maxTargets} = this;
  this.initDrop();
  let targets = this.targets;
  for (let i=0;i<maxTargets;i++) {
    let rp = this.genRandomPoint();
    targets.push(rp);
  }
  this.dropLoop();
}
