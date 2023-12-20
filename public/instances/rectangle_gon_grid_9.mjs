
import {rs as generatorP} from '/generators/rectangle_gon_grid_0.mjs'
import {rs as motionHistory} from '/motionHistories/motion_1.mjs';

let rs = generatorP.instantiate();

rs.motionHistory = motionHistory;

rs.setName('rectangle_gon_grid_9');

let ht= 55;
let nr = 250;
// nr = 100;
//let cornerColors = {ULC:[10,10,10],URC:[238,105,65],LLC:[238,105,65],LRC:[10,10,10]};
let newParams = {width:ht,height:ht,numRows:nr,numCols:nr};//50

Object.assign(rs,newParams);



let lowc = 0;
let highc = 250;

rs.colors = [[lowc,lowc,highc],[lowc,highc,lowc],[highc,lowc,lowc],[highc,highc,highc]];
//[[0,250,0],[250,0,0],[250,0,0],[0,0,250],
//[[0,0,250],[0,250,0],[250,0,0],[250,250,250]];
//[0,0,250],[0,250,0],[0,0,0],[250,250,250],
//[0,0,0],[0,250,0],[0,0,0],[0,0,250]];;

rs.tfn = (v) => {
  let v0 =v[0];
  let v1 =v[1];
  let v2 =v[2];
  let mdv = 25;
  let vmod0 = Math.floor(v0%mdv);
  let vmod1 = Math.floor(v1%mdv);
  let vmod2 = Math.floor(v2%mdv);
  /*
   let vmod0 = Math.floor(v0/25);
  let vmod1 = Math.floor(v1/25);
  let vmod2 = Math.floor(v2/25);*/
  let tbv0 = Math.min(vmod0*25,250);
  let tbv1 = Math.min(vmod1*25,250);
  let tbv2 = Math.min(vmod2*25,250);
  //return [tbv0,tbv1,tbv2];
  return [tbv0,tbv0,tbv0];
}

rs.onUpdate = function () {
  let {stepsSoFar:ssf} = this;
  console.log('steps',ssf);
}

rs.shift = function (colors) {
  let ncl = [];
  let ln = colors.length;
  for (let i=0;i<ln;i++) {
    ncl.push(colors[(i+1)%ln]);
  }
  return ncl;
}
rs.buildColorsA = function () {
  let {colors}  = this;
  let cla = [colors];
  for (let i=1;i<4;i++) {
    cla.push(this.shift(cla[i-1]));
  }
  let rcla = cla.reverse();
  debugger;
  this.colorsA = rcla;
}
rs.initialize = function () {
  debugger;
  this.initProtos();
   //let {width:wd,circleP,numRows,numCols,width,height,stepsPerStage:sps,motionHistory:mh} = this;
   let {circleP,numRows,numCols,stepsPerStage:sps,motionHistory:mh} = this;
   
  let motion=this.motion = this.processHistory(mh);
  let numSteps = this.numSteps = motion.length;
  this.stepsPerStage = Math.floor(numSteps/4);
  let hr = this.historyRadius(motion);
  let nr = 1.1*hr;
  let wd = this.width = 2*nr;
  let ht = this.height = 2*nr;
  this.addFrame();
  let lines = this.set('lines',arrayShape.mk());
  let gons = this.set('gons',arrayShape.mk());
  let points = this.set('points',arrayShape.mk());
  let bbase = this.bbase = 0.9*wd;
  let gg = this.addGonGrid({numRows,numCols,width:wd,height:ht});
  this.buildColorsA();
  this.updateState();
 // let vertices = this.vertices = motion[0].points;
  //this.interpolateColors(gons,vertices,this.colors,this.tfn,this.dfn);
}


rs.updateState = function () {
  let {stepsPerStage:sps,motion,stepsSoFar:ssf,gons,colors,tfn,dfn,verbose} = this;
  
  if (ssf>=31) {
    this.numSteps = 34;
    this.getVerbose =1;
    debugger;
  }
  if (ssf>40) {
 //   debugger;
    return;
  }
  let stage = Math.floor(ssf/sps);
  let fr = (ssf%sps)/sps;
  this.setColors(stage,fr);
  let vertices = motion[ssf].points;
  let iparams ={gons,vertices,colors,tfn,dfn,verbose};
 // this.interpolateColors(gons,vertices,this.colors,this.tfn,this.dfn);
  this.interpolateColors(iparams);
   let onUp = this.onUpdate;
 // debugger;
   this.onUpdate();
 }


export {rs};



