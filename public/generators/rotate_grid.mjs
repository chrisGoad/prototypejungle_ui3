

import {rs as linePP} from '/shape/line.mjs';

import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPathMethods} from '/mlib/animate0.mjs';	
let rs = basicP.instantiate();
addPathMethods(rs);

let wd = 200;
let nr = 8;
rs.setName('rotate_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.0*wd,frameStroke:'rgb(2,2,2)',frameStrokeWidth:1,saveAnimation:0,numSteps:1000}
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
  let gr = this.grid = [];
  let {numRows:nr,numCols:nc,height:ht,width:wd} = this;
  let deltaX = this.deltaX =wd/nc;
  let deltaY = this.deltaY = ht/nr;
  let minX = -0.5*wd;
  let minY = -0.5*ht;
  for (let i=0;i<nc;i++) {
    let x = minX+i*deltaX;
    for (let j=0;j<nr;j++) {
      let y = minY + j*deltaY;
      let p = Point.mk(x,y);
      let idx =i*nr+j;
      let fc = .3;
      let name = 'g_'+i+'_'+j;
      let minSpeed = -30;
      let maxSpeed = 30;
      let dSpeed = maxSpeed - minSpeed;
     // let speed = (minSpeed+dSpeed*Math.random())*2*Math.PI;
      let speed = (Math.random()>0.5?30:-30)*2*Math.PI;
    //  this.addPath(name,speed);
      let g = {name,row:i,col:i,index:idx,basePos:p,below:idx+1,toRight:idx+nr,offset:Point.mk(0,0),speed};
     //let g = {name,row:i,col:i,index:idx,basePos:p,below:idx+1,toRight:idx+nr,offset:Point.mk(fc*Math.random()*deltaX,fc*Math.random()*deltaY)};
      gr.push(g);
    }
  }
}


rs.addLines = function() {
  let {numRows:nr,numCols:nc,grid,lineP} = this;
  let hlines =  this.set('hlines',arrayShape.mk());
  let vlines =  this.set('vlines',arrayShape.mk());
  for (let i=0;i<nc;i++) {
    for (let j=0;j<nr;j++) {
      let hline = (i === nc-1)?null:lineP.instantiate();
      let vline = (j === nr-1)?null:lineP.instantiate();
      hlines.push(hline);
      vlines.push(vline);
      let idx =i*nr+j;
      let g = grid[idx];
      g.hline = hline;
      g.vline = vline;
    }
  }
}

rs.rotatePoint = function(p,angle,center) {
  let v = p.difference(center);
  let m00 = Math.cos(angle);
  let m10 = -Math.sin(angle);
  let m01  = -m10;
  let m11 = m00;
  let {x,y} = v;
  let rx =  m00*x + m10*y;
  let ry = m01*x + m11*y;
  return center.plus(Point.mk(rx,ry));
}

rs.rotateLine = function (line,angle,center,box) {
  if (!line) {
    debugger;
    return;
  }
  let {end0:e0,end1:e1} = line;
  let re0  = this.rotatePoint(e0,angle,center);
  let re1  = this.rotatePoint(e1,angle,center);
  line.setEnds(re0,re1);
  line.update();
}

rs.rotateLines = function (lines,angle,center,box) {
  lines.forEach ((line) => {
    this.rotateLine(line,angle,center,box);
  });
}

rs.adjustLines = function() {
  let {grid} = this;
  let ln = grid.length;
  for (let i=0;i<ln;i++) {
    let g=grid[i]
    let {basePos:bp,offset,hline,vline,below,toRight} = g;
    let e0 = bp.plus(offset);
    if (hline) {
      let tor = grid[toRight];
      let e1=(tor.basePos).plus(tor.offset);
      hline.setEnds(e0,e1);
      hline.update();
    }
    if (vline) {
      let bl = grid[below];
      let e1=(bl.basePos).plus(bl.offset);
      vline.setEnds(e0,e1);
      vline.update();
    }
  }
}

rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .2;
  lineP.stroke = 'white';
  
}  
rs.initialize =  function () {
  debugger;
  this.initProtos();
  this.buildGrid();
  this.addLines();
  this.adjustLines();
  let {vlines} =this;
  this.rotateLines(vlines,0.02*Math.PI*2,Point.mk(0,0))
}

rs.updateState = function () {
  let {grid,stepsSoFar:ssf,numSteps,deltaX} =this;
  let ln = grid.length;
  for (let i=0;i<ln;i++) {
    let g = grid[i];
    let {speed} = g;
    let fr = ssf/numSteps;
    let a = fr*speed;
    let fc = .2;
    let vec = Point.mk(Math.cos(a),Math.sin(a)).times(fc*deltaX);
    g.offset = vec;
  }
  this.adjustLines();
}  


    

  
export {rs};


