

import {rs as linePP} from '/shape/line.mjs';

import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPathMethods} from '/mlib/animate0.mjs';	
let rs = basicP.instantiate();
addPathMethods(rs);

let wd = 200;
let nr = 10;
rs.setName('rotate_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,
                 smooth:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,numSteps:51}
Object.assign(rs,topParams);
/*
rs.addPath = function (nm,speed) {
  let {pstate,speeds} = this;
  let {pspace,cstate} = pstate;
  pspace[nm] = {kind:'sweepFixedDur',dur:100,min:0,max:10,start:0};
  cstate[nm] = {value:0};
};

rs.pstate = {pspace:{},cstate:{});
*/
rs.grid = [];




rs.buildGrid = function () {
  let gr =  [];
  let {numRows:nr,numCols:nc,height:ht,width:wd} = this;
  let deltaX = this.deltaX =wd/(nc-1);
  let deltaY = this.deltaY = ht/(nr-1);
  let minX = -0.5*wd;
  let minY = -0.5*ht;
  let maxIdx = nr*nc-1;
  for (let i=0;i<nc;i++) {
    let x = minX+i*deltaX;
    for (let j=0;j<nr;j++) {
      let y = minY + j*deltaY;
      let p = Point.mk(x,y);
      let idx =i*nr+j;
    //  this.addPath(name,speed);
      let below = idx+1;
      below = below>maxIdx?-1:below;
      let above = idx-1;
      above = above<0?-1:above;
      let toRight = idx+nr;
      toRight = toRight>maxIdx?-1:toRight;
      let toLeft = idx-nr;
      toLeft = toLeft<0?-1:toLeft;
      let g = {name,row:j,col:i,index:idx,pos:p,below,above,toRight,toLeft,occupants:null,occupant:null};
      gr.push(g);
    }
  }
  return gr;
}
// pos is {row,col}
rs.addDot = function (pos,dir) {
  let {numRows,numCols,dots,dotShapes,grid,circleP} = this;
  let dot ={pos,dir,stopped:0};
  let {row:i,col:j} = pos;
  let idx = i*nr+j;
  let g = grid[idx];
  let {occupant,pos:gridPos} = g;
  if (occupant) {
    return null;
  }
  let ds = circleP.instantiate();
  dotShapes.push(ds);
  dot.shape = ds;
  return dot;
}
  
  
  
  
  
  
  
rs.addLines = function() {
  let {numRows:nr,numCols:nc,grid,lineP,lines} = this;
  grid.forEach((g) => {
    let {pos:bp,below,toRight,row:j,col:i} = g;
    let e0 = bp;
    if (i < (nc - 1)) {
      let tor = grid[toRight];
      let e1=tor.pos;
      let hline = lineP.instantiate();
      g.hline = hline;
      lines.push(hline);
      hline.setEnds(e0,e1);
    }
    if (j < (nr - 1)) {
      let b = grid[below];
      let e1=b.pos;
      let vline = lineP.instantiate();
      g.vline = vline;
      lines.push(vline);
      vline.setEnds(e0,e1);
    }
  });
}





rs.initialize = function() { 
  debugger;
  this.initProtos();
  this.addFrame();
  this.grid = this.buildGrid();
  this.nextGrid = this.buildGrid();
  this.set('lines',arrayShape.mk());
  this.set('dotShapes',arrayShape.mk());
  this.dots = [];
  this.addLines();
 
  //this.updateState();

  
}

rs.updateState = function () {
  let {stepsSoFar:ssf,numSteps,theScript} =this;
  let activeConfigs = [];
  theScript.forEach((step) => {
    let config = this.executeStep(step);
    if (config) {
      activeConfigs.push(config);
    }
  });
  this.displayOutSegs(activeConfigs);
} 


    

  
export {rs};


