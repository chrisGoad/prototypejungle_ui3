import {rs as poygonPP} from '/shape/polygon.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';

let rs = basicP.instantiate();
rs.setName('triangle_0');


let ht= 100;
let nr = 101;
//nr = 5	;
 let color0 = [250,250,10];
      let color1 = [238,105,65];
      let color2 = [10,10,250];
      let color3 = [10,10,10];

let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,framePadding:0.01*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,oneShot:1,
numSteps:2000,chopOffBeginningg:218,stepInterval:50,ULC:[250,0,0],URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0],period:20,xgapf:.1,ygapf:.1};//50
//numSteps:295,chopOffBeginning:218,stepInterval:50,ULC:rs.randomFill('ran','ran','ran',100,250),URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0]};//50

Object.assign(rs,topParams);

rs.pointsAlong = function (ls,n) {
  let {end0,end1} = ls;
  let vec = end1.difference(end0);
  let ln = vec.length();
  let nvec = vec.times(1/ln);
  let intv = ln/(n+1);
  let ps = [];
  for (let i=1;i<=n;i++) {
    let p = end0.plus(nvec.times(i*intv));
    ps.push(p);
  }
  return ps;;
}
    

rs.connectSegs = function(lsA,lsB,n) {
  let {lines,lineP} = this;
  let psA = this.pointsAlong(lsA,n,11);
  let psB = this.pointsAlong(lsB,n,13);
  for (let i=0;i<n;i++) {
    let pA = psA[i];
    let pB = psB[i];
    let line = lineP.instantiate();
    lines.push(line);
    line.show();
    line.setEnds(pA,pB);
    line.update();
  }
}

rs.mkTriangleSegs = function (base) {
  let a2r = Math.PI/180;
  let ht = base*Math.sin(60*a2r);
  let hht = 0.5*ht;
  let hb = 0.5*base;
  let v0 = Point.mk(-hb,hht);
  let v1 = Point.mk(0,-hht);
  let v2 = Point.mk(hb,hht);
  let lsA  = LineSegment.mk(v0,v1);
  let lsB  = LineSegment.mk(v1,v2);
  let lsC  = LineSegment.mk(v2,v0);
  return [lsA,lsB,lsC];
}


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .05;
}
rs.reverseSeg = function (ls) {
  let {end0,end1} = ls;
  return LineSegment.mk(end1,end0);
}
rs.rreverseSeg = function (ls) {
  return ls;
}
rs.addSeg = function (sg) {
  let {lines,lineP} = this;
  let {end0,end1} = sg;
  let line = lineP.instantiate();
  lines.push(line);
  line.show();
  line.setEnds(end0,end1);
  line.update();
}
rs.initialize = function () {
  let {width:wd} = this;
  debugger;
  this.initProtos();
  this.addFrame();
  let lines = this.set('lines',arrayShape.mk());
  let trisegs = this.mkTriangleSegs(0.7*wd);
  let [lsA,lsB,lsC] = trisegs;
  let n = 200;
  //this.connectSegs(lsA,this.reverseSeg(lsB),n);
  this.connectSegs(lsB,this.rreverseSeg(lsC),n);
  this.connectSegs(lsC,this.rreverseSeg(lsA),n);
  this.addSeg(lsA);
  this.addSeg(lsB);
  this.addSeg(lsC);
  //this.connectSegs(lsB,lsC,n);
  //this.connectSegs(lsC,lsA,n);
}
rs.initializee = function () {
  let {width:wd} = this;
  debugger;
  this.initProtos();
  this.addFrame();
  let lines = this.set('lines',arrayShape.mk());
  let trisegs = this.mkTriangleSegs(0.7*wd);
  let [lsA,lsB,lsC] = trisegs;
  let n = 200;
  n = 10;
  this.connectSegs(lsA,this.reverseSeg(lsB),n);
  this.connectSegs(lsB,this.reverseSeg(lsC),n);
  //this.connectSegs(lsC,this.rreverseSeg(lsA),n);
  this.addSeg(lsA);
  this.addSeg(lsB);
  this.addSeg(lsC);
  //this.connectSegs(lsB,lsC,n);
  //this.connectSegs(lsC,lsA,n);
}
  
  
  


export {rs};



