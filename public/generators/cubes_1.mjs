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

rs.setName('cubes_1');
let wd=60;
let topParams = {width:wd,height:wd,frameStrokee:'white',frameStrokeWidth:0.1,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:900, 
  focalPoint:Point3d.mk(100,0,0),
  focalLength:100,
  cameraScaling:1,
  cameraAxis:'x',
  saveAnimation:1,
  cubeDim:0.5*wd,
  includeLines:1,
  gridDim:8,
  gridWid:0.5*wd
  };
  


Object.assign(rs,topParams);

//rs.dropParams = {dropTries:150,innerRadius:0,outerRadius:30,collideRadius:2,circleRadius:.2,maxLoops:1000,maxDrops:5,motionRadius:.5,motionCycles:4};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension = .4;
  circleP.fill = 'red';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
   let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .303;
}


rs.genCube = function (dim) {
  let hdim  = 0.5*dim;
  let ph = Object.create(Polyhedron);
  //let {circleRadius,motionRadius} = this.dropParams;
  let edges = {};
  let vertices = {};
  let idx=0;
  let eidx =0;
  for (let i=0;i<2;i++) { // z
    for (let j=0;j<2;j++) { //y
      for (let k=0;k<2;k++) { //x
        let p = Point3d.mk(k*dim-hdim,j*dim-hdim,i*dim-hdim);
        let vname = 'v_'+idx;
        vertices[vname] = p;
        let edgex,edgey,edgez;
        if (k===0) {
          let edgez = [vname,'v_'+(idx+1)];
          let ename = 'e_'+eidx;
          edges[ename] = edgez;
          eidx++;
        }
        if (j===0) {
          let edgey = [vname,'v_'+(idx+2)];
          let ename = 'e_'+eidx;
          edges[ename] = edgey;
          eidx++;

        }
        if (i===0) {
          let edgex = [vname,'v_'+(idx+4)];
          let ename = 'e_'+eidx;
          edges[ename] = edgex;
          eidx++;

        }
   //     gp.push(p);
        idx++;
      }
    }
  }
   ph.vertices = vertices;
  ph.relations ={edgeVertices:edges}; 
  ph.numEdges = ph.computeNumEdges();
  ph.wireframe = 1;
  return ph;
 }

    
     
rs.initialize = function () {
  debugger;
  this.initProtos();
  let {circleP,lineP,numSteps} = this;
  this.addFrame();
  let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
  let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
  let cube = this.genCube(50);
  cube.lineP = lineP;
  cube.vertexP = circleP;
  let cubeLines = this.set('cubeLines',arrayShape.mk());
  cube.lines = cubeLines;
  let cubeVertices= this.set('cubeVertices',arrayShape.mk());
  cube.vertexShapes = cubeVertices;
  //this.installCircleDrops(cube);
 // this.set('copies',arrayShape.mk());
   let tr = Affine3d.identity ();

  let container = this.container = Shape3d.mk(tr);
  container.set('cube',cube);
    cube.transform = Affine3d.identity ();

  let oneR =(2*Math.PI/(numSteps+1));
  this.stepRotation = Affine3d.mkRotation('z',2*oneR).times(Affine3d.mkRotation('x',oneR));

}

rs.updateState = function  () {
  debugger;
  let {camera,stepRotation:sr,container} = this;
  let {cube} = container;
  let cntr = container.transform;
  let ntr =cntr.times(sr);
  container.transform = ntr;
  cube.project(camera);
}

export {rs};




