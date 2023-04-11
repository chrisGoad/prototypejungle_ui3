import {rs as addQuadGridMethods} from '/mlib/quad_grid.mjs';	

import {rs as generatorP} from '/instances/part2_0_49.mjs';

let rs = generatorP.instantiate();

addQuadGridMethods(rs);
rs.setName('part2_0_49d');

let levels = 9;
levels = 2;
//levels = 3;
//topLevels = 6;

rs.partParams.levels = levels;
rs.computeFills = function () {
  const rshade =() => Math.floor(Math.random()*255);
  let aw = this.allWheres(this.partParams.levels,5);
  let af = {};
  
  aw.forEach((w) => {
    let r = rshade();
    let g = rshade();
    let b = rshade();
    let wn = w[0];
    let rcolor = `rgb(${r},${r},${r})`;
    af[wn] = rcolor;
  });
  this.colors = af;
}

rs.partFill  = function (prt) {
 
  let w = prt.where;
  let pgon = prt.polygon;
  if (pgon) {
    let corners = pgon.corners;
    if (corners) {
      let cln = corners.length;
      if (cln === 4) {
        debugger;
      }
    }
  }
  let ln = w.length;
  if (ln < 1) {
    return 'black';
  }
  let ws = this.whereString(w);
  let clr = this.colors[ws];
  return clr;
}

rs.computeFills();




rs.saveAnimation = 1;
rs.numSteps = 500;
rs.numISteps = 60;


  
//rs.addToArray(strokeWidths,.1,levels);
export {rs};


