
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
//import {rs as addPathMethods} from '/mlib/path.mjs';	
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicsP.instantiate();
addAnimationMethods(rs);

rs.setName('grid_emergence_2');
addGridMethods(rs);
//addPathMethods(rs);
//addRandomMethods(rs);
let nr = 24;
let wd=100;

let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:0,framePadding:0.15*wd,numSteps:48,saveAnimation:1,lineLength:2.5,
  hiStroke:'yellow'};
Object.assign(rs,topParams);






rs.initProtos = function () {	
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke='blue';
  //lineP.stroke='white';
}

rs.updateState  = function () {
  let {stepsSoFar:ssf,numSteps} = this;
  let fr = ssf/numSteps;
  this.updateCells(fr);
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
  
  let {lineP,numRows:nr,lineLength:ll} = this;
  let {x,y} = cell;
  let shape = lineP.instantiate().show();
  let alongDiag = 0;
  let dir = this.angleByCell(cell);
  let hvec = Point.mk(Math.cos(dir),Math.sin(dir)).times(ll);
  shape.setEnds(hvec.times(-1),hvec);
  debugger;
  if ((x===(nr/2))&&(y===(nr/2))) {
    debugger;
    shape.stroke = 'transparent';
  }
 // let stroke = `rgb(${gb},${gb},${255-gb})`;
  shape.update();
  return shape;
}

rs.updateCell = function (cell,fr,wh) {
  let {lineLength:ll} = this
  let onmd0 = this.onNthDiagonal0(nr,cell);
  let onmd1 = this.onNthDiagonal1(0,cell);
  let {shape} = cell;
  let dir;
  let isdir = 0;
  //debugger;
  let frN = typeof fr === 'number';
  if (onmd0 || onmd1) {  
    if (onmd1&&((wh==='1')||(wh==='both'))) {
      //dir = -.25*Math.PI + fr*.5*Math.PI;
      if (frN) {
        dir = -.25*Math.PI + fr*Math.PI;
      }
      isdir = 1;
    } else if (onmd0&&((wh==='0')||(wh==='both'))) {
      if (frN) {
        dir = .25*Math.PI - fr*Math.PI;
      }
      isdir = 1;
    } 
    if (isdir) {
      if (frN) {
        let hvec = Point.mk(Math.cos(dir),Math.sin(dir)).times(ll);
        shape.setEnds(hvec.times(-1),hvec);
        shape.stroke = 'blue'
      } else {
        shape.stroke = fr;
      }
      shape.update();
    }
  }
}

rs.updateCells = function (fr,wh) {
  let {theCells} = this;
  theCells.forEach( (cell) => {
    this.updateCell(cell,fr,wh);
  });
}

rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.setBackgroundColor('gray');
  this.computeAnglesByCell();
  debugger;
  this.generateGrid();
 this.updateCells(0,'both');
}

rs.updateStatee = function () {
  let {stepsSoFar:ssf,numSteps} = this;
  debugger;
  let nso4 = numSteps/4;
  let tso4 = nso4*2;
  let thso4 = nso4*3;
  let fr;
  if (ssf <= nso4) {
    fr = ssf/nso4;
    this.updateCells(fr);
  }  else if ((tso4 <= ssf) && (ssf <= thso4)) {
    fr = 1-(ssf-tso4)/nso4;
    this.updateCells(fr,'both');
  }
     
}


rs.updateState2 = function () {
  let {stepsSoFar:ssf,numSteps} = this;
  debugger;
  let stage1 = (3/8)*numSteps;
  let mlength = numSteps/4;
  let stage3 = (5/8)*numSteps;
  if ((stage1<=ssf) && (ssf <= stage3)) {
    let fr = (ssf-stage1)/mlength;
    this.updateCells(fr,'0'); 
  }    
}

rs.updateState = function () {
  let {stepsSoFar:ssf,numSteps:ns} = this;
  //debugger;
  let stage1 = (1/8)*ns;
  if (ssf === stage1) {
    debugger;
  }
  let mid = (1/2)*ns;
  let mlength = (3/8)*ns;
  let stage3 = (7/8)*ns;
  if ((stage1<=ssf) && (ssf <= mid)) {
    let fr = (ssf-stage1)/mlength;
    this.updateCells(fr,'0'); 
  }    
  if ((mid<=ssf) && (ssf <= stage3)) {
    let fr = (ssf-mid)/mlength;
    this.updateCells(fr,'1'); 
  }    
}


rs.updateState3 = function () {
  let {stepsSoFar:ssf,numSteps:ns} = this;
  //debugger;
  let stage1 = (1/8)*ns;
  let stage2 = (3/8)*ns;
  let stage3 = (5/8)*ns;
  let stage4 = (7/8)*ns;
  if (ssf === stage1) {
    debugger;
  }
  let mlength = (2/8)*ns;
  if ((stage1<=ssf) && (ssf <= stage2)) {
    let fr = (ssf-stage1)/mlength;
    this.updateCells(fr,'1'); 
  }
  if ((stage2<=ssf) && (ssf <= stage3)) {
    let fr = (ssf-stage2)/mlength;
    this.updateCells(fr,'0'); 
  }     
  if ((stage3<=ssf) && (ssf <= stage4)) {
    let fr = (ssf-stage3)/mlength;
    this.updateCells(fr,'both'); 
  }   
}

rs.updateState = function () {
  let {stepsSoFar:ssf,numSteps:ns} = this;
  //debugger;
  let stage1 = (1/8)*ns;
  let stage2 = (3/8)*ns;
  let stage3 = (7/8)*ns;
  if (ssf === stage1) {
    debugger;
  }
  let mlength = (2/8)*ns;
  if ((stage1<=ssf) && (ssf <= stage2)) {
    this.updateCells('yellow','both'); 
  }
    
  if (stage3<=ssf) {
    let fr = (ssf-stage3)/mlength;
    this.updateCells(0,'both'); 
  }   
}
export {rs};


