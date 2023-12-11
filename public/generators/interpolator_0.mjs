import {rs as gonPP} from '/shape/polygon.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';


let rs = basicP.instantiate();
addAnimationMethods(rs);
rs.setName('interpolator_0');


let ht= 100;
let nr = 101;
//nr = 5	;

let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,framePadding:0.01*ht,frameStrokee:'white',frameStrokeWidth:.1,saveAnimation:1,oneShot:1,
numSteps:200,chopOffBeginningg:218,stepInterval:50,ULC:[250,0,0],URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0],period:20,xgapf:.1,ygapf:.1};//50
//numSteps:295,chopOffBeginning:218,stepInterval:50,ULC:rs.randomFill('ran','ran','ran',100,250),URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0]};//50

Object.assign(rs,topParams);
/*
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
*/
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

rs.triangleCenter = function (base) {
  let a2r = Math.PI/180;
  let ht = base*Math.sin(60*a2r);
  let p=Point.mk(0,0);//.3333333*ht);
  return p;
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

rs.addPoint = function (p) {
  let {points,circleP} = this;
  let c = circleP.instantiate();
  c.dimension =2;
  points.push(c);
  c.show();
  c.moveto(p);
  c.update();
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


rs.interpolateParams = function () {
   let {gons,vertices,vParams,applicator} = this;
  let lng = gons.length;
  let vl = vertices.length;
  for (let i = 0;i<lng;i++) {
    let gon = gons[i];
    let pt = gon.center;
    let ds = vertices.map((v) => pt.distance(v));
   
    let fcs = ds.map((v)=>1/v);//factors
    let sum =0;
    fcs.forEach((v) => {
      sum=sum+v;
    });
    let nfcs = fcs.map( (v) => v/sum);//normalized factors
    let wvps = [];// weighted parameters
    for (let j=0;j<vl;j++) {
      let vp = vParams[j];
      let nfc = nfcs[j];
      let wvp = vp.map((v)=>nfc*v);
      wvps.push(wvp);
    }
    let suma= this.sumArrays(wvps);  //sum the weights
    applicator.call(this,gon,suma);
  }
}  
  
rs.applicator = function (gon,colorArray) {
  let rgb = this.arrayToRGB(colorArray);
  gon.fill = rgb;
  gon.update();
}  
rs.initialize = function () {
  debugger;
  this.initProtos();
   let {width:wd,circleP} = this;
 this.addFrame();
  let lines = this.set('lines',arrayShape.mk());
  let gons = this.set('gons',arrayShape.mk());
  let points = this.set('points',arrayShape.mk());
  let bbase = this.bbase = 0.9*wd;
  let a2r = Math.PI/180;
  let tht = bbase*Math.sin(60*a2r);
  let trisegs = this.trisegs = this.mkTriangleSegs(bbase);
  let vertices = this.vertices = trisegs.map((v)=>v.end0);
  let [lsA,lsB,lsC] =  trisegs;
   this.addSeg(lsA);
  this.addSeg(lsB);
  this.addSeg(lsC);
  let n = 200;
  n = 50;
  let pal = this.pal = this.pointsAlong(lsA,n);
  pal.unshift(lsA.end0);
  let sbase = this.sbase = bbase/(n+1);
  let ln = pal.length;
  for (let i=0;i<ln;i++) {
    this.addRow(i);
  }
 
  let c0 = [250,250,250];
  let c1 = [0,0,0];
  let c2 = [250,0,0];
  this.vParams = [c0,c1,c2];
  this.interpolateParams();

}
 

rs.updateState = function () {
   debugger;
  let {cornerColors,trisegs,cangle,triCenter} =this;
  let pparams = {cornerColors,angle:cangle,segs:trisegs,center:triCenter};
  this.paintIt(pparams);
  this.cangle = cangle + Math.PI/100;
}


export {rs};



