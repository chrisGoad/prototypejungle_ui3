

const rs = function (item) {
/*
x**2 = r**2 - cy**2
tan(a0) = y/x
arctan(y/x) = a0;
PI/2 +
*/

item.anArc = function (r,y,n) {
  let {polygonP} = this;
  let pnts = [];
  let x = Math.sqrt(r*r-y*y);
  let a0 = Math.atan(y/x);
  let a2 = Math.PI - a0;
  let inc = (a2-a0)/n;
  for (let i = 0;i<=n;i++) {
    let a = a0+inc*i;
    let p = Point.mk(Math.cos(a),Math.sin(a)).times(r).plus(Point.mk(0,-y));
    pnts.push(p);
  }
  for (let i = 1;i<n;i++) {
    let p = pnts[n-i];
    pnts.push(Point.mk(p.x,-p.y));
  }
  let poly = polygonP.instantiate();
  poly.corners = pnts;
  return poly;
}
    
  
  

  
}

export {rs};


