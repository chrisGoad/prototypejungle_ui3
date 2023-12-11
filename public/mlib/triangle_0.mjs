import {rs as gonPP} from '/shape/polygon.mjs';




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
  return Point.mk(0,0);
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

rs.mkTri = function (base,ip) {
  let ps = this.mkTriangleVertices(base,ip);
  this.mkGon(ps);
}
 


rs.mkTriSegs = function (ps) {
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

rs.angleIntersectLineSegment = function (p,a,sg1) { 
  let {width:wd} = this;
  let e1 = Point.mk(Math.cos(a)*wd,Math.sin(a)*wd).plus(p);
  let sg0 = LineSegment.mk(p,e1);
 // this.addSeg(sg0);
  let intsct = sg0.intersect(sg1);
  return intsct;
}

rs.intersectSegs = function (p,a,sgs) {
  let ln = sgs.length;
  for (let i=0;i<ln;i++) {
    let sg = sgs[i]
    let intsct = this.angleIntersectLineSegment(p,a,sg);
    if (intsct) {
      return {which:i,intersection:intsct};
    }
  }
}

rs.paintIt= function (params) {
  let {cornerColors:cc,angle:a,segs,center}=params;
  let {bbase,sbase,gons} =this;
  debugger;
  let [c0,c1,c2,c3] = cc;
  let a2r = Math.PI/180;
  let tht = bbase*Math.sin(60*a2r);
  let [lsA,lsB,lsC]  = segs;
  let ii = this.interpolateArrays;
  let i0 =  this.intersectSegs(center,a+30*a2r,segs);
  let i1 =  this.intersectSegs(center,a+150*a2r,segs);
  let i2 =  this.intersectSegs(center,a+270*a2r,segs);
  const getColor = (i) => {
    let {which:wh,intersection:intsct} = i;
    let seg = segs[wh];
    let {end0,end1} = seg;
    let ce0 = cc[wh];
    let ce1 = cc[(wh+1)%3];
    let svec = intsct.difference(end0);
    let sln = svec.length();
    let fr = sln/bbase;
    let ca = this.interpolateArrays(ce0,ce1,fr);
    return ca;
  }
  let ca0 = getColor(i0);
  let ca1 = getColor(i1);
  let ca2 = getColor(i2);
  let lng = gons.length;
  for (let i = 0;i<lng;i++) {
    let gon = gons[i];
    let pt = gon.center;
    
    let dA = tht-this.distFromSeg(pt,lsA);
    let dB = tht-this.distFromSeg(pt,lsB);
    let dC = tht-this.distFromSeg(pt,lsC);
    let dCnt = 2*(pt.difference(center)).length();
    console.log('pt',pt,'dA',dA,'dB',dB,'dC',dC,dCnt);
    let fA = 1/dA;
    let fB = 1/dB;
    let fC = 1/dC;
    let fCnt = 1/dCnt;
    let sum = c3?fA+fB+fC+fCnt:fA+fB+fC;
    let nfA = fA/sum;
    let nfB = fB/sum;
    let nfC = fC/sum;
    let nfCnt = fCnt/sum;
    console.log('NFA',nfA,'nfB',nfB,'nfC',nfC);
    let wc0A = ca0.map((v) => nfA*v);
    let wc1B = ca1.map((v) => nfB*v);
    let wc2C = ca2.map((v) => nfC*v);
    let wc3Cnt;
    if (c3) {
      wc3Cnt = c3.map((v) => nfCnt*v);
    }
    
    debugger;
    let suma = c3?this.sumArrays([wc0A,wc1B,wc2C,wc3Cnt]):this.sumArrays([wc0A,wc1B,wc2C]);
    let fill = this.arrayToRGB(suma);
    gon.fill = fill;
    gon.update();

  }
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
  let [lsA,lsB,lsC] =  trisegs;
   this.addSeg(lsA);
  this.addSeg(lsB);
  this.addSeg(lsC);
  let triCenter = this.triCenter = this.triangleCenter(bbase);
  let olsA  = this.orthSeg(lsA);
  let olsB = this.orthSeg(lsB);
  let olsC = this.orthSeg(lsC);
  let n = 200;
  n = 50;
  let pal = this.pal = this.pointsAlong(lsA,n);
  pal.unshift(lsA.end0);
  let sbase = this.sbase = bbase/(n+1);
  let ln = pal.length;
  for (let i=0;i<ln;i++) {
    this.addRow(i);
  }
 

  let lng = gons.length;
  debugger;
  let c0 = this.randomColorArray(10,250,3);
  let c1 = this.randomColorArray(10,250,3);
  let c2 = this.randomColorArray(10,250,3);
  let c3 = this.randomColorArray(10,250,3);
 
  c0 = [250,250,250];
  c1 = [0,0,0];
  c2 = [250,0,0];
  c2 = [0,0,0];
  /* c0 = [250,0,0];
  c1 = [0,250,0];
  c2 = [0,0,250];
  c3 = [250,250,0];*/
  let cornerColors = this.cornerColors = [c0,c1,c2];//c3];
  let cangle = this.cangle = 0;
  let pparams = {cornerColors,angle:cangle,segs:trisegs,center:triCenter};
  this.paintIt(pparams);

}
 

rs.updateState = function () {
   debugger;
  let {cornerColors,trisegs,cangle,triCenter} =this;
  let pparams = {cornerColors,angle:cangle,segs:trisegs,center:triCenter};
  this.paintIt(pparams);
  this.cangle = cangle + Math.PI/100;
}


export {rs};



