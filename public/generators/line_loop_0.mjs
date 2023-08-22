import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';


let rs = basicP.instantiate();

addAnimationMethods(rs);
rs.setName('line_loop_0');

let ht = 100;
let topParams = {width:ht,height:ht,framePadding:.0*ht,frameStrokee:'red',numSteps:20,speed:2,numSteps:20,
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

rs.xrangeIntersectSeg = function (seg,lb,ub) {
  const intersectX=(seg,x)=> {
    let {end0,end1} = seg;
    let {x:x0,y:y0} = end0;
    let {x:x1,y:y1} = end1;
    if ((x1 <= x)||(x0 >= x)) {
      return null;
    }
    let d0 = x-x0;
    let d1 = x1-x;
    let dx = x1-x0;
    let dy = y1-y0;
    let r = d0/dx;
    let y = y0 + r*dy;
    return y;
    
  }
  let {end0,end1} = seg;
  let {x:x0,y:y0} = end0;
  let {x:x1,y:y1} = end1;
  if ((x1<=lb) || (x0 >= ub)){
    seg.hidden =1;
    return;
  }
  let ilb = intersectX(seg,lb);
  let iub = intersectX(seg,ub);
  seg.hidden = 0;
  if (ilb !== null) {
    end0.y = ilb;
    end0.x= lb;
  }
   if (iub !== null) {
    end1.y = iub;
    end1.x= ub;
  }
}    

rs.xrangeIntersectSegs = function (segs,lb,ub) {
  let ln = segs.length;
  for (let i=0;i<ln;i++) {
     this.xrangeIntersectSeg(segs[i],lb,ub);
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
    
rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke= 'rgb(255,255,255)';
  lineP['stroke-width'] = .5;
}
  
rs.initialize = function () {
  let {width,speed} = this;
  let hwd = 0.5*width;
  this.initProtos();
  this.addFrame();
  this.numSteps = 2*Math.floor(width/speed);
  rs.set('linePool', arrayShape.mk());
  rs.set('rlinePool', arrayShape.mk());
  const addSegPair = (x) => {
    let left = Point.mk(x-hwd,0);
    let top = Point.mk(x+hwd,-hwd);
    let bot = Point.mk(x+hwd,hwd);
     this.addSegment(left,top);
     this.addSegment(left,bot);
  }
  for (let i=0;i<=10;i++) {
    addSegPair(i*5);
  }
  
  /*
  let left = Point.mk(-50,0);
  let top = Point.mk(50,-50);
  let bot = Point.mk(50,50);
  debugger;
  this.addSegment(left,top);
  
  this.addSegment(left,bot);*/
  this.shiftAllSegs(0);
  this.xrangeIntersectSegs(this.segSetShifted,-hwd,hwd);
  this.xrangeIntersectSegs(this.rsegSetShifted,-hwd,hwd);
  this.dpyShifted();
}
 
 

rs.updateState = function () {
  let {numSteps:ns,stepsSoFar:ssf,speed,width,segSet,rsegSet,segSetShifted,rsegSetShifted} = this;
  //debugger;
  let hwd = 0.5*width;
  let shift = Math.floor(speed*ssf);
  ;
  if (shift < width) {
    this.shiftSegs(segSet,segSetShifted,shift);
    this.shiftSegs(rsegSet,rsegSetShifted,shift-width);
  } else {
    debugger;
    this.shiftSegs(segSet,segSetShifted,shift-2*width);
    //this.shiftSegs(segSet,segSetShifted,-0);
    this.shiftSegs(rsegSet,rsegSetShifted,shift-width);
  }

  
   //this.shiftAllSegs(shift);
  this.xrangeIntersectSegs(this.segSetShifted,-hwd,hwd);
  this.xrangeIntersectSegs(this.rsegSetShifted,-hwd,hwd);
  this.dpyShifted();
 
}

export {rs}
