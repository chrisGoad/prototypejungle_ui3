
let rs = function (item) {

item.mkPath0 = function() {
  let d = 0.3;
  let p0 = Point.mk(0.5+d,0.5+d);
  let p1 = Point.mk(0.5-d,0.5+d);
  let p2 = Point.mk(0.5-d,0.5-d);
  let p3 = Point.mk(0.5+d,0.5-d);
  let path = [p0,p1,p2,p3];//,p4,p3,p2,p1,p0];
  return path;
}

item.mkPath1 = function () {
  let d = 0.3;
  let p0 = Point.mk(0.5-d,0.5+d);
  let p1 = Point.mk(0.5+d,0.5+d);
  let p2 = Point.mk(0.5+d,0.5);
  let p3 = Point.mk(0.5-d,0.5);
  let p4 = Point.mk(0.5-d,0.5-d);
  let p5 = Point.mk(0.5+d,0.5-d);
  let path = [p0,p1,p2,p3,p4,p5];
  return path;
}


item.mkPath2 = function () {
  let d = 0.3;
  let p0 = Point.mk(0.5+d,0.5+d);
  let p1 = Point.mk(0.5-d,0.5-d);
  let p2 = Point.mk(0.5+d,0.5-d);
  let p3 = Point.mk(0.5-d,0.5+d);
  let p4 = Point.mk(0.5+d,0.5+d);

  let path = [p0,p1,p2,p3,p4];
  return path;
}
item.mkPath3 = function () {
  let d = 0.3;
  let p0 = Point.mk(0.5-d,0.5+d);
  let p1 = Point.mk(0.5-d,0.5-d);
  let p2 = Point.mk(0.5+d,0.5-d);
  let p3 = Point.mk(0.5+d,0.5+d);
  let p4 = Point.mk(0.5-d,0.5+d);

  let path = [p0,p1,p2,p3,p4];
  return path;
}


item.mkRandomPath = function (params) {
  let {rectangle,numPoints:np} = params;
  let rect =  rectangle?rectangle:Rectangle.mk(Point.mk(0,0),Point.mk(1,1));
  let {corner,extent} = rect;
  let {x:cx,y:cy} = corner;
  let {x:ex,y:ey} = extent;
  let path = [];
  const randomPoint = () => {
    let rx = cx+Math.random()*ex;
    let ry = cy+Math.random()*ey;
    return Point.mk(rx,ry);
  }
  for (let i=0;i<np;i++) {
    path.push(randomPoint());
  }
  return path;
}
     
item.mkCircle = function (params) {
  let {radius:r,numPoints:np,center,startAngle:sa,endAngle:ea,clockWise:clkw} = params;
  //let da = (2*Math.PI)/(np+1);
 /* if (ea) {
    let deltaA
 */
  let da = (2*Math.PI)/np;
  let path = [];
  for (let i=0;i<=np;i++) {
    let a = sa+i*da;
    let vec = Point.mk(Math.cos(a),Math.sin(a)).times(r);
    let dvec = vec.plus(center);
    path.push(dvec);
  }
  return path;
}

item.mkWavyCircle = function (params) {
  let {radius:r,deltaRadius,numWaves:nw,numPoints:np,center,startAngle:sa} = params;
  let da = (2*Math.PI)/np;
  let wvl = (2*Math.PI)/nw;
  let path = [];
  for (let i=0;i<=np;i++) {
    let a = sa+i*da;
    
    let inwv = Math.floor(a/wvl);
    let wvfr = (a - inwv*wvl)/wvl;
    let wvv = wvfr*2*Math.PI;
    let sn = Math.sin(wvv);
    let dr = sn*deltaRadius;
    let vec = Point.mk(Math.cos(a),Math.sin(a)).times(r+dr);
    let dvec = vec.plus(center);
    path.push(dvec);
  }
  return path;
}

item.twoCircles = function (params) {
  let {centers,startAngles} = params;
  
  let params0 = Object.assign({},params);
  let params1 = Object.assign({},params);
  Object.assign(params0,{center:centers[0],startAngle:startAngles[1]});
  Object.assign(params1,{center:centers[1],startAngle:startAngles[1]});
  let c0 =this.mkCircle(params0);
  let c1 = this.mkCircle(params1);
  let path = c0.concat(c1.reverse());
  return path;
}

item.threeCircles = function (params) {
  let {centers,startAngles} = params;
  
  let params0 = Object.assign({},params);
  let params1 = Object.assign({},params);
  let params2 = Object.assign({},params);
  Object.assign(params0,{center:centers[0],startAngle:startAngles[1]});
  Object.assign(params1,{center:centers[1],startAngle:startAngles[1]});
  Object.assign(params2,{center:centers[2],startAngle:startAngles[2]});
  let c0 = this.mkCircle(params0);
  let c1 = this.mkCircle(params1);
  let c2 = this.mkCircle(params2);
  let path = c0.concat(c1.reverse().concat(c2));
  return path;
}


item.mkSpiral = function(params) {
  let {turns,pointsPerTurn:ppt,iRadius:ir,deltaRadius:dr,center} = params;
  let path =[];
  for (let i=0;i<turns;i++) {
    let sr = ir - i*dr;
    let fr = ir - (i+1)*dr;
    let da = (2*Math.PI)/(ppt+1);
    let idr = (fr-sr)/ppt;
    for (let j=0;j<=ppt;j++) {
      let a = j*da;
      let cr = sr + j*idr;
      let vec = Point.mk(Math.cos(a),Math.sin(a)).times(cr);
      let dvec = vec.plus(center);
      path.push(dvec);
    }
  }
  return path;
}

       
item.showPath = function (path,fc,lineP) {
  let {pathLines} = this;
  if (!pathLines) {
    pathLines = this.set('pathLines',arrayShape.mk());
  }
  let ln = path.length;
  for (let i=0;i<(ln-1);i++) {
    let e0 = path[i].times(fc);
    let e1 = path[i+1].times(fc);
    let line = lineP.instantiate();
    line.show();
    line.setEnds(e0,e1);
    pathLines.push(line);
  }
}
}
 

  
export {rs};

