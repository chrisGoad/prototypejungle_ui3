// documented in https://prototypejungle.net/doc/circleDrops.html

const rs = function (rs) {

let defaults = {dropTries:5,maxLoops:Infinity};

Object.assign(rs,defaults);
      
rs.collides0 = function (point1,radius1,point2,radius2) {
  let p1x = point1.x;
  let p1y = point1.y;
  let p2x = point2.x;
  let p2y = point2.y;
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
    let {point,radius} = drops[i];
    if (this.collides0(npoint,nradius,point,radius)) {
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

rs.via3d = function (p) {
  if (this.genPoint3d) {
    let p3d = this.genPoint3d(p);
    let rs = this.camera.project(p3d);
    return rs;
  }
  return p;
}

/* 
drops is the set of LineSegments dropped so far
targets is the set of pointstwo of which are joined by a new drop.
tried is an array of arrays [firstTriedIndex,secondTriedIndex0,secondTriedIndex1...secondTriedIndexN] pairs of indicices in targets  which have been already tried
*/

rs.dropCandidate = function () {
  let {targets,tried} = this;
  let ln = targets.length;
  let ie0i = randomIntLessThan(ln);
  let ie1i = randomIntLessThan(ln);
  if (ie0i === ie1i) {
    return;
  }
  let lt = ie0i < ie1il;
  let e0i = lt?ie0i:ie1i;
  let e1i = lt?ie1i:ie0i;
  let triedln = tried.length;
  let tr0;
  for (i=0;i<triedln;i++) {
    let tr=tried[i];
    if (e0i === tr[0]) {
      tr0 = tr;
      let trln = tr.length;
      for (let j=1;j<trln;j++) {
        if (e1i === tr[1]) {
          return;
        }
      }
    }
  }
  // found a candidate
  if (tr0) {
    tr0.push(e0i);
  } else {
    tried.push([e0i,e1i];
  }
  return [e0i,e1i];
}

rs.tryDrop = function () {
  let {targets,tried) 
  
   
  
  
  
  
  

  
rs.generateSegDrops = function () {
  let props = ['drops','targets','maxLoops','maxDrops','dropTries','scale'];
  /*let params = {};
  debugger;
  //core.transferProperties(params,this,props);
  //core.transferProperties(params,iparams,props);
  Object.assign(params,iparams);
  this.dropParams = params;
  let {radius=10,maxLoops=Infinity,maxDrops=Infinity,dropTries,scale=1} = this;
  let cnt =0;
  let tries = 0;
  let drops = [];
  debugger;
  while ((cnt < maxLoops) && (drops.length < maxDrops)) {
    cnt++;
    let pnt = this.genRandomPoint();
    let drop = this.generateCircleDrop(pnt);
    if (!drop) {
      continue;
    } 
    let radius = drop.radius;
    let cl = this.collides(pnt,radius,drops);
    if (cl) {
      tries++;
      if (tries >= dropTries) {
        //console.log('dropTries',dropTries,'exceeded');
        return drops;
      }
    } else {
      drop.point = pnt;
      if (!drop.dimension) {
        drop.scale = scale;
      }
      drops.push(drop);
      tries = 0;
    }
  }
  return drops;
}

rs.generateDrop = function (p) {
  return {radius:this.dropParams.radius};
}

rs.installCircleDrops = function (drops,dropP) {
  let shapes = this.set('shapes',arrayShape.mk());
  let ln  = drops.length;
  for (let i=0;i<ln;i++) {
    let {point,radius,fill,dimension,scale} = drops[i];
    let crc = dropP.instantiate();
    crc.setDimension(dimension?dimension:2*scale*radius);
    if (fill) {
      crc.fill = fill;
    }
    shapes.push(crc);
    if (crc.initialize) {
      crc.initialize();
    }
    crc.moveto(point);
   }
}
}


export {rs};      
    
    
      
