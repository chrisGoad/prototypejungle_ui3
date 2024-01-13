

const rs = function (item) {
/* an  interpolation_path is an array of timeStamped values [{time:time0,value:val0,},{time:time1,value:val1} ....]

the values are hereditary arrays for which the interpolate function in basics.mjs works.

an active interpolation path is {cyclic,startTime,speed,pathTime,cycle:integer,path:p,activeElementIndex:integer,value,action} where the activeElementIndex is the index of  the path element 
which is active at pathTime. pathTime is path relative.  globalTime = startTime+ pathTime/speed. pathTime = (globalTime-startTime)/speed
pathTimes are normalized to [0,1];;
*/

item.updateActivePath = function (ap,gt) { // global time; t is relative  time
  let {startTime,speed,path,activeElementIndex:aei,cycle} = ap;
  let pt = (gt-startTime)*speed - cycle;//pathTime
  let pln = path.length;
  while (1) {
    let sae = path[aei]; //sae = start active element
    let {pathTime:st,value:sv} = sae; // st= start time, sv = start value
    if ((pt < 0) || (pt>1)){ //  not started or over
      return 0;
    }
    let eaei = aei + 1;; //end active element index
    if (eaei < pln) { 
      let eae = path[eaei];
      let {pathTime:et,value:ev} = eae;
      if (pt<=et) { // t is within the active element
        let iv = this.interpolate(sv,ev,(pt-st)/(et-st));
        ap.value = iv;
        ap.pathTime = pt;
        ap.activeElementIndex =aei;
        return 1;
      } else {
        aei = aei+1;
      }
    } else {
      ap.cycle = cycle+1;
      pt = pt-1;
      aei = 0;
    }
   
  }
}
    
item.normalizePath = function (p) {
  debugger;
  let pln = p.length;
  let last = p[pln-1];
  let dur = last.pathTime;
  let np = p.map((pe) => {
    let {pathTime:pt,value} =  pe;
    return {pathTime:pt/dur,value};
    
  })
  return np;
}

item.mkActivePath = function (startTime,speed,path) {
  let ap = {startTime,speed,path,activeElementIndex:0,cycle:0};
  return ap;
}

item.runActivePaths  = function () {
  let {currentTime:gt,activePaths:aps} = this;
  aps.forEach( (ap) => {
    let {action} = ap;
    let active = this.updateActivePath(ap,gt);
    if (active && action) {
      action.call(this,ap);
    }
  });
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
 
  
}

export {rs};


