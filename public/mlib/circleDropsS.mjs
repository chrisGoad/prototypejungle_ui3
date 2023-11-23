// documented in https://prototypejungle.net/doc/circleDrops.html

const rs = function (rs) {



rs.collides0 = function (point1,radius1,point2,radius2) {
  let p1x = point1.x;
  let p1y = point1.y;
  let z = point1.z;
  let p1z = z?z:0;
  let p2x = point2.x;
  let p2y = point2.y;
  z = point1.z;
  let p2z = z?z:0;

  let minDist =  radius1 + radius2 ;
  //console.log('minDist',minDist,'xd',p2x-p1x,'yd',p2y-p1y,'d',d);
  if (Math.abs(p2x - p1x) >=  minDist) {return false;}
  if (Math.abs(p2y - p1y) >= minDist) {return false;}
  let d= point1.distance(point2);
  return minDist >= d;
}

rs.collidesWithSides = function (point,radius) {
  let {height:ht,width:wd} = this;
  let hht = 0.5*ht;
  let hwd = 0.5*wd;
  let {x,y} = point;
  let minx = x-radius;
  let maxx = x+radius;
  let miny = y-radius;
  let maxy = y+radius;
  if (minx<-hwd) {
    return 1;
  }
  if (maxx>hwd) {
    return 1;
  }
  if (miny<-hht) {
    return 1;
  }
  if (maxy>hht) {
    return 1;
  }
}

rs.collides = function (npoint,nradius,drops,useDim) {
  let n = drops.length;
  for (let i=0;i<n;i++) {
    let drop = drops[i];
    if (drop) {
      let {point,collideRadius,dimension} = drops[i];
      let r = useDim?dimension/2:collideRadius;
      if (this.collides0(npoint,nradius,point,r)) {
        return true;
      }
    }
  }
  return false
}


rs.pointTable = [];//[Point.mk(0,0),Point.mk(-40,0),Point.mk(40,0)];

rs.genRandomPoint = function (rect) {
 let {stepsSoFar:ssf,width,height,updatingState:uping,drops,pointTable} = this;
  let ln = drops.length;
  let tln = pointTable.length;
  if (ln<tln) {
    let p = pointTable[ln]
    return p;
  }
  if (rect) {
    let {corner,extent} = rect;
    let lx = corner.x;
    let ly = corner.y;
    let x = Math.random() * extent.x + lx;
    let y = Math.random() * extent.y + ly;
    return Point.mk(x,y);
  }
  let rx = (Math.random()-0.5) * width;
   let ry= (Math.random()-0.5) * height;
  return Point.mk(rx,ry);
}


rs.genRandomValue = function (lb,ub) {
  let delta = ub-lb;
  return lb + Math.random()*delta;
}

rs.mkRectFromCenterExtent = function (c,xt) {
  let hxt = xt.times(-0.5);
  let crn = c.plus(hxt);
  let rect = Rectangle.mk(crn,xt);
  return rect;
}
  
rs.generateCircleDrops = function (params) {
  let {zone,maxLoops=Infinity,maxDrops=Infinity,dropTries,stepsSoFar:ssf,udatingState:uping} = params;
  let {drops} = this;
  let cnt =0;
  let tries = 0;
//  if ((!drops) || (uping && !ssf)) {//fix this
  if ((!drops) ) {//fix this
    drops = this.drops = [];
  }
  let newDrops = [];
  let origNumDrops = drops.length;
  while ((cnt < maxLoops) && ((drops.length-origNumDrops) < maxDrops)) {
    cnt++;
     let pnt = this.genRandomPoint(zone);
    let drop = this.generateCircleDrop(pnt);
    console.log('pnt ln', pnt.length());
    if (!drop) {
      continue;
    } 
    let  {collideRadius,dimension} = drop;
    let cls = this.collidesWithSides(pnt,dimension/2);
    let cl = this.collides(pnt,collideRadius,drops)||cls;
    if (cl) {
      tries++;
      if (tries >= dropTries) {
        //console.log('dropTries',dropTries,'exceeded');
        return drops;
      }
    } else {
      console.log('pnt ',pnt);
      drop.point = pnt;;
      //drop.point = camera?pnt.project(camera):pnt;
      drop.index = drops.length;
      drops.push(drop);
      newDrops.push(drop);
      tries = 0;
    }
  }
  return newDrops;
}
rs.opDrops = function (drops,p,op) {
  let nds=[];
  drops.forEach((d)=>{
    let {point} = d;
    let nd = {};
    Object.assign(nd,d);
    nd.point = op(point,p);
    nds.push(nd);
  });
  return nds;
}
rs.moveDrops = function (drops,p) {
  let op = (pnt,d)=> {
    return pnt.plus(d);
  }
  return this.opDrops(drops,p,op);
}

rs.dropsFlipX = function (drops,p) {
  let op = (pnt)=> {
    let {x,y} = pnt;
    return Point.mk(-x,y);
  }
  return this.opDrops(drops,p,op);
}

rs.dropsFlipY = function (drops,p) {
  let op = (pnt)=> {
    let {x,y} = pnt;
    return Point.mk(x,-y);
  }
  return this.opDrops(drops,p,op);
}


rs.dropsFlipXY = function (drops,p) {
  let op = (pnt)=> {
    let {x,y} = pnt;
    return Point.mk(-x,-y);
  }
  return this.opDrops(drops,p,op);
}


rs.moveDropss = function (drops,p) {
  let nds=[];
  drops.forEach((d)=>{
    let {point} = d;
    let nd = {};
    Object.assign(nd,d)
    nd.point = point.plus(p);
    nds.push(nd);
  });
  return nds;
}

rs.segFrom = function (drop) {
  let {cvec,cdist,cdrop} = drop;
  if (cvec) {
   // debugger;
    let {point:p,dimension:dim0,cvec,cdrop,cdist} = drop;
    let {dimension:dim1} = cdrop;
    let e0 = p.plus(cvec.times(dim0/2));
    let e1 = p.plus(cvec.times(cdist-dim1/2));
    let seg = LineSegment.mk(e0,e1);
    return seg;
  }
}
  
rs.installCircleDrops = function (container,dropP,drops) {
  //debugger;
  let {lineP} = this;
  let ln  = drops.length;
  for (let i=0;i<ln;i++) {
    let drop = drops[i];
    if (drop) {
      let {point,fill,dimension,shape,cvec} = drop;
      if (!shape) {
        let crc=dropP.instantiate();
        drop.shape = crc;
        
        crc.setDimension(dimension);
        if (fill) {
          crc.fill = fill;
        }
        container.push(crc);
        crc.moveto(point);
        if (cvec) {
          debugger;
          let sgf  = this.segFrom(drop);
          let line = lineP.instantiate();
          drop.line = line;
          container.push(line);
          line.setEnds(sgf.end0,sgf.end1);
          line.show();
          line.update();
        }  
      }
    }
  }
}



rs.dropsToPath = function (drops) { 
  let path = drops.map((drop) => drop.point);
  return path;
}
    
    
}


export {rs};      
    
    
      
