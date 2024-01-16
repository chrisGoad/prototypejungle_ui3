

const rs = function (item) {
/* an  interpolation_path is an array of timeStamped values [{time:time0,value:val0,},{time:time1,value:val1} ....]

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

//item.mkActivePath = function (startTime,startOffset,speed,path) {
item.mkActivePath = function (params) {
  let {startTime:st,startOffset:soff,speed,path,value} = params; //value is an object for interpolated values to be copied into
  let ap = {startTime:st?st:0,startOffset:soff?soff:0,speed,path,activeElementIndex:0,cycle:0,value};
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
  
}

export {rs};


