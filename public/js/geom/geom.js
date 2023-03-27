// Copyright 2019 Chris Goad
// License: MIT

//import * as core from "/js/core-1.1.0.min.js";
import * as core from "/js/core-1.1.0.js";

let codeRoot = core.codeRoot;

let geomr = codeRoot.set("geom",core.ObjectNode.mk());
geomr.__builtIn = true;
geomr.set("Point",core.ObjectNode.mk()).__namedType();
let Point = geomr.Point;
let geometricObject; // defined up in dom by defineGeometric

const isGeometric = function (nd) {
  return core.ArrayNode.isPrototypeOf(nd) || (geometricObject && geometricObject.isPrototypeOf(nd));
}


Point.mk = function (x,y) {
  let rs = Object.create(Point);
  if (typeof x==="number") {
    rs.x = x;
    rs.y = y;
  } else {
    rs.x = 0;
    rs.y =0;
  }
  return rs;
}

Point.equals = function (p) {
   let {x:thx,y:thy} = this;
   let {x,y} = p;
   return (x===thx) && (y===thy);
}
/*
const rotationMatrix  = function (th) {
	let r00 = Math.cos(th);
	let r10 = -Math.sin(th);
	let r01 = -r10;
	let r11 = r00;
	return [r00,r01,r10,r11];
}
*/
const rotationMatrix  = function (th) {
	let r00 = Math.cos(th);
	let r10 = -Math.sin(th);
	let r01 = -r10;
	let r11 = r00;
	return [r00,r01,r10,r11];
}
Point.rotate =  function (rm) {
	let [r00,r01,r10,r11] = rm;
	let {x,y} = this;
	let rx = r00*x + r01 * y;
	let ry = r10*x + r11 * y;
	return Point.mk(rx,ry);
}
  
Point.nonNegative = function () {
  this.x = Math.max(0,this.x);
  this.y = Math.max(0,this.y);
  return this;
}

Point.hasNaN = function () {
  return isNaN(this.x) || isNaN(this.y);
}

  
  
  // set the property p of this to v construed as a point 
  
core.ObjectNode.__setPoint = function (p,v) {
  let pnt;
  if (v) {
    pnt = toPoint(v);
  } else {
    pnt = Point.mk();
  }
  this.set(p,pnt);
  return pnt;
}



Point.x = 0;
Point.y = 0;



Point.plus = function (q) {
  let p = this;
  return Point.mk(p.x + q.x,p.y + q.y);
};

Point.plusX = function (x) {
  return Point.mk(this.x + x,this.y);
}
  
  
Point.plusY = function (y) {
  return Point.mk(this.x,this.y+y);
}

Point.length = function () {
  let {x,y} = this;
  return Math.sqrt(x*x + y*y);
}

// x might be an array, or a point, or x and y might be numbers
const pointify = function (mkNew,x,y) {
  let p;
  if (x === undefined) {
    p = Point.mk(0,0);
  } else if (typeof y ==="number") {
    p = Point.mk(x,y);
  } else if (core.ArrayNode.isPrototypeOf(x) || Array.isArray(x)) {
    p = Point.mk(x[0],x[1])
  } else {
    p = mkNew?Point.mk(x.x,x.y):x;
  }
  return p;
}



const toPoint = function (x,y) {
  return pointify(0,x,y);
}

Point.copy = function () {
  return Point.mk(this.x,this.y);
}
  
  
Point.copyto = function (src) {
  this.x = src.x;
  this.y = src.y;
  return this; 
}


const newPoint = function (x,y) {
  return pointify(1,x,y);
}

core.ObjectNode.setPointProperty = function (prop,pnt) {
  if (this.__get(prop)) {
    this[prop].copyto(pnt);
  } else {
    this[prop] = pnt.copy();
  }
}

Point.angleOf= function () {
  return normalizeAngle(Math.atan2(this.y,this.x));
}

Point.difference = function (q) {
  let p = this;
  return Point.mk(p.x - q.x,p.y - q.y);
}

Point.directionTo = function (pnt) {
    return pnt.difference(this).normalize();
}
geomr.set("Interval",core.ObjectNode.mk()).__namedType();
let Interval = geomr.Interval;

export {Interval};
Interval.mk = function (lb,ub) {
  let rs = Object.create(Interval);
  rs.lb = lb;
  rs.ub = ub;
  return rs;
}

const mkInterval = function (lb,ub) {
  return Interval.mk(lb,ub);
}

Interval.intersectsInterval = function (intv) {
	let {lb,ub} = this;
	let lb1 = intv.lb;
	let ub1 = intv.ub;
	let ni = (ub < lb1) || (ub1 < lb);
	return !ni;
}

Interval.containsInterval = function (intv) {
	let {lb,ub} = this;
	let {lb:lb1,ub:ub1} = intv;
	let rs = (lb <= lb1) && (ub1 <= ub);
	return rs;
}

Point.setCoords = function (x,y) {
  this.set("x",x);
  this.set("y",y);
}

// if p is null, compute distance from origin
Point.distance = function (p) {
  let vx,vy;
  if (p) {
    vx = this.x - p.x;
    vy = this.y - p.y;
  } else {
    vx = this.x;
    vy = this.y;
  }
  return Math.sqrt(vx*vx + vy * vy);
}

Point.boxcarDistance = function (p) {
	let {x:ax,y:ay} = this;
	let {x:bx,y:by} = p;
	let rs = Math.abs(ax - bx) + Math.abs(ay - by);
	return rs;
}

Point.times = function (f) {
  let p = this;
  return Point.mk(f*p.x,f*p.y);
}


Point.normalize = function () {
  let ln = this.length();
  return Point.mk(this.x/ln,this.y/ln);
}


Point.normal = function () {
  return Point.mk(-this.y,this.x);
}

Point.minus = function () {
  return Point.mk(-this.x,-this.y);
}

Point.dotp = function (p) {
  return this.x * p.x + this.y * p.y;
}
const angleToDirection = function (a) {
  return Point.mk(Math.cos(a),Math.sin(a));
}

const mkRadialPoint = function (r,a) {
  return Point.mk(r*Math.cos(a),r*Math.sin(a));
}


Point.interpolate = function (dst,fc) {
   let d = dst.difference(this);
   let vc  = d.times(fc);
   let rs = this.plus(vc);
   return  rs;
}


Point.toRectangle = function () {
  let {x,y} = this;
  let xt = Point.mk(Math.abs(x),Math.abs(y));
  let cx = (x<0)?x:0;
  let cy = (y<0)?y:0;
  let crn = Point.mk(cx,cy);
  return Rectangle.mk({corner:crn,extent:xt});
}

Point.toString = function () {
  let {x,y} = this;
  return "["+x+","+y+"]";
}

geomr.set("Transform",core.ObjectNode.mk()).__namedType();

let Transform = geomr.Transform
// every transform will have all three of scale, rotation,translation defined.
// scale might be scale or a point. In the latter case, the scaling in  x and y are the scale's coordinates.
Transform.mk = function (o,scale,rotation) {
  let rs = Object.create(Transform);
  let otranslation,oscale,orotation;
  rs.scale = 1;
  rs.rotation = 0;
  if (!o) {
    rs.set("translation",Point.mk());
    return rs;
  }
  if (Point.isPrototypeOf(o)) {
    rs.set('translation',o.copy());
    if (typeof scale === 'number') {
      rs.scale = scale;
    } else if  (Point.isPrototypeOf(scale)) {
      rs.set('scale',scale.copy());
    }
    if (typeof rotation === 'number') {
      rs.rotation = rotation;
    }
    return rs;
  }
  otranslation = o.translation;
  if (otranslation) {
    rs.set('translation',otranslation.copy());
  }
  oscale = o.scale;
  if (typeof oscale === "number") {
    rs.scale = oscale;
  } else if  (Point.isPrototypeOf(oscale)) {
      rs.set('scale',oscale.copy());
  }
  orotation = o.rotation;
  if (typeof orotation === "number") {
    rs.rotation = orotation;
  } 
  return rs;
}

Transform.copyto = function (xf) {
  this.scale = xf.scale;
  this.rotation = xf.rotation;
  this.translation.copyto(xf.translation);
}

Transform.hasNaN = function() {
  if (isNaN(this.scale)) {
    return true;
  }
  if (isNaN(this.rotation)) {
    return true;
  }
  let tr = this.translation;
  if (tr) {
    return tr.hasNaN();
  }
}


const normalizeAngle = function (a) { // normalize to between 0 and 2*Pi
  let m = a%(Math.PI*2);
  if (m < 0) {
    m = m + Math.PI*2;
  }
  return m;
}
  
// see __draw: __properties translation (a point), subject and optionally scale,rotation (later matrix xform)
// if the subject is another translation

  
  
const mkRotation = function (r) {
  let trns =  Transform.mk();
  trns.rotation = r;
  return trns;

}

// x might be a point; this is in the object's own coord system
const mkTranslation = function (x,y) {
  let p = newPoint(x,y);
  let trns = Transform.mk({translation:p});
  return trns;
}

const mkScaling = function (s) {
  let trns = Transform.mk();
  trns.scale = s;
  return trns;
}
  
// move to a given location where x,y are in global coords
const movetoInGlobalCoords = function (nd,x,y) { // only for points for now; inputs are in global coordinates
  let p = toPoint(x,y);
  let lp = nd.toLocalCoords(p);//desired position of this relative to its parent
  // we want to preserve the existing scaling
  let xf = nd.transform;
  let o = {};
  if (xf) {
    xf.translation.setTo(lp);
  } else {
    o.translation = lp;
    let trns = Transform.mk(o);
    nd.set("transform",trns);
  }
  if (nd.realizeTransform) {
    nd.realizeTransform();
  }
}

  
Transform.inverse =  function () {
  let s = this.scale;
  let ns,nsx,nsy,tr,nx,ny;
  if (!s) {
    s = 1;
  }
  if (typeof s === "number") {
    ns = 1/s;
    nsx = ns;
    nsy = ns;
  } else {
    nsx = 1/(s.x);
    nsy = 1/(s.y);
    ns = Point.mk(nsx,nsy);
  }
  tr = this.translation;
  if (tr) {
    nx = -(tr.x) * nsx;
    ny = -(tr.y) * nsy;
    return Transform.mk({scale:ns,translation:Point.mk(nx,ny)});
  } else {
    return Transform.mk({scale:ns});
  }
  }

   
Point.applyTransform = function (tr) {
 // order: rotation,scaling  translation
 let trns = tr.translation;
 let tx = trns.x,ty = trns.y;
 let sc = tr.scale;
 let scx,scy,rt,x,y,s,c,rx,ry,fx,fy;
 if (sc === undefined) {
    scx = scy = 1;
 } else if (typeof sc === "number") {
   scx = scy = sc;
 } else {
   scx = sc.x;
   scy = sc.y;
 }
 rt = tr.rotation;
 ({x,y} = this);
 if (rt === 0) {
   rx = x;
   ry = y;
 } else {
   s = Math.sin(rt);
   c = Math.cos(rt);
   rx = c*x - s*y;
   ry = s*x + c*y;
 }
 fx = scx*rx + tx;
 fy = scy*ry + ty;
 return Point.mk(fx,fy);
}

Transform.apply = function (p) {
  return p.applyTransform(this);
}

Transform.applyInverse = function (p) {
  // reverse order: translation, scaling, rotation
  let trns = this.translation;
  let sc = this.scale;
  let rt = this.rotation;
  let px = p.x - trns.x;
  let py = p.y - trns.y;
  let isc = 1/sc;
  let s,c,fx,fy;
  px = px * isc;
  py = py * isc;
  if (rt === 0) {
    fx = px;
    fy = py;
  } else {
    s = Math.sin(-rt);
    c = Math.cos(-rt);
    fx = c*px - s*py;
    fy = s*px + c*py;
  }
 
  return Point.mk(fx,fy);
}

Point.applyInverse = function (tr) {
  return tr.applyInverse(this);
}

Transform.applyToPoints = function (pnts) {
  let rs = core.Array.mk();
  let thisHere = this;
  pnts.forEach(function (p) {
    rs.push(p.applyTransform(thisHere));
  });
  return rs;
}
    
const toCoords = function (nd,p) {
  let xf = nd.__get("transform");
  if (xf) {
    return xf.applyInverse(p);
  } else {
    return p;
  }
}

const toParentCoords = function (nd,p) {
 return nd.toLocalCoords(p);
}
  
// ip in nd's own coordinates
const toOwnCoords = function (nd,ip) {
  let p = nd.toLocalCoords(ip);
  let xf = nd.__get("transform");
  if (xf) {
    p = xf.applyInverse(p);
  }
  return p;
}


 const translateX = function (nd,x) {
  let xf = nd.transform;
  if (xf) {
    xf.translation.x =x;
    return;
  }
  xf = mkTranslation(x,0);
  nd.set("transform",xf);
}


 const translateY = function (nd,y) {
  let xf = nd.transform;
  if (xf) {
    xf.translation.y =y;
    return;
  }
  xf = mkTranslation(0,y);
  nd.set("transform",xf);
}
  



const rotate = function (nd,r) {
  let xf = nd.transform;
  if (xf) {
    xf.rotation = r;
    return xf;
  }
  xf = mkRotation(r);
  nd.set("transform",xf);
}

    
    
Point.setTo = function (src) {
  this.x = src.x;
  this.y = src.y;
}

Point.setXY = function (x,y) {
  if (y === undefined) { // assume the one arg is a point
    this.x = x.x;
    this.y = x.y;
  } else { 
    this.x = x;
    this.y = y;
  }
}


geomr.set("Ray",core.ObjectNode.mk()).__namedType();


let Ray = geomr.Ray;

Ray.mk = function (point,vector) {
  let rs = Object.create(Ray);
  rs.point = point;
  rs.vector = vector;
  return rs;
}

/*intersecting Rays A and B


let SLA = vay/vax;
SLB = vby/vbx;
suppose you go t units along a then that will get you SLA*t units up. and SLB units down. we are going up at SLA/SLB times as fast from A as we are down from B. Let R = SLA/SLB. The meeting spot will have (y-Ay) =  -R * (By -y); thus 

y * (1 - R) = Ay- R*By;
y * (1 + R) = Ay+ R*By;
y * (1 - R) = Ay-  R*By;

y = (Ay -  R*By)/(1 - R);
y = (Ay + R*By)/(1 - R);

Then (x,y) = t*vax + Ax,t*vay + Ay)
y = t*vay + Ay;
t = (y-Ay)/vay
x = t*vax + Ax;

SLB === 0 case:
y = vby;
t = (y - Ay)/vay = (
*/


Ray.intersectRay = function (RB) {
 // let A = this;
 //debugger;
  let {point:A,vector:vA}  = this;
  let {point:B,vector:vB}  = RB;
  let {x:Ax,y:Ay} = A;
  let {x:Bx,y:By} = B;
  let {x:vax,y:vay} = vA;
  let {x:vbx,y:vby} = vB;
  let SLA = vay/vax;
  let SLB = vby/vbx;
  let y;
  if (SLB === 0) {
    if (SLA === 0) {
      return undefined;
    }
    y = By;
  } else {
    let R = SLA/SLB;
    if (R === 1) {
      return undefined;
    }
    y = (Ay -  R*By)/(1 - R);
  }

  //let y = (Ay + R*By)/(1 - R);
  let t = (y-Ay)/vay
  let x = t*vax + Ax;
 // debugger;
  return Point.mk(x,y);
  //console.log('Ay',Ay,'x',x,'y',y);
}
/*
RA = Window.geom.Ray.mk(Point.mk(0,0),Point.mk(1,1));RB = Window.geom.Ray.mk(Point.mk(0,1),Point.mk(1,-1));RC = RA.intersectRay(RB);
*/

geomr.set("Line",core.ObjectNode.mk()).__namedType();

let Line = geomr.Line;

Line.mk = function (point,direction) {
	let rs = Object.create(Line);
	rs.set('point',point.copy());
	rs.set('direction',direction.copy());
	return rs;
}

Line.toEquation = function () {
	let {direction,point} = this;
	let {x:dx,y:dy} = direction;
	let {x:px,y:py} = point;
	let m = 0;
	let im = 0;
	if (Math.abs(dx) > 0.0001) {
	  m = dy/dx;
	}
	if (Math.abs(dy) > 0.0001) {
	  im = dx/dy;
	}
	let a,b,c;
	if (Math.abs(m) > Math.abs(im)) {
		a = -m;
		b = 1;
		c = m*px-py
	} else {
		a = 1;
		b = -im;
		c = im*py-px
	}
	return {a,b,c};
}
// needs fixing - does not work
Line.nearestPoint = function (p) {
	//debugger;
	let {point} = this;
  let {direction} = this;
	let tpnt = point.plus(direction);
	let {x:px,y:py} = point;
	let eqn = this.toEquation();
	let {a,b,c} = eqn;
	let xx0 = a*px + b*py + c;
	let xx1 = a*tpnt.x + b* tpnt.y + c;
	//let {a,b,c} = eqn;
	let {x,y} = p;
	let xr = (b*(b*x - a*y) - a*c)/(a*a + b*b);
	let yr = (a*(a*y - b*x) - a*c)/(a*a + b*b);
	let xx2 = a*xr + b*yr + c;
	let rs = Point.mk(xr,yr);
	// for checking
	let vec = rs.difference(p);
	let ln = vec.length();
	console.log('ln',ln);
	if (ln > 5) {
	//	debugger;
	}
	return rs;
}
	

	

geomr.set("LineSegment",core.ObjectNode.mk()).__namedType();

let LineSegment = geomr.LineSegment;

LineSegment.mk = function (end0,end1,dontCopy) {
  let rs = Object.create(LineSegment);
  if (!end0) {
    return rs;
  }
  if (dontCopy) {
    rs.set('end0',end0);
    rs.set('end1',end1);
  } else {
    rs.set('end0',end0.copy());
    rs.set('end1',end1.copy());
  }
  return rs;
}


LineSegment.center = function () {
  //debugger;
	let {end0,end1} = this;
  let rs = end0.plus(end1).times(0.5);
  return rs;
}




LineSegment.along = function (fraction) {
	let {end0,end1} = this;
  let vec = end1.difference(end0);
  let rs = end0.plus(vec.times(fraction));
 // let rs2 = end0.plus(end1).times(fraction);
  //console.log('rs1',rs1.x,rs1.y,'rs2',rs2.x,rs2.y);
 // console.log('rs',rs.x,rs.y);
  return rs;
}

LineSegment.toLine = function () {
	let {end0,end1} = this;
	let vec = end1.difference(end0);
	let nvec = vec.normalize();
	let line = Line.mk(end0,nvec);
	return line;
}

LineSegment.nearestPoint = function (p) {
	let line = this.toLine();
	let rs = line.nearestPoint(p);
	return rs;
}

LineSegment.length = function () {
  return (this.end1.difference(this.end0)).length();
}

LineSegment.pointAlong = function (fraction) {
  let end0,end1;
  ({end0,end1} = this);
  let d = end1.difference(end0);
  return end0.plus(d.times(fraction));
}

LineSegment.middle = function () {
  return this.pointAlong(0.5);
}

LineSegment.xBounds = function () {
	let {end0,end1} = this;
	let x0 = end0.x;
	let x1 = end1.x;
	if (x0<x1) {
		return Interval.mk(x0,x1);
	}
	return Interval.mk(x1,x0);
}

LineSegment.yBounds = function () {
	let {end0,end1} = this;
	let y0 = end0.y;
	let y1 = end1.y;
	if (y0<y1) {
		return Interval.mk(y0,y1);
	}
	return Interval.mk(y1,y0);
}

LineSegment.mkAngled = function (p,angle,ln) {
  let vec = Point.mk(Math.cos(angle),Math.sin(angle));
  let svec = vec.times(ln/2);
  let e0 = p.difference(svec);
  let e1 = p.plus(svec);
  return LineSegment.mk(e0,e1);
}
LineSegment.lengthen = function (ln) {
	let {end0,end1} = this;
	let cntr = end0.plus(end1).times(0.5);
	let vc= end1.difference(end0);
  let vln = vc.length();
	let hvc = vc.times(ln*0.5);
	//let nvc = vc.normalize();
	let nvc = vc.times(1/vln);
	let nhvc = hvc.plus(nvc.times(0.5*ln));
	let nend0 = cntr.difference(hvc);
	let nend1 = cntr.plus(hvc);
	return LineSegment.mk(nend0,nend1);
 }

LineSegment.twist = function (da) {
	let {end0,end1} = this;
	let vc= end1.difference(end0);
  let cntr = end0.plus(end1).times(0.5);
  let a = Math.atan2(vc.y,vc.x);
  let vln = vc.length();
  let na = a + da;
  let hvc = Point.mk(Math.cos(na),Math.sin(na)). times(0.5*vln);
	let nend0 = cntr.difference(hvc);
	let nend1 = cntr.plus(hvc);
	return LineSegment.mk(nend0,nend1);
}
LineSegment.onOppositeSides = function (line1) { // the ends of line1 are on opposite sides of this
  let line0 = this;
  let e00 = line0.end0;
  let e01 = line0.end1;
  let e10 = line1.end0;
  let e11 = line1.end1;
  let vec0 = e01.difference(e00);
  let n0 = vec0.normal();
  let e10Toe00 = e10.difference(e00);
  let e11Toe00 = e11.difference(e00);
  let dt0 = e10Toe00.dotp(n0);
  let dt1 = e11Toe00.dotp(n0);
  let sd0 = dt0 >0;
  let sd1 = dt1 <0;
  return sd0 === sd1;
}
/*
LineSegment.intersectsLineSegment = function (line1) {
  let op1 = this.onOppositeSides(line1);
  let op0 = line1.onOppositeSides(this);
  return op1 && op0;
} 
*/
LineSegment.intersectsCircle = function (crc) {
  let {end0:e0,end1:e1} =this;
  let {center:c,radius:r}= crc;
  let de0 = e0.distance(c);
  let de1 = e1.distance(c);
  let e0in = de0<r;
  let e1in = de1<r;
  if ((!crc.isDisk) && e0in && e1in) {
    //debugger;
    return 0;  // crc contains this
  }
  if (e0in !== e1in) {
    return 1;
  }
  if (crc.isDisk && (e0in || e1in)) {
    return 1;
  }
  let vec = e1.difference(e0);
  let n = vec.normal().normalize();
  let cvec = c.difference(e0);
  let d = cvec.dotp(n);
  if (Math.abs(d)>r) {
    return 0;
  }
  let onL;
  let onL0 = c.plus(n.times(d));
  let onL02e0 = onL0.difference(e0);
  let dp0 = onL02e0.dotp(n);
  if (Math.abs(dp0) < 0.0001) {
    onL = onL0;
  } else {    
    let onL1 = c.plus(n.times(-d));
 // let onL12e0 = onL1.difference(e0);
 // let dp1 = onL12e0.dotp(n); 
    onL = onL1;
  }
  let onL2e0 = onL.difference(e0);
  let onL2e1= onL.difference(e1);
  let onL2e0D = vec.dotp(onL2e0);
  let onL2e1D= vec.dotp(onL2e1);
  return (onL2e0D * onL2e1D) <= 0;
}
  


LineSegment.intersectsLineSegment = function (line1) {
  let isct = this.intersect(line1);
  return !!isct;
} 
LineSegment.intersect = function (line1) {
	let verbose = false;
  let line0 = this;
  let x0 = line0.end0.x;
  let y0 = line0.end0.y;
  let x1 = line1.end0.x;
  let y1 = line1.end0.y;
	let e1x0 = line0.end1.x;
	let e1y0 = line0.end1.y;
	let e1x1 = line1.end1.x;
	let e1y1 = line1.end1.y;
  let maxX0 = Math.max(line0.end0.x,line0.end1.x);
  let minX0 = Math.min(line0.end0.x,line0.end1.x);
  let maxX1 = Math.max(line1.end0.x,line1.end1.x);
  let minX1 = Math.min(line1.end0.x,line1.end1.x);
  if ((minX1 > maxX0)||(minX0 > maxX1)) {
		if (verbose) {
			console.log('No Intersect 0 [[',x0,y0,'][',e1x0,e1y0,']] [[',x1,y1,'][',e1x1,e1y1,']]');
		}
    return false;
  }
  let maxY0 = Math.max(line0.end0.y,line0.end1.y);
  let minY0 = Math.min(line0.end0.y,line0.end1.y);
  let maxY1 = Math.max(line1.end0.y,line1.end1.y);
  let minY1 = Math.min(line1.end0.y,line1.end1.y);
  if ((minY1 > maxY0)||(minY0 > maxY1)) {		
	  if (verbose) {
			console.log('No Intersect 1 [[',x0,y0,'][',e1x0,e1y0,']] [[',x1,y1,'][',e1x1,e1y1,']]');
		}

		
    return false;
  }
 
  let n = line0.end1.difference(line0.end0).normalize().normal();
  let nx = n.x;
  let ny = n.y;
  let v1 = line1.end1.difference(line1.end0);
  let length = v1.length();
  let d = v1.times(1/length);
  let dx = d.x;
  let dy = d.y;
  let den = (dx*nx + dy*ny);
  if (Math.abs(den) < 0.001) { // lines are parallel
    let distN0 = line0.end0.dotp(n);
    let distN1 = line1.end0.dotp(n);
		if (Math.abs(distN1-distN0) < 0.001) {
			if (verbose) {
				console.log('Intersect 2 [[',x0,y0,'][',e1x0,e1y0,']] [[',x1,y1,'][',e1x1,e1y1,']]');
			}
			return true;
		} else {
      return false;
		}
  }
  let t = -((y1-y0)*ny + (x1-x0)*nx)/den;
  if ((t<0) || (t > length+0)) {// line1 terminates before it meets line0
		if (verbose) {
			console.log('No Intersect 3 [[',x0,y0,'][',e1x0,e1y0,']] [[',x1,y1,'][',e1x1,e1y1,']]');
		}
    return false;
  }
  let ip = line1.end0.plus(d.times(t));// intersection point
  if (ip.difference(line0.end0).dotp(ip.difference(line0.end1))<=0) {
   // console.log('Intersection!');
    return ip;
  }
	if (verbose) {
		console.log('No Intersect 4 [[',x0,y0,'][',e1x0,e1y0,']] [[',x1,y1,'][',e1x1,e1y1,']]');
	}
  return false;
  
}
/*
LineSegment.intersectsLineSegment = function (seg) {
	return !!this.intersect(seg);
}
*/
LineSegment.distanceTo = function (p) {
  let {end0,end1} = this;
  let vec = end1.difference(end0);
  let vecln = vec.length();
  let nvec = vec.times(1/vecln);
  let nnvec = vec.normal();
  let e0v = nvec.dotp(end0);
  let e1v = nvec.dotp(end1);
  let pv = nvec.dotp(pv);
 //let d = pv - e0v; // distance along vec
 // let between = ((e0v <= pv) && (pv <= e1v)) || ((e1v <= pv) && (pv <= e0v));
  let d;
  let between = ((e0v <= pv) && (pv <= e1v));
  if (between)  {
    let e0nv = nnvec.dotp(end0);
    let pnv = nnvec.dotp(pv);
    d = Math.abs(e0nv-pnv);
  } else {
    let e0d = end0.distance(p);
    let e1d = end1.distance(p);
    d = Math.min(e0d,e1d);
  }
  return d;
}

const separation1  = function (ths,seg) {
  let {end0:t0,end1:t1} = ths;
  let tvec = t1.difference(t0);
  let tvecln = tvec.length();
  let ntvec = tvec.times(1/tvecln);
  let nntvec = tvec.normal();
  let t0v = ntvec.dotp(t0);
  let t1v = ntvec.dotp(t1);
  let {end0:e0,end1:e1} = seg;
  let e0v = ntvec.dotp(e0);
  let e1v = ntvec.dotp(e1);
  if (e0v > e1v) {
    let tmp = e0v;
    e0v = e1v;
    e1v = tmp;
  }
  let e0beyondt1 = e0v >= t0v;
  if (e0beyondt1) {
    let e0distt1 = e0.distance(t1);
    let e1distt1 = e1.distance(t1);
    return Math.min(e0distt1,e1distt1);
  }
  let e1beforet0 = e1v <= t0v;
  if (e1beforet0) {
    let e0distt0 = e0.distance(t0);
    let e1distt0 = e1.distance(t0);
    return Math.min(e0distt0,e1distt0);  
  }
  const distToPoint = function (p) {
     let tv = nntvec.dotp(e0);
     let pv = nntvec.dotp(p);
     return Math.abs(tv-pv);
  }
  let p0,pi;
  let evec = e1.difference(e0);
  if ((t0v<e1v) && (e1v <t1v)) {
     let fr = (t0v-e0v)/(e1v - e0v);
     let p = e0.plus(evec.times(fr));
     let d0 = distToPoint(p);
     let d1 = distToPoint(e1);
     return Math.min(d0,d1);
  }
  let fr = (t1v-e0v)/(e1v - e0v);
  let p = e0.plus(evec.times(fr));
	let d0 = distToPoint(p);
	let d1 = distToPoint(e0);
	return Math.min(d0,d1);
}

LineSegment.separation = function (seg) {
  let sep0 = separation1(this,seg);
  let sep1 = separation1(seg,this);
  return Math.min(sep0,sep1);
}
      
LineSegment.allIntersections = function (segs) {
	let rs = [];
	segs.forEach( (seg) => {
		if (seg === this) {
			return;
		}
	  let intr = this.intersect(seg);
		if (intr) {
		  rs.push([intr,seg]);
		}
	});
	let {end0,end1} = this;
	let vec = end1.difference(end0);
	let {x,y} = vec;
	let orderByX = Math.abs(x) > Math.abs(y);
	let reverse = orderByX?x<0:y<0;
	const compare = function (a,b) {
		let va = orderByX?a[0].x:a[0].y;
		let vb = orderByX?b[0].x:b[0].y;
		if (reverse) {
			let tmp = va;
			va = vb;
			vb = tmp;
		}
		if (va < vb) {
			return -1;
		} else if (va === vb) {
			return 0;
		} else {
			return 1;
		}
	}
	rs.sort(compare);
	return rs;

};

Line.sortIntersections = function (intrs,orderBy) {
	let rs = intrs.map((x) => x);
	let compare = function (a,b,orderBy) {
		let av = orderBy==='x'?a[0].x:a[0].y;
		let bv = orderBy==='y'?a[0].x:a[0].y;
		if (av < bv) return -1;
		if (av === bv) return 0;
		return 1;
	}
	rs.sort(compare);
}

let Circle = geomr.set("Circle",core.ObjectNode.mk()).__namedType();


Circle.mk = function(icenter,iradius) {
  let center,radius;
  if (iradius === undefined) {
    radius = icenter;
    center = Point.mk(0,0);
  } else {
    center = icenter;
    radius = iradius;
  }
  let rs = Object.create(Circle);
  rs.set('center',center.copy());
  rs.radius = radius;
  rs.isDisk = 1;
  return rs;
}

Circle.intersectsCircle = function (crc) {
	let {center:tc,radius:tr} = this;
	let {center:cc,radius:cr} = crc;
	let d = tc.distance(cc);
	if (d > (tr + cr)) {
    return 0;
  }
  //if ((!crc.isDisk) && ((d+cr)<tr)) {
  if ((!crc.isDisk) && ((d+tr)<cr)) {
     if (crc.index !== undefined) {
      //  debugger;
     }
    return null; // crc contains this
  }
  // if ((!this.isDisk) && ((d+tr)<cr)) {
   if ((!this.isDisk) && ((d+cr)<tr)) {
    return 0; // this contains crc
  }
  return 1;
}
    

Circle.intersects = function (target) {
   if (!target) {
     return 0;
   }
  if (Circle.isPrototypeOf(target)) {
    return this.intersectsCircle(target);
  }
  if (LineSegment.isPrototypeOf(target)) {
    return target.intersectsCircle(this);
  }
   if (Rectangle.isPrototypeOf(target)) {
    return target.intersectsCircle(this);
  }
}
	
Circle.intersectLine = function (point,vec) {
  let px = point.x;
  let py = point.y;
  let center = this.center;
  let r = this.radius;
  let cx = center.x;
  let cy = center.y;
  let vx = vec.x;
  let vy = vec.y;
  let qx = px-cx;
  let qy = py-cy;
  /* (qx + t*vx)*(qx + t*vx) + (qy + t*vy)*(qy + t*vy) = r*r
  qx*qx + 2*t*vx*qx + t*t*vx*vx + qy*qy + 2*t*vy*qy + t*t*vy*vy 
  
  qy*qy + t * 2*(qx*vx +  qy*vy) + t*t * (vx + vy) = r*r */
  let a =  vx*vx + vy*vy;
  let b = 2*(qx*vx + qy*vy);
  let c = qx*qx + qy*qy - r*r;
  let sqz = b*b - 4*a*c;
  if (sqz <= 0) {
    return undefined;
  }
  let z = Math.sqrt(sqz);
  let t0 = (z - b)/(2*a);
  let t1 = -(z+b)/(2*a);
  let s0 = point.plus(vec.times(t0));
  let s1 = point.plus(vec.times(t1));
  let d0 = s0.distance(center);
  let d1 = s1.distance(center);
  return [s0,s1];
}

Circle.containsCircle = function (circle) {
  let Cr = this.radius;
  let cr = c.radius;
  let Cc = this.center;
  let cc = c.center;
}
Circle.containsPoint = function (point) {
  if (!point) {
   debugger;
  }
  let v = point.difference(this.center);
  let {x,y}= v;
  let r = this.radius;
  return (x*x + y*y) < r*r;
}

Circle.containsRectangle = function (rect) {
  let corners = rect.corners();
  for (let i=0;i<4;i++) {
    if (!this.containsPoint(corners[i])) {
      return 0;
    } 
  }
  return 1;
 }
 
Circle.containsLineSegment = function (s,p) {
  if (p) {
    return this.contains(s.end0.plus(p)) && this.contains(s.end1.plus(p));
  }
  return this.contains(s.end0) && this.contains(s.end1);
}



Circle.contains = function (g,p) {
//debugger;
 if (Point.isPrototypeOf(g)) {
   return this.containsPoint(g);
 }
 if (LineSegment.isPrototypeOf(g)) {
   return this.containsLineSegment(g,p);
 }
 /*if (Rectangle.isPrototypeOf(g)) {
   return this.containsRectangle(g);
 }*/
}
geomr.set("Arc",core.ObjectNode.mk()).__namedType();
let Arc = geomr.Arc;
 

// two argument forms: center, angle0, angle1, or end0,end1,radius
Arc.mk = function (center,angle0,angle1,radius) {
	let rs = Object.create(Arc);
	if (typeof angle0 === 'number') {
	  rs.center = center;
		rs.angle0 = angle0;
		rs.angle1 = angle1;
		rs.radius = radius;
	} else {
		let a = center;
		let b = angle0;
		let rv = angle1;
		let r = Math.abs(rv);
		let vec = b.difference(a);
		let ln = vec.length();
		let c = a.plus(vec.times(0.5));
	  let excess = r -  (ln/2);
		let vnrm = vec.times(1/ln);
		let nrm = vnrm.normal();
	  let cntr =c.plus(nrm.times(rv>0?excess:-excess));
		rs.set('center',cntr);
		let avec = a.difference(cntr);
		let bvec = b.difference(cntr);
		if  (1 || (r > 0)) {
		  rs.angle0 = Math.atan2(avec.y,avec.x);
		  rs.angle1 = Math.atan2(bvec.y,bvec.x);
		} else {
			rs.angle1 = Math.atan2(avec.y,avec.x);
		  rs.angle0 = Math.atan2(bvec.y,bvec.x);
		}
		rs.radius = Math.abs(r);
	}
	return rs;
}

Arc.pointAlong = function (fr) {
	let {center,angle0,angle1,radius} = this;
	let angle = angle0 + fr*(angle1-angle0);
	let vec = Point.mk(Math.cos(angle),Math.sin(angle));
  let rs = center.plus(vec.times(radius));
	return rs;
}

geomr.set("Rectangle",core.ObjectNode.mk()).__namedType();
let Rectangle = geomr.Rectangle;
// takes corner,extent or {corner:c,extent:e,style:s} style being optional, or no args
// Rectangles without styles are often used for purely computational purpose - never drawn.
Rectangle.mk = function (a0,a1) {
  let rs = Object.create(Rectangle);
  let c,e,style;
  if (!a0) {
    return rs;
  }
  if (a1) {
    c = a0;
    e = a1;
  } else {
    if (a0.style) {
      style = core.draw.Style.mk();
      rs.set("style",style);
      core.extend(style,a0.style);
    }
    c = a0.corner;
    e = a0.extent;
  }
  rs.__setPoint("corner",c);
  rs.__setPoint("extent",e);
  return rs;
}

Rectangle.mkCentered = function (icenter,iextent) {
  let center,extent;
  if (iextent === undefined) {
    center = Point.mk(0,0);
    extent = icenter;
  } else {
    center = icenter;
    extent = iextent;
  }
	let {x,y} = extent;
	let {x:cx,y:cy} = center;
	let corner = Point.mk(cx-0.5*x,cy - 0.5*y);
	let rs = Rectangle.mk(corner,extent);
	return rs;
}

  
Rectangle.toString = function () {
  let corner,extent;
  ({corner,extent} = this);
  return '[['+corner.x+','+corner.y+'],['+extent.x+','+extent.y+']]';
}

Rectangle.hasNaN = function () {
  let crn = this.corner;
  let xt = this.extent;
  if (crn) {
    if (isNaN(crn.x) || isNaN(xt.y)) {
      return true;
    }
  }
  if (xt) {
    if (isNaN(xt.x) || isNaN(xt.y)) {
      return true;
    }
  }
}


Rectangle.addSides = function () {
  let hw,hh;
	let {corner,extent} = this;
	hw = (extent.x)/2;
	hh = (extent.y)/2;
	let {x:cx,y:cy} = corner;
	let {x:ex,y:ey} = extent;
  let UL = Point.mk(cx,cy)
  let UR = Point.mk(cx+ex,cy)
  let LL = Point.mk(cx,cy+ey)
  let LR  = Point.mk(cx+ex,cy+ey);
  let sides = this.set('sides',core.ArrayNode.mk());
  sides.push(geom.LineSegment.mk(UL,UR));
	sides.push(geom.LineSegment.mk(UR,LR));
  sides.push(geom.LineSegment.mk(LR,LL));
  sides.push(geom.LineSegment.mk(LL,UL));
  return sides;
}


Rectangle.set("corner",Point.mk());
Rectangle.set("extent",Point.mk(1,1));

Rectangle.corners = function () {
  let rs = [];
  let c = this.corner;
  let cx = c.x,cy = c.y;
  let xt = this.extent;
  let xtx = xt.x;
  let xty = xt.y;
  // right hand rule
  rs.push(Point.mk(cx+xtx,cy+xty));
  rs.push(Point.mk(cx+xtx,cy));
  rs.push(c);
  rs.push(Point.mk(cx,cy+xty));
  return rs;
}


Rectangle.labeledCorners = function () {
  let {x:cx,y:cy} = this.corner;
  let {x:ex,y:ey} = this.extent;
  let rs = {UL:Point.mk(cx,cy),UR:Point.mk(cx+ex,cy),LL:Point.mk(cx,cy+ey),LR:Point.mk(cx+ex,cy+ey)};
  return rs;
}

Rectangle.xBounds = function () {
	let {corner,extent} = this
	let lb = corner.x;
	let ub = corner.x + extent.x;
	return Interval.mk(lb,ub);
}
Rectangle.yBounds = function () {
	let {corner,extent} = this
	let lb = corner.y;
	let ub = corner.y + extent.y;
	return Interval.mk(lb,ub);
}

Rectangle.intersectsRectangle = function (rect) {
	let xb0 = this.xBounds();
	let xb1 = rect.xBounds();
	let yb0 = this.yBounds();
	let yb1 = rect.yBounds();
	let xi = xb0.intersectsInterval(xb1);
	let yi = yb0.intersectsInterval(yb1);
  let rs;
  if (this.isSolid) {
	  rs = xi && yi;
    return rs;
  }
  let thisContainsRect = xb0.containsInterval(xb1) && yb0.containsInterval(yb1);
  let rectContainsThis = xb1.containsInterval(xb0) && yb1.containsInterval(yb0);
  rs = xi && yi && !thisContainsRect && !rectContainsThis;
	return rs;
}

Rectangle.intersectsCircle = function (crc) {
  let corners = this.corners();
  let cr = crc.containsRectangle(this);
  if (cr) {
    return  this.isSolid;
  }
  let {center,radius} = crc;
  let {x:cx,y:cy} = center;
  let {corner,extent}  = this;
  let {x:ilbx,y:ilby} = corner;
  let farCorner = corner.plus(extent);
  let {x:iubx,y:iuby} = farCorner;
  let lbx = (ilbx<iubx)?ilbx:iubx;
  let ubx = (ilbx<iubx)?iubx:ilbx;
  let lby = (ilby<iuby)?ilby:iuby;
  let uby = (ilby<iuby)?iuby:ilby;
  let lcx = cx - radius;
  let lcy = cy - radius;
  let ucx = cx + radius;
  let ucy = cy + radius;
  let abvubx = lcx > ubx;
  let abvuby = lcy > uby;
  let blwlbx = ucx < lbx;
  let blwlby = ucy < lby;
  if (abvubx || abvuby || blwlbx || blwlby) {
    return 0;
  } 
  if (this.isSolid) { 
    return 1;
  }
  let abvlbx = lcx > lbx;
  let abvlby = lcy > lby;
  let blwubx = ucx < ubx;
  let blwuby = ucy < uby;
 
   // console.log('lbx',lbx,'ubx',ubx,'lcx',lcx,'ucx',ucx,'lby',lby,'uby',uby,'lcy',lcy,'ucy',ucy);
  return !(abvlbx && abvlby && blwubx && blwuby); // the circle is not inside the rectangle
  //return !abvx && !abvy && !blwx && !blwy; // the circle is inside the rectangle
}

Rectangle.intersectsLineSegment = function (seg) {
	let xb0 = this.xBounds();
	let yb0 = this.yBounds();
	let xb1 = seg.xBounds();
	let yb1 = seg.yBounds();
	if ((!xb0.intersectsInterval(xb1))&& (!yb0.intersectsInterval(yb1))) {
		return false;
	}
	let {end0,end1} = seg;
	if (this.contains(end0)||this.contains(end1)) {
		return true;
	}
// now the hard case
  let sides = this.sides();
	//debugger;
	let rs = seg.intersect(sides[0])&& seg.intersect(sides[1])&& seg.intersect(sides[2])&& seg.intersect(sides[3]);
  return rs;
}
 Rectangle.intersects = function (g) {
   if (!g) {
     return 0;
   }
	 if (Rectangle.isPrototypeOf(g)) {
		 return this.intersectsRectangle(g);
	 } 
   if (LineSegment.isPrototypeOf(g)) {
		 return this.intersectsLineSegment(g);
	 }  
   if (Circle.isPrototypeOf(g)) {
		 return this.intersectsCircle(g);
	 } 
	 error('unsupported case for Rectangle.intersects');
 }

LineSegment.intersects = function (g) {
    if (!g) {
     return 0;
   }
	 if (Rectangle.isPrototypeOf(g)) {
		 return g.intersectsRectangle(this);
	 } 
   if (LineSegment.isPrototypeOf(g)) {
		 return this.intersectsLineSegment(g);
	 } 
   if (Circle.isPrototypeOf(g)) {
		 return this.intersectsCircle(g);
	 }   
	 error('unsupported case for LineSegment.intersects');
}
/*
const geometriesIntersect0 = function (g,gs) {
  let ln = gs.length;
  for (let i=0;i<ln;i++) {
    let gi = gs[i];
    if (g.intersects(gi)) {
      return 1;
    }
   }
   return 0;
 }
 
 */
 /* g must interesect at least n+ 1 member of gs for a non-zero result to be returned */
const geometriesIntersect0 = function (g,gs,n=0) {
  let ln = gs.length;
  let cnt = 0;
  let containments =[];
  for (let i=0;i<ln;i++) {
    let gi = gs[i];
    let ig = g.intersects(gi);
    if ((ig === null)&&(gi.index)) {
      containments.push(gi);
    }
    if (ig) {
      cnt ++;
    }
    if (cnt>n) {
      return cnt;
    }
  }
  return containments.length>0?containments:0;
 }
  // return the min(number of intersections,n+1)
 
const geometriesIntersect = function (gs0,gs1,n=0) {
  let ln = gs0.length;
  let cnt = 0;
  let containments = [];
  for (let i=0;i<ln;i++) {
    let gi = gs0[i];
    let ig = geometriesIntersect0(gi,gs1,n-cnt);
     if (typeof ig !== 'number') {
      containments.push.apply(containments,ig);
    }
    cnt += ig;
    if (cnt > n) {
      return cnt;
    }
  }
  let lc = containments.length;
  if (lc) {
   //  debugger;
  }
  return lc?containments:0;
 }
   

Rectangle.sides = function () {
  let corners = this.corners();
  let rs = [];
  rs.push(LineSegment.mk(corners[0].copy(),corners[1].copy()));
  rs.push(LineSegment.mk(corners[1].copy(),corners[2].copy()));
  rs.push(LineSegment.mk(corners[2].copy(),corners[3].copy()));
  rs.push(LineSegment.mk(corners[3].copy(),corners[0].copy()));
  return rs;
}



Rectangle.labeledSides = function () {
  let corners = this.labeledCorners();
  let sides = {};
  sides.right = LineSegment.mk(corners.UR,corners.LR);
  sides.left = LineSegment.mk(corners.UL,corners.LL);
  sides.top = LineSegment.mk(corners.UL,corners.UR);
  sides.bottom = LineSegment.mk(corners.LL,corners.LR);
  return sides;
}
  
const pointArrayToLineSegments = function (ar) {
  let ln = ar.length;
	let rs = [];
	for (let i=0;i<ln-1;i++) {
		let lns = LineSegment.mk(ar[i],ar[i+1]);
		rs.push(lns);
	}
	return rs;
}
// The point is some point outide the rectangle. This determines where a ray from the center with the given direction 
// intersects the rectangle. Used in graph construction interface. Could be optimized in several ways
// retuns {interesection:Point,side:integer,sideFraction:real}. sideFraction is the fraction  of the way along the side
// at which the interesection point appears.
let rp_time = 0;

Rectangle.peripheryAtDirection = function(direction) {
  let tms = Date.now();
  let sides = this.sides();
  let dim = 2*Math.max(this.extent.x,this.extent.y);
  let center = this.center();
  let line = LineSegment.mk(center,center.plus(direction.times(dim)));
  for (let i=0;i<4;i++) {
    let side = sides[i];
    let intersection = line.intersect(sides[i]);
    if (intersection) {
      let fractionAlong =  ((intersection.difference(side.end0)).length())/(side.length());
      rp_time += Date.now() - tms;
      return {intersection,side:i,sideFraction:fractionAlong};
    }
  }
}

Rectangle.intersectLineSegment = function (ls) {
  let {end0,end1} = ls;
  let c0 = this.containsPoint(end0);
  let c1 = this.containsPoint(end1);
  if (c0&&c1) {
    return ls;
  }
 // if (!(c0 || c1)) {
  //   return ls;
 // }
  //debugger;
  let sides = this.sides();
  let icnt = 0;
  const toLS = function (intersection) {
    let e0 = c0?end0:end1;
    let e1 = intersection;
    let rs = LineSegment.mk(e0,e1);
    return rs;
  }
  if (c0 !== c1) {
    for (let i=0;i<4;i++) {
      let intr = ls.intersect(sides[i]);
      if (intr) {
        return toLS(intr);
      }
    }
  }
  let cnt = 0;
  let i0,i1;
  for (let i=0;i<4;i++) {
    let intr = ls.intersect(sides[i]);
    if (intr) {
      if (cnt === 0) {
        i0 = intr;
        cnt = 1;
      } else {
        i1 = intr;
        return LineSegment.mk(i0,i1);
      }
    }
  }
  return ls;
}

   
  
  
Rectangle.alongPeriphery = function (edge,fraction) {
  let sides = this.sides();
  let side = sides[edge];
  return side.pointAlong(fraction);
}


Rectangle.expandBy = function (x,y) {
  let xt = this.extent;
  let c = this.corner;
  let nex = xt.x + x;
  let ncx = c.x - 0.5*x;
  let ney =  xt.y + y;
  let ncy =  c.y -0.5*y;
  return Rectangle.mk(Point.mk(ncx,ncy),Point.mk(nex,ney));
}

  
// expand the extent of this to at least x in x and y in y

Rectangle.expandTo = function (x,y) {
  let xt = this.extent;
  let xx = (xt.x < x)?(x-xt.x):0;
  let yx = (xt.y < y)?(y-xt.y):0;
  if ((xx === 0) && (yx === 0)) {
    return  this;
  }
  return this.expandBy(xx,yx);
}
  

// the bounding rectangle of an array of points

const boundingRectangle = function (pnts) {
  let ln = pnts.length;
  if (ln===0) {
    return undefined;
  }
  let p0 = pnts[0];
  let minx = p0.x;
  let maxx = minx;
  let miny = p0.y;
  let maxy = miny;
  for (let i=1;i<ln;i++) {
    let p = pnts[i];
    let px = p.x,py = p.y;
    maxx = Math.max(maxx,px);
    minx = Math.min(minx,px);
    maxy = Math.max(maxy,py);
    miny = Math.min(miny,py);
  }
  return Rectangle.mk({corner:Point.mk(minx,miny),extent:Point.mk(maxx-minx,maxy-miny)});
}

// this ignores any transforms the rectangles might have 
Rectangle.extendBy = function (xby) {
  let corners = this.corners().concat(xby.corners());
  return boundingRectangle(corners);
}

const boundsForRectangles = function (rectangles) {
  let ln = rectangles.length;
  if (ln === 0) {
    return undefined;
  }
  let allCorners = [];
  rectangles.forEach(function (rectangle) {
    let corners = rectangle.corners();
    corners.forEach(function (corner) {
      allCorners.push(corner);
    });
  });
  return boundingRectangle(allCorners);
}
    
  
Rectangle.center = function () {
  let xt = this.extent;
  let c = this.corner;
  return Point.mk(c.x + 0.5*xt.x,c.y + 0.5*xt.y);
}


Rectangle.width = function () {
  return this.extent.x
}


Rectangle.height = function () {
  return this.extent.y
}

Rectangle.scaleCentered = function (sc) { // while maintaining the same center
  let wd = this.width();
  let ht = this.height();
  let cnt = this.center();
  let swd =  sc * wd;
  let sht =  sc * ht;
  let crn = cnt.plus(Point.mk(-0.5 * swd,-0.5 * sht));
  let xt = Point.mk(swd,sht);
  return Rectangle.mk({corner:crn,extent:xt});
}

Rectangle.plus = function (p) { // __translate
  let rs = Rectangle.mk({corner:this.corner.plus(p),extent:this.extent});
  return rs;
}

Rectangle.containsPoint = function (p) {
  let c = this.corner;
  let px = p.x;
  let py,ex;
  if (px < c.x) {
    return false;
  }
  py = p.y;
  if (py < c.y) {
    return false;
  }
  ex = this.extent;
  if (px > c.x + ex.x) {
    return false;
  }
  if (py > c.y + ex.y) {
    return false;
  }
  return true;
}


  
Rectangle.distance2 = function (p,msf) {
  if (!this.contains1(p)) {
    return undefined;
  }
  let c = this.corner;
  let xt = this.extent;
  let ux = c.x + xt.x;
  let uy = c.y + xt.y;
  let d = Math.min(p.x - c.x,ux - p.x,p.y - c.y,uy - p.y);
  if (d < msf) {
    return d;
  }
  return undefined;
}

// for rotation, all four corners need consideration
Rectangle.applyTransform = function (tr) {
  let rt = tr.rotation;
  let crn,xt,sc,rcrn,rxt,corners,xcorners;
   if (rt === 0) {
    crn = this.corner;
    xt = this.extent;
    sc = tr.scale;
    rcrn = crn.applyTransform(tr);
    rxt = xt.times(sc);
    return Rectangle.mk({corner:rcrn,extent:rxt});
  } else {
    corners = this.corners();
    xcorners = corners.map(function (c) {return c.applyTransform(tr)});
    return boundingRectangle(xcorners);
  }
  // the transform which fitst the rectangle this evenly into the rectangle dst
}



Rectangle.applyInverse = function (xf) {
  let tcorner = xf.applyInverse(this.corner);
  let textent = this.extent.times(1/xf.scale);
  let rs = Rectangle.mk(tcorner,textent);
  return rs;
}
  
Rectangle.upperLeft = function () {
  return this.corner;
}

Rectangle.lowerLeft = function () {
  let corner = this.corner;
  let  x =  corner.x;
  let y = corner.y + this.extent.y;
  return Point.mk(x,y);
}



Rectangle.upperRight = function () {
  let corner = this.corner;
  let  x =  corner.x + this.extent.x;
  let y = corner.y;
  return Point.mk(x,y);
}


Rectangle.lowerRight = function () {
  let corner = this.corner;
  let  x =  corner.x + this.extent.x;
  let y = corner.y + this.extent.y;
  return Point.mk(x,y);
}



Rectangle.containsRectangle = function (r) {
  return this.containsPoint(r.upperLeft()) && this.containsPoint(r.lowerRight());
}
 
 
Rectangle.containsLineSegment = function (s) {
  return this.containsPoint(s.end0) && this.containsPoint(s.end1);
}

Rectangle.contains = function (g) {
 if (Point.isPrototypeOf(g)) {
   return this.containsPoint(g);
 }
 if (LineSegment.isPrototypeOf(g)) {
   return this.containsLineSegment(g);
 }
 if (Rectangle.isPrototypeOf(g)) {
   return this.containsRectangle(g);
 }
}


geomr.set("Polygon",core.ObjectNode.mk()).__namedType();
let Polygon = geomr.Polygon;
// takes corner,extent or {corner:c,extent:e,style:s} style being optional, or no args
// Rectangles without styles are often used for purely computational purpose - never drawn.
Polygon.reduce = function() {
 // debugger;
  let {corners} = this;
  if (!corners) {
    return;
  }
  let ln = corners.length;
  if (ln < 3) {
    return;
  }
  let newCorners = arrayShape.mk();
  let reduced = 0;
  for (let i=0;i<ln;i++) {
    let cc = corners[i];
    let ni = (i+1)%ln;
    let nc = corners[ni];
    if (!nc) {
      debugger; //keep
    }
    if (!cc.equals(nc)) {
      newCorners.push(cc);
    } else {
      console.log('Reduced a polygon');
      reduced = 1;
    }
  } 
  if (reduced&&(newCorners.length > 2)) {
    this.set('corners',newCorners);
    return 1;
  }
}  
    
Polygon.mk = function (corners) {
  let rs = Object.create(Polygon);
  rs.set('corners',corners);
  rs.reduce();
  //rs.reorderFromLL();
  return rs;
}


/* a place on periphery of a polygon is specified by a pc (periphery coord).
This is a real number less that the number of its sides. 
If Math.floor(pc) === n, it specifiesa spot on the nth side,  the spot which is a fraction  pc-n of the way along the side. 
Thus if pc <1 it specifies a spot on the  first side, if 1 <= pc < 2, on the second, and so on */

Polygon.pc2point = function (pc) {
  if (isNaN(pc)) {
    return;
  }
  let {corners} = this;
  let ln = corners.length;
 /* if (pc >= ln) {
    core.error('pc (periphery coordinate) is too large');
    returnS
  }*/
  let sideNum= Math.floor(pc);
  let along = pc-sideNum;
  let aSideNum = sideNum%ln;
  let v0 = corners[aSideNum];
  let v1 = corners[(aSideNum+1)%ln];
  if (!v1) {
    debugger; // keep
  }
  let vec = v1.difference(v0);
  let rs = v0.plus(vec.times(along));
  return rs;
}

Polygon.lowerLeftCorner = function () {
  let {corners} = this;
  if (!corners) {
    return;
  }
  let rsv = -Infinity;
  let rsi;
  let ln = corners.length;
  for (let i=0;i<ln;i++) {
    let c = corners[i]
    let cv = c.y-c.x
    if (cv > rsv) {
      rsv = cv;
      rsi = i;
    }
  }
  return rsi;
}

Polygon.reorderFromLL = function () {
//  debugger;
  let {corners} = this;
  if (!corners) {
    return;
  }
  let lli = this.lowerLeftCorner();
  if (lli === 0) {
    return;
  }
  let a0 = corners.slice(0,lli)
  let a1 = corners.slice(lli);
  corners.length = 0;
  a1.forEach( (c) => {corners.push(c)});
  a0.forEach( (c) => {corners.push(c)});
}
  
    

// in its own coords
Polygon.center = function () {
  let {corners} = this;
  let tx =0;
  let ty = 0;
  corners.forEach( (c) => {
    tx+=c.x;
    ty+=c.y;
  });
  let ln = corners.length;
  return Point.mk(tx/ln,ty/ln);
}

Polygon.min_or_max = function (x_or_y,min_or_max) {
  let isX = x_or_y === 'x';
  let isMin = min_or_max === 'min';
  let {corners} = this;
  let rs = isMin?Infinity:-Infinity;
  corners.forEach( (c) => {
    let cv = isX?c.x:c.y;
    if (isMin?cv < rs:cv > rs) {
      rs = cv
    }
  });
  return rs;
}


Polygon.left = function () {
  return this.min_or_max('x','min');
}

Polygon.right = function () {
  return this.min_or_max('x','max');
}

Polygon.width = function () {
	return this.right() - this.left();
}
	
Polygon.top = function () {
  return this.min_or_max('y','min');
}


Polygon.bottom = function () {
  return this.min_or_max('y','max');
}


Polygon.height = function () {
	return this.bottom() - this.top();
}

Polygon.extent = function() {
  return Math.max(this.width(),this.height());
}
Polygon.sides = function () {
  let rs = [];
  let corners = this.corners;
  let ln = corners.length;
  for (let i=0;i<ln;i++) {
    let seg = LineSegment.mk(corners[i],corners[(i+1)%ln]);;
    rs.push(seg);
  }
  return rs;
}

Polygon.intersectsLineSegment = function (sg) {
  let sds = this.sides();
  let sln = sds.length;
  for (let i=0;i<sln;i++) {
    let iscts = sg.intersectsLineSegment(sds[i]);
    if (iscts) {
     return 1;
    }
  }
  return 0;
}
     
// only works for convex polygons.

Polygon.contains = function (p) {
  debugger;
  let ext = this.extent();
  let ra = Math.random()*2*Math.PI;
  let rvec = Point.mk(Math.cos(ra),Math.sin(ra));
  let op0 = p.plus(rvec.times(ext*100));
  let op1 = p.plus(rvec.times(-ext*100));
  let seg0 = LineSegment.mk(p,op0);
  let seg1 = LineSegment.mk(p,op1);
  return this.intersectsLineSegment(seg0) && this.intersectsLineSegment(seg1);
}
     
Polygon.mangle = function (params) {
 let {twist:tw=0,lengthen:ln=1,within} = params;
//debugger;
 // let orect = this.orect; 
  let sides = this.sides();
  let msides = sides.map( (s) => s.lengthen(ln).twist(tw));
  if (within) {
    let csides = msides.map((s) => within.intersectLineSegment(s));
    return csides;
  }
  return msides;
}
  
Polygon.minDimension = function () {
  let minx = this.left();
  let maxx = this.right();
  let miny = this.bottom();
  let maxy = this.top();
  let dimx = maxx - minx;
  let dimy = miny - maxy;
  return Math.min(dimx,dimy);
}

Rectangle.toPolygon = function () {
  let lc = this.labeledCorners();
  let corners = arrayShape.mk([lc.UL,lc.UR,lc.LR,lc.LL]);
  let rs = Polygon.mk(corners);
  return rs;
}
 

//  does not work with rotations
Transform.times = function (tr) {
  let sc0 = this.scale;
  let sc0N,sc0x,sc0y,sc1N,sc1x,sc1y,tr0,tr1,sc,sc1,scx,scy,trX,trY,rtr,rs;
  if (typeof sc0 === "number") {
    sc0N = 1;
    sc0x = sc0;
    sc0y = sc0;
  } else {
    sc0x = sc0.x;
    sc0y = sc0.y;
  }
  sc1 = tr.scale;
  if (typeof sc1 === "number") {
    sc1N = 1;
    sc1x = sc1;
    sc1y = sc1;
  } else {
    sc1x = sc0.x;
    sc1y = sc0.y;
  }
  tr0 = this.translation;
  tr1 = tr.translation;
  if (sc0N && sc1N) {
    sc = sc0 * sc1;
  } else {
    scx = sc0x*sc1x;
    scy = sc0y*sc1y;
    sc = Point.mk(scx,scy);
  } 
  trX = sc1x * tr0.x + tr1.x;
  trY = sc1y * tr0.y + tr1.y;
  rtr = Point.mk(trX,trY);
  rs = Transform.mk({scale:sc,translation:rtr});
  return rs;
}
    
    
    
Rectangle.transformTo = function (dst) {
  let cnt = this.center();
  let dcnt = dst.center();
  let wd = this.width();
  let ht = this.height();
  let dwd = dst.width();
  let dht = dst.height();
  let wdr,htr,r,x,y,rs;
  if ((wd===0)&&(ht===0)) {
    return Transform.mk({translation:Point.mk(0,0),scale:1});
  }
  wdr = (wd === 0)?Infinity:dwd/wd;
  htr = (ht === 0)?Infinity:dht/ht;
  r = Math.min(wdr,htr);
  x = dcnt.x - (cnt.x)*r;
  y = dcnt.y - (cnt.y)*r;
  rs = Transform.mk({translation:Point.mk(x,y),scale:r});
  return rs;
}
  
// rectangle is  given relative  to node's coords
Rectangle.toGlobalCoords = function (node) {
  let corner = this.corner;
  let outerCorner = corner.plus(this.extent);
  let globalCorner = node.toGlobalCoords(corner);
  let globalOuter = node.toGlobalCoords(outerCorner);
  return Rectangle.mk(globalCorner,globalOuter.difference(globalCorner));
}

Rectangle.toAncestorCoords = function (node,ancestor) {
  let corner = this.corner;
  let outerCorner = corner.plus(this.extent);
  let ancestorCorner = node.toAncestorCoords(corner,ancestor);
  let ancestorOuter = node.toAncestorCoords(outerCorner,ancestor);
  return Rectangle.mk(ancestorCorner,ancestorOuter.difference(ancestorCorner));
}

// rectangle is given relative to global coords - returns relative to ownCoords
Rectangle.toOwnCoords = function (node) {
  let corner = this.corner;
  let outerCorner = corner.plus(this.extent);
  let ownCorner = toOwnCoords(node,corner);
  let ownOuter = toOwnCoords(node,outerCorner);
  return Rectangle.mk(ownCorner,ownOuter.difference(ownCorner));
}

  
const mkSquare = function (center,sz) {
  let {x,y} = center;
  let hsz = sz/2;
  let lx = x-hsz;
  let ly = y-hsz;
  return Rectangle.mk([lx,ly],[sz,sz]);
}

core.ObjectNode.__countShapes = function () {
  let cnt = 1;
  this.shapeTreeIterate(function (c) {
    cnt = cnt + c.__countShapes();
  });
  return cnt;
}


core.ArrayNode.__countShapes = core.ObjectNode.__countShapes;

const flipY = function (pnts,bias) {
  let rs = core.Array.mk();
  pnts.forEach(function (p) {
    let fp = Point.mk(p.x,bias -p.y);
    rs.push(fp);
  });
  return rs;
}

// coverage is data space, extent is image space.
// this maps the former to the later, with a y flip
// used for graphing
const transformForGraph = function (coverage,extent) {
  let cvxt = coverage.extent;
  let xtxt = extent.extent;
  let cvc = coverage.corner;
  let xtc = extent.corner;
  let scx = (xtxt.x)/(cvxt.x);
  let scy = -(xtxt.y)/(cvxt.y);
  let tx = xtc.x - scx * cvc.x;
  let ty = (xtc.y + xtxt.y) - scy * cvc.y;
  let tr = Point.mk(tx,ty);
  let sc = Point.mk(scx,scy);
  let rs = Transform.mk({scale:sc,translation:tr});
  return rs;
}

const moveBy = function (g,p) {
  if (Circle.isPrototypeOf(g)) {
     let c = g.center;
     let np = c.plus(p);
     g.center = np;
     return g;
  }
  if (Rectangle.isPrototypeOf(g)) {
     let c = g.corner;
     let nc = c.plus(p);
     g.corner = nc;
     return g;
  }
  if (LineSegment.isPrototypeOf(g)) {
    let {end0,end1} = g;
    let ne0 = end0.plus(p);
    let ne1= end1.plus(p);
    g.end0.copyto(ne0);
    g.end1.copyto(ne1);
    return g;
  }
}
   
  

const degreesToRadians =  function (n) {return Math.PI * (n/180);}

const radiansToDegrees =  function (n) {return 180 * (n/Math.PI);}

Rectangle.randomPoint = function () {
  let c = this.corner;
  let ex = this.extent;
  let x = c.x + (ex.x)*Math.random();
  let y = c.y +(ex.y)*Math.random();
  return Point.mk(x,y);
}

Rectangle.mangle = function (params) {
//rs.mangleRectangle = function (rect,ln,tw) {
 let {twist:tw=0,lengthen:ln=1,within} = params;
//debugger;
 // let orect = this.orect; 
  let sides = this.labeledSides();
  let {left,right,top,bottom} = sides;
  let mleft = left.lengthen(ln).twist(tw);
  let mright = right.lengthen(ln).twist(tw);
  let mtop = top.lengthen(ln).twist(tw);
  let mbottom = bottom.lengthen(ln).twist(tw);
  if (within) {
   
    //let ln = 1.2;
    //let tw = 0.1*Math.PI;
    let ileft = within.intersectLineSegment(mleft);
    let iright = within.intersectLineSegment(mright);
    let itop = within.intersectLineSegment(mtop);
    let ibottom = within.intersectLineSegment(mbottom);
    return [ileft,iright,itop,ibottom];
  }
  return [mleft,mright,mtop,mbottom];
}
  
  

geomr.set("oneDf",core.ObjectNode.mk()).__namedType();
let oneDf = geomr.oneDf;


oneDf.applY = function (v) {
  let f = this.f;
  let ov = f(v);
  return ov;
}
oneDf.mk = function () {
  return Object.create(oneDf);
}

oneDf.mkStraight = function (p0,p1) {
   let vec = p1.difference(p0);
   let ln = vec.length();
   let nvec = vec.times(1/ln);
   let f = (v) => p0.plus(nvec.times(v*ln));
   let ov = Object.create(oneDf);
   ov.f = f;
   return ov;
 }
 
oneDf.mkArc = function (cntr,radius,fromAngle=0,toAngle=2*Math.PI) {
   let f = (v) => {
     let ac = toAngle-fromAngle;
     let a = fromAngle + v*ac;
     let vec = Point.mk(Math.cos(a),Math.sin(a)).times(radius);
     let pv = cntr.plus(vec);
     return pv;
   }
   let ov = Object.create(oneDf);
   ov.f = f;
   return ov;
 }
 
 oneDf.mixin = function (a) {
  let ln = a.length;
  //let fs = this.f?[this.f]:[];
  let parts = this.f?[this.f]:[];
 // a.forEach((oneD) => fs.push(oneD.f));
  a.forEach((oneD) => parts.push(oneD));
  oneDf.parts = parts;
//  oneDf.fs = fs;
}
  
 
 oneDf.randomPoint = function () {
  let rv = Math.random();
  let f = this.f;
  let parts = this.parts;
  if (parts) {
    let ln = parts.length;
    let wh = Math.floor(ln*Math.random());
    let part  = parts[wh];
    f = part.f;
    let ov = f(rv);
    return {value:ov,part:part};
  }
  let ov = f(rv);
  return {value:ov}
}



export {rotationMatrix,movetoInGlobalCoords,toOwnCoords,toPoint,angleToDirection,Point,Line,Rectangle,Polygon,Transform,Ray,degreesToRadians,
        LineSegment,Circle,Arc,boundsForRectangles,rp_time,pointArrayToLineSegments,geometriesIntersect,moveBy,oneDf};
