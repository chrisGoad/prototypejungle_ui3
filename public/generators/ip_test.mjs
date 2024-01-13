import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addIPmethods} from '/mlib/interpolation_path_0.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();

addIPmethods(rs);
addAnimationMethods(rs);

rs.setName('ip_test');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1,stopTime:100}

Object.assign(rs,topParams)

let pv = ht/4;

let UL = Point.mk(-pv,-pv);
let UR = Point.mk(pv,-pv);
let LR = Point.mk(pv,pv);
let LL = Point.mk(-pv,pv);

let p = [{pathTime:0,value:UL},{pathTime:1,value:UR},{pathTime:2,value:LR},{pathTime:3,value:LL},{pathTime:4,value:UL}];
let np = rs.normalizePath(p);
let ap = rs.mkActivePath(0,1/10,np);
rs.activePaths = [ap];



rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP,circleP} = this;
  this.addFrame();
  this.numSteps =stp/tps;
}    
rs.updateState = function () {
  let {currentTime:ct,activePaths} = this;
  let ap = this.activePaths[0]
  debugger;
  this.runActivePaths();
  console.log('time',ct,'value',ap.value);
  debugger;
}


export {rs}
  

  