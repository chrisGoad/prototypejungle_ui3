import {rs as addDropMethods} from '/mlib/segDrops.mjs';
import {rs as linePP} from '/shape/line.mjs';

import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();

addDropMethods(rs);
debugger;
let wd = 200;
let nr = 10;
rs.setName('segDrops_0');
let topParams = {width:wd,height:wd,framePadding:.1*wd,numSteps:200,numRows:nr,numCols:nr,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,maxFindUntried:10,maxCheckIntersect:10000,minLength:3,maxLength:20,
                 maxTargets:500}
Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke = 'cyan';
}

rs.genGridPoints = function () {
  let {numRows:nr,numCols:nc,width:wd,height:ht} = this;
  let ncm1 = nc-1;
  let nrm1 = nr-1;
  let dx = wd/ncm1;
  let dy = ht/nrm1;
  let minx = -0.5*wd;
  let miny = -0.5*ht;
  let pnts = [];
  for (let i=0;i<nc;i++) {
    let cx = minx+i*dx;
    for (let j=0;j<nr;j++) {
      let cy = miny+j*dy;
      let p = Point.mk(cx,cy);
      pnts.push(p);
    }
  }
  return pnts;
}
    
rs.initialize = function () {
  //let {maxTargets} = this;
  this.initProtos();
  this.addFrame();

  debugger;
  this.initDrop();
  let targets = this.targets= this.genGridPoints();
  this.maxTargets = targets.length;
 /* for (let i=0;i<maxTargets;i++) {
    let rp = this.genRandomPoint();
    targets.push(rp);
  }*/
  this.dropLoop();
  this.installDrops(this.lineP);
}

rs.segFilter = function (seg) {
  let {minLength:minL,maxLength:maxL} = this;
  let ln = seg.length();
  return (minL < ln) && (ln < maxL);
}
export {rs};
