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


let topParams = {width:ht,height:ht,framePadding:1.85*ht,frameStrokee:'white',frameStrokeWidth:.25,timePerStep:1/(3*180),stopTime:1,recordingMotion:1,saveAnimation:1,
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
  lineP['stroke-width'] = 5; 
}



rs.circleCount = 0;      
rs.addAcircle = function (radius,speed,left,vdisplacement) {
  let {circleCount:cc,circleP,width:wd} = this; 
  let v = vdisplacement;
    
  let nm = 'circle'+cc;
  let circle,colors
  if ((cc===0)||(cc===3)) {
    colors = [[250,250,250],[250,250,250],[250,100,0],[250,0,0],[250,250,0],[0,250,0],[0,250,250],[0,0,250],[100,100,250]];
    circle = this.anArc(60,50,20);
  } else if ((cc === 1)||(cc===4)) {
    colors = [[0,0,250],[0,0,250],[250,0,250],[250,0,0],[250,250,0],[0,250,0],[100,250,100],[250,250,250],[100,100,100],[0,0,0],[0,0,100]];
    circle = circleP.instantiate();
    circle.radius = radius;
  } else {
    colors = [[0,0,0],[0,0,0],[100,0,0],[250,0,0],[250,250,0],[0,250,0],[0,250,250],[0,0,250],[100,100,250],[250,250,250],[100,100,100]];
    circle = circleP.instantiate();
    circle.radius = radius;
  }
  this.set(nm,circle);
  let d = 0.75*wd;
  let dest = Point.mk(left?-d:d,v);
  if (left) {
    colors.reverse();
  }
  colors.unshift([250,95,0]);
  circle.moveto(dest);
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
rs.addNose = function (v) {
  let {width:wd,polygonP,lineP} = this;
  let noseHWD=0.3*wd;
  let noseHt = .8*wd;
  let noseD = .2*wd;
  let noseTop = Point.mk(0,noseD);
  let noseBot = Point.mk(0,noseD+noseHt);
  let noseLp = Point.mk(-noseHWD,noseD+noseHt);
  let noseRp = Point.mk(noseHWD,noseD+noseHt);
  let noseL = polygonP.instantiate();
  let noseR = polygonP.instantiate();
  noseL.corners = [noseTop,noseBot,noseLp,noseTop];
  noseR.corners = [noseTop,noseBot,noseRp,noseTop];
  this.set('noseL',noseL);
  this.set('noseR',noseR);
  let dest = Point.mk(0,v);
  noseL.moveto(dest);
  noseR.moveto(dest);
  let RNcolors = [[0,0,250],[0,0,250],[250,0,250],[250,0,0],[250,250,0],[0,250,0],[100,250,100],[250,250,250],[100,100,100],[70,70,70],[0,0,100]];
  let LNcolors = [...RNcolors];
  LNcolors.reverse();
  RNcolors.unshift([250,95,0]);
  LNcolors.unshift([250,95,0]);
  let npathL = this.mkColorApath(LNcolors,noseL,2);
  let npathR = this.mkColorApath(RNcolors,noseR,2);
   this.activePaths.push(npathL);
   this.activePaths.push(npathR);

  return;
  let mouthHWD = 2*noseHWD;
  let mouthD = noseD+noseHt+0.3*wd;
  let mouthLp = Point.mk(-mouthHWD,mouthD);
  let mouthCp = Point.mk(0,mouthD);
  let mouthRp = Point.mk(mouthHWD,mouthD);
  let mouthL = lineP.instantiate();
  let mouthR = lineP.instantiate();
  mouthL.setEnds(mouthLp,mouthCp);
  mouthR.setEnds(mouthRp,mouthCp);
  this.set('mouthL',mouthL);
  this.set('mouthR',mouthR);
  //let Rcolors = [[250,250,250],[250,250,250],[250,100,0],[250,0,0],[250,250,0],[0,250,0],[0,250,250],[0,0,250],[100,100,250]];
  let   RMcolors = [[100,100,100],[100,100,100],[100,0,0],[250,0,0],[250,250,0],[0,250,0],[0,250,250],[0,0,250],[100,100,250],[250,250,250],[100,100,100]];

  let LMcolors = [...RMcolors];
  LMcolors.reverse();
  let mpathL = this.mkColorApath(LMcolors,mouthL,4);
  let mpathR = this.mkColorApath(LMcolors,mouthR,4);
  this.activePaths.push(mpathL);
  this.activePaths.push(mpathR);
}


rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,circleP} = this;
  this.addFrame();
  this.numSteps =stp/tps;
 this.activePaths =[];
 let vd = -30;
 this.addAcircle(30,1,1,vd);
 this.addAcircle(10,2,1,vd);
 this.addAcircle(5,4,1,vd);
 this.addAcircle(30,1,0,vd);
 this.addAcircle(10,2,0,vd);
 this.addAcircle(5,4,0,vd);
 this.addNose(vd);
}

rs.updateState = function () {
  let {currentTime:ct,activePaths,circ,lineP,segs,ints} = this;
  //let ap = this.activePaths[0]
  debugger;
  this.runActivePaths();
 
}



    
 
export {rs};



