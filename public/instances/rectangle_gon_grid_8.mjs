
import {rs as generatorP} from '/generators/rectangle_gon_grid_0.mjs'
import {rs as motionHistory} from '/motionHistory.mjs';

let rs = generatorP.instantiate();

rs.motionHistory = motionHistory;

rs.setName('rectangle_gon_grid_8');

let ht= 100;
let nr = 250;
//let cornerColors = {ULC:[10,10,10],URC:[238,105,65],LLC:[238,105,65],LRC:[10,10,10]};
let newParams = {numRows:nr,numCols:nr};//50

Object.assign(rs,newParams);




rs.colorss =[[250,250,250],[250,250,250],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[0,0,0],[250,250,250],[0,0,0],[250,250,250],[250,250,250]];

rs.colorss=[[250,250,250],[250,250,250],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[0,0,0],[250,250,250],[0,0,0],[250,250,250],[250,250,250]];
rs.colorss =[[250,250,250],[0,0,0],[0,250,0],[250,0,0],[250,0,0],[250,250,250],[250,250,250],[0,250,0],[0,250,0],[0,0,250],[250,0,0],[250,250,250],[0,250,0],[250,0,0],[0,0,250],[0,0,250]];
rs.colorss=[[250,250,250],[250,250,250],[250,250,250],[0,250,0],[250,250,250],[0,250,0],[250,250,250],[0,0,250],[0,250,0],[0,0,250],[250,250,250],[250,0,0],[0,0,0],[250,0,0],[250,0,0],[0,0,250]];

rs.icolors =
[[0,250,0],[250,0,0],[250,0,0],[0,0,250],
[0,0,0],[0,250,0],[250,0,0],[250,250,250],
[0,0,250],[0,250,0],[0,0,0],[250,250,250],
[0,0,0],[0,250,0],[0,0,0],[0,0,250]];;

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




export {rs};



