

const rs = function (item) {
/* an  interpolation_path is  array of timeStamped values 
[{pathTime:time0,value:val0,pathFunction:pf0},{pathTime:time1,value:val1,pathFunction:pf1} ....]
the values are hereditary arrays for which the interpolate function in basics.mjs works.
the pathFunctions are optional. If absent the interpolation function is used.
Each pathFunction pf takes as input the current value cv, the next value nv, and the fraction along the current path element as input and returns a value.
pathTimes are normalized  so that the first is 0 and the last is 1
The first element of the path may assert other attributes of the path as a whole, such as length, used for appending paths
 
an active interpolation path is {cyclic,startTime,speed,pathTime,cycle:integer,path:p,activeElementIndex:integer,value,action} where the activeElementIndex is the index of  the path element 
which is active at pathTime. pathTime is path relative.  globalTime = startTime+ pathTime/speed. pathTime = (globalTime-startTime)/speed
*/

item.pointAlongPath = function (path,fr) {
  let pln = path.length;
  let idx = 0;
  while (idx < (pln-1)) {
    let pe = path[idx];
    let npe = path[idx+1];
    let {pathTime:st,value:sv,pathFunction:pf} = pe;
    let {pathTime:et,value:ev} = npe;
    if (fr<=et) {
      let ifr = (fr-st)/(et-st);
      let v=pf?pf(ifr,sv,ev):this.interpolate(sv,ev,ifr);
      return v;
    }
    idx++;
  }
}
    
item.updateActivePath = function (ap,gt) { // global time; t is relative  time
  let {startTime,startOffset,speed,path,activeElementIndex:aei,cycle} = ap;
  let pln = path.length;
  while (1) {
    let pt = startOffset + (gt-startTime)*speed - cycle;//pathTime
    let sae = path[aei]; //sae = start active element
    let {pathTime:st,value:sv,pathFunction:lastpf} = sae; // st= start time, sv = start value
    if (pt < 0){ //  not started or over
      return 0;
    }
    let eaei = aei + 1;; //end active element index
    if (eaei < pln) { 
      let eae = path[eaei];
      let {pathTime:et,value:ev,pathFunction:pf} = eae;
      if (pt<=et) { // t is within the active element
        let fr = (pt-st)/(et-st);
        if (pf) {
         // debugger;
        }
        let iv=lastpf?lastpf(fr,sv,ev):this.interpolate(sv,ev,fr);
        lastpf = pf;
        this.copyTo(ap.value,iv);
        ap.pathTime = pt;
        ap.activeElementIndex =aei;
        return 1;
      } else {
        aei = aei+1;
      }
    } else {
      cycle = ap.cycle = cycle+1;
      pt = pt-1;
      aei = 0;
    }
   
  }
}

item.xferOtherProperties = function (np,p) {
  let ln = p[0].length;
  if (ln) {
    np[0].length = ln;
  }
}
    
item.normalizePath = function (p) {
  let pln = p.length;
  let last = p[pln-1];
  let dur = last.pathTime;
  let np = p.map((pe) => {
    let {pathTime:pt,value} =  pe;
    return {pathTime:pt/dur,value};
    
  });
  this.xferOtherProperties(np,p);
  return np;
}


item.mapPath = function (p,f) {
  let pln = p.length;
  let np = p.map((pe) => {
    let {pathTime,value} =  pe;
    return {pathTime,value:f(value)};
    
  })
  this.xferOtherProperties(np,p);

  return np;
}

//item.mkActivePath = function (startTime,startOffset,speed,path) {
item.mkActivePath = function (params) {
  let {startTime:st,startOffset:soff,speed,path,value,shape,shapes,action} = params; //value is an object for interpolated values to be copied into
  let ap = {startTime:st?st:0,startOffset:soff?soff:0,speed,path,activeElementIndex:0,cycle:0,value,shape,shapes,action};
  return ap;
}

item.runActivePaths  = function () {
  let {currentTime:gt,activePaths:aps} = this;
  let cnt = 0;
  aps.forEach( (ap) => {
    let {action} = ap;
    let active = this.updateActivePath(ap,gt);
    if (active && action) {
      action.call(this,ap);
    }
    cnt++;
  });
}

item.allValues = function () {
  let {activePaths} = this;
  let av = activePaths.map((ap) => ap.value);
  return av;
}

item.allValuesToConnect = function () {
  let {activePaths} = this;
  let av =[];
  activePaths.forEach((ap) => {
    if (ap.connectMe) {
     av.push(ap.value);
    }
  });
  return av;
}
 
 // assumes all path elements have a Point as value
 item.pathLength  = function (path) {
 // debugger;
  let ln = path.length;
  let pln = 0;
  let pe0 = path[0];
  let lastwp;
  for (let i=0;i<ln;i++) {
    let pe = path[i];
    let wp = pe.value;
    let isp = Point.isPrototypeOf(wp);
    if (isp) {
      if (lastwp) {
        let peln = wp.distance(lastwp);
        pln = pln+peln;
        lastwp = wp;
      } else {
        lastwp = wp;
      }
    }
  }
  return pln;
}
    
     
 // uniform timing; adds elements[0] as last path element if wrap 
  
 item.mkUniformPath = function (elements,wrap) {
  let ln = elements.length;
  let ipath = [];
  let lastEl = elements[0];
  let idx = 1;
  ipath.push({pathTime:0,value:lastEl});
  for (let i=1;i<ln;i++) {
    let e = elements[i];
    if (e!==lastEl) {
      let pel = {pathTime:idx,value:e};
      ipath.push(pel);
      lastEl = e;
      idx++
    }
    
  }
  let e0 = elements[0];
  if (wrap && (e0 !== lastEl)) {
    let pel = {pathTime:ln,value:e0};
    ipath.push(pel);
  }
  let npath = this.normalizePath(ipath);
  let pln = this.pathLength(npath);
  npath[0].length = pln;
  return npath;
}
    
     
  


item.scale2dPath = function (path,scale) {
  let {x:xs,y:ys} = scale;
  let f = (p) => {
    let {x,y} = p;
    let np = Point.mk(xs*x,ys*y);
    return np;
  }
  let rp=this.mapPath(path,f);
  return rp;
}
 
item.straightPath = function (p0,p1) {
  let pe0 = {pathTime:0,value:p0};
  let pe1 = {pathTime:1,value:p1};
  let path =[pe0,pe1];
  return path;
}
/*
 item.circleToPath = function (circle,numSegs) {
  let {center,radius} = circle;
  let inc = (2*Math.PI)/numSegs;
  let path=[];
  for (let i=0;i<=numSegs;i++) {
    let a = i*inc;
    let x = Math.cos(a);
    let y = Math.sin(a);
    let p = Point.mk(x,y).times(radius);
    let t = i/numSegs;
    let pe = {pathTime:t,value:p};
    path.push(pe);
  }
  return path;
}
*/
 item.circleToPath = function (circle,scale) {
  let {center,radius} = circle;
  debugger;
  let scaleX = 1;
  let scaleY = 1;
  if (scale) {
    scaleX = scale.x;
    scaleY = scale.y;
  }
  let sv = center.plus(Point.mk(radius,0));
 // let sv = Point.mk(center.plus(radius,0));
  let pf = (fr) => {
    let a = fr * 2 * Math.PI;
    let x = scaleX*radius*Math.cos(a);
    let y = scaleY*radius*Math.sin(a);
    let p = Point.mk(x,y)
    return p.plus(center);;
  }
  let pe0 = {pathTime:0,value:sv,pathFunction:pf};
  let pe1 = {pathTime:1,value:sv};
  pe0.length = 2*Math.PI.radius;
  let path=[pe0,pe1];
  return path;
}
 
 item.arcToPath = function (arc) {
//  debugger;
  let radius = arc.radius;
  let a0 = arc.angle0;
  let a1 = arc.angle1;
  let aln = Math.abs(a1-a0);
  let sv = arc.pointAlong(0);
  let ev = arc.pointAlong(1);
  let pf = (fr) => arc.pointAlong(fr);
  let pe0 = {pathTime:0,value:sv,pathFunction:pf};
  let pe1 = {pathTime:1,value:ev};
  let path=[pe0,pe1];
  pe0.length = aln*radius;
  return path;
}
item.bendToPathh = function (params) {
  let {bendKind:bk,startPoint:sp,direction:dir,radius} = params;
  //bend kinds are UL UR
  //                  LL LR
  
  let center,a0,a1;
  if (bk === 'UL') {
     center = sp.plus(Point.mk(0,radius));
     a0 = -Math.PI/2;
     a1 = -Math.PI;
   } else if (bk === 'UR') {
      center = sp.plus(Point.mk(0,radius));
     a0 = -Math.PI/2;
     a1 = 0;
  } else if (bk === 'LL') {
     center = sp.plus(Point.mk(0,-radius));
     a0 = Math.PI/2;
     a1 = Math.PI; 
  } else if (bk === 'LR') {
      center = sp.plus(Point.mk(0,-radius));
     a0 = Math.PI/2;
     a1 = 0;    
  }   
  let arc = dir==='clockwise'? Arc.mk(center,a0,a1,radius):Arc.mk(center,a1,a0,radius);
  let path = this.arcToPath(arc);
  return path;
}


item.uturnToPath = function (params) {
  let {startPoint:sp,fromDir,dirChange:dc,radius} = params;
  console.log('fromDir',fromDir,'dc',dc);
  // dirChange is clockwise or counterclockwise
  //fromDir is left right up down
  let center,a0,a1;
  if (fromDir === 'left') {
    if (dc === 'clockwise') {
      center = sp.plus(Point.mk(0,-radius));
      a0 = Math.PI/2;
      a1 = 3*Math.PI/2;
    }  else {
      center = sp.plus(Point.mk(0,radius));
      a0 = -Math.PI/2;
      a1 = -3*Math.PI/2;
    }
  }
  if (fromDir === 'right') {
    if (dc === 'clockwise') {
      center = sp.plus(Point.mk(0,radius));
      a0 = -Math.PI/2;
      a1 = Math.PI/2;
    }  else {
      center = sp.plus(Point.mk(0,-radius));
      a0 = Math.PI/2;
      a1 = -Math.PI/2;
    }
  }
   if (fromDir === 'up') {
    if (dc === 'clockwise') {
      center = sp.plus(Point.mk(radius,0));
      a0 = -Math.PI;
      a1 = 0;
    }  else {
      center = sp.plus(Point.mk(-radius,0));
      a0 = 0;
      a1 = -Math.PI;
    }
  }
  if (fromDir === 'down') {//uturn
    if (dc === 'clockwise') {
      center = sp.plus(Point.mk(-radius,0));
      a0 = 0;
      a1 = Math.PI;
    }  else {
      center = sp.plus(Point.mk(radius,0));
      a0 = Math.PI;
      a1 = 0;
    }
  }
  let arc =  Arc.mk(center,a0,a1,radius);
  let path = this.arcToPath(arc);
  return path;
}


item.bendToPath = function (params) {
  let {startPoint:sp,fromDir,dirChange:dc,radius} = params;
    console.log('fromDir',fromDir,'dc',dc);

  /* dirChange is clockwise or counterclockwise
  fromDir is left right up down
  */
  let center,a0,a1;
  if (fromDir === 'left') {
    if (dc === 'clockwise') {
      center = sp.plus(Point.mk(0,-radius));
      a0 = Math.PI/2;
      a1 = Math.PI;
    }  else {
      center = sp.plus(Point.mk(0,radius));
      a0 = -Math.PI/2;
      a1 = -Math.PI;
    }
  }
  if (fromDir === 'right') {
    if (dc === 'clockwise') {
      center = sp.plus(Point.mk(0,radius));
      a0 = -Math.PI/2;
      a1 = 0;
    }  else {
      center = sp.plus(Point.mk(0,-radius));
      a0 = Math.PI/2;
      a1 = 0;
    }
  }
   if (fromDir === 'up') {
    if (dc === 'clockwise') {
      center = sp.plus(Point.mk(radius,0));
      a0 = -Math.PI;
      a1 = -Math.PI/2;
    }  else {
      center = sp.plus(Point.mk(-radius,0));
      a0 = 0;
      a1 = -Math.PI/2;
    }
  }
  if (fromDir === 'down') {
    if (dc === 'clockwise') {
      center = sp.plus(Point.mk(-radius,0));
      a0 = 0;
      a1 = Math.PI/2;
    }  else {
      center = sp.plus(Point.mk(radius,0));
      a0 = Math.PI;
      a1 = Math.PI/2;
    }
  }
  let arc =  Arc.mk(center,a0,a1,radius);
  let path = this.arcToPath(arc);
  return path;
}
   
  
  
item.sinWaveToPath = function (params) {
  let {waveLength:wl,amplitude:a,startPoint:sp,thetaAtStart:tas,thetaAtEnd:tae} = params;
  let vas =Math.sin(tas)*a;
  let yoff = sp.y-vas;
  const pf = (fr) => {
    let theta = tas + fr*(tae-tas);
    let valy = Math.sin(theta)*a+yoff;
    let valx = ((theta - tas)/(2*Math.PI))*wl;
    return Point.mk(valx,valy).plus(sp);
  }
  let ep = pf(1);
  let pe0 = {pathTime:0,value:sp,pathFunction:pf};
  let pe1 = {pathTime:1,value:ep};
  let path=[pe0,pe1];
  return path;
}
    
  



item.bendPath = function (params) {
 let {radius,startPosition:sp,bendCenter:bc,bendBy:bb,numSegs} = params;
}
 
item.snakePath = function (params) {
 let {height:ht,width:wd,numBends,numSegs} = params;
 let rowht = ht/numBends;
 let bendRadius = rowht/2;
 let straightDist = wd - 4*bendRadius;
 let turnLength = Math.PI*bendRadius;
 let totalLength = numBends * straighDist + turnLength;
 let segLength = totalLength/numSegs;
 let lengthPerBend = straightDist+turnLength;
 const whichBend = (x) => Math.floor(x/lengthPerBend);
 const bendStart = (x) => whichBend*lengthPerBend;
 }
   
   
  
 item.spiralToPath = function (params) {
  let {radius,numTurns:nt,segsPerTurn:spt} = params;
  let ns = Math.floor(nt*spt);
  let inca = (nt*2*Math.PI)/ns
  let incd = radius/ns;
  let path=[];
  let a;
  for (let i=0;i<ns;i++) {
    let cr = i*incd;
    a = i*inca;
    let x = Math.cos(a);
    let y = Math.sin(a);
    let p = Point.mk(x,y).times(cr);
    let t = i/ns;
    let pe = {pathTime:t,value:p};
    console.log('i',i,'cr',cr);
    path.push(pe);
  }
  let pe = {pathTime:1,value:Point.mk(0,0)};
  path.push(pe);
  return path;
}

item.mkColorApath = function (colorArrays,shapes,speed) { //shapes might be an array or a single shape
  let path = this.mkUniformPath(colorArrays);
  let action =(ap) => {
    let {value:vl,shapes,shape} = ap;
    let fill = this.arrayToRGB(vl);
    if (shapes) {
      shapes.forEach((sh) => {
        sh.fill = fill;
        sh.stroke = fill;
        sh.update();
      });
    } else {
      shape.fill = fill;
      shape.stroke = fill;
      shape.update();
    }
  }
  
  let value = this.deepCopy(colorArrays[0]);
  let params = {path,speed,value,action};
  if (Array.isArray(shapes)||Array.isArray(Object.getPrototypeOf(shapes))) {
    params.shapes = shapes;
  } else {
    params.shape = shapes;
  }
  let ap = this.mkActivePath(params);
  return ap;
}
 
 
 
item.pathAroundCell = function (params,x,y,offset) {
  let pnts = this.pointsAroundCell(params,x,y);
  let path = [];
  let ln = pnts.length;
  for (let i=0;i<ln;i++) {
    let pel = {pathTime:i,value:offset.plus(pnts[i])};
    path.push(pel);
  }
  return this.normalizePath(path);
}


 item.show2dPathWaypoints = function (path) {
  let {polylineP,polylines} = this;
  let poly = polylineP.instantiate();
  let points = path.map((el) => el.value);
  poly.wayPoints = points;
  polylines.push(poly);
  poly.show();
  poly.update();
}


item.show2dPath = function (path,numSegs) {
  let {polylineP,polylines} = this;
  let poly = polylineP.instantiate();
  let points = [];
  for (let i=0;i<=numSegs;i++) {
    let fr = i/numSegs;
    let p = this.pointAlongPath(path,fr);
    points.push(p);
  }
  poly.wayPoints = points;
  polylines.push(poly);
  poly.show();
  poly.update();
}

item.concatTwoPaths = function (path0,path1) {
  let pln0 = this.pathLength(path0);
  let pln1 = this.pathLength(path1);
  let ln0= path0.length;
  let ln1= path1.length;
  let np =[];
  let npln = pln0+pln1;
  let tsc0 = pln0/npln;
  let tsc1 = pln1/npln;
  for (let i=0;i<ln0-1;i++) {
    let pe = path0[i];
    let pt = pe.pathTime;
    pe.pathTime =  tsc0*pt;
    np.push(pe);
  }
  for (let i=0;i<ln1;i++) {
    let pe = path1[i];
    let pt = pe.pathTime;
    pe.pathTime =  tsc0+tsc1*pt;
    np.push(pe);
  }
  let pe0 = np[0];
  pe0.length=npln;
  return np;
}

item.concatPaths = function (paths) {
  let np = paths.length;
  let cp = paths[0];
  for (let i=1;i<np;i++) {
    cp = this.concatTwoPaths(cp,paths[i]);
  }
  return cp;
}
item.interpolatePaths = function(p0,p1,ofr)  {
  const pf = (ifr) => {
    let pnt0 = this.pointAlongPath(p0,ifr);
    let pnt1 = this.pointAlongPath(p1,ifr);
    let pnt = this.interpolate(pnt0,pnt1,ofr);
    return pnt;
  }
  let sp = pf(0);
  let ep = pf(1);
    
  let pe0 = {pathTime:0,value:sp,pathFunction:pf};
  let pe1 = {pathTime:1,value:ep};
  let path=[pe0,pe1];
  return path;
}
}
export {rs};


