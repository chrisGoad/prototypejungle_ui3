import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
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
  for (let i=0;i<n;i++) {
   let x = lb + iv*i;
   let y = f(x);
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
rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .2;
}


rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP} = this;
  let hht = 0.5*ht;
  this.setNumSteps();
  this.initProtos();
  this.addFrame();
  const f = (x) => {
    debugger;
    let y = Math.sin(x);
    let sy = hht*y
    return sy;
  }
  let pnts = this.approximateCurve(Math.sin,-4*Math.PI,4*Math.PI,100,10);
  let spnts =this.scale(pnts,ht/(2*Math.PI),hht);
  let lcnt = 20;
  for (let i=0;i<20;i++) {
      let spnts0 =this.scale(pnts,ht/(2*Math.PI),1*(lcnt-i)*(hht/lcnt));
      let spnts1 =this.scale(pnts,ht/(2*Math.PI),1*i*(hht/lcnt));

    let tpnts0 = this.translate(spnts0,Point.mk(-24,-2*(lcnt-i)-30));
    let tpnts1 = this.translate(spnts1,Point.mk(0,2*i-30));
     this.displayPolyline(tpnts0);
     this.displayPolyline(tpnts1);
  }
  return;
 
}

export {rs}
  

  