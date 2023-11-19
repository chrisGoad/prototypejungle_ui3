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

rs.collides = function (npoint,nradius,drops) {
  let n = drops.length;
  for (let i=0;i<n;i++) {
    let {point,collideRadius} = drops[i];
    if (this.collides0(npoint,nradius,point,collideRadius)) {
      return true;
    }
  }
  return false
}

rs.genRandomPoint = function (rect) {
  if (rect) {
    let {corner,extent} = rect;
    let lx = corner.x;
    let ly = corner.y;
    let x = Math.random() * extent.x + lx;
    let y = Math.random() * extent.y + ly;
    return Point.mk(x,y);
  }
  let {width,height} = this;
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
  let {zone,maxLoops=Infinity,maxDrops=Infinity,dropTries} = params;
  let cnt =0;
  let tries = 0;
  let drops = [];
  debugger;
  while ((cnt < maxLoops) && (drops.length < maxDrops)) {
    cnt++;
     let pnt = this.genRandomPoint(zone);
    let drop = this.generateCircleDrop(pnt);
    console.log('pnt ln', pnt.length());
    if (!drop) {
      continue;
    } 
    let collideRadius = drop.collideRadius;
    let cl = this.collides(pnt,collideRadius,drops);
    if (cl) {
      tries++;
      if (tries >= dropTries) {
        //console.log('dropTries',dropTries,'exceeded');
        return drops;
      }
    } else {
      console.log('pnt ',pnt);
      drop.point = pnt;;
      //drop.point = camera?pnt.project(camera):pnt
      drops.push(drop);
      tries = 0;
    }
  }
  return drops;
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

rs.installCircleDrops = function (container,dropP,drops) {
  debugger;
  let ln  = drops.length;
  for (let i=0;i<ln;i++) {
  let drop = drops[i];
    let {point,fill,dimension} = drop;
    let crc=dropP.instantiate();
    drop.shape = crc;
    crc.setDimension(dimension);
    if (fill) {
      crc.fill = fill;
    }
    container.push(crc);
    crc.moveto(point);
  }
}



rs.dropsToPath = function (drops) { 
  let path = drops.map((drop) => drop.point);
  return path;
}
    
    
}


export {rs};      
    
    
      
