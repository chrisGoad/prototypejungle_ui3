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
let topParams = {circleRadius:1,width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/4,stopTime:100}

Object.assign(rs,topParams)

let pv = ht/4;

let UL = Point.mk(-pv,-pv);
let UR = Point.mk(pv,-pv);
let LR = Point.mk(pv,pv);
let LL = Point.mk(-pv,pv);

let p = [{pathTime:0,value:UL},{pathTime:1,value:UR},{pathTime:2,value:LR},{pathTime:3,value:LL},{pathTime:4,value:UL}];
let np = rs.normalizePath(p);
let ap = rs.mkActivePath(0,1/4,np);

rs.activePaths = [ap];



  
rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.dimension = cr*2;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .05; 
}

rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP,circleP} = this;
  this.addFrame();
  this.numSteps =stp/tps;
  let circ0Shape = circleP.instantiate();
  let circ1Shape = circleP.instantiate();
  this.set('circ0',circ0Shape);
  this.set('circ1',circ1Shape);
  let circ = Circle.mk(Point.mk(0,0),0.4*ht);
  let p = this.circleToPath(circ,40);
  let np = rs.normalizePath(p);
  let ap0 = rs.mkActivePath(0,1/10,np);
  let ap1 = rs.mkActivePath(2,1/20,np);
  ap0.shape = circ0Shape;
  ap1.shape = circ1Shape;
  let action =(ap) => {
    let {shape:sh,value:vl} = ap;
    sh.moveto(vl);
  }
  ap0.action = action;
  ap1.action = action;
  this.activePaths = [ap0,ap1];  
  
}    
rs.updateState = function () {
  let {currentTime:ct,activePaths,circ} = this;
  let ap = this.activePaths[0]
 // debugger;
  this.runActivePaths();
  let vl = ap.value;
  console.log('time',ct,'value',vl);
  //circ.moveto(vl);
}


export {rs}
  

  