import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
//import {rs as basicP} from '/generators/basics.mjs';
//import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as generatorP} from '/generators/motion_3.mjs'

let rs = generatorP.instantiate();
//addDistanceMethods(rs);

rs.setName('motion_24');
let ht=50;


let topParams = {width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:-0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/(32*32),stopTime:1,recordingMotion:1,saveAnimation:1,distanceThreshold:10,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:64,speed:1,segsPerCircle:6,radius:.4*ht,numSlices:8};

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
  polylineP['stroke-width'] = .2; 
}




rs.buildPath = function (params) {
  let {radius,scaleX,scaleY,numSegs} = params;
  let circle = Circle.mk(Point.mk(0,0),radius);
  let cpath = this.circleToPath(circle,numSegs);
  let scale = {x:scaleX,y:scaleY};
  let path = this.scale2dPath(cpath,scale);
  return path;
}


rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP,circleP,radius} = this;
  this.addFrame();
  this.numSteps =stp/tps;
  this.numSteps =128;
  this.set('shapes',arrayShape.mk());
  let lines = this.set('lines',arrayShape.mk());
  let path0 = this.buildPath({radius,scaleX:.3,scaleY:1,numSegs:40});
  let path1 = this.buildPath({radius,scaleX:1,scaleY:.3,numSegs:40});
  //this.paths = [path0,path1];
  this.speedFun = (j) => {
    let jodd = j%2;
    return jodd?3:2;
  }
  let activePaths = this.activePaths = this.buildApaths([path0,path1]);
 // activePaths.forEach((ap)=>ap.connectMe = 1);
  let av = this.allValues();
  this.addLinesBetweenPositions(av,lineP);
  let colors = [[250,250,0],[0,250,0],[0,250,250],[100,250,250],[250,250,250],[250,250,100]];
  this.addColorPath(colors,1,lines);
}

rs.updateState = function () {
  let {currentTime:ct,activePaths,circ,lineP,segs,ints,stepsSoFar:ssf,radius,distanceThreshold:th} = this;
  console.log('ssf',ssf,'ct',ct);
  debugger;
  this.runActivePaths();
  let av = this.allValues();
  let apnts = av.filter( (v) => !Array.isArray(v));
   const fn = (line,dist) => {
   //let th = 10;
   let v = (th-dist)/dist;
    let c = Math.floor(v*250);
    if (dist>th) {
      line.hide();
    } else {
      line.show();
      line.stroke = `rgb(${c},${c},${c})`;
    }
  }
  this.updateLines(apnts,fn);
}



    
 
export {rs};



