
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
  //let iv = delta/n;
  for (let i=0;i<n;i++) {
   let x = lb + iv*i;
   let y = f(x);
    console.log('x',x/(Math.PI),'y',y);
    pnts.push(Point.mk(x,y));
  }
  return pnts;
}

rs.scale= function (pnts,x,y) {
  return pnts.map((p) => Point.mk(x*p.x,y*p.y));
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
    console.log('y',ip.y,'ln',ln);
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
   
   
rs.polyCnt = 0;
rs.displayPolyline = function (pnts) {
  let {polyCnt:cnt} = this;
  let ply = this.polylineP.instantiate();
  ply.wayPoints = pnts;
  let nm = 'p_'+cnt;
  this.set(nm,ply);
  ply.update();
  this.polyCnt = cnt+1;
}



export {rs}
  

  