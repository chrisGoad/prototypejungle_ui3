

debugger;
import {rs as spinner} from '/instances/gridSpinner_28.mjs';

import {rs as addAnimationMethods} from '/mlib/animate0.mjs';


import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();
addAnimationMethods(rs);

rs.set('spinner',spinner);

rs.setName('gridSpinner_27');

rs.initialize = function () {
  debugger;
  this.spinner.initialize();
  
}



rs.updateState = function () {
  debugger;
    let {stepsSoFar:ssf} =this;

  this.spinner.stepsSoFar = ssf;
  this.spinner.updateState();
} 

  
export {rs};


