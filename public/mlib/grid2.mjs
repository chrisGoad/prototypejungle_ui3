

let rs = function (item) {

item.rc2rpoint = function (pos,grid) {  //row col 2 coords
  let theGrid = grid?grid:this;
  let {width:wd,height:ht,deltaX,deltaY,numRows:nr,numCols:nc} = theGrid;
  let {x:i,y:j} = pos;
  let minX = -0.5*wd;
  let minY = -0.5*ht;
  let x = minX+i*deltaX;
  let y = minY+j*deltaY;
  return Point.mk(x,y);
 }
 
 item.rc2qpoint = function (pos,corners,grid) {
   let theGrid = grid?grid:this;
  let {numRows:nr,numCols:nc} = theGrid;
  let {x,y} = pos;
  let sx = x/nc;
  let sy = y/nc;
  let rp = this.usq2qpoint(Point.mk(sx,sy),corners);
  return rp;
}
 item.rc2point = function (pos,corners,grid) {
  let theGrid = grid?grid:this;
  let {numRows:nr,numCols:nc} = theGrid;
  let {x,y} = pos;
  if (corners) {
     let p = this.rc2qpoint(pos,corners,grid);
     return p;
  }
  let rp = this.rc2rpoint(pos,grid);
  return rp;
 }

item.rcCoords2unitCoods = function (p,grid) {
  let theGrid = grid?grid:this;
  let {numCols:nc,numRows:nr,width:wd,height:ht} = theGrid;
  let mx = x/nc;
  let my = y/nr;
  let rp =  Point.mk(mx,my);
  return rp;
}
item.cellCorners = function (pos,map) {
  let {numRows:nr,numCols:nc} = this;
  let {x,y} = pos;
  let UL = map.call(this,Point.mk(x,y));
  let UR = map.call(this,Point.mk(x+1,y));
  let LR = map.call(this,Point.mk(x+1,y+1));
  let LL = map.call(this,Point.mk(x,y+1));
  return [LL,UL,UR,LR];
}



item.cellCenter = function (corners) {
  let ln = corners.length;
  let a = Point.mk(0,0);
  for (let i=0;i<ln;i++) {
    let c = corners[i];
    a = a.plus(c);
  }
  return a.times(1/ln);
}

item.addCell = function (pos,grid) {
 // debugger;
  let theGrid = grid?grid:this;
  let {cells,map,polygons,gridPolygonP,numCols:nc} = theGrid;
  let {x,y} =pos;
  let index =x*nc+y;
  let corners = this.cellCorners(pos,map);
  let center = this.cellCenter(corners);
  let polygon =  gridPolygonP.instantiate();
  polygon.corners = corners;
  polygons.push(polygon);
  let cell = {coords:pos,corners,center,index,polygon};
  cells.push(cell);
}

item.updateCell = function (cell,grid) {
  let theGrid = grid?grid:this;
  let {map} = theGrid;
  let {coords:pos,polygon} = cell;
  let corners = this.cellCorners(pos,map);
  let center = this.cellCenter(corners);
  polygon.corners = corners;
  polygon.update();
  cell.center = center;
  cell.corners = corners;
}
  
item.updateCells = function (grid) {
  debugger;
  let theGrid = grid?grid:this;
  let {cells} = theGrid;
  cells.forEach((cell) => {
    this.updateCell(cell,grid);
  });
}

  
item.addCells = function (grid) { 
  let theGrid = grid?grid:this;
  let {numRows:nr,numCols:nc} = theGrid;
  for (let i=0;i<nc;i++) {
    for (let j=0;j<nr;j++) {
      let pos = Point.mk(i,j);
      this.addCell(pos,grid);
    }
  }
}


item.initGrid = function (grid,map) {
  let theGrid=grid?grid:this;
  let {numRows:nr,numCols:nc,height:ht,width:wd} = theGrid;
  let deltaX = this.deltaX =wd/nc;
  let deltaY = this.deltaY = ht/nr;
  let minX = this.minX =-0.5*wd;
  let minY = this.minY = -0.5*ht;
  theGrid.map = map?map:this.rc2rpoint;
  theGrid.cells = [];
  theGrid.motions = [];
  if (!theGrid.polygons) {
    theGrid.set('polygons',arrayShape.mk());
  }
  this.addCells(theGrid);

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
  

}
    

  
export {rs};


