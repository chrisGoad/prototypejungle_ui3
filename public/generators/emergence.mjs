
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicsP.instantiate();

rs.setName('emergence');
addGridMethods(rs);
addAnimationMethods(rs);
//addRandomMethods(rs);
let nr = 16;
let wd=100;

let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:0,framePadding:0.15*wd,
     numSteps:300,stepInterval:50,saveAnimation:1};
Object.assign(rs,topParams);




rs.initProtos = function () {	
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke='blue';
}

rs.onNthDiagonal0 = function (n,cell) {
  let {x,y} = cell;
  return x+y === n;
}

rs.onNthDiagonal1 = function (n,cell) {
  let {x,y} = cell;
  return x-y === n;
}


rs.anglesByCell = [];
rs.angleByCell = function (cell,angles) {
  let {x,y} = cell;
  let idx = nr*x+y;
 // return this.anglesByCell[idx];
  return angles[idx];
} 
rs.computeAnglesByCell = function () {
  let abc = [];
  for (let i=0;i<nr;i++) { 
    for (let j=0;j<nr;j++) { 
      let dir = Math.random()*Math.PI;
      abc.push(dir);
      //this.anglesByCell.push(dir);
    } 
  }
  return abc;
}
   

rs.determineDiagonal = function (cell) {
  let ond0_top = this.onNthDiagonal0(nr/2,cell)
  let ond0_bot = this.onNthDiagonal0(nr*(3/2),cell)
  let ond1_top = this.onNthDiagonal1(nr/2,cell);
  let ond1_bot = this.onNthDiagonal1(-nr/2,cell)
  let onmd0 = this.onNthDiagonal0(nr,cell);
  let onmd1 = this.onNthDiagonal1(0,cell);
  let onDiag = ond0_top || ond0_bot || ond1_top || ond1_bot || onmd0 || onmd1;
  return {onDiag,ond0_top,ond0_bot,ond1_top,ond1_bot,onmd0,onmd1};
}

rs.shapeGenerator = function (rvs,cell) {
  debugger;
  let {angles0} = this;
  let diag = this.determineDiagonal(cell);
  let {ond0_top,ond0_bot,ond1_top,ond1_bot,onmd0,onmd1} = diag;
  let {lineP} = this;
  let shape = lineP.instantiate().show();
  let dir;
  if (ond0_top||ond0_bot || onmd0) {
    dir = .25*Math.PI;
  } else if (ond1_top||ond1_bot || onmd1) {
    dir = -.25*Math.PI;
  } else {
    dir = this.angleByCell(cell,angles0);
  }
  let hvec = Point.mk(Math.cos(dir),Math.sin(dir)).times(2);
  shape.setEnds(hvec.times(-1),hvec);
  shape.stroke = 'blue';
 // shape.update();
  return shape;
  let {pstate} = this;
  let {cstate} = pstate;
  let ctime = cstate.time;
  let gb= cstate.gb.value;
  let stroke = `rgb(${gb},${gb},${255-gb})`;

  if ((ond0_bot || ond0_top || ond1_top || ond1_bot) && (ctime <= 103)) {
    shape.stroke = stroke;
  }
  if ((onmd0 || onmd1)  && (ctime > 103)) {
   shape.stroke = stroke;
  }
  if ((ond0_bot || ond0_top || ond1_top || ond1_bot ) && (ctime > 206)) {
    shape.stroke = stroke;
  }
  shape.update();
  return shape;
}

rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.angles0= this.computeAnglesByCell();
  this.angles1 = this.computeAnglesByCell();
  this.generateGrid();
}

rs.reorientSegs = function () {
  let {angles1,theCells,rdone} = this;
  if (!rdone) {
    theCells.forEach ( (cell)=> {
      let shape = cell.shape;
      let diag = this.determineDiagonal(cell).onDiag; 
      if (!diag) {
        let dir = this.angleByCell(cell,angles1);
        let hvec = Point.mk(Math.cos(dir),Math.sin(dir)).times(2);
        shape.setEnds(hvec.times(-1),hvec);   
        shape.update();
      }
    });
  }
  this.rdone = 1;
}  
rs.updateState = function () {
  let {numSteps,stepsSoFar:ssf,theCells} = this;
  debugger;
  //let cells = this.allCells();
  let fr = ssf/numSteps;
  let fr0 =3*fr;
  let fr1 = 3*(fr-1/3);
  let fr2 = 3*(fr-2/3);
  let stroke;
  let phase0 = (fr < 1/3);
  let phase1 = !phase0 && (fr < 2/3);
  let phase2 = !(phase0 || phase1);
  if (phase0) {
    let gb= Math.floor(255*fr0);
    stroke = `rgb(${gb},${gb},${255-gb})`;
  } else if (phase1) {
    let gb= Math.floor(255*fr1);
    //stroke = `rgb(${255-gb},${255-gb},255)`;
    stroke = `rgb(0,0,${255-gb})`;
  } else {
    this.reorientSegs();
    let gb= Math.floor(255*fr2);
    stroke = `rgb(0,0,${gb})`;
  }
  theCells.forEach ( (cell)=> {
    let shape = cell.shape;
    let diag = this.determineDiagonal(cell).onDiag;
   // let {ond0_top,ond0_bot,ond1_top,ond1_bot,onmd0,onmd1} = diag;
    if (phase0 && diag) {
      shape.stroke = stroke;
      shape.update();
    }
    if (phase1 && (!diag)) {
      shape.stroke = stroke;
      shape.update();
    }
    if (phase2 && (!diag)) {
       shape.stroke = stroke;
       shape.update();
    }
  });
}
export {rs};


