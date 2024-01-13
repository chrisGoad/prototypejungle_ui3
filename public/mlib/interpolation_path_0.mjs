

const rs = function (item) {
/* an  interpolation_path is an array of timeStamped values [{time:time0,value:val0,},{time:time1,value:val1} ....]

the values are hereditary arrays for which the interpolate function in basics.mjs works.

an active interpolation path is {cyclic,startTime,speed,pathTime,cycle:integer,path:p,activeElementIndex:integer,value,action} where the activeElementIndex is the index of  the path element 
which is active at pathTime. pathTime is path relative.  globalTime = startTime+ pathTime/speed. pathTime = (globalTime-startTime)/speed
pathTimes are normalized to [0,1];;
*/

rs.updateActivePath = function (ap,gt) { // global time; t is relative  time
  let {startTime,speed,path,activeElementIndex:aei,cycle} = ap;
  let pt = (gt-startTime)/speed - cycle;//pathTime
  let pln = path.length;
  while (1) {
    let sae = path[aei]; //sae = start active element
    let {time:st,value:sv} = sae; // st= start time, sv = start value
    if (pt < 0) || (pt>1)){ //  not started or over
      return 0;
    }
    eaei = aei + 1;; //end active element index
    if (eaei < pln) { 
      let eae = path[eaei];
      let {time:et,value:ev} = eae;
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
    
rs.normalizePath = function (p) {
  let pln = p.length;
  let last = p[pln-1];
  let dur = last.pathTime;
  p.forEach(((pe) => {
    let pt = pe.pathTime;
    pe.pathTime = pt/dur;
  })
}

rs.mkActivePath = function (startTime,speed,path) {
  let ap = {startTime,speed,path,activeElementIndex:0};
  return ap;
}

rs.runActivePaths  = function () {
  let {currentTime:gt,activePaths:aps} = this;
  let 
  aps.forEach( (ap) => {
    let {action} = ap;
    let active = this.updateActivePath(p,gt);
    if (active && action) {
      action.call(this,ap);
    }
  });
}
 
  
}

export {rs};


