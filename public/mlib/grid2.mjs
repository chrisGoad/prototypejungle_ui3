

let rs = function (item) {

item.rc2rpoint = function (pos) {
  let {width:wd,height:ht,deltaX,deltaY} = this;
  let {row:j,col:i} = pos;
  let minX = -0.5*wd;
  let minY = -0.5*ht;
  let x = minX+i*deltaX;
  let y = minY+j*deltaY;
  return Point.mk(x,y);
 }
 
 item.rc2point = function (pos,corners) {
  let rp = this.rc2rpoint(pos);
  if (corners) {
     let p = this.rc2qpoint(rp,corners);
     return p;
  }
  return rp;
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


}
    

  
export {rs};


