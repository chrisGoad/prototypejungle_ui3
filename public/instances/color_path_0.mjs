import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addIPmethods} from '/mlib/interpolation_path_0.mjs';
import {rs as addEyeMethods} from '/mlib/eye_0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);
addIPmethods(rs);
addEyeMethods(rs);

rs.setName('color_path_0');
let ht=50;


let topParams = {width:ht,height:ht,framePadding:0.34*ht,frameStrokee:'white',frameStrokeWidth:.25,timePerStep:1/(3*180),stopTime:1,recordingMotion:1,saveAnimation:1,
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
  let polygonP = this.polygonP = polygonPP.instantiate();
  polygonP.fill = 'orange';
  polygonP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .0; 
}



rs.circleCount = 0;      
rs.addAcircle = function (radius,speed) {
  let {circleCount:cc,circleP} = this; 
    
  let nm = 'circle'+cc;
  let circle,colors
  if (cc===0) {
    colors = [[250,250,250],[250,100,0],[250,0,0],[250,250,0],[0,250,0],[0,250,250],[0,0,250],[100,100,250]];
    circle = this.anArc(60,50,20);
  } else if (cc === 1) {
    colors = [[0,0,250],[250,0,250],[250,0,0],[250,250,0],[0,250,0],[100,250,100],[250,250,250],[100,100,100],[0,0,0],[0,0,100]];
    circle = circleP.instantiate();
    circle.radius = radius;
  } else {
    colors = [[0,0,0],[100,0,0],[250,0,0],[250,250,0],[0,250,0],[0,250,250],[0,0,250],[100,100,250],[250,250,250],[100,100,100]];
    circle = circleP.instantiate();
    circle.radius = radius;
  }
  this.set(nm,circle);
 // let colors = [[250,0,0],[250,250,0],[0,250,0],[0,250,250],[0,0,250],[100,100,250],[250,250,250],[250,100,100]];
  //let colors = [[250,0,0],[250,250,0],[0,250,0],[0,250,250],[0,0,250],[100,100,250],[250,250,250],[100,100,100],[0,0,0],[100,0,0]];
 /* let colors = [];
  for (let i=0;i<5;i++) {
    //let rc =this.randomColorArray(100,250);
    //let rc =this.randomGrayArray(100,250);
    let rc =this.randomYellowArray(0,150,250);
    colors.push(rc);
  }*/
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
 this.activePaths =[];
 this.addAcircle(30,1);
 this.addAcircle(10,2);
 this.addAcircle(5,4);
 
}

rs.updateState = function () {
  let {currentTime:ct,activePaths,circ,lineP,segs,ints} = this;
  //let ap = this.activePaths[0]
  debugger;
  this.runActivePaths();
 
}



    
 
export {rs};



