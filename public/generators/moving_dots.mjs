

import {rs as linePP} from '/shape/line.mjs';

import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPathMethods} from '/mlib/animate0.mjs';	
let rs = basicP.instantiate();
addPathMethods(rs);

let wd = 200;
let nr = 10;
nr = 3;
rs.setName('rotate_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numSteps:100,
                 smooth:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1}
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
      let centerPos = p.plus(Point.mk(0.5*deltaX,0.5*deltaY));
      let g = {name,row:j,col:i,index:idx,pos:p,centerPos,below,above,toRight,toLeft,occupants:null,occupant:null};
      gr.push(g);
    }
  }
  return gr;
}
debugger;
// pos is {row,col}; dir is 'up','down','left',right'
rs.addDot = function (pos,dir) {
  let {numRows:nr,numCols:nc,dots,dotShapes,grid,circleP,deltaX} = this;
  let dot ={pos,dir,stopped:0};
  let {row:j,col:i} = pos;
  let idx = i*nr+j;
  let g = grid[idx];
  debugger;
  let {occupant,centerPos} = g;
  if (occupant) {
    return null;
  }
  dots.push(dot);
  g.occupant = dot;
  dot.occupies = g;
  let ds = circleP.instantiate();
  dotShapes.push(ds);
  
  dot.shape = ds;
  ds.moveto(centerPos);
  return dot;
}

rs.placeDotInNextGrid = function (dot) {
  let {grid,nextGrid,numRows:nr,numCols:nc} = this;   
  let {pos,dir} = dot;
  let {row:j,col:i} = pos;
  let idx = i*nr+j;
  let g = grid[idx];
  let dest
  if (dot.stopped) {
    dest = idx;
  } else if (dir === 'up') {
    dest  = g.above;
  } else if (dir === 'down') {
    dest  = g.below;
  } else if (dir === 'right') {
    dest  = g.toRight;
  } else if (dir === 'left') {
    dest  = g.toLeft;
  }
  if (dest === -1) { 
    dot.removed = 1;
    return 0;
  }
  let ng = nextGrid[dest];
  dot.dest = ng;
  let {occupants}= ng;
  occupants.push(dot);
  return 1;
}
  
rs.placeDotsInNextGrid = function () {
  let {dots} = this;
  dots.forEach((dot) => {
     dot.stopped = 0;
    if (!dot.removed) {
      this.placeDotInNextGrid(dot);
    }
  });
}

rs.moveDots = function () {
  let {dots} = this;
  dots.forEach((dot) => {
    //debugger;
    if (dot.stopped && (!dot.mover)) {
      return;
    }
    let dest = dot.dest;
    dot.occupies = dest;
    let {row,col,index} = dest;
    dot.pos = {row,col,index};
    dot.stopped = 0;
    dot.mover = 0;
  });
}
  
debugger;

rs.clearOccupants = function () {
  let {nextGrid} = this;
  nextGrid.forEach((ng) => {
    ng.occupants = [];
  });
}

rs.stopDots = function () {
  let {nextGrid} = this;
  let stopCount = 0;
  nextGrid.forEach((ng) => {
    let {occupants}  = ng;
    let ln = occupants.length;
    if (ln < 2) {
      return;
    }
      debugger;
    let isStop = 0;
    for (let i=0;i<ln;i++) {
      let dot = occupants[i];
      if (dot.stopped || dot.mover) {
       isStop = 1
       break;
      } 
    }      
    if (isStop) {
      for (let i=0;i<ln;i++) {
        let dot = occupants[i];
        if (!dot.stopped) {
          dot.stopped = 1;
          stopCount++;
        }
      }
      
      return;
    }
    let rn = Math.floor(Math.random()*ln);
    for (let i=0;i<ln;i++) {
      let dot = occupants[i];
      if (i===rn) {
          dot.mover =1;
      } else {
          dot.stopped = 1;
          stopCount++;
      }

    }
      
  });
  return stopCount;
}

rs.performDotMove = function (dot,fr) {
 // debugger;
  let {occupies:g,dest:ng,stopped,removed,shape} = dot;
  if (stopped || removed) {
    return;
  }
  let pos0 = g.centerPos;
  let pos1 = ng.centerPos;
  let vec =pos1.difference(pos0);
  let mvec = vec.times(fr);
  let npos = pos0.plus(mvec);
  shape.moveto(npos);
}

rs.performMove = function(fr) {
  let {dots} = this;
  dots.forEach((dot) => {
    this.performDotMove(dot,fr);
  });
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
  this.addDots();
} 
  //this.updateState();

  

rs.updateState = function () {
  let {stepsSoFar:ssf,numSteps,stepsPerMove} =this;
  let stinm = ssf%stepsPerMove;
  let fr = stinm/stepsPerMove;
  debugger;
  if (stinm === 0) {
    debugger;
    if (ssf>0) {
      this.moveDots();
    }
    this.clearOccupants();
    this.placeDotsInNextGrid();
    for (let i=0;i<4;i++) {
      let stopped =this.stopDots(0);
      console.log('stopped',stopped);
    }
    
  }
  this.performMove(fr);    
} 


    

  
export {rs};


