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
let topParams = {width:wd,height:wd,frameStrokee:'white',frameStrokeWidth:0.1,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:300, numCubes:30,
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


rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension = 0.5;
  circleP.fill = 'red';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
   let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .1;
}


rs.genCube = function (dim) {
  let hdim  = 0.5*dim;
  let ph = Object.create(Polyhedron);
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



rs.setCubeDim = function (cube,dim) {
  let hdim  = 0.5*dim;
  let edges = cube.relations.edgeVertices;
  let vertices = cube.vertices;
  let idx=0;
  let eidx =0;
  for (let i=0;i<2;i++) { // z
    for (let j=0;j<2;j++) { //y
      for (let k=0;k<2;k++) { //x
        //let p = Point3d.mk(k*dim-hdim,j*dim-hdim,i*dim-hdim);
        let vname = 'v_'+idx;
        let p = vertices[vname];
        p.x = k*dim-hdim;
        p.y = j*dim-hdim;
        p.z = i*dim-hdim;
        idx++;
      }
    }
  }
}

rs.addCube = function (n) {
  let {container,circleP,lineP} = this;
   let cube = this.genCube(50);
  cube.lineP = lineP;
  cube.vertexP = circleP;
  let cubeLines = this.set('cubeLines_'+n,arrayShape.mk());
  cube.lines = cubeLines;
  let cubeVertices= this.set('cubeVertices__'+n,arrayShape.mk());
  cube.vertexShapes = cubeVertices;
      cube.transform = Affine3d.identity ();
  container.set('cube_'+n,cube);
}
     
rs.initialize = function () {
  debugger;
  this.initProtos();
  let {circleP,lineP,numSteps,numCubes} = this;
  this.addFrame();
  let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
  let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
  /*let cube = this.genCube(50);
  cube.lineP = lineP;
  cube.vertexP = circleP;
  let cubeLines = this.set('cubeLines',arrayShape.mk());
  cube.lines = cubeLines;
  let cubeVertices= this.set('cubeVertices',arrayShape.mk());
  cube.vertexShapes = cubeVertices;*/
  //this.installCircleDrops(cube);
 // this.set('copies',arrayShape.mk());
   let tr = Affine3d.identity ();
  let container = this.container = Shape3d.mk(tr);
  for (let i=0;i<numCubes;i++) {
    this.addCube(i);
  }
  

  let oneR =(2*Math.PI/(numSteps+1));
  this.stepRotation = Affine3d.mkRotation('z',2*oneR).times(Affine3d.mkRotation('x',oneR));

}

rs.updateState = function  () {
  let {camera,stepRotation:sr,container,numSteps,stepsSoFar:ssf,numCubes} = this;
  let firstStage= Math.floor(numSteps/3);
  let lastStage = Math.floor((2*numSteps)/3);
//  let {cube_0:cube} = container;
 // let fr = ssf/numSteps;
  let intv = 0.33333333 *numSteps/numCubes;
  let cntr = container.transform;
  let ntr =cntr.times(sr);
  container.transform = ntr;
  if (ssf < firstStage) {
    for (let i=0;i<numCubes;i++) {
      let cube = container['cube_'+i];
      let strt = Math.floor(intv*i);
      if (ssf<strt) {
        this.setCubeDim(cube,0); 
      } else {
        let fr = (ssf-strt)/firstStage;
        this.setCubeDim(cube,fr*50);
      }
      cube.project(camera);
    }
  return;
  }
  if (ssf < lastStage) {
    for (let i=0;i<numCubes;i++) {
      let cube = container['cube_'+i];
      cube.project(camera);
    }
    return;
  }
  for (let i=0;i<numCubes;i++) {
    debugger;
    let cube = container['cube_'+i];
    let rstrt = Math.floor(intv*(numCubes-i));
    let strt = lastStage+rstrt;
    if (ssf>strt) {
      this.setCubeDim(cube,0); 
    } else {
      debugger;
      let fr = (ssf-(lastStage-intv*i))/firstStage;
      debugger;
     this.setCubeDim(cube,(1-fr)*50);
    }
    cube.project(camera);
  }

}

export {rs};




