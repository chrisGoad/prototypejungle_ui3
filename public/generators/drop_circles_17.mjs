debugger;
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addDropMethods} from '/mlib/circleDrops.mjs';

let rs = basicP.instantiate();
addAnimationMethods(rs);
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

rs.dropParams = {dropTries:150,innerRadius:0,outerRadius:30,collideRadius:2,circleRadius:.1,maxLoops:1000,maxDrops:10};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  this.dropP  = circleP;
}

rs.generateCircleDrop= function (p) {
  let {circleRadius,collideRadius} = this.dropParams;
  return {collideRadius,dimension:2*circleRadius};
}

rs.initialize = function () {
  debugger;
  this.initProtos();
  let {circleP,dropParams,numSteps} = this;
  this.addFrame();
  let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
  let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
  let drops =  this.drops = this.generateCircleDrops(dropParams);
  this.installCircleDrops(drops,circleP);
  this.stepRotation = Affine3d.mkRotation('z',(2*Math.PI/(numSteps+1)));//.times(Affine3d.mkRotation('x',1*a2r));

}


rs.updateState = function  () {
  debugger;
  let {drops,stepRotation:sr} = this;
  this.applyTransformInPlaceToDrops(sr,drops);
  this.installCircleDrops(drops);
  this.placeDrops();
 // sr.applyToCollectionInPlace(shapes);
 // this.transformPathsInPlace(paths,srt);
}
export {rs};



