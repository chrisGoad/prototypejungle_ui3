import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
//import {rs as basicP} from '/generators/basics.mjs';
//import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as generatorP} from '/generators/motion_3.mjs'

let rs = generatorP.instantiate();
//addDistanceMethods(rs);

rs.setName('motion_29');
let ht=50;
/*
25inches = 63.5 cm
17inches 43.2 cm

63.5 * 43.2 * .05 = 137 cc
13lb = 5.9 kg
5.9/137 = .043 = 43g /cc

26+36=62= 157 cm
23 = 58 cm
9106*.5 = 13/4553
*/
let topParams = {width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:-0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/(32*32),stopTime:1,recordingMotion:1,saveAnimation:1,numSegs:30,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:4,speed:1,segsPerCircle:6,radius:.15*ht,numSlices:8,distanceThreshold:15};

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
  lineP['stroke-width'] = .06; 
   let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .2; 
}




rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP,circleP,radius,height:ht,numSegs} = this;
  this.addFrame();
  this.numSteps =stp/tps;
  this.numSteps =512;
  //this.numSteps =128;
  this.set('shapes',arrayShape.mk());
  let lines = this.set('lines',arrayShape.mk());
  let fr =0.4;
  let dim = fr*ht;
  let circle = Circle.mk(Point.mk(0,0),radius);
  let cpath = this.circleToPath(circle,numSegs);
  let mpath0 = this.mkUniformPath([Point.mk(-dim,0),Point.mk(dim,0)]);
  let mpath1 = this.mkUniformPath([Point.mk(dim,0),Point.mk(-dim,0)]);
 // let path0 = this.mkUniformPath([Point.mk(-dim,-dim),Point.mk(dim,-dim),Point.mk(dim,dim),Point.mk(-dim,dim),Point.mk(-dim,-dim)]);
  //let path0 = this.mkUniformPath([Point.mk(fr*ht,-10),Point.mk(-fr*ht,-5)]);
  //let path1 = this.mkUniformPath([Point.mk(-fr*ht,5),Point.mk(fr*ht,10)]);
  this.paths = [cpath];
  let params0 = {speed:2,path:mpath0,startOffset:0,value:Point.mk(0,0)};
  let mp0 = this.mkActivePath(params0)
  let params1 = {speed:2,path:mpath1,startOffset:0,value:Point.mk(0,0)};
  let mp1 = this.mkActivePath(params1);;
  //this.mapath0 = mp0;
  //this.mapath1 = mp1;
  let action =(ap) => {
    let {shape:sh,value:vl,offsetPath} = ap;
    let offset = offsetPath.value;
    sh.moveto(vl.plus(offset));
  }  
  this.speedFun = (j,i) => {
    let iodd = i%2;
    let jodd = j%2;
    let sp0 = jodd?3:2;
    return iodd?2*sp0:sp0;
  }
  let activePaths = this.activePaths = [mp0,mp1];
  let leftApaths = this.buildApaths([cpath],action);
  let rightApaths = this.buildApaths([cpath],action);
  leftApaths.forEach((ap) => {ap.offsetPath = mp0;ap.connectMe = 1});
  rightApaths.forEach((ap) => {ap.offsetPath = mp1;ap.connectMe = 1});
  activePaths = this.activePaths = activePaths.concat(leftApaths,rightApaths);
  let av = this.allValuesToConnect();
  this.addLinesBetweenPositions(av,lineP);
  return;
  let colors = [[250,250,0],[0,250,0],[0,250,250],[100,250,250],[250,250,250],[250,250,100]];
  this.addColorPath(colors,1,lines);
}

rs.updateState = function () {
  let {currentTime:ct,activePaths,circ,lineP,segs,ints,stepsSoFar:ssf,radius,distanceThreshold:th} = this;
  console.log('ssf',ssf,'ct',ct);
  debugger;
  this.runActivePaths();
  //return;
  let aps = activePaths.filter((ap) => ap.connectMe);
   let mpnts = aps.map((ap) => {
     let {offsetPath,value} = ap;
     let offset = offsetPath.value;
     let np =value.plus(offset);
     np.firstLine = value.firstLine;
     return np;
    });
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



