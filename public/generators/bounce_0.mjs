import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';

let rs = basicP.instantiate();

rs.setName('bounce_0');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2}

Object.assign(rs,topParams);

/*
(Ax + Vx*t-Px)**2+ (Ay + Vy*t-Py)**2 = r1+r2;

Cx = Ax-Px;
Cy = Ay-Py;

(Cx+Vx*t)**2+(Cy+Vy*t)**2 = r1+r2;
(Cx**2 +2*Cx*Vx*t + (Vx*t)**2)+(Cy**2 +2*Cy*Vy*t + (Vy*t)**2) = r1+r2;
(Cx**2+Cy**2 - r1-r2)+t*(2*Cx*Vx+2*Cy*Vy) + (t**2)*(Vx+Vy) = 0;

a=Vx+Vy;
b = 2*Cx*Vx+2*Cy*Vy;
c = Cx**2+Cy**2-r1-r2;

t = (-b +- sqrt(b**2-4*a*c))/(2*a)
*/


rs.solveForT = function (params) {
  debugger;
  let {A,V,P,r1,r2} = params;
  let {x:Ax,y:Ay} = A;  
  let {x:Vx,y:Vy} = V;
  let {x:Px,y:Py} = P;
  let vAP = A.difference(P);
  let {x:Cx,y:Cy} = vAP;
  //let a = Vx+Vy;
  let a = Vx*Vx+Vy*Vy;
  let b =2*(Cx*Vx+Cy*Vy); 
  let r = r1+r2;
  let c = Cx*Cx+Cy*Cy-r*r; 
//  t = (-b +- sqrt(b**2-4*a*c))/(2*a)

  
  let itrm = b*b-4*a*c;
  if (itrm < 0) {
    return undefined;
  }
  let itrm1 = Math.sqrt(itrm);
  let t1 = (itrm1 -b)/(2*a);
  let t0 = -(itrm1 +b)/(2*a);
  const tpos=  (t) => {
     return A.plus(V.times(t));
  }
   const check0 =  (t) => {
     let p = tpos(t);
     return p.distance(P);
  }
   const check1 =  (t) => {
     return a*t*t+b*t+c;
  }
  let p0 = tpos(t0);
  let p1 = tpos(t1);
  let ckp0  = check0(t0);
  let ckp1  = check0(t1);
  let ck0 = check1(t0);
  let ck1 = check1(t1);
  debugger;
  return [p0,p1,t0,t1];
}

rs.collide = function (params) {
  let  {v1,v2,x1,x2,m1,m2} =params;
  debugger;
  let x1mx2ln = (x1.difference(x2)).length();
  let sqx1mx2ln = x1mx2ln*x1mx2ln;
  let itrm1 = (2*m2/(m1+m2))* (v1.difference(v2).dotp(x1.difference(x2))/sqx1mx2ln);
  let nv1 = v1.difference(x1.difference(x2).times(itrm1));
  
  //let x1mx2ln = (x1.difference(x2)).length();
  //let sqx1mx2ln = x1mx2ln*x1mx2ln;
  let itrm2 = (2*m1/(m1+m2))* (v2.difference(v1).dotp(x2.difference(x1))/sqx1mx2ln);
  let nv2 = v2.difference(x2.difference(x1).times(itrm2));
  return [nv1,nv2];
}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .1;
}

rs.initialize = function () {
  debugger;
  this.initProtos();
  this.addFrame();
  let A = Point.mk(0,0);
  let a = (Math.PI/180)*4;
  let V = Point.mk(Math.cos(a),Math.sin(a));
  let P = Point.mk(20,0);
  let r1 = 1;
  let r2=3;
  let params = {A,V,P,r1,r2};
  let iline = this.lineP.instantiate();
  this.set('iline',iline);
  let oline1 = this.lineP.instantiate();
  this.set('oline1',oline1);
  let oline2 = this.lineP.instantiate();
  this.set('oline2',oline2);
  let ln = P.length();
  let vp = V.times(ln*2);
  iline.setEnds(A,vp);
  let ps = this.solveForT(params);
  if (!ps) {
    return;
  }
  let circ0=this.circleP.instantiate();
  let circ1=this.circleP.instantiate();
  let circ2=this.circleP.instantiate();
 
  this.set('circ0',circ0);
  this.set('circ1',circ1);
  circ1.stroke = 'red';
  this.set('circ2',circ2);
  circ0.dimension = 2*r2;
  circ1.dimension = 2*r1;
  circ2.dimension = 2*r1;
  let [c0,c1] =ps;
  let colresParams = {v1:V,v2:Point.mk(0,0),x1:c0,x2:P,m1:1,m2:1};
  let colres = this.collide(colresParams);
  let [nv1,nv2] = colres;
  let nv1ln = nv1.length();
  let nv2ln = nv2.length();
  oline1.stroke = 'green';
  oline2.stroke = 'cyan';
  let o1end1 = c1.plus(nv1.times(10*nv1ln));
  oline1.setEnds(c0,o1end1);
  let o2end1 = P.plus(nv2.times(10*nv2ln));
  oline2.setEnds(P,o2end1);
  circ0.moveto(P);
  circ1.moveto(c0);
  circ2.moveto(c1);
  circ0.update();
  circ1.update();
  circ2.update();
}


export {rs}
  

  