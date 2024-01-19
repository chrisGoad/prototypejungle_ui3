import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addIPmethods} from '/mlib/interpolation_path_0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);
addIPmethods(rs);
rs.setName('color_path_0');
let ht=50;


let topParams = {width:ht,height:ht,framePadding:0.3*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/1180,stopTime:1,recordingMotion:1,saveAnimation:1,
    circleRadius:20,ringRadii:[],nearestCount:6,nearestFadeFactor:0,toAngle:2*Math.PI,particleColor:'blue',shapesPerPath:4,speed:1}

Object.assign(rs,topParams);
let subParams ={speed:10,shapesPerRing:2};

debugger;


  
rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'orange';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .0; 
}



rs.circleCount = 0;      
rs.addAcircle = function (radius,speed) {
  let {circleCount:cc,circleP} = this; 
  let nm = 'circle'+cc;
  let circle = this.set(nm,circleP.instantiate());
  circle.radius = radius;
  let colors = [];
  for (let i=0;i<5;i++) {
    let rc =this.randomColorArray(100,250);
    colors.push(rc);
  }
  let apath = this.mkColorApath(colors,circle,speed);
  this.activePaths.push(apath);
  this.circleCount=cc+1;
}
rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,circleP} = this;
  this.addFrame();
  this.numSteps =stp/tps;
 // this.numSteps =80;
 // this.stepArrayy = [0].concat(this.sequentialArray(102,120));
 this.activePaths =[];
 this.addAcircle(30,1);
 this.addAcircle(20,2);
 this.addAcircle(10,4);
 
}

rs.updateState = function () {
  let {currentTime:ct,activePaths,circ,lineP,segs,ints} = this;
  //let ap = this.activePaths[0]
  debugger;
  this.runActivePaths();
 
}



    
 
export {rs};



