
import {rs as generatorP} from '/generators/rectangle_gon_grid_0.mjs'
let rs = generatorP.instantiate();


rs.setName('rectangle_gon_grid_7');

let ht= 100;
let nr = 201;
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
/*
[ 0, 1, 2, 3,
  4, 5, 6, 7,
  8, 9,10,11,
 12,13,14,15]
 
rs.rotator =[12, 8, 4, 0,
 13, 9, 5, 1,
 14,10, 6, 2,
 15,11, 7, 3 ];

rs.rotate = function (a) {
  let {rotator} = this;
  let rv = [];
  for (let i =0;i<16;i++) {
    rv.push(a[rotator[i]]);
  }
  return rv;
}

rs.colors = rs.rotate(rs.icolors);
 
rs.colors =[[0,0,0],[0,0,250],[0,0,0],[0,250,0],[0,250,0],[0,250,0],[0,250,0],[250,0,0],[0,0,0],[0,0,0],[250,0,0],[250,0,0],[0,0,250],[250,250,250],[250,250,250],[0,0,250]]; 
rs.colorsA = [rs.icolors];
for (let i=1;i<4;i++) {
  rs.colorsA.push(rs.rotate(rs.colorsA[i-1]));
}
*/
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



