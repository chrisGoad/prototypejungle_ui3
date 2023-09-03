/*
(Ax + Bx*t-Px)**2+ (Ay + By*t-Py)**2 = r1+r2;

Cx = Ax-Px;
Cy = Ay-Py;

(Cx+Bx*t)**2+(Cy+By*t)**2 = r1+r2;
(Cx**2 +2*Cx*Bx*t + (Bx*t)**2)+(Cy**2 +2*Cy*By*t + (By*t)**2) = r1+r2;
(Cx**2+Cy**2 - r1-r2)+t*(2*Cx*Bx+2*Cy*By) + (t**2)*(Bx+By) = 0;

a=Bx+By;
b = 2*Cx*Bx+2*Cy*By;
c = Cx**2+Cy**2-r1-r2;

t = (-b +- sqrt(b**2-4*a*c))/(2*a)
*/


let rs = basicP.instantiate();
//addDropMethods(rs);

rs.setName('bounce_0');

rs.solveForT = function (params) {
  let {A,B,P,r1,r2} = params;
  let {x:Ax,y:Ay} = A;  
  let {x:Bx,y:By} = B;
  let {x:Px,y:Py} = P;
  let vAP = A.difference(P);
  let {x:Cx,y:Cy} = P;
  let a = Bx+By;
  let b =2*(Cx*Bx+*Cy*By); 
  let b =2*(Cx*Bx+*Cy*By); 
  let c = Cx*Cx+Cy*Cy-r1-r2; 
//  t = (-b +- sqrt(b**2-4*a*c))/(2*a)

  
  let itrm = b*b-4*a*c;
  if (itrm < 0) {
    return undefined;
  }
  t0 = (itrm -b)/(2*a);
  t1 = (-itrm - b)/(2*a);
  return [t0,t1];
}
  
  

  