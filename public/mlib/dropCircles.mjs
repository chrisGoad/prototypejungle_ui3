// documented in https://prototypejungle.net/doc/dropCircles.html

const rs = function (rs) {

let defaults = {dropTries:5,maxLoops:Infinity};

Object.assign(rs,defaults);
      
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

rs.genRandomLatitude = function () {
  while (1) {
    let rlat = (Math.random()-0.5)*(Math.PI/2);
    let rcos = Math.cos(rlat);
    if (Math.random() < rcos) {
      return rlat;
    }
  }
}

rs.genRandomLongitude = function () {
    return (Math.random()-0.5)*2*(Math.PI);
}

rs.genRandomValue = function (lb,ub) {
  let delta = ub-lb;
  return lb + Math.random()*delta;
}

rs.genRandomSpherePoint = function (lb,ub) {
  let lat = genRandomLatitude();
  let long = genRandomLongitude();
  let radius = this.genRandomValue(lb,ub);
  let z = Math.cos(lat);
  let x = Math.cos(long);
  let y = Math.sin(long);
  return Point3d.mk(x,y,z).times(radius);
}
  

rs.via3d = function (p) {
  if (this.genPoint3d) {
    let p3d = this.genPoint3d(p);
    let rs = this.camera.project(p3d);
    return rs;
  }
  return p;
}
  
rs.generateCircleDrops = function (iparams) {
  let props = ['radius','maxLoops','maxDrops','dropTries','maxDrops','scale'];
  let params = {};
  debugger;
  //core.transferProperties(params,this,props);
  //core.transferProperties(params,iparams,props);
  Object.assign(params,iparams);
  this.dropParams = params;
  let {camera} = this;
  let {radius=10,maxLoops=Infinity,maxDrops=Infinity,dropTries} = params;
  let cnt =0;
  let tries = 0;
  let drops = [];
  debugger;
  while ((cnt < maxLoops) && (drops.length < maxDrops)) {
    cnt++;
    let pnt = camera?this.genRandomSpherePoint():this.genRandomPoint();
    let drop = this.generateDrop(pnt);
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
      drops.push(drop);
      tries = 0;
    }
  }
  return drops;
}

rs.generateDropCircles = function (p) {
  return {radius:this.dropParams.radius};
}

rs.stdDropCirclesInitialize = function (params) {
  this.initProtos();
  let {dropP=this.circleP,scale=1} = params;
  this.addFrame();
  let shapes = this.set('shapes',arrayShape.mk());
  let drops =  this.generateCircleDrops(params);
  let ln  = drops.length;
  for (let i=0;i<ln;i++) {
    let {point,radius,fill,dimension} = drops[i];
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
    
    
      
