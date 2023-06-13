debugger;
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/circleDrops.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_17');
let wd=80;
let topParams = {width:wd,height:wd,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:300, 
  focalPoint:Point3d.mk(100,0,0),
  focalLength:100,
  cameraScaling:1,
  cameraAxis:'x',
  };
  


Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,innerRadius:10,outerRadius:30,collideRadius:10,circleRadius:.1,maxLoops:1000,maxDrops:1000};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}

rs.generateCircleDrop= function (p) {
  let {circleRadius,collideRadius} = this.dropParams;
  return {collideRadius,dimension:2*circleRadius};
}

rs.initialize = function () {
  debugger;
  this.initProtos();
  let {circleP,dropParams} = this;
  this.addFrame();
  let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
  let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
  let drops =  this.generateCircleDrops(dropParams);
  this.installCircleDrops(drops,circleP);
}

export {rs};



