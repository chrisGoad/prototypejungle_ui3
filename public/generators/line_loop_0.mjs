import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';


let rs = basicP.instantiate();

addAnimationMethods(rs);
rs.setName('line_loop_0');

let ht = 100;
let topParams = {width:ht,height:ht,framePadding:.0*ht,frameStroke:'white',numSteps:20,
   //sides:['top','bot']};
   saveAnimation:1};

Object.assign(rs,topParams);


rs.segSet = [];
rs.segSetShifted = [];

rs.rsegSet = [];
rs.rsegSetShifted = [];

rs.addSegment = function (end0,end1) {
  let {segSet,rsegSet,segSetShifted,rsegSetShifted,linePool,rlinePool,lineP} = this;
  let {x:x0,y:y0} = end0;
  let {x:x1,y:y1} = end1;
  let seg = LineSegment.mk(end0,end1);
  let rseg = LineSegment.mk(Point.mk(-x0,y0),Point.mk(-x1,y1));
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
  }
  let ln = sgs.length;
  for (let i=0;i<ln;i++) {
    let seg = sgs[i];
    let segShifted = sgsShifted[i];
    shiftSeg(seg,segShifted);
  }
}

rs.shiftAllSegs = function (shift) {
  let {segSet,rsegSet,segSetShifted,rsegSetShifted} = this;
  this.shiftSegs(segSet,segSetShifted,shift);
  this.shiftSegs(rsegSet,rsegSetShifted,shift);
}

rs.dpyShifted = function () {
  let {segSetShifted,linePool} = this;
  let ln =segSetShifted.length;
  const dpySeg = (seg,line) => {
    line.setEnds(seg.end0,seg.end1);
    line.update();
    line.show();
  }
  for (let i=0;i<ln;i++) {
    dpySeg(segSetShifted[i],linePool[i]);
  }
}
    
rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke= 'rgb(255,255,255)';
  lineP['stroke-width'] = 2;
}
  
rs.initialize = function () {
  this.initProtos();
  this.addFrame();
  rs.set('linePool', arrayShape.mk());
  rs.set('rlinePool', arrayShape.mk());
  let left = Point.mk(-50,0);
  let top = Point.mk(50,-50);
  let bot = Point.mk(50,50);
  debugger;
  this.addSegment(left,top);
  this.addSegment(left,bot);
  this.shiftAllSegs(40);
  this.dpyShifted();
}
  


export {rs}
