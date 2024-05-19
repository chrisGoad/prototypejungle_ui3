
import {rs as generatorP} from '/instances/part2_0_I_16.mjs';

let rs = generatorP.instantiate();


rs.setName('part2_0_I_16_2');

let wd =200;
let ht =100;
let nc=80;
let nr=40;
let myParams = {width:wd,height:ht,numCols:nc,numRows:nr};
Object.assign(rs,myParams);

debugger;

rs.updateState = function () {
  debugger;
  let {numSteps,stepsSoFar:ssf} = this;
  this.partParams.splitParams.direction = (ssf/numSteps)*2*Math.PI;//= {Case:9,direction:-0.25*Math.PI,radius:0.2,pcs:[.4,1.4,2.4,3.4]};
  this.resetShapes();
  this.afterInitialize();
}
export {rs};

