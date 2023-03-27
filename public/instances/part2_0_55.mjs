
import {rs as generatorP} from '/generators/part2_0.mjs';

let rs = generatorP.instantiate();
rs.pstate = {pspace:{},cstate:{}};

rs.setName('part2_0_55');
let levels = 16;
levels = 6;
let topLevels = 9;
rs.frameStrokee = 'white';
rs.framePadding = .05*rs.width;
let kind = 'sweep';
rs.partParams.levels = levels;
rs.partParams.rectangular = 1;
levels++;


let qsr = 0.03;
let qssf = 0.04;
let qmin = 0.2;
let qmax = 0.8;
let qiv = 0.5;
 rs.addWpath('L1q0s0',qsr,qssf,qmin,qmax,qiv);
    rs.addWpath('L1q0s1',qsr,qssf,qmin,qmax,qiv);
    rs.addWpath('L1q0s2',qsr,qssf,qmin,qmax,qiv);
    rs.addWpath('L1q0s3',qsr,qssf,qmin,qmax,qiv);
rs.numSteps = 200;
rs.numSteps = 1000;


rs.quadSplitParams = {Case:3,vertexNum:0,pcs:[0.4,1.4,2.6,3.4]};
rs.triSplitParams = {Case:1,vertexNum:0,pcs:[0.3,1.3]};
rs.partSplitParams = function (prt) {
  let ln = prt.polygon.corners.length;
  let {pstate} = this;
  let {cstate} = pstate;
  let {where} = prt;
  let lev = where.length;
  /*let eps0 = cstate.pc0.value;
  let eps1 = cstate.pc1.value;
  let eps2 = cstate.pc2.value;
  let eps3 = cstate.pc3.value;*/
  let L1q0s0 = cstate.L1q0s0.value;
  let L1q0s1 = cstate.L1q0s1.value+1;
  let L1q0s2 = cstate.L1q0s2.value+2;
  let L1q0s3 = cstate.L1q0s3.value+3;
  let qp;
  if (1 || (lev===0)) {
    qp =  {Case:3,pcs:[L1q0s0,L1q0s1,L1q0s2,L1q0s3]};
  } else {
    qp = null;
  }
  let rs = (ln === 3)?this.triSplitParams:qp;
  return rs;
}

let visibles = rs.partParams.visibles = [];
rs.addToArray(visibles,1,20);

let strokeWidths = rs.partParams.strokeWidths = [];
rs.computeExponentials({dest:strokeWidths,n:20,root:0.4,factor:.8});

//item.addWpath = function (nm,subRange,min,max,initVal,prop,val) {
//item.addWpath = function (nm,subRange,substepfactor,min,max,initVal,prop,val) {

rs.afterInitializee = function () {
    this.addWpath('L1q0s0',qsr,qssf,qmin,qmax,qiv);
    this.addWpath('L1q0s1',qsr,qssf,qmin,qmax,qiv);
    this.addWpath('L1q0s2',qsr,qssf,qmin,qmax,qiv);
    this.addWpath('L1q0s3',qsr,qssf,qmin,qmax,qiv);
}
rs.updateStatee = function () {
  debugger;
  this.resetShapes();
  draw.zoomStep(1.01);
  return;
  let ssf = this.stepsSoFar;
  let ns = this.numSteps;
  let hns = 0.5*ns;
  let fr = ssf<hns?ssf/hns:1-(ssf-hns)/hns;
  levels = Math.floor(1 + (topLevels-1)*fr);
  console.log('levels',levels);
  this.partParams.levels = levels;

  this.resetShapes();
}

rs.saveAnimation = 1;
rs.chopOffBeginning = 1;
 rs.stepInterval = 40;
let ist=rs.numISteps = 0;

rs.numSteps = 101-ist;
rs.numSteps = 500;
//rs.recycle = 1;
//rs.numSteps = 300;
//rs.addToArray(strokeWidths,.1,levels);
export {rs};


