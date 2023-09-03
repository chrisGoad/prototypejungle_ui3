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
import {rs as basicP} from '/generators/basics.mjs';

let rs = basicP.instantiate();
//addDropMethods(rs);

rs.setName('bounce_0');

rs.solveForT = function (params) {
  debugger;
  let {A,V,P,r0,r1} = params;
  let {x:Ax,y:Ay} = A;  
  let {x:Vx,y:Vy} = V;
  let {x:Px,y:Py} = P;
  let vAP = A.difference(P);
  let {x:Cx,y:Cy} = vAP;
  let a = Vx+Vy;
  let b =2*(Cx*Vx+Cy*Vy); 
  let c = Cx*Cx+Cy*Cy-r0-r1; 
//  t = (-b +- sqrt(b**2-4*a*c))/(2*a)

  
  let itrm = b*b-4*a*c;
  if (itrm < 0) {
    return undefined;
  }
  let itrm1 = Math.sqrt(itrm);
  let t0 = (itrm1 -b)/(2*a);
  let t1 = (-itrm1 - b)/(2*a);
  const check =  (t) => {
     return A.plus(V.times(t));
  }
   const check1 =  (t) => {
     return a*t*t+b*t+c;
  }
  let ck0 = check(t0);
  let ck1 = check(t1);
  let ck2 = check1(t0);
  let ck3 = check1(t1);
  return [t0,t1];
}

rs.initialize = function () {
  debugger;
  let A = Point.mk(0,0);
  let V = Point.mk(1,0);
  let P = Point.mk(10,0);
  let r0 = 1;
  let r1=2;
  let params = {A,V,P,r0,r1}
  let ts = this.solveForT(params);
  let r2= 1000;
}


export {rs}
  

  