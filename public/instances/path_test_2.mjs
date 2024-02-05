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
timePerStep:1/(16*32),stopTime:1,recordingMotion:1,saveAnimation:1,distanceThreshold:6,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:60,speed:1,segsPerCircle:20,radius:.4*ht,numSlices:8,bendRadius:4};

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
  let {startPoint:sp,straightLength:sln,radius,lastLength:lln} = params;
  let ep0 = sp.plus(Point.mk(sln,0));
  let path0 = this.mkUniformPath([sp,ep0]);
  let params1 = {fromDir:'right',startPoint:ep0,radius,dirChange:'clockwise'};
  let path1 = this.uturnToPath(params1);
  let yc  = Point.mk(0,2*radius);
  let sp2 = ep0.plus(yc);
  let ep2 = lln?sp2.plus(Point.mk(-lln,0)):sp2.plus(Point.mk(-sln,0));
  let path2 = this.mkUniformPath([sp2,ep2]);
  paths.push(path0,path1,path2);
  if (lln) {
    return ep2;
  }
  let params3 = {fromDir:'left',startPoint:ep2,radius,dirChange:'counterclockwise'};
  let path3 = this.uturnToPath(params3);
  paths.push(path3);
  //paths.push(path2,path3);
  return ep2.plus(yc);
}

rs.initialize = function () {
   debugger;
   this.initProtos();
   let {radius,lineP,bendRadius} = this;
  this.addFrame();
  this.set('shapes',arrayShape.mk());
  this.numSteps = 10000;
  let lines = this.set('lines',arrayShape.mk());
  let polylines = this.set('polylines',arrayShape.mk());
/*  let path0 = this.mkUniformPath([Point.mk(0,0),Point.mk(10,0)]);
  let params1 = {fromDir:'right',startPoint:Point.mk(10,0),radius:4,dirChange:'clockwise'};
  let path1 = this.uturnToPath(params1);
  let path2 = this.mkUniformPath([Point.mk(10,8),Point.mk(0,8)])
  let params3 = {fromDir:'left',startPoint:Point.mk(0,8),radius:4,dirChange:'clockwise'};
  let path3 = this.uturnToPath(params3);;
  let path = this.concatPaths([path0,path1,path2,path3]);*/
  let paths = [];
  let sp = Point.mk(-5,-10);
  let bparams = {startPoint:sp,straightLength:10,radius:bendRadius};
  let bendend = this.addBend(paths,bparams);
  bparams.startPoint = bendend;
  bparams.lastLength =8;
  bendend = this.addBend(paths,bparams);
  bparams = {fromDir:'left',startPoint:bendend,radius,dirChange:'clockwise',radius:bendRadius};
  let bend0 = this.bendToPath(bparams);
  paths.push(bend0);
  bendend = bend0[1].value;
  let returnEnd = Point.mk(bendend.x,sp.y+bendRadius);
  let returnPath = this.mkUniformPath([bendend,returnEnd]);
  paths.push(returnPath);
  bparams = {fromDir:'up',startPoint:returnEnd,dirChange:'clockwise',radius:bendRadius};
  let bend1 = this.bendToPath(bparams);
  bendend  =bend1[1].value;
  paths.push(bend1);
  let closingPath = this.mkUniformPath([bendend,sp]);
  paths.push(closingPath);
  //paths.forEach((path) => this.show2dPath(path,30));
  //return;
  let path  = this.concatPaths(paths);
  //this.show2dPath(path,30);
  //return;
  //this.show2dPath(path1,30);
  //this.show2dPath(path,30);
  
  this.speedFun = (j,i) => {
    let iodd = i%2;
    let jodd = j%2;
    let sp0 = jodd?.5:.5;
    return iodd?2*sp0:sp0;
  }
  let activePaths = [];
  let Apaths0 = this.buildApaths([path]);
  Apaths0.forEach((ap) => {ap.connectMe = 1});
 
  activePaths = this.activePaths = Apaths0;
  //activePaths = this.activePaths = [].concat(Apaths0,Apaths1,Apaths2,Apaths3);
  let av = this.allValuesToConnect();
  this.addLinesBetweenPositions(av,lineP);

}



rs.updateState = function () {
  let {currentTime:ct,activePaths,circ,lineP,segs,ints,stepsSoFar:ssf,radius,distanceThreshold:th} = this;
  console.log('ssf',ssf,'ct',ct);
  debugger;
  this.runActivePaths();
  //return;
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



