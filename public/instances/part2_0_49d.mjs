//import {rs as addQuadGridMethods} from '/mlib/quad_grid.mjs';	
import {rs as addQuadMethods} from '/mlib/rect2quad.mjs';	
//import {rs as addGridMethods} from '/mlib/quad_grid2.mjs';	
import {rs as addGridMethods} from '/mlib/grid2.mjs';	
import {rs as polygonPP} from '/shape/polygon.mjs';

import {rs as generatorP} from '/instances/part2_0_49.mjs';

let rs = generatorP.instantiate();

addQuadMethods(rs);
addGridMethods(rs);
rs.setName('part2_0_49d');
let nr =20;
//nr = 1;
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
      this.corners =corners;
      let c = corners;
      let cln = corners.length;
      let wln = w.length;
      if ((cln === 4)&&(wln===2)) {
        //debugger;
        if (!gridReady) {
          this.initGrid();
          this.map = (p) => {
             let c = this.corners;
             let rc = [c[0],c[3],c[2],c[1]];
            return this.rc2qpoint(p,rc);
          }
          this.gridReady=1;
        }
        this.updateCells();
      }
    }
  }
  let ln = w.length;
  if (ln < 1) {
    return 'black';
  }
  let ws = this.whereString(w);
  let clr = this.colors[ws];
  return null;
  return clr;
}

rs.computeFills();



rs.initProtos = function () {
  this.polygonP =  polygonPP.instantiate();
  this.polygonP.stroke = 'white';
  this.polygonP.fill = 'transparent';
  this.polygonP['stroke-width'] =1;
  this.gridPolygonP =  polygonPP.instantiate();
  this.gridPolygonP.stroke = 'white';
  this.gridPolygonP.fill = 'green';
  this.gridPolygonP['stroke-width'] =.1; 
  /*this.lineP =  linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] =.5 ;
    this.circleP =  circlePP.instantiate();
  this.circleP.stroke = 'white';
  this.circleP.fill = 'blue';
  this.circleP['stroke-width'] =.05;
   let textP = this.textP =  textPP.instantiate();
  textP["font-size"] = "12";
  textP["font-style"] = "normal";
  textP["font-family"] = "arial";
  textP["font-weight"] = "normal";
  textP.stroke = 'white';*/
}



rs.saveAnimation = 1;
rs.numSteps = 500;
rs.numISteps = 60;


  
//rs.addToArray(strokeWidths,.1,levels);
export {rs};


