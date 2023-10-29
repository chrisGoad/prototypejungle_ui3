
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
let rs = basicP.instantiate();

addAnimationMethods(rs);

rs.setName('curves_0');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:0.05,stopTime:100,collideWithParticle:1}

Object.assign(rs,topParams);

rs.approximateCurve = function (f,lb,ub,n) {
  let pnts =[];
  let delta = ub-lb;
  let iv = delta/(n-1);
  let dop = delta/(2*Math.PI);
  //let iv = delta/n;
  for (let i=0;i<n;i++) {
   let x = lb + iv*i;
   let y = f(x);
 //   console.log('x',x/(Math.PI),'y',y);
    pnts.push(Point.mk(x,y));
  }
  return pnts;
}
// scale and optionally add a constant to x and y
rs.scale= function (pnts,x,y,ixc,iyc) {
  let xc = ixc?ixc:0;
  let yc = iyc?iyc:0;
  return pnts.map((p) => Point.mk(xc+x*p.x,yc+y*p.y));
}
rs.translate = function (pnts,p) {
  return pnts.map((ip) => ip.plus(p));
}

rs.fromPolar = function (pnts)  {
  return pnts.map((ip) =>{
    //console.log('ip',ip.x,ip.y);
    let vec = Point.mk(Math.cos(ip.x),Math.sin(ip.x));
    let r = vec.times(ip.y);
    let ln = r.length();
  //  console.log('y',ip.y,'ln',ln);
    //let r = vec.times(10);
    return r;
  });
}


rs.rotate = function (pnts,theta)  {
  return pnts.map((ip) =>{
    let rm = geom.rotationMatrix(theta);
    let rp = ip.rotate(rm);
    return rp;
  });
}
   
   
   
rs.maxf = function (pnts,f) {
  let r = -Infinity;
  pnts.forEach((p) => {
    let v=f(p);
    if (v>r) {
      r=v
    }   
  });
  return r;
}
rs.containingBox = function (pnts) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity
  let maxY = -Infinity
  pnts.forEach((p) => {
    let {x,y} = p;
    if (x>MaxX) {
      maxX = x;
    }
    if (y>MaxY) {
      maxY = y;
    }
    if (x<MinX) {
      minX = x;
    }
 
  });
  let crn =Point.mk(minX,minY)
  let ext = Point.mk(maxX-minX,maxY-minY);
  let rect = Rectangle.mk(crn,ext)
  return rect;
}

rs.containedPnts = function (box,pnts) {
  let ln = pnts.length;
  let cpnts = [];//indices
  for (let i=0;i<ln;i++) {
    let p = pnts[i];
    if (box.contains(p)) {
      cpnts.push(i);
    }
  }
  return cpnts;
}

rs.containedSegs = function (box,pnts) {
  let cpnts = this.containedPnts(box,pnts);
  let ln = cpnts.length;
  if (ln === 0) {
    return [];
  }
  let fpi = cpnts[0];
  let lpi = cpnts[ln-1]
  let sg0 = LineSegment.mk(pnts[fpi-1],pnts[fpi]);
  let segs = [sg0];
  for (i=fpi;i<=fpi;i++) {
    let p0 = pnts[i];
    let p1 = pnts[i+1];
    let seg = LineSegment.mk(p0,p1);
    segs.push(seg);
  }
  return segs;
}

      
    
  
rs.maxLength = function (pnts) {
  return this.maxf(pnts,(p)=>p.length()); 
}
   
rs.polyCnt = 0;
rs.lineCnt = 0;
rs.displayPolyline = function (pnts) {
  let {polyCnt:cnt} = this;
  let ln = pnts.length;
  let nm = 'p_'+cnt;
  let ply = this[nm];
  if (!ply) {
    ply = this.polylineP.instantiate();
    this.set(nm,ply);
  }
  ply.wayPoints = pnts;
  ply.update();
  ply.show();
  this.polyCnt = cnt+1;
}
/*
rs.displayPolyline = function (pnts) {
  let {lineCnt:cnt} = this;
  debugger;
  let ln = pnts.length;
  let ccnt = cnt;
  for (let i=0;i<ln-1;i++) {
    let p = pnts[i];
    let nm = 'line_'+(cnt+i);
    let ln = this[nm];
    if (!ln) {
      ln = this.lineP.instantiate();
      this.set(nm,ln);
      ln.setEnds(pnts[i],pnts[i+1]);
      ln.show();
      ccnt++;
      }
  }
  this.lineCnt = ccnt;
}*/


export {rs}
  

  