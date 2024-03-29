


import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPathMethods} from '/mlib/path.mjs';	
import {rs as addPathInParts} from '/mlib/path_in_parts.mjs';
let rs = basicP.instantiate();
addPathMethods(rs);
addPathInParts(rs);

rs.interpolate = function (lb,ub,fr) {
  let delta = ub-lb;
  return lb+fr*delta;
}

rs.interpolate = function (lba,uba,fr) {
  let ln = lb.length;
  let ra = [];
  for (let i=0;i<ln;i++) {
    let lb=lba[i];
    let ub = uba[i];
    let vl = this.interpolate(lb,ub,fr);
    ra.push(vl);
  }
  return ra;
}

rs.addPath = function (nm) {
  let {pstate} = this;
  let {pspace,cstate} = pstate;
  let dur = this.duration;
 // let nm = 'v_'+n;
  pspace[nm] = {kind:'sweepFixedDur',dur,min:0,max:1};
  cstate[nm] = {value:0};
};


rs.buildSeqOb = function () {
  let {pstate,numCycles,arrayLen} = this;
  let {pspace} = pstate;
  let props = Object.getOwnPropertyNames(pspace);
  return this.randomArraySeqOb({props,ln:arrayLen,lb:0,ub:0,numCycles:numCycles-1});
}

  
export {rs};


