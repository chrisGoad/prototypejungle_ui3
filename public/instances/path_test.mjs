import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
//import {rs as basicP} from '/generators/basics.mjs';
//import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
//import {rs as generatorP} from '/generators/motion_3.mjs'
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addIPmethods} from '/mlib/interpolation_path_0.mjs';

let rs = basicP.instantiate();

addIPmethods(rs);

rs.setName('path_test');
let ht=50;


let topParams = {width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:-0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:1/(16*32),stopTime:1,recordingMotion:1,saveAnimation:1,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:50,speed:1,segsPerCircle:20,radius:.4*ht,numSlices:8};

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
  lineP['stroke-width'] = .05; 
   let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .1; 
}




rs.initialize = function () {
   debugger;
   this.initProtos();
   let {radius} = this;
  this.addFrame();
  let polylines = this.set('polylines',arrayShape.mk());
  let path0 = this.mkUniformPath([Point.mk(0,0),Point.mk(10,0)]);
  let params1 = {fromDir:'right',startPoint:Point.mk(10,0),radius:4,dirChange:'clockwise'};
  let path1 = this.uturnToPath(params1);
  let path2 = this.mkUniformPath([Point.mk(10,8),Point.mk(0,8)])
  let params3 = {fromDir:'left',startPoint:Point.mk(0,8),radius:4,dirChange:'clockwise'};
  let path3 = this.uturnToPath(params3);;
  let path = this.concatPaths([path0,path1,path2,path3]);
  //this.show2dPath(path0,30);
  //this.show2dPath(path1,30);
  this.show2dPath(path,30);

}



rs.initialize1 = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP,circleP,radius} = this;
  this.addFrame();
  let polylines = this.set('polylines',arrayShape.mk());
  let circle = Circle.mk(Point.mk(0,0),20);
  let which =3 ;
  let fromDir;
  let dirChange = 'clockwisee';
  let bendKind;
  if (which==0) {
    fromDir = 'left';
  }
  if (which==1) {
    fromDir = 'right';
  }
  if (which==2) {
    fromDir = 'up';
  }
  if (which==3) {
    fromDir = 'down';
  }
 
    
  //let path = this.spiralToPath({radius,numTurns:2,segsPerTurn:20});
  //let params = {bendKind:'UL',startPoint:Point.mk(0,0),radius};
 // let params = {bendKind:'UR',startPoint:Point.mk(0,0),radius};
  //let params = {bendKind:'LL',startPoint:Point.mk(0,0),radius};
  let params = {fromDir,startPoint:Point.mk(0,0),radius,dirChange};

  //let path = this.bendToPath(params);
  let path = this.uturnToPath(params);
  //let path = this.circleToPath(circle);
  this.show2dPath(path,8);
}



    
 
export {rs};



