
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
}


export {rs}
  

  