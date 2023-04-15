

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


item.rc2rpoint = function (pos) {
  let {width:wd,height:ht,deltaX,deltaY} = this;
  let {row:j,col:i} = pos;
  let minX = -0.5*wd;
  let minY = -0.5*ht;
  let x = minX+i*deltaX;
  let y = minY+j*deltaY;
  return Point.mk(x,y);
 }
 
 item.alongSeg = function (p0,p1,fr) {
   let vec = p1.difference(p0);
   let svec  = vec.times(fr);
   let p = p0.plus(svec);
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
  

 
 item.rc2point = function (pos,corners) {
  let {deltaX,deltaY} = this;
  if (corners) {
     let p = this.rc2qpoint(pos,corners);
     return p;
  }
  let p = this.rc2rpoint(pos);
  //let pp = p.plus(Point.mk(0.5*deltaX,0.5*deltaY));
  return p;
 }


item.initLines = function () {
  let {numRows:nr,numCols:nc,lineP} = this;
   let lines = this.set('lines',arrayShape.mk());
   for (let j=0;j<=nr;j++) {
     let line = lineP.instantiate();
     lines.push(line);
  }
  for (let i=0;i<=nc;i++) {
    let line = lineP.instantiate();
     lines.push(line);
  }
} 


item.initCells = function () { 
  let {deltaX,deltaY,minX,minY,numRows:nr,numCols:nc,cells} = this;
  let hdx=0.5*deltaX;
  let hdy=0.5*deltaY;
  for (let i=0;i<nc;i++) {
    let x = minX+deltaX*i+hdx;
    for (let j=0;j<nr;j++) {
      let y = minY+deltaY*j+hdy;
      let index = i*(nc-1)+j;
      let center = Point.mk(x,y);
      let cell={center,index,row:i,col:j};
      cells.push(cell);
    }
  }
}


item.initGrid = function () {
  let gr =  [];
  let {numRows:nr,numCols:nc,height:ht,width:wd} = this;
  let deltaX = this.deltaX =wd/nc;
  let deltaY = this.deltaY = ht/nr;
  let minX = this.minX =-0.5*wd;
  let minY = this.minY = -0.5*ht
  this.cells = [];
  this.initLines();
  this.set('dotShapes',arrayShape.mk());
  this.motions = [];
  this.cells = [];
  this.initCells();
  debugger;
}

item.hseg = function (j,corners) {
  let {numCols:nc,numRows:nr} = this;
  let e0 = this.rc2point({col:0,row:j},corners);
  let e1 = this.rc2point({col:nr,row:j},corners);
  let seg = LineSegment.mk(e0,e1);
  return seg;
}

item.vseg = function (i,corners) {
  let {numCols:nc,numRows:nr} = this;
  let e0 = this.rc2point({col:i,row:0},corners);
  let e1 = this.rc2point({col:i,row:nr},corners);
  let seg = LineSegment.mk(e0,e1);
  return seg;
}

item.addAline = function (seg) {

  let {lineP,lines} = this;
  //let seg = vertical?this.vseg(v):this.hseg(v);
  let {end0,end1} = seg;
  let line = lineP.instantiate();
  line.setEnds(end0,end1);
  lines.push(line);
  line.show();
}
  
item.addHline = function (j,corners) {
  let seg = this.hseg(j,corners);
  this.addAline(seg);
}

item.updateHline = function (j,line,corners) {
  let seg = this.hseg(j,corners);
  let {end0,end1} = seg;
  line.setEnds(end0,end1);
}

item.addVline = function (i,corners) {
  let seg = this.vseg(i,corners);
  this.addAline(seg);
}



item.updateVline = function (j,line,corners) {
  let seg = this.vseg(j,corners);
  let {end0,end1} = seg;
  line.setEnds(end0,end1);
}




  
item.addLines = function(corners) {
  let {numRows:nr,numCols:nc} = this;
  for (let j=0;j<=nr;j++) {
    this.addHline(j,corners);
  }
  for (let i=0;i<=nc;i++) {
    this.addVline(i,corners);
  }
}


  
item.updateLines = function(corners) {
  let {numRows:nr,numCols:nc,lines} = this;
  let cnt =0;
  for (let j=0;j<=nr;j++) {
    let line = lines[cnt++];
    this.updateHline(j,line,corners);
  }
  for (let i=0;i<=nc;i++) {
    let line = lines[cnt++];
    this.updateVline(i,line,corners);
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


   /*
 A motion is an object {index:integer,startTime,duration,startPoint:point,endPoint:Point,shape:shape,finished:boolean}
  
 */
 /* 
 a script is an array of motions. The updateState method runs rs.theScript.*/
 
 /*
item.execMotion=  function (m,t) {
  let {startTime:st,duration:dur,startPoint:sp,endPoint:ep,shape,finished} = m;
  if (finished) {
   return;
  }
  let et = st+dur;
  if ((t<st)||(t>et)) {
    return;
  }
  let fr = (t-st)/dur;
  let vec = ep.difference(sp);
  let svec = vec.times(fr);
  let cp = sp.plus(svec);
  shape.moveto(cp);
}

item.execMotions = function (t) {
  let {motions} = this;
  motions.forEach((m)=>{
    this.execMotion(m,t);
  });
}

item.addAdot = function (spos,epos,t) {
  let {dotShapes,duration,circleP,motions} = this;
  let sp = this.rc2point(spos);
  let ep = this.rc2point(epos);
  let crc = circleP.instantiate();
  dotShapes.push(crc);
  crc.show();
  let m =  {startTime:t,duration,startPoint:sp,endPoint:ep,shape:crc};
  motions.push(m);
}

item.addVdot = function (i,t) {
  let {numRows:nr,numCols:nc} = this;
  let epos = {row:0,col:i};
  let spos = {row:nr,col:i};
  this.addAdot(spos,epos,t);
  
}
 
 
item.addHdot = function (i,t) {
  let {numRows:nr,numCols:nc} = this;
  let spos = {row:i,col:0};
  let epos = {row:i,col:nc};
  this.addAdot(spos,epos,t);
  
}
 

rs.configs =  [];

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
*/
}
    

  
export {rs};


