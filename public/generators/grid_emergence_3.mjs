
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
//import {rs as addPathMethods} from '/mlib/path.mjs';	
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicsP.instantiate();
addAnimationMethods(rs);

rs.setName('grid_emergence_3_d1c1');
addGridMethods(rs);
//addPathMethods(rs);
//addRandomMethods(rs);
let nr = 24;
let wd=100;

let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:0,framePadding:0.15*wd,numSteps:48,saveAnimation:1,lineLength:2.5,lowStroke:[255,255,255],
  hiStroke:[100,100,100],frvvvv:0,onDiagonals:1,colinear:1};
Object.assign(rs,topParams);






rs.initProtos = function () {	
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke='black';
  lineP.stroke='white';
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


rs.onVertical = function (cell) {
  let {numRows} = this;
  let hnr = numRows/2;
  let {x,y} = cell;
  return x === hnr;
}



rs.onHorizontal  = function  (cell) {
  let {numRows} = this;
  let hnr = numRows/2;
  let {x,y} = cell;
  return y === hnr;
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
  
  let {lineP,numRows:nr,lineLength:ll,frv,onDiagonals,colinear} = this;
  let {x,y} = cell;
  let onmd0 = this.onNthDiagonal0(nr,cell);
  let onmd1 = this.onNthDiagonal1(0,cell);
  let onV = this.onVertical(cell);
  let onH = this.onHorizontal(cell);
  let shape = lineP.instantiate().show();
  let alongDiag = 0;  
  let dir = this.angleByCell(cell);
  let cond = onDiagonals?onmd0 || onmd1:onV ||onH;
  if (cond) {
    if (onDiagonals) {
      let frv = colinear?0.5:0;
      if (onmd1) {
        dir = -.25*Math.PI + frv*Math.PI;
      } else {
        dir = .25*Math.PI - frv*Math.PI;
      }
    } else {
      if (onV) {
        dir =colinear?.5*Math.PI:0;
      } else {
        dir = colinear?0:.5*Math.PI;
      }
    }
  }
  let hvec = Point.mk(Math.cos(dir),Math.sin(dir)).times(ll);
  shape.setEnds(hvec.times(-1),hvec);
//debugger;
  if ((x===(nr/2))&&(y===(nr/2))) {
   //debugger;
    shape.stroke = 'transparent';
  }
 // let stroke = `rgb(${gb},${gb},${255-gb})`;
  shape.update();
  return shape;
}




rs.updateCell = function (cell,stroke) {
  let {lineLength:ll,onDiagonals} = this
  let onmd0 = this.onNthDiagonal0(nr,cell);
  let onmd1 = this.onNthDiagonal1(0,cell);
  let onV = this.onVertical(cell);
  let onH = this.onHorizontal(cell);
  let cond = onDiagonals?!(onmd0 || onmd1):!(onV || onH);
  let {shape} = cell;
  //debugger;
//  if (onmd0 || onmd1) {  
  if (cond) {  
    shape.stroke = stroke;
    shape.update();
  }
}



rs.updateCells = function (fr) {
  let {theCells,lowStroke,hiStroke,stepsSoFar:ssf} = this;
  let strokeA = this.interpolate(lowStroke,hiStroke,fr);
  let stroke = this.arrayToRGB(strokeA);
  console.log('ssf',ssf,'fr',fr,'stroke',stroke);
  theCells.forEach( (cell) => {
    this.updateCell(cell,stroke);
  });
}

rs.initialize = function () {
  let {frv,hiStroke} = this;
  this.addFrame();
  this.initProtos();
  this.setBackgroundColor(this.arrayToRGB(hiStroke));
  this.computeAnglesByCell();
  debugger;
  this.generateGrid();
 //this.updateCells(0,'both');
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
  if (ssf === 73) {
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
  let {stepsSoFar:ssf,numSteps:ns,frv} = this;
  //debugger;
  let stage1 = (1/8)*ns;
  let mid = (1/2)*ns;
  let stage2 = (7/8)*ns;
  if (ssf === 48) {
    debugger;
  }
  let mlength = mid-stage1;
  if ((ssf<stage1) || (stage2<ssf)) {
    if (stage2<ssf) {
      //debugger;
    }
    this.updateCells(0); 
  }
  if ((stage1<=ssf) && (ssf < mid)) {
    let fr = (ssf-stage1)/mlength
    this.updateCells(fr); 
  }
    
  if ((mid<=ssf)&&(ssf<=stage2)) {
    let fr = (stage2-ssf)/mlength
    this.updateCells(fr); 
  }   
}
export {rs};


