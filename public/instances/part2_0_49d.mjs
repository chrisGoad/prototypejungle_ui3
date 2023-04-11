import {rs as addQuadGridMethods} from '/mlib/quad_grid.mjs';	

import {rs as generatorP} from '/instances/part2_0_49.mjs';

let rs = generatorP.instantiate();

addQuadGridMethods(rs);
rs.setName('part2_0_49d');
let nr =20;
let topParams = {numRows:nr,numCols:nr,saveAnimation:1};
Object.assign(rs,topParams);

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
    //debugger;
    let r = rshade();
    let g = rshade();
    let b = rshade();
    let wn = w[0];
    let rcolor = `rgba(${r},${r},${r},.5)`;
  af[wn] = rcolor;
    //af[wn] = 'transparent';
  });
  this.colors = af;
}

rs.gridReady = 0;

rs.partFill  = function (prt) {
  let {gridReady} = this;  
  let w = prt.where;
  let pgon = prt.polygon;
  if (pgon) {
    let corners = pgon.corners;
    if (corners) {
      let c = corners;
      let cln = corners.length;
      let wln = w.length;
      if ((cln === 4)&&(wln===2)) {
        //debugger;
        if (!gridReady) {
          this.initGrid();
          this.gridReady=1;
        }
        let rc = [c[2],c[3],c[0],c[1]]
        rc = [c[1],c[0],c[3],c[2]]
        rc = [c[0],c[3],c[2],c[1]]
        this.updateLines(rc);
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


