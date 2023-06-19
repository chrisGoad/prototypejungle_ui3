debugger;
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addDropMethods} from '/mlib/circleDrops.mjs';
import {rs as addPlaceDropMethods} from '/mlib/placeDrops.mjs';

let rs = basicP.instantiate();
addAnimationMethods(rs);
addDropMethods(rs);
addPlaceDropMethods(rs);

rs.setName('drop_circles_19');
let wd=60;
let topParams = {width:wd,height:wd,frameStroke:'white',frameStrokeWidth:0.1,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:300, 
  focalPoint:Point3d.mk(100,0,0),
  focalLength:100,
  cameraScaling:1,
  cameraAxis:'x',
  saveAnimation:1,
  includeLines:1
  };
  


Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,innerRadius:29,outerRadius:30,collideRadius:2,circleRadius:.1,maxLoops:1000,maxDrops:6,motionRadius:1,motionCycles:4};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
   let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .1;
}

rs.generateCircleDrop= function (p) {
  let {motionRadius} = this;
  let {circleRadius,collideRadius} = this.dropParams;
  return {collideRadius,dimension:2*circleRadius,motionRadius};
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
  this.set('copies',arrayShape.mk());
  this.stepRotation = Affine3d.mkRotation('z',(2*Math.PI/(numSteps+1)));//.times(Affine3d.mkRotation('x',1*a2r));

}

rs.placeDrops = function () {
  let {stepsSoFar:ssf,numSteps,drops,shapes,dropParams,copies,dropP} = this;
  let fr = ssf/numSteps;
  let {motionRadius,motionCycles:mc} = dropParams;
  //let vec = Point3d.mk(0,Math.cos(angle),Math.sin(angle));
   debugger;
  let idx = 0;
  let angle = Math.PI*2*fr*mc;
  drops.forEach( (drop) => {
    let {projection,shape,vec,delta,point,radius,fill,dimension,scale} = drop;
    /*let crc=dropP.instantiate();
    crc.setDimension(dimension?dimension:2*scale*radius);
    if (fill) {
      crc.fill = fill;
    }*/
    if (!delta) {
      delta = drop.delta = Math.random()*Math.PI;
    };
    let na = angle+delta;
    vec = Point3d.mk(0,Math.cos(na),Math.sin(na)).times(motionRadius);
    let np  = projection.plus(vec);
    /*copies.push(crc);
    crc.moveto(np);
    crc.update();*/
    shape.moveto(np);
    drop.pnt2d=np;
    idx++;
  });
}

rs.updateState = function  () {
  debugger;
  let {drops,stepRotation:sr} = this;
  this.applyTransformInPlaceToDrops(sr,drops);
  this.installCircleDrops(drops);
   this.placeDrops();
   this.placeLines();
   //this.set('copies',arrayShape.mk());
 // sr.applyToCollectionInPlace(shapes);
 // this.transformPathsInPlace(paths,srt);
}

export {rs};



