import {rs as gonPP} from '/shape/polygon.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
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

rs.mkTriangleVertices = function (base,ip) {
  let a2r = Math.PI/180;
  let ht = base*Math.sin(60*a2r);
  let hht = 0.5*ht;
  let hb = 0.5*base;
  let p=ip?ip:Point.mk(-hb,0.3333333*ht);
  let v0 = Point.mk(0,0).plus(p);
  let v1 = Point.mk(hb,-ht).plus(p);
  let v2 = Point.mk(base,0).plus(p);
  return [v0,v1,v2];
}

rs.mkQuadVertices = function (base,ip) {
  let a2r = Math.PI/180;
  let ht = base*Math.sin(60*a2r);
  let hht = 0.5*ht;
  let hb = 0.5*base;
  let p=ip?ip:Point.mk(-hb,hht);
  let v0 = Point.mk(0,0).plus(p);
  let v1 = Point.mk(hb,-ht).plus(p);
  let v2 = Point.mk(1.5*base,-ht).plus(p);
  let v3 = Point.mk(base,0).plus(p);
  return [v0,v1,v2,v3];
}

rs.gonCenter = function (gon) {
  let cs = gon.corners;
  let ln = cs.length;
  let ps = cs[0];
  for (let i=1;i<ln;i++) {
    ps = ps.plus(cs[i]);
  }
  let avg = ps.times(1/ln);
  return avg;
 }
    
rs.mkGon = function (ps) {
  let {gons,gonP} = this;
  let gon = gonP.instantiate();
  gons.push(gon);
  gon.show();
  gon.corners = ps;
  gon.update();
  let cnt = this.gonCenter(gon);
  gon.center = cnt;
}

rs.mkQuad = function (base,ip) {
  let ps = this.mkQuadVertices(base,ip);
  this.mkGon(ps);
}

rs.mkTri = function (base,ip) {
  let ps = this.mkTriangleVertices(base,ip);
  this.mkGon(ps);
}
 


rs.mkSegs = function (ps) {
  let [v0,v1,v2] =ps;
  let lsA  = LineSegment.mk(v0,v1);
  let lsB  = LineSegment.mk(v1,v2);
  let lsC  = LineSegment.mk(v2,v0);
  return [lsA,lsB,lsC];
}


rs.mkTriangleSegs = function (base,p) {
  let ps = this.mkTriangleVertices(base,p);
  return this.mkSegs(ps);
}


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .5;
  let gonP = this.gonP = gonPP.instantiate();
  gonP.stroke = 'white';
  gonP['stroke-width'] = .0;
  gonP.fill = 'blue';
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .05;
  circleP.fill = 'blue';
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
rs.initialize = function () {
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
  
rs.addRow =  function (j) {
  let {pal,sbase} = this;
  let ln = pal.length;
  let nq = ln - j-1;
  let  v= pal[j];
  let {x,y} =v;
  for (let i=0;i<nq;i++) {
    let p = Point.mk(x+sbase*i,y);
    let qvs = this.mkQuadVertices(sbase,p);
    this.mkGon(qvs);
  }
  let p = Point.mk(x+sbase*nq,y);
  let qvs = this.mkTriangleVertices(sbase,p);
  this.mkGon(qvs);
}

rs.orthVector = function (sg) {
  let {end0,end1} = sg;
  let vec = end1.difference(end0);
  let ln = vec.length();
  let nvec = vec.times(1/ln);
  let {x,y} =nvec;
  let nv = Point.mk(-y,x);
  return nv.times(1);
}

rs.orthSeg = function (sg) {
  let e0 = sg.end0;
  let ov = this.orthVector(sg).times(10);
  let oseg = LineSegment.mk(e0,e0.plus(ov));
  return oseg;
}

rs.distFromSeg = function (p,sg) {
  let ov = this.orthVector(sg);
  let e0 = sg.end0;
  let pv = p.difference(e0);
  let d = ov.dotp(pv);
  return d;
}


  
  
rs.initialize = function () {
  debugger;
  this.initProtos();
   let {width:wd,circleP} = this;
 this.addFrame();
  let lines = this.set('lines',arrayShape.mk());
  let gons = this.set('gons',arrayShape.mk());
 /* let c = this.set('c',circleP.instantiate());
  c.dimension = 10;
  c.show();
  c.update();*/
  let bbase = this.bbase = 0.7*wd;
  let a2r = Math.PI/180;
  let tht = bbase*Math.sin(60*a2r);
  let trisegs = this.mkTriangleSegs(bbase);
  let [lsA,lsB,lsC] = trisegs;
  this.addSeg(lsA);
  this.addSeg(lsB);
  this.addSeg(lsC);
  let olsA  = this.orthSeg(lsA);
  let olsB = this.orthSeg(lsB);
  let olsC = this.orthSeg(lsC);
  this.addSeg(olsA);
  this.addSeg(olsB);
  this.addSeg(olsC);
 
  
 // return;
  let n = 200;
 // n = 10;
  n = 5;
  let pal = this.pal = this.pointsAlong(lsA,n);
  pal.unshift(lsA.end0);
  let sbase = this.sbase = bbase/(n+1);
  /*let {end0,end1} = lsA;
 this.connectSegs(lsA,this.reverseSeg(lsB),n);
  this.connectSegs(lsB,this.reverseSeg(lsC),n);*/
  let ln = pal.length;
  for (let i=0;i<ln;i++) {
    this.addRow(i);
  }
  let lng = gons.length;
  debugger;
  let c0 = this.randomColorArray(10,250,3);
  let c1 = this.randomColorArray(10,250,3);
  let c2 = this.randomColorArray(10,250,3);
 
  c0 = [250,250,0];
  c1 = [0,250,250];
  c2 = [250,0,250];
  for (let i = 0;i<lng;i++) {
    let gon = gons[i];
    let pt = gon.center;
    
    let dA = tht-this.distFromSeg(pt,lsA);
    let dB = tht-this.distFromSeg(pt,lsB);
    let dC = tht-this.distFromSeg(pt,lsC);
    console.log('pt',pt,'dA',dA,'dB',dB,'dC',dC);
    let fA = 1/dA;
    let fB = 1/dB;
    let fC = 1/dC;
    let sum = fA+fB+fC;
    let nfA = fA/sum;
    let nfB = fB/sum;
    let nfC = fC/sum;
    console.log('NFA',nfA,'nfB',nfB,'nfC',nfC);
    let wc0A = c0.map((v) => nfA*v);
    let wc1B = c1.map((v) => nfB*v);
    let wc2C = c2.map((v) => nfC*v);
    
    debugger;
    let suma = this.sumArrays([wc0A,wc1B,wc2C]);
    let fill = this.arrayToRGB(suma);
    gon.fill = fill;

  }
  //this.mkTri(.2*wd,Point.mk(0,0));
  //let quad = this.mkQuad(.2*wd,Point.mk(0,0));
 }


export {rs};



