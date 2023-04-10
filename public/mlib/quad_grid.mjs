

let rs = function (item) {

/*
let wd = 200;
let nr = 20;
nr =200;
rs.setName('rotate_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numSteps:100,
                 smooth:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1}
Object.assign(rs,topParams);
*/


item.rc2point = function (pos) {
  let {width:wd,height:ht,deltaX,deltaY} = this;
  let {row:j,col:i} = pos;
  let minX = -0.5*wd;
  let minY = -0.5*ht;
  let x = minX+i*deltaX;
  let y = minY+j*deltaY;
  return Point.mk(x,y);
 }
 
 item.alongSeg = function (p0,p1,fr) {
   let vec = p1.difference(p);
   let svec  = vec.times(fr);
   let p = p1.plus(svec);
   return p;
}

item.rc2qpoint = function (pos,corners) {
  let {row:j,col:i} = pos;
  let {numRows:nr,numCols:nc} = this;
  let [LL,UL,UR,LR] = corners;
  let frx = i/nc;
  let fry = j/nr;
  let bp = this.alongSeg(LL,LR,frx);
  let tp = this.alongSeg(UL,UR,frx);
  let p = this.alongSeg(bp,tp,fry);
  return p;
}
  

 
 item.rc2cpoint = function (pos) {
  let {deltaX,deltaY} = this;
   let p = this.rc2point(pos);
   let pp = p.plus(Point.mk(0.5*deltaX,0.5*deltaY));
   return pp;
 }
 

item.initGrid = function () {
  let gr =  [];
  let {numRows:nr,numCols:nc,height:ht,width:wd} = this;
  let deltaX = this.deltaX =wd/nc;
  let deltaY = this.deltaY = ht/nr;
  let minX = this.minX =-0.5*wd;
  let minY = this.minY = -0.5*ht;
}

item.hseg = function (j) {
  let {numCols:nc,numRows:nr} = this;
  let e0 = this.rc2point({col:0,row:j});
  let e1 = this.rc2point({col:nr,row:j});
  let seg = LineSegment.mk(e0,e1);
  return seg;
}

item.vseg = function (i) {
  let {numCols:nc,numRows:nr} = this;
  let e0 = this.rc2point({col:i,row:0});
  let e1 = this.rc2point({col:i,row:nr});
  let seg = LineSegment.mk(e0,e1);
  return seg;
}

item.addLine = function (v,vertical) {

  let {lineP,lines} = this;
  let seg = vertical?this.vseg(v):this.hseg(v);
  let {end0,end1} = seg;
  let line = lineP.instantiate();
  line.setEnds(end0,end1);
  lines.push(line);
  line.show();
}
  
item.addHline = function (j) {
  this.addLine(j,0);
}


  
item.addVline = function (j) {
  this.addLine(j,1);
}


  
  
item.addLines = function() {
  let {numRows:nr,numCols:nc} = this;
  for (let j=0;j<=nr;j++) {
    this.addHline(j);
  }
  for (let i=0;i<=nc;i++) {
    this.addVline(i);
  }
}
 

item.initProtoss = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  //lineP['stroke-width'] = .8;
  lineP.stroke = 'cyan';
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 2;
  circleP.fill = 'cyan';
}

item.initializee = function() { 
  debugger;
  this.initProtos();
  this.addFrame();
  this.initGrid();
  this.set('lines',arrayShape.mk());
  this.set('dotShapes',arrayShape.mk());
  this.dots = [];
  this.addLines();
//  this.addDots();
} 
  //this.updateState();

  

item.updateStatee = function () {
  let {stepsSoFar:ssf,numSteps,stepsPerMove} =this;
  let stinm = ssf%stepsPerMove;
  let fr = stinm/stepsPerMove;
  if ((ssf%(stepsPerMove*2)) === 0) {
    debugger;
    this.addDots();
  }
//  debugger;
  if (stinm === 0) {
    //debugger;
    if (ssf>0) {
      this.moveDots();
    }
    this.clearOccupants();
    this.resetDots();
    this.placeDotsInNextGrid();
    for (let i=0;i<4;i++) {
      let stopped =this.stopDots(0);
      console.log('stopped',stopped);
    }
    
  }
  this.performMove(fr);    
} 

}
    

  
export {rs};


