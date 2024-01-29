

const rs = function (item) {
/* an  interpolation_path is  array of timeStamped values [{pathTime:time0,value:val0,},{pathTime:time1,value:val1} ....]
the values are hereditary arrays for which the interpolate function in basics.mjs works.

 
an active interpolation path is {cyclic,startTime,speed,pathTime,cycle:integer,path:p,activeElementIndex:integer,value,action} where the activeElementIndex is the index of  the path element 
which is active at pathTime. pathTime is path relative.  globalTime = startTime+ pathTime/speed. pathTime = (globalTime-startTime)/speed
pathTimes are normalized to [0,1];;
*/

item.updateActivePath = function (ap,gt) { // global time; t is relative  time
  let {startTime,startOffset,speed,path,activeElementIndex:aei,cycle} = ap;
  let pln = path.length;
  while (1) {
    let pt = startOffset + (gt-startTime)*speed - cycle;//pathTime
    let sae = path[aei]; //sae = start active element
    let {pathTime:st,value:sv} = sae; // st= start time, sv = start value
    if (pt < 0){ //  not started or over
      return 0;
    }
    let eaei = aei + 1;; //end active element index
    if (eaei < pln) { 
      let eae = path[eaei];
      let {pathTime:et,value:ev} = eae;
      if (pt<=et) { // t is within the active element
        let iv = this.interpolate(sv,ev,(pt-st)/(et-st));
        this.copyTo(ap.value,iv);
        ap.pathTime = pt;
        ap.activeElementIndex =aei;
        return 1;
      } else {
        aei = aei+1;
      }
    } else {
      debugger;
      cycle = ap.cycle = cycle+1;
      pt = pt-1;
      aei = 0;
    }
   
  }
}
    
item.normalizePath = function (p) {
  let pln = p.length;
  let last = p[pln-1];
  let dur = last.pathTime;
  let np = p.map((pe) => {
    let {pathTime:pt,value} =  pe;
    return {pathTime:pt/dur,value};
    
  })
  return np;
}


item.mapPath = function (p,f) {
  let pln = p.length;
  let np = p.map((pe) => {
    let {pathTime,value} =  pe;
    return {pathTime,value:f(value)};
    
  })
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
 
 // uniform timing; also adds elements[0] as last path element
  
 item.mkUniformPath = function (elements) {
  let ln = elements.length;
  let ipath = [];
  for (let i=0;i<ln;i++) {
    let e = elements[i]
    let pel = {pathTime:i,value:e};
    ipath.push(pel);
  }
  let e0 = elements[0];
  let pel = {pathTime:ln,value:e0};
  ipath.push(pel);
  let npath = this.normalizePath(ipath);
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
 
item.bumpyCircleToPath = function (params) {
  let {icenter,innerRadius:ird,outerRadius:ord,numBumps,numSegs} = params;
  let center=icenter?icenter:Point.mk(0,0);
  let delta = ord-ird;
  let radius = ird+0.5*delta;
  let do2 = delta/2;
  let inc = (2*Math.PI)/numSegs;
  let bumpL = (2*Math.PI)/numBumps;
  let path=[];
  for (let i=0;i<=numSegs;i++) {
    let a = i*inc;
    let wib = (a%bumpL)/bumpL;//whereInBump
    let bv = Math.sin(wib*2*Math.PI);
   // console.log('wib',wib,'bv',bv);
    let x = Math.cos(a);
    let y = Math.sin(a);
    let p = Point.mk(x,y).times(radius+bv*do2);
    let t = i/numSegs;
    let pe = {pathTime:t,value:p};
    path.push(pe);
  }
  return path;
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
    debugger;
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


 item.show2dPath = function (path) {
  let {polylineP,polylines} = this;
  let poly = polylineP.instantiate();
  let points = path.map((el) => el.value);
  poly.wayPoints = points;
  polylines.push(poly);
  poly.show();
  poly.update();
}

}

export {rs};


