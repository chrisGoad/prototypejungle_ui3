
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
//import {rs as addPathMethods} from '/mlib/path.mjs';	

let rs = basicsP.instantiate();

rs.setName('grid_emergence_2');
addGridMethods(rs);
//addPathMethods(rs);
//addRandomMethods(rs);
let nr = 32;
let wd=100;

let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:0,framePadding:0.15*wd};
Object.assign(rs,topParams);


let initState = {gb:{value:0}};
let pspace = {
  gb:{kind:'sweep',step:5,min:0,max:255,interval:1,steps:0.5,startDown:0,bounce:1,sinusoidal:1}
};


rs.pstate = {pspace,cstate:initState};

rs.numSteps = 309;
rs.saveAnimation = 1;
rs.chopOffBeginning = 0;
rs.stepInterval = 100;


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
rs.angleByCell = function (cell) {
  let {x,y} = cell;
  let idx = nr*x+y;
  return this.anglesByCell[idx];
} 
rs.computeAnglesByCell = function () {
  for (let i=0;i<nr;i++) { 
    for (let j=0;j<nr;j++) { 
      let dir = Math.random()*Math.PI;
      this.anglesByCell.push(dir);
    }
  }
}
   

rs.shapeGenerator = function (rvs,cell) {
  
  let {lineP} = this;
  let shape = lineP.instantiate().show();
  let alongDiag = 0;
  let dir = this.angleByCell(cell);
  let hvec = Point.mk(Math.cos(dir),Math.sin(dir)).times(2);
  shape.setEnds(hvec.times(-1),hvec);
 // let stroke = `rgb(${gb},${gb},${255-gb})`;
  shape.update();
  return shape;
}

rs.updateCell = function (cell,fr) {
  let onmd0 = this.onNthDiagonal0(nr,cell);
  let onmd1 = this.onNthDiagonal1(0,cell);
  let {shape} = cell;
  let dir;
  debugger;
  if (onmd0 || onmd1) {
    if (onmd1) {
      dir = -.25*Math.PI + fr*.5*Math.PI;
    } else if (onmd0) {
      dir = .25*Math.PI - fr*.5*Math.PI;
    } 
    let hvec = Point.mk(Math.cos(dir),Math.sin(dir)).times(2);
    shape.setEnds(hvec.times(-1),hvec);
  }
}

rs.updateCells = function (fr) {
  let {theCells} = this;
  theCells.forEach( (cell) => {
    this.updateCell(cell,fr);
  });
}

rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.computeAnglesByCell();
  debugger;
  this.generateGrid();
 this.updateCells(.9)
}

export {rs};


