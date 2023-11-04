
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
  let dop = delta/(2*Math.PI);
  //let iv = delta/n;
  for (let i=0;i<n;i++) {
   let x = lb + iv*i;
   let y = f(x);
 //   console.log('x',x/(Math.PI),'y',y);
    pnts.push(Point.mk(x,y));
  }
  return pnts;
}
// scale and optionally add a constant to x and y
rs.scale= function (pnts,x,y,ixc,iyc) {
  let xc = ixc?ixc:0;
  let yc = iyc?iyc:0;
  return pnts.map((p) => Point.mk(xc+x*p.x,yc+y*p.y));
}
rs.translate = function (pnts,p) {
  return pnts.map((ip) => ip.plus(p));
}

rs.fromPolar = function (pnts)  {
  return pnts.map((ip) =>{
    //console.log('ip',ip.x,ip.y);
    let vec = Point.mk(Math.cos(ip.x),Math.sin(ip.x));
    let r = vec.times(ip.y);
    let ln = r.length();
  //  console.log('y',ip.y,'ln',ln);
    //let r = vec.times(10);
    return r;
  });
}


rs.rotate = function (pnts,theta)  {
  return pnts.map((ip) =>{
    let rm = geom.rotationMatrix(theta);
    let rp = ip.rotate(rm);
    return rp;
  });
}
   
   
   
rs.maxf = function (pnts,f) {
  let r = -Infinity;
  pnts.forEach((p) => {
    let v=f(p);
    if (v>r) {
      r=v
    }   
  });
  return r;
}
rs.containingBox = function (pnts) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity
  let maxY = -Infinity
  pnts.forEach((p) => {
    let {x,y} = p;
    if (x>maxX) {
      maxX = x;
    }
    if (y>maxY) {
      maxY = y;
    }
    if (x<minX) {
      minX = x;
    }
    if (y<minY) {
      minY = y;
    }
 
  });
  let crn =Point.mk(minX,minY)
  let ext = Point.mk(maxX-minX,maxY-minY);
  let rect = Rectangle.mk(crn,ext)
  return rect;
}

rs.containedPnts = function (box,pnts) {
  let ln = pnts.length;
  let cpnts = [];//indices
  for (let i=0;i<ln;i++) {
    let p = pnts[i];
    if (box.contains(p)) {
      cpnts.push(i);
    }
  }
  return cpnts;
}

rs.containedSegs = function (box,pnts) {
  let cpnts = this.containedPnts(box,pnts);
  let ln = cpnts.length;
  if (ln === 0) {
    return [];
  }
  let fpi = cpnts[0];
  let lpi = cpnts[ln-1];
  if (fpi===0) {
    return [];
  }
  let sg0 = LineSegment.mk(pnts[fpi-1],pnts[fpi]);
  let segs = [sg0];
  let loopStart = fpi<1?0:fpi-1;
  for (let i=loopStart;i<=lpi;i++) {
    let p0 = pnts[i];
    let p1 = pnts[i+1];
    if ((!p0)||(!p1)) {
      debugger;
      return [];
    }
  //  this.displayPoint(p0,'yellow');
   // this.displayPoint(p1,'yellow');
    let seg = LineSegment.mk(p0,p1);
    let ln = seg.length();
 //   debugger;
    let lseg = seg.lengthenBy(1.5);
    let nln = lseg.length();
    segs.push(lseg);
  }
  return segs;
}

LineSegment.anIntersection = function (segs) {
  let seg = this;
  let ln = segs.length;
  for (let i=0;i<ln;i++) {
    let sseg = segs[i];
    //let isct = this.intersectLineSegs(seg,sseg);
    let isct = seg.intersect(sseg);
    if (isct) {
      return isct;
    }
  }
}  

rs.intersect2segSets = function (segs1,segs2) {
  let ln = segs1.length;
  for (let i=0;i<ln;i++) {
    let seg = segs1[i];
    //let isct = this.intersectLineSegs(seg,sseg);
    let isct = seg.anIntersection(segs2);
    if (isct) {
      return isct;
    }
  }
}  

rs.lineCount = 0;
rs.displayLineSegment = function (sg,stroke) {
  if ((!sg) || (!sg.end0) || (!sg.end1)) {
     debugger;
   }
  let lsg = sg.lengthenBy(3);
  let {end0,end1} = lsg;
  let {lineP,lineCount:lcnt} = this;
  let nm = 'line_'+lcnt;
  this.lineCount = lcnt+1;
  let line = this[nm];
  if (!line) {
    line=this.lineP.instantiate();
    this.set(nm,line);
  }
  line.stroke = stroke;
  line.setEnds(end0,end1);
  line.show();
  line.update();
}

rs.resetDisplayedLines = function () {
  let {lineCount:lc} = this;
  for (let i=0;i<lc;i++) {
    let nm = 'line_'+i;
    let line = this[nm];
    if (line) {
      line.hide();
    }
  }
  this.lineCount = 0;
}
     

rs.pointCount = 0;

rs.displayPoint = function (p,fill) {
  let {circleP,pointCount:pcnt} = this;
  let nm = 'pnt_'+pcnt;
  this.pointCount = pcnt+1;
  let c= this[nm];
  if (!c) {
    c=this.circleP.instantiate();
    this.set(nm,c);
  }
  c.fill = fill;
  c.show();
  c.update();
  c.moveto(p);
}
 
 
rs.rectCount = 0;

rs.displayRectangle = function (r,stroke) {
  let {rectP,rectCount:rcnt} = this;
  let nm = 'r_'+rcnt;
  this.rectCount = rcnt+1;
  let {corner,extent} = r;
  let {x:cx,y:cy} = corner;
  let {x:ex,y:ey} = extent;;
  let rect =rectP.instantiate();
  rect . width = ex;
  rect . height = ey;
  rect.stroke= stroke;
  let p = Point.mk(cx+0.5*ex,cy+0.5*ey);
  this.set(nm,rect);
  rect.show();
  rect.update();
  rect.moveto(p);
}
  


rs.intersectRectangle  = function (rect1,rect2) {
  //debugger;
 // this.displayRectangle(rect1,'red');
 // this.displayRectangle(rect2,'red');
  let {corner:crn1,extent:ext1} = rect1;
  let {corner:crn2,extent:ext2} = rect2
  let {x:lwx1,y:lwy1} = crn1;
  let {x:lwx2,y:lwy2} = crn2;
  let {x:extx1,y:exty1} = ext1;
  let {x:extx2,y:exty2} = ext2;
  let hx1 = lwx1+extx1;
  let hx2 = lwx2+extx2;
  let hy1 = lwy1+exty1;
  let hy2 = lwy2+exty2;
  if ((hx2<lwx2) || (hy2<lwy2)) {
    return;
  }
  if ((hx1<lwx1) || (hy1<lwy1)) {
    return;
  }
  let lwx = Math.max(lwx1,lwx2);
  let lwy = Math.max(lwy1,lwy2);
  let hx = Math.min(hx1,hx2);
  let hy = Math.min(hy1,hy2);
  let extx = hx-lwx;
  let exty = hy-lwy;
  let rr = Rectangle.mk(Point.mk(lwx,lwy),Point.mk(extx,exty));
 // this.displayRectangle(rr,'blue');
  return rr;
}


rs.intersectPointSets = function (pnts1,pnts2) {
//  debugger;
  let box1 = this.containingBox(pnts1);
  let box2 = this.containingBox(pnts2);
  let box = this.intersectRectangle(box1,box2);
  let sgs1 = this.containedSegs(box,pnts1);
  sgs1.forEach((seg) => {
    this.displayLineSegment(seg,'rgba(0,0,255,.5)');
  });
  let sgs2= this.containedSegs(box,pnts2);
  sgs2.forEach((seg) => {
    this.displayLineSegment(seg,'rgba(255,255,0,.5)');
  });
  let isct = this.intersect2segSets(sgs1,sgs2);
  if (isct) {
    this.displayPoint(isct,'cyan');
  }
  return isct;
}
  
rs.maxLength = function (pnts) {
  return this.maxf(pnts,(p)=>p.length()); 
}
   
rs.polylineCnt = 0;
rs.lineCnt = 0;
rs.displayPolyline = function (pnts) {
  let {polylineCnt:cnt} = this;
  let ln = pnts.length;
  let nm = 'p_'+cnt;
  let ply = this[nm];
  if (!ply) {
    ply = this.polylineP.instantiate();
    this.set(nm,ply);
  }
  ply.wayPoints = pnts;
  ply.update();
  ply.show();
  this.polylineCnt = cnt+1;
}



rs.polygonCnt = 0;


rs.displayPolygon = function (pnts,fill) {
  let {polygonCnt:cnt} = this;
  let ln = pnts.length;
  let nm = 'p_'+cnt;
  let ply = this[nm];
  if (!ply) {
    ply = this.polygonP.instantiate();
    this.set(nm,ply);
  }
  ply.corners = pnts;
  if (fill) {
    ply.fill = fill;
  }
  ply.update();
  ply.show();
  this.polygonCnt = cnt+1;
}

/*
rs.displayPolyline = function (pnts) {
  let {lineCnt:cnt} = this;
  debugger;
  let ln = pnts.length;
  let ccnt = cnt;
  for (let i=0;i<ln-1;i++) {
    let p = pnts[i];
    let nm = 'line_'+(cnt+i);
    let ln = this[nm];
    if (!ln) {
      ln = this.lineP.instantiate();
      this.set(nm,ln);
      ln.setEnds(pnts[i],pnts[i+1]);
      ln.show();
      ccnt++;
      }
  }
  this.lineCnt = ccnt;
}*/


export {rs}
  

  