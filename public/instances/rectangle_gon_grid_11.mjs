
import {rs as generatorP} from '/instances/rectangle_gon_grid_9.mjs'
import {rs as motionHistory} from '/motionHistories/motion_2.mjs';

let rs = generatorP.instantiate();

rs.motionHistory = motionHistory;

rs.setName('rectangle_gon_grid_11');

let ht= 55;
let nr = 250;
 nr = 200;
//let cornerColors = {ULC:[10,10,10],URC:[238,105,65],LLC:[238,105,65],LRC:[10,10,10]};
let newParams = {width:ht,height:ht,numRows:nr,numCols:nr,verbose:100,scaling:2};//50

Object.assign(rs,newParams);

rs.rca = function () {
 return this.randomColorArray(0,250);
}
rs.mkrcas = function  (n)  {
  let rcas = [];
  for (let i=0;i<ln;i++) {
     rcas.push(this.rca());
  }
  this.colors = rcas;
}
rs.colors = [[0,0,0],[100,100,100],[175,175,175],[250,250,250]];
rs.colors = [[0,100,175],[100,175,250],[175,250,0],[250,0,100]];
rs.colors = [[0,100,175],[100,175,250]];




rs.tfn = (v,vrb) => {
  let v0 =v[0];
  let v1 =v[1];
  let v2 =v[2];
  let mdv = 25;
  let fc = 250/mdv;
  let vmod0 = Math.floor(v0%mdv);
  let vmod1 = Math.floor(v1%mdv);
  let vmod2 = Math.floor(v2%mdv);
  
  /*
   let vmod0 = Math.floor(v0/25);
  let vmod1 = Math.floor(v1/25);
  let vmod2 = Math.floor(v2/25);*/
  let tbv0 = Math.min(vmod0*fc,250);
  let tbv1 = Math.min(vmod1*fc,250);
  let tbv2 = Math.min(vmod2*fc,250);
  if (vrb&&0) {
    console.log('v1',v1,'vmod1',vmod1,'tbv1',tbv1);
  }
return [tbv0,tbv1,tbv2];
return [tbv1,tbv1,tbv1];
 // return [v0,v1,v2];
  return [v1,v1,v1];
}

export {rs};



