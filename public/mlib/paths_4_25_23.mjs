
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

item.mkRectangularPath = function (rect) {
  let {corner:crn,extent:ext} = rect;
  let {x:cx,y:cy} = crn;
  let {x:ex,y:ey} = ext;
  let LL = Point.mk(cx,cy+ey);
  let UL = Point.mk(cx,cy);
  let UR = Point.mk(cx+ex,cy);
  let LR = Point.mk(cx+ex,cy+ey);
  return [LL,UL,UR,LR,LL];
}
     
item.mkSpokePaths = function (params) {
  let {numSpokes:ns,innerRadius:irdi,outerRadius:ord,center,startAngle:isa} = params;
  let sa = isa?isa:0;
  let ird = irdi?irdi:0;
  let da = (2*Math.PI)/ns;
  let paths = [];
  for (let i=0;i<ns;i++) {
    let ca = sa + i*da;
    let vec = Point.mk(Math.cos(ca),Math.sin(ca));
    let ip = vec.times(ird).plus(center);
    let op = vec.times(ord).plus(center);
    paths.push([ip,op]);
  }
  return paths;
}

item.interpolatePaths = function (path0,path1) {
  let ln = Math.min(path0.length,path1.length);
  let rp = [];
  for (let i=0;i<ln;i++) {
    let fr = i/ln;
    let p0 = path0[i]
    let p1 = path1[i]
    let vec = p1.difference(p0);
    let svec = vec.times(fr);
    let ip = p0.plus(svec);
    rp.push(ip);
  }
  return rp;
}		

       
item.setPathLength = function (path,n) {
  let rp = [];
  for (let i=0;i<n;i++) {
    let fr = i/(n-1);
    let cp = this.alongPath(path,fr);
    rp.push(cp);
  }
  return rp;
}

item.mkParallelPaths = function (params) {
  let {numPaths:np,rectangle} = params;
  let rect =  rectangle?rectangle:Rectangle.mk(Point.mk(0,0),Point.mk(1,1));
  let {corner,extent} = rect;
  let {x:cx,y:cy} = corner;
  let {x:ex,y:ey} = extent;
  let dx = ey/(np-1);
  let paths = [];
  let minV = cx;
  let maxV = cx+ex;;
  for (let i=0;i<np;i++) {
    let cv = i*dx+minV;
    let ip = Point.mk(minV,cv);
    let ep = Point.mk(maxV,cv);
    paths.push(i%2?[ip,ep]:[ep,ip]);
  }
  return paths;
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
item.mkCirclePath = function (params) {
  return this.mkCircle(params);
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

   
item.mkSnakePath = function (params) {
  let {rectangle,numPoints:np,numTurns:nt} = params;
  let rect =  rectangle?rectangle:Rectangle.mk(Point.mk(0,0),Point.mk(1,1));
  let {corner,extent} = rect;
  let {x:cx,y:cy} = corner;
  let {x:ex,y:ey} = extent;
  let UL = Point.mk(cx,cy);
  let UR = Point.mk(cx+ex,cy);
  let vecR= Point.mk(ex,0);
  let vecL= Point.mk(-ex,0);
  let vecD = Point.mk(0,ey/nt);
  let path = [];
  let goingRight = 1;
  let cp = UL;
  let hvec;
  for (let i=0;i<nt;i++) {
    path.push(cp);
    hvec = goingRight?vecR:vecL;
    cp = cp.plus(hvec);
    path.push(cp);
    cp = cp.plus(vecD);
    path.push(cp);
    goingRight = !goingRight;
  }
  hvec = goingRight?vecR:vecL;
  cp = cp.plus(hvec);
  path.push(cp);
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

