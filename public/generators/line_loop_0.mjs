//import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';


let rs = basicP.instantiate();

addAnimationMethods(rs);
rs.setName('line_loop_0');
/*
let ht = 100;
let topParams = {width:ht,height:ht,framePadding:.0*ht,frameStrokee:'red',numSteps:20,speed:1,numSteps:20,
   //sides:['top','bot']};
   saveAnimation:1};

Object.assign(rs,topParams);
*/

rs.segSet = [];
rs.segSetShifted = [];

rs.rsegSet = [];
rs.rsegSetShifted = [];

rs.addSegment = function (end0,end1) {
  let {segSet,rsegSet,segSetShifted,rsegSetShifted,linePool,rlinePool,lineP} = this;
  let {x:x0,y:y0} = end0;
  let {x:x1,y:y1} = end1;
  let nend0,nend1
  /*if (x1<x0) {
    let svx0 = x0;
    let svy0 = y0;
    x0 = x1;
    y0 = y1;
    x1 = svx0;
    y1 = svy0;
    nend0 = end1;
    nend1 = end0;
  } else {*/
    nend0 = end0;
    nend1 = end1;
  //}
    
  let seg = LineSegment.mk(nend0,nend1);
  let rseg = LineSegment.mk(Point.mk(-x1,y1),Point.mk(-x0,y0));
  let segShifted = LineSegment.mk(Point.mk(0,y0),Point.mk(0,y1));
  let rsegShifted = LineSegment.mk(Point.mk(0,y0),Point.mk(0,y1));
  segSet.push(seg);
  segSetShifted.push(segShifted);
  rsegSet.push(rseg);
  rsegSetShifted.push(rsegShifted);
  let line = lineP.instantiate();
  let rline = lineP.instantiate();
  linePool.push(line);
  rlinePool.push(rline);
}

rs.shiftSegs = function (sgs,sgsShifted,shift) {
  const shiftSeg = (seg,segShifted) => {
    let {end0,end1} = seg;
    let {x:x0,y:y0} = end0;
    let {x:x1,y:y1} = end1;
    segShifted.end0.x = x0-shift;
    segShifted.end1.x = x1-shift;
    segShifted.end0.y = y0;
    segShifted.end1.y = y1;
  }
  let ln = sgs.length;
  for (let i=0;i<ln;i++) {
    let seg = sgs[i];
    let segShifted = sgsShifted[i];
    shiftSeg(seg,segShifted);
  }
}

rs.shiftAllSegs = function (shift) {
  let {segSet,rsegSet,segSetShifted,rsegSetShifted,width} = this;
  this.shiftSegs(segSet,segSetShifted,shift);
  this.shiftSegs(rsegSet,rsegSetShifted,shift-width);
}

rs.rectIntersectSeg = function (rect,iseg) {
debugger;
  let seg = iseg.lengthen(1.05);
  let {end0,end1} = seg;
  let c0 = rect.contains(end0);
  let c1 = rect.contains(end1);
  if (c0 && c1) {
    return seg;
  }
  let sides = rect.sides();
  let is0 = seg.intersect(sides[0]);
  let is1 = seg.intersect(sides[1]);
  let is2 = seg.intersect(sides[2]);
  let is3 = seg.intersect(sides[3]);
  let nend0,nend1;
  if (c0 !== c1) {
    nend0 = c0?end0:end1;
    nend1 = is0?is0:(is1?is1:(is2?is2:is3));
    if (!nend1) {
      return null;
      //debugger;
    }
    return LineSegment.mk(nend0,nend1);
  }
  if (is0) {
    nend0 = is0;
  }
  const checkSide = (sideI) => {
    if (sideI) {
      if (nend0) {
        return LineSegment.mk(nend0,sideI);
      } else {
        nend0=sideI;
        return null;
      }
    }
  }
  checkSide(is1)
  let ci = checkSide(is2)
  if (ci) {
    return ci;
  }
  ci = checkSide(is3)
  return ci;
}  
  
    
    
rs.boxIntersectSeg = function (seg,lbx,ubx,lby,uby) {
 // debugger;
  let corner = Point.mk(lbx,lby);
  let ex= ubx-lbx;
  let ey= uby-lby;
  let rect = Rectangle.mk(corner,Point.mk(ex,ey));
  let segt = LineSegment.mk(Point.mk(91.557,1.066),Point.mk(100,0));
  let nseg = this.rectIntersectSeg(rect,seg);
  if (nseg) {
    seg.copyto(nseg);
    seg.hidden =0;
  } else {
    seg.hidden=1;
  }
 }


rs.boxIntersectSegs = function (segs,lbx,ubx,lby,uby) {
  let ln = segs.length;
  for (let i=0;i<ln;i++) {
     this.boxIntersectSeg(segs[i],lbx,ubx,lby,uby);
  }
}

rs.dpyShifted = function () {
  let {segSetShifted,linePool,rsegSetShifted,rlinePool} = this;
  let ln =segSetShifted.length;
  const dpySeg = (seg,line) => {
    if (seg.hidden) {
      line.hide();
      line.update();
      
      return;
    }
    line.setEnds(seg.end0,seg.end1);
    line.update();
    line.show();
  }
  for (let i=0;i<ln;i++) {
   dpySeg(segSetShifted[i],linePool[i]);
  }
   for (let i=0;i<ln;i++) {
    dpySeg(rsegSetShifted[i],rlinePool[i]);
  }
}
 /*   
rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke= 'rgb(255,255,255)';
  lineP['stroke-width'] = .5;
}*/
  
rs.initialize = function () {
  let {width,speed} = this;
  let hwd = 0.5*width;
  this.initProtos();
  this.addFrame();
  this.numSteps = 2*Math.floor(width/speed);
  this.set('linePool', arrayShape.mk());
  this.set('rlinePool', arrayShape.mk());
  this.addTheSegments();
  debugger;
  this.shiftAllSegs(0);
  this.boxIntersectSegs(this.segSetShifted,-hwd,hwd,-hwd,hwd);
  this.boxIntersectSegs(this.rsegSetShifted,-hwd,hwd,-hwd,hwd);
  this.dpyShifted();
}
 
 

rs.updateState = function () {
  let {numSteps:ns,stepsSoFar:ssf,speed,width,segSet,rsegSet,segSetShifted,rsegSetShifted} = this;
  //debugger;
  let hwd = 0.5*width;
  let shift = Math.floor(speed*ssf);
  let smodw = shift%width;
  let eps = 0;
  if (shift < width) {
    this.shiftSegs(segSet,segSetShifted,shift);
    this.shiftSegs(rsegSet,rsegSetShifted,shift-width);
   // debugger;
    this.boxIntersectSegs(this.segSetShifted,-hwd,eps+hwd-shift,-hwd,hwd);
    this.boxIntersectSegs(this.rsegSetShifted,hwd-shift-eps,hwd,-hwd,hwd);
  } else {
    debugger;
    this.shiftSegs(segSet,segSetShifted,smodw-width);
    this.shiftSegs(rsegSet,rsegSetShifted,smodw);
    //this.shiftSegs(rsegSet,rsegSetShifted,smodw-width);
    debugger;
    this.boxIntersectSegs(this.rsegSetShifted,-hwd,eps+hwd-smodw,-hwd,hwd);

    this.boxIntersectSegs(this.segSetShifted,hwd-smodw-eps,hwd,-hwd,hwd);
  }

  
  this.dpyShifted();
 
}

export {rs}
