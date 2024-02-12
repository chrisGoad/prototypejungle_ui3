import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
//import {rs as basicP} from '/generators/basics.mjs';
//import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
//import {rs as generatorP} from '/generators/motion_3.mjs'
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addIPmethods} from '/mlib/interpolation_path_0.mjs';
import {rs as generatorP} from '/generators/motion_3.mjs'

let rs = generatorP.instantiate();


addIPmethods(rs);

rs.setName('path_test_2');
let ht=50;


let topParams = {width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:-0.1*ht,frameStroke:'white',frameStrokeWidth:.2,
timePerStep:1/(16*32),stopTime:1,recordingMotion:1,saveAnimation:1,distanceThreshold:3,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:200,speed:1,segsPerCircle:20,radius:.4*ht,numSlices:8,bendRadius:1.5};

Object.assign(rs,topParams);
let subParams ={speed:10,shapesPerRing:2};



  
rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .1; 
   let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .1; 
}


rs.addBend = function (paths,params) {
  let {startPoint:sp,straightLength:sln,radius,lastLength:lln,rightFacing:rf} = params;
  let ep0 = sp.plus(Point.mk(rf?sln:-sln,0));
  let path0 = this.mkUniformPath([sp,ep0]);
  let params1 = {fromDir:rf?'right':'left',startPoint:ep0,radius,dirChange:rf?'clockwise':'counterclockwise'};
  let path1 = this.uturnToPath(params1);
  let yc  = Point.mk(0,2*radius);
  let sp2 = ep0.plus(yc);
  let ep2 = lln?sp2.plus(Point.mk(rf?-lln:lln,0)):sp2.plus(Point.mk(rf?-sln:sln,0));
  let path2 = this.mkUniformPath([sp2,ep2]);
  paths.push(path0,path1,path2);
  if (lln) {
    return ep2;
  }
  let params3 = {fromDir:rf?'left':'right',startPoint:ep2,radius,dirChange:rf?'counterclockwise':'clockwise'};
  let path3 = this.uturnToPath(params3);
  paths.push(path3);
  return ep2.plus(yc);
}

rs.addE = function (paths,params) {
  let {rightFacing:rf,startPoint:sp,straightLength:sln,lastLength:lln,radius} = params;
  let bparams = {startPoint:sp,radius,rightFacing:rf,straightLength:sln};
  let bendend = this.addBend(paths,bparams);
  bparams.startPoint = bendend;
  for (let i=0;i<4;i++) {
    bendend = this.addBend(paths,bparams);
    bparams.startPoint = bendend;
  }
  bparams.lastLength =lln;
  bendend = this.addBend(paths,bparams);
  bparams = {fromDir:rf?'left':'right',startPoint:bendend,radius,dirChange:rf?'clockwise':'counterclockwise',radius};
  let bend0 = this.bendToPath(bparams);
  paths.push(bend0);
  bendend = bend0[1].value;
  let returnEnd = Point.mk(bendend.x,sp.y+radius);
  let returnPath = this.mkUniformPath([bendend,returnEnd]);
  paths.push(returnPath);
  bparams = {fromDir:rf?'up':'up',startPoint:returnEnd,dirChange:rf?'clockwise':'counterclockwise',radius};
  let bend1 = this.bendToPath(bparams);
  bendend  =bend1[1].value;
  paths.push(bend1);
  let closingPath = this.mkUniformPath([bendend,sp]);
  paths.push(closingPath); 
}
rs.initialize = function () {
   debugger;
   this.initProtos();
   let {radius,lineP,bendRadius} = this;
  this.addFrame();
  this.set('shapes',arrayShape.mk());
  this.numSteps = 5;
  let lines = this.set('lines',arrayShape.mk());
  let polylines = this.set('polylines',arrayShape.mk());
  let paths0 = [];
  let paths1 = [];
  let spy = -17;
  let sp0 = Point.mk(-9,spy);
  let sp1 = Point.mk(9,spy);
  this.addE(paths0,{startPoint:sp0,straightLength:10,radius:bendRadius,lastLength:14,rightFacing:0});
  this.addE(paths1,{startPoint:sp1,straightLength:10,radius:bendRadius,lastLength:14,rightFacing:1});  
  let path0  = this.concatPaths(paths0);
  let path1  = this.concatPaths(paths1);

 
  
  this.speedFun = (j,i) => {
    let iodd = i%2;
    let jodd = j%2;
    let sp0 = jodd?1:1;
    return iodd?2*sp0:sp0;
  }
  let activePaths = this.activePaths = [];
  let Apaths0 = this.buildApaths([path0]);
  Apaths0.forEach((ap) => {ap.connectMe = 1;activePaths.push(ap)});
  let Apaths1 = this.buildApaths([path1]);
  Apaths1.forEach((ap) => {ap.connectMe = 1;activePaths.push(ap)});
  return;
  //activePaths = this.activePaths = [].concat(Apaths0,Apaths1,Apaths2,Apaths3);
  let av = this.allValuesToConnect();
  this.addLinesBetweenPositions(av,lineP);

}



rs.updateState = function () {
  let {currentTime:ct,activePaths,circ,lineP,segs,ints,stepsSoFar:ssf,radius,distanceThreshold:th} = this;
  console.log('ssf',ssf,'ct',ct);
  debugger;
  this.runActivePaths();
  return;
  let aps = activePaths.filter((ap) => ap.connectMe);
   let mpnts = aps.map((ap) => ap.value);
   const fn = (line,dist) => {
   let v = dist/th;
    let c = Math.floor(v*250);
    if (dist>th) {
      line.hide();
    } else {
      line.show();
      let stroke =`rgb(${c},${c},${c})`;
     // console.log('stroke',stroke);
      
      line.stroke = `rgb(${c},${c},${c})`;
      line.stroke = 'white';
      line.stroke = stroke;
    }
  }
  console.log('th',th);
  this.updateLines(mpnts,fn);
  return;
  let goingUp = ssf<=128;
  let inc=0.015;
  this.distanceThreshold = th+(goingUp?inc:-inc);
}

    
 
export {rs};



