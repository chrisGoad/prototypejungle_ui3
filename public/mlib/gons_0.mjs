
const rs = function (item) {

item.pointsAlong = function (ls,n) {
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
    


item.mkTriangleVertices = function (base,ip) {
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

item.triangleCenter = function (base) {
  return Point.mk(0,0);
}

item.mkRectangleVertices = function (params) {
  let {center,width:wd,height:ht} = params;
  let hwd = wd/2;
  let hht = ht/2;
  let cnt = center?center:Point.mk(0,0);
  let vs = [Point.mk(-wd,-ht),Point.mk(wd,-ht),Point.mk(wd,ht),Point.mk(-wd,ht)];
  return vs;
}
  


item.gonCenter = function (gon) {
  let cs = gon.corners;
  let ln = cs.length;
  let ps = cs[0];
  for (let i=1;i<ln;i++) {
    ps = ps.plus(cs[i]);
  }
  let avg = ps.times(1/ln);
  return avg;
 }
   
item.mkTriQuadVertices = function (base,ip) {
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
 
item.mkGon = function (ps) {
  let {gonP} = this;
  let gon = gonP.instantiate();
  gon.corners = ps;
  return gon;
}


item.addGon = function (g) {
  let isa = Array.isArray(g);
  let gon = isa?this.mkGon(g):g;
  let {gons} = this;
  gons.push(gon);
  gon.show();
  gon.update();
  return gon;
}

item.addTri = function (base,ip) {
  let ps = this.mkTriangleVertices(base,ip);
  this.addGon(ps);
}
 


item.mkSegs = function (vs) {
  let sgs = [];;
  let ln = vs.length;
  for (let i=0;i<ln;i++) {
    let ls = LineSegment.mk(vs[i],vs[(i+1)%ln]);
    sgs.push(ls);
  }
  return sgs;
 
}


item.mkTriangleSegs = function (base,p) {
  let ps = this.mkTriangleVertices(base,p);
  return this.mkSegs(ps);
}

item.reverseSeg = function (ls) {
  let {end0,end1} = ls;
  return LineSegment.mk(end1,end0);
}
item.rreverseSeg = function (ls) {
  return ls;
}
item.addSeg = function (sg) {
  let {lines,lineP} = this;
  let {end0,end1} = sg;
  let line = lineP.instantiate();
  lines.push(line);
  line.show();
  line.setEnds(end0,end1);
  line.update();
}

item.addPoint = function (p) {
  let {points,circleP} = this;
  let c = circleP.instantiate();
  c.dimension =2;
  points.push(c);
  c.show();
  c.moveto(p);
  c.update();
}

  
item.addRow =  function (pal,sbase,j) {
  let ln = pal.length;
  let nq = ln - j-1;
  let  v= pal[j];
  let {x,y} =v;
  for (let i=0;i<nq;i++) {
    let p = Point.mk(x+sbase*i,y);
    let qvs = this.mkTriQuadVertices(sbase,p);
    this.addGon(qvs);
  }
  let p = Point.mk(x+sbase*nq,y);
  let qvs = this.mkTriangleVertices(sbase,p);
  this.addGon(qvs);
}


item.addGonTriangle = function (bbase,n) {
  debugger;
  let a2r = Math.PI/180;
  let tht = bbase*Math.sin(60*a2r);
  let trisegs =  this.mkTriangleSegs(bbase);
  let vertices =  trisegs.map((v)=>v.end0);
  let [lsA,lsB,lsC] =  trisegs;
   this.addSeg(lsA);
  this.addSeg(lsB);
  this.addSeg(lsC);
  let pal = this.pal = this.pointsAlong(lsA,n);
  pal.unshift(lsA.end0);
  let sbase = this.sbase = bbase/(n+1);
  let ln = pal.length;
  for (let i=0;i<ln;i++) {
    this.addRow(pal,sbase,i);
  }
  return {segs:trisegs,vertices,gons:this.gons};

}
item.mkRectangleGon = function (center,width,height) {
  let hwd = width/2;
  let hht = height/2;
  let {x:cx,y:cy} = center;
  let ps = [Point.mk(cx-hwd,cy-hht),Point.mk(cx+hwd,cy-hht),Point.mk(cx+hwd,cy+hht),Point.mk(cx-hwd,cy+hht)];
  let gon = this.mkGon(ps);
  return gon;
}
item.addGonGrid = function (params) {
  debugger;
  let {numRows:nr,numCols:nc,width:wd,height:ht,center} = params;
  let xi = wd/nc;
  let yi = ht/nr;
  let cx = xi/2 -wd/2;
  let gons = [];
  for (let i=0;i<nc;i++) {
    let cy =yi/2 -ht/2;
    for (let j=0;j<nr;j++) {
      let p = Point.mk(cx,cy);
      let gon = this.mkRectangleGon(p,xi,yi);
      gons.push(gon);
      this.addGon(gon);
      cy = cy+yi;
    }
    cx = cx+xi;
  }
  let hwd = wd/2;
  let hht = ht/2;
  let vertices = [Point.mk(-hwd,-hht),Point.mk(hwd,-hht),Point.mk(hwd,hht),Point.mk(-hwd,hht)];
  return {vertices,gons}
  
}
item.addGonTriangle = function (bbase,n) {
  let a2r = Math.PI/180;
  let tht = bbase*Math.sin(60*a2r);
  let trisegs =  this.mkTriangleSegs(bbase);
  let vertices =  trisegs.map((v)=>v.end0);
  let [lsA,lsB,lsC] =  trisegs;
   this.addSeg(lsA);
  this.addSeg(lsB);
  this.addSeg(lsC);
  let pal = this.pal = this.pointsAlong(lsA,n);
  pal.unshift(lsA.end0);
  let sbase = this.sbase = bbase/(n+1);
  let ln = pal.length;
  for (let i=0;i<ln;i++) {
    this.addRow(pal,sbase,i);
  }
  return {segs:trisegs,vertices,gons:this.gons};

}

item.interpolateColors = function (gons,vertices,cornerColors,fn,dfn)  {
  gons.forEach((gon)=>{
    let cc = cornerColors;
    let isa = Array.isArray(cc);
    let vValues = isa?cc:[cc.ULC,cc.URC,cc.LRC,cc.LLC];
    let pt = this.gonCenter(gon);
    let iv = this.interpolateVectors({vertices,vValues,pt,dfn});
    let tv = fn?fn(iv):iv;
    let fill = this.arrayToRGB(tv);
    gon.fill = fill;
    gon.update();
  });
}

item.addGonsForSubgrid = function (params) {
  let {lowX,highX,lowY,highY,width,height,numRows,numCols} = params;
  let xinc = width/numCols;
  let yinc = height/numRows;
  let xdiff = highX-lowX;
  let ydiff = highY-lowY;
  let subwd = xdiff*xinc;
  let subht = ydiff*yinc;
  let xLow = lowX*xinc;
  let yLow = lowY*yinc;
  let xHigh = highX*xinc;
  let yHigh = highY*yinc;
  let xvg = (xLow+xHigh)/2;
  let xavg = (xLow+xHigh)/2;
  let yavg = (yLow+yHigh)/2;
  let center = Point.mk(xavg,yavg);
  
  debugger;
  let gg = this.addGonGrid({numRows:ydiff,numCols:xdiff,width:subwd,height:subht,center});
  return gg;
}
  

   
}
export {rs};





