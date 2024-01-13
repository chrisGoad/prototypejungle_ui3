
import {rs as generatorP} from '/generators/rectangle_gon_grid_0.mjs'
import {rs as motionHistory} from '/motionHistory.mjs';

let rs = generatorP.instantiate();

rs.motionHistory = motionHistory;

rs.setName('rectangle_gon_grid_8');

let ht= 55;
let nr = 250;
//let cornerColors = {ULC:[10,10,10],URC:[238,105,65],LLC:[238,105,65],LRC:[10,10,10]};
let newParams = {width:ht,height:ht,numRows:nr,numCols:nr};//50

Object.assign(rs,newParams);




rs.colorss =[[250,250,250],[250,250,250],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[0,0,0],[250,250,250],[0,0,0],[250,250,250],[250,250,250]];

rs.colorss=[[250,250,250],[250,250,250],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[0,0,0],[250,250,250],[0,0,0],[250,250,250],[250,250,250]];
rs.colorss =[[250,250,250],[0,0,0],[0,250,0],[250,0,0],[250,0,0],[250,250,250],[250,250,250],[0,250,0],[0,250,0],[0,0,250],[250,0,0],[250,250,250],[0,250,0],[250,0,0],[0,0,250],[0,0,250]];
rs.colorss=[[250,250,250],[250,250,250],[250,250,250],[0,250,0],[250,250,250],[0,250,0],[250,250,250],[0,0,250],[0,250,0],[0,0,250],[250,250,250],[250,0,0],[0,0,0],[250,0,0],[250,0,0],[0,0,250]];

rs.colors =
[[0,250,0],[250,0,0],[250,0,0],[0,0,250],
[0,0,0],[0,250,0],[250,0,0],[250,250,250]];
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

rs.initialize = function () {
  debugger;//keep
  this.initProtos();
   let {width:wd,circleP,numRows,numCols,width,height,stepsPerStage:sps,motionHistory:mh} = this;
   this.addFrame();
   
  let motion=this.motion = this.processHistory(mh);
  this.numSteps = motion.length;

  let lines = this.set('lines',arrayShape.mk());
  let gons = this.set('gons',arrayShape.mk());
  let points = this.set('points',arrayShape.mk());
  let bbase = this.bbase = 0.9*wd;
  let gg = this.addGonGrid({numRows,numCols,width,height});
  let vertices = this.vertices = motion[0].points;
  this.interpolateColors(gons,vertices,this.colors,this.tfn,this.dfn);
}

rs.updateState = function () {
  let {motion,stepsSoFar:ssf,gons} = this;
  let vertices = motion[ssf].points;
  this.interpolateColors(gons,vertices,this.colors,this.tfn,this.dfn);
   let onUp = this.onUpdate;
 // debugger;
   this.onUpdate();
 }


export {rs};



