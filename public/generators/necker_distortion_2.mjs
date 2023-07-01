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

rs.setName('necker_distortion');
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

//rs.dropParams = {dropTries:150,innerRadius:0,outerRadius:30,collideRadius:2,circleRadius:.1,maxLoops:1000,maxDrops:5,motionRadius:10,motionCycles:4};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
   let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = 1;
}
/*
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
 */  
     
rs.initialize = function () {
  debugger;
  this.initProtos();
  let {circleP,lineP,dropParams,numSteps,cubeDim} = this;
  this.addFrame();
  let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
  let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
  let cube0 = this.cube0 = Cube.mk(cubeDim,1);
  let phases = this.phases =[];
  for (let i=0;i<12;i++) {
     phases.push(2*Math.PI*Math.random());
  }
  let cube = this.cube = Cube.mk(cubeDim,1);
  cube.lineP = lineP;
  let cubeLines = this.set('cubeLines',arrayShape.mk());
  let cubeVertices = this.set('cubeVertice',arrayShape.mk());
  cube.lines = cubeLines;
  cube.cubeVertices = cubeVertices;
  //let tr = Affine3d.mkTranslation(Point3d.mk(20,0,0));
  let tr = Affine3d.identity ();
  let container = this.container = Shape3d.mk(tr);
  container.set('cube',cube);
  let sr =this.stepRotation = Affine3d.mkRotation('z',(2*Math.PI/(numSteps+1)));//.times(Affine3d.mkRotation('x',1*a2r));
  cube.transform = Affine3d.identity ();

}


rs.updateState = function  () {
  debugger;
  let {cube,camera,stepRotation:sr,container} = this;
  let cntr = container.transform;
  let ntr =cntr.times(sr);
  container.transform = ntr;
  cube.project(camera);
}

export {rs};



