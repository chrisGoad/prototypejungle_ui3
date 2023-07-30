debugger;
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as gonPP} from '/shape/polygon.mjs';
import {rs as basicP} from '/generators/basics.mjs';
//import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
//import {rs as addDropMethods} from '/mlib/circleDrops.mjs';
//import {rs as addPlaceDropMethods} from '/mlib/placeDrops.mjs';

let rs = basicP.instantiate();
//addAnimationMethods(rs);
//addDropMethods(rs);
//addPlaceDropMethods(rs);

rs.genSideParams = function (extent,d,ornt,genLines) {
  let {x,y} = extent;
  let hx = 0.5 * x;
  let theta = Math.atan(hx/d);
  let r = hx/Math.sin(theta);
  let b = r - d;
  let e0,e1;
  if (ornt === 'down') {
    e0 = Point.mk(0,hx-d);
    e1 = Point.mk(0,r+hx-d);
  } else if (ornt === 'right') {
    e0 = Point.mk(hx-d,0);
    e1 = Point.mk(r+hx-d,0);
  } else if (ornt === 'up') {
    e0 = Point.mk(0,d-hx);
    e1 = Point.mk(0,d-hx-r);
  } else if (ornt === 'left') {
    e0 = Point.mk(d-hx,0);
    e1 = Point.mk(d-hx-r,0);
  }
  let line;
  if (genLines) {
    let line = this.lineP.instantiate();
    this.set('vline',line);
    line.setEnds(e0,e1);
  }
  let atheta;
  const addLine = (nm,theta,r) => {
  //  debugger;
    let dtheta;
    if (ornt === 'right') {
      dtheta = Math.PI/2;
    }
    if (ornt === 'down') {
      dtheta = 0;
     // dtheta = Math.PI/2;
    }
    if (ornt === 'up') {
      dtheta = Math.PI;
    }
    if (ornt === 'left') {
      dtheta = 3*Math.PI/2;
    }
    atheta = theta+dtheta;
    let cs = Math.cos(atheta);
    let sn = Math.sin(atheta);
    //let e2 = e0.plus(Point.mk(r*cs,r*sn));
    let e2 = e0.plus(Point.mk(r*sn,r*cs));
    if (genLines) {
      let line = this.lineP.instantiate();
      this.set(nm,line);
      line.setEnds(e0,e2);
    }
  }
  addLine('line2',theta,r);
  let theta0 = atheta;
  addLine('line3',-theta,r);
  let  theta1 = atheta;
  return {center:e0,radius:r,theta0,theta1};
}


rs.genCorners = function (center,radius,theta0,theta1,numCorners,icorners) {
 // debugger;
  let adjust = !!icorners;
  let corners = adjust?icorners:[];
  let dt = theta1-theta0;
  let intv = dt/(numCorners-1);
  for (let i = 0;i<numCorners;i++){
    let th = theta0+i*intv;
    let v = Point.mk(Math.sin(th),Math.cos(th)).times(radius);
    let p = center.plus(v);
    if (adjust) {
      corners[i]=p;
    } else {
      corners.push(p);
    }
  }
  return corners;
}

rs.genCorners1 = function (extent,d,ornt,numCorners,icorners) {
  let sp = this.genSideParams(extent,d,ornt,0);
  let {center,radius,theta0,theta1} = sp;
  return this.genCorners(center,radius,theta0,theta1,numCorners,icorners);
}

rs.genRectGon = function (extent,nsegs,d) {
  let {x,y} = extent;
  let hx = 0.5*x;
  let hy = 0.5*y;
  let UL = Point.mk(-hx,-hy);
  let UR = Point.mk(hx,-hy);
  let LR = Point.mk(hx,hy);
  let LL = Point.mk(-hx,hy);
  let gon = this.gonP.instantiate();
  gon.corners = [UL,UR,LR,LL];
  return gon;
 }
 
 
rs.genGonGon = function (extent,d,nsegs) {
  let isnum = typeof d === 'number';
  let crnsL = this.genCorners1(extent,isnum?d:d[0],'left',nsegs);
  let crnsU = this.genCorners1(extent,isnum?d:d[1],'up',nsegs);
  let crnsR = this.genCorners1(extent,isnum?d:d[2],'right',nsegs);
  let crnsD = this.genCorners1(extent,isnum?d:d[3],'down',nsegs);
  let crns = crnsL.concat(crnsU,crnsR,crnsD);
  let agon = this.gonP.instantiate();
  agon.corners = crns;
  return agon;
 }

let numPointsShown = 0;
rs.showPoints = function (c) {
  let ln = c.length;
  for (let i=0;i<ln;i++) {
    let p = c[i];
    let nm = 'c_'+(i+numPointsShown);
    let crc = this.circleP.instantiate();
    this.set(nm,crc);
    crc.moveto(p);
  }
  numPointsShown += ln;
}  




export {rs};




