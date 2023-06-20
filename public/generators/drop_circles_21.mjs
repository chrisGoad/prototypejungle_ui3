debugger;
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addDropMethods} from '/mlib/circleDrops.mjs';
import {rs as addPlaceDropMethods} from '/mlib/placeDrops.mjs';
import {rs as addMotionMethods} from '/mlib/motion.mjs';	
import {rs as addPathMethods} from '/mlib/paths.mjs';

let rs = basicP.instantiate();
addAnimationMethods(rs);
addDropMethods(rs);
addPlaceDropMethods(rs);
addMotionMethods(rs);
addPathMethods(rs);

rs.setName('drop_circles_21');
let wd=60;
let topParams = {width:wd,height:wd,frameStroke:'white',frameStrokeWidth:0.1,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:300, 
  focalPoint:Point3d.mk(100,0,0),
  focalLength:100,
  cameraScaling:1,
  cameraAxis:'x',
  saveAnimation:1,
  includeLines:1,
  showThePaths:0,
  scaling:1,
  cycles:1,
  numConnections:60,numPhases:60/*100*/,showThePaths:1,showIntersections:0,chopOffBeginning:2,chopOffEnd:0,newCoords:1
  };
  


Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,innerRadius:29,outerRadius:30,collideRadius:2,circleRadius:.1,maxLoops:1000,maxDrops:6,motionRadius:0,motionCycles:4};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
   let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .1;
   let connectorP = this.connectorP = linePP.instantiate();
  connectorP['stroke-width'] = .4;
  connectorP.stroke = 'cyan';
}

rs.generateCircleDrop= function (p) {
  let {motionRadius} = this;
  let {circleRadius,collideRadius} = this.dropParams;
  return {collideRadius,dimension:2*circleRadius,motionRadius};
}


rs.connectIndices = function (params) {
  //debugger;
  let {cell,pathIndex:pi,connectIndex:ci} = params;
  let {numPhases:np,numConnections:nc,piMap} = this;
  let e0si = ci;
  let e1pi = (pi+1)%4;
//  let e1pi = pi;
  let e1si =(e0si+16)%np;
  //debugger;
  console.log('pi',pi,'e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};

}

rs.addMotions = function () {
  debugger;
    let {numSteps,circleP,cycles} = this;
    let {numPhases,shapeConnector,numSpokes} = this;
  //this.thePaths = this.paths=rpaths;
  //let paths= this.thePaths =this.paths = [path1];
  debugger;
  let params = {numPhases,paths:this.paths,cycles,shapeP:circleP,shapeConnector,duration:numSteps};
  this.mkPathMotionGroup(params);
  //let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
   //let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
}


rs.initialize = function () {
  debugger;
  this.initProtos();
  let {circleP,dropParams,numSteps,showThePaths} = this;
  this.addFrame();
  let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
  let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
  let drops =  this.drops = this.generateCircleDrops(dropParams);
  //let path = this.path = this.dropsToPath(drops);
  let paths = this.paths = [this.dropsToPath(drops)];
  this.installCircleDrops(drops,circleP);
  this.set('copies',arrayShape.mk());
  this.stepRotation = Affine3d.mkRotation('z',(2*Math.PI/(numSteps+1)));//.times(Affine3d.mkRotation('x',1*a2r));
  this.set('mshapes',arrayShape.mk());
  this.motionGroups = [];
  this.connectedMotions = [];
  this.addMotions();
  if (showThePaths) {
    this.showPaths();
    //return;
  }
  this.connectShapes();
  this.hideUnconnectedShapes();

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
  let {drops,stepRotation:sr,stepsSoFar:ssf} = this;
  this.applyTransformInPlaceToDrops(sr,drops);
  this.installCircleDrops(drops);
   this.placeDrops();
   this.placeLines();
   this.execMotionGroups(ssf);			
  this.callIfDefined("afterUpdateState");
   //this.set('copies',arrayShape.mk());
 // sr.applyToCollectionInPlace(shapes);
 // this.transformPathsInPlace(paths,srt);
}


rs.updateState = function () {
  let {stepsSoFar:ssf} =this;
  debugger;
  this.execMotionGroups(ssf);			
  this.callIfDefined("afterUpdateState");
} 


export {rs};



