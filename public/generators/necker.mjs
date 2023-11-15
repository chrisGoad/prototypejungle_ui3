debugger;
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
//import {rs as addDropMethods} from '/mlib/circleDrops.mjs';
import {rs as addPlaceDropMethods} from '/mlib/placeDrops.mjs';

let rs = basicP.instantiate();
addAnimationMethods(rs);
//addDropMethods(rs);
addPlaceDropMethods(rs);

rs.setName('necker');
let wd=60;
let topParams = {width:wd,height:wd,frameStrokee:'white',frameStrokeWidth:0.1,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:300, 
  focalPoint:Point3d.mk(100,0,0),
  focalLength:100,
  cameraScaling:1,
  cameraAxis:'x',
  saveAnimation:1,
  cubeDim:0.5*wd,
  includeLines:1
  };
  


Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,innerRadius:0,outerRadius:30,collideRadius:2,circleRadius:.1,maxLoops:1000,maxDrops:5,motionRadius:10,motionCycles:4};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
   let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .1;
}
rs.genCube = function (dim) {
  let drops = [];
  let {circleRadius,motionRadius} = this.dropParams;
  let segs = [];
  let hdim = 0.5*dim;
  const addDrop = (p) => {
    let drop = {motionRadius,dimension:2*circleRadius,point:p};
    drops.push(drop);
  }
  
  const addFace = (zv,reverse)=> {
    let sp = segs.length;
    let LL = Point3d.mk(-hdim,-hdim,zv);
    let UL = Point3d.mk(-hdim,hdim,zv);
    let UR = Point3d.mk(hdim,hdim,zv);
    let LR = Point3d.mk(hdim,-hdim,zv);
    let fc = reverse?[LR,UR,UL,LL]:[LL,UL,UR,LR];
    fc.forEach((p) => {
     addDrop(p);
    });
    segs.push([sp,sp+1],[sp+1,sp+2],[sp+2,sp+3],[sp+3,sp]);
  }
  addFace(-hdim,0);
  addFace(hdim,0);
  segs.push([0,4],[1,5],[2,6],[3,7]);
  return {drops,segs};
}
    
     
rs.initialize = function () {
  debugger;
  this.initProtos();
  let {circleP,dropParams,numSteps,cubeDim} = this;
  this.addFrame();
  let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
  let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
  let cube = this.graph3d = this.genCube(cubeDim);
  this.installCircleDrops(cube);
 // this.set('copies',arrayShape.mk());
  this.stepRotation = Affine3d.mkRotation('z',(2*Math.PI/(numSteps+1)));//.times(Affine3d.mkRotation('x',1*a2r));

}

rs.placeDrops = function (graph3d) {
  let {stepsSoFar:ssf,numSteps,shapes,dropParams,copiess,dropP} = this;
  let {drops} = graph3d;
  let fr = ssf/numSteps;
  let {motionRadius,motionCycles:mc} = dropParams;
  //let vec = Point3d.mk(0,Math.cos(angle),Math.sin(angle));
   debugger;
  let idx = 0;
  let angle = Math.PI*2*fr*mc;
  drops.forEach( (drop) => {
    let {projection,shape,vec,delta,point,radius,fill,dimension,scale} = drop;
    if (!delta) {
      delta = drop.delta = Math.random()*Math.PI;
    };
    let na = angle+delta;
    vec = Point3d.mk(0,Math.cos(na),Math.sin(na)).times(motionRadius);
    let np  = projection.plus(vec);
    shape.moveto(np);
    drop.pnt2d=np;
    idx++;
  });
}

rs.updateState = function  () {
  debugger;
  let {graph3d,stepRotation:sr} = this;
  let {drops} = graph3d;
  this.applyTransformInPlaceToDrops(sr,drops);
  this.installCircleDrops(graph3d);
   this.placeDrops(graph3d);
   this.placeLines(graph3d);
   //this.set('copies',arrayShape.mk());
 // sr.applyToCollectionInPlace(shapes);
 // this.transformPathsInPlace(paths,srt);
}

export {rs};



