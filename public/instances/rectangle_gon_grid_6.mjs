
import {rs as generatorP} from '/generators/rectangle_gon_grid_0.mjs'
let rs = generatorP.instantiate();


rs.setName('rectangle_gon_grid_6');
/*
let ht= 100;
let nr = 201;
let cornerColors = {ULC:[10,10,10],URC:[238,105,65],LLC:[238,105,65],LRC:[10,10,10]};
let newParams = {numRows:nr,numCols:nr,randomColors:0,cornerColors,
                  framePadding:0.01*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,xgapf:-.1,ygapf:-.1};//50

Object.assign(rs,newParams);
*/
rs.colors =[[250,0,0],[0,250,0],[250,0,0],[0,0,0],[250,250,250],[0,0,0],[0,250,0],[250,250,250],[250,250,250],[0,0,250],[0,0,250],[250,0,0],[250,0,0],[0,250,0],[0,0,250],[0,0,250]]; rs.tfn = (v) => {
  let v0 =v[0];
  let v1 =v[1];
  let v2 =v[2];
  let vmod0 = Math.floor(v0%25);
  let vmod1 = Math.floor(v1%25);
  let vmod2 = Math.floor(v2%25);
  let tbv0 = vmod0*25;
  let tbv1 = vmod1*25;
  let tbv2 = vmod2*25;
  //return [tbv0,tbv1,tbv2];
  return [tbv0,tbv2,tbv0];
}

export {rs};



