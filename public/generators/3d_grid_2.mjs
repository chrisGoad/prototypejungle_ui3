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

rs.setName('3d_grid_2');
let wd=60;
let topParams = {width:wd,height:wd,frameStrokee:'white',frameStrokeWidth:0.1,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:900, 
  focalPoint:Point3d.mk(100,0,0),
  focalLength:100,
  cameraScaling:1,
  cameraAxis:'x',
  saveAnimation:1,
  cubeDim:0.5*wd,
  includeLines:1,
  gridDim:7,
  gridWid:0.5*wd
  };
  


Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,innerRadius:0,outerRadius:30,collideRadius:2,circleRadius:.2,maxLoops:1000,maxDrops:5,motionRadius:.5,motionCycles:4};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension = 10;
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
   let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .03;
}


rs.genGrid = function () {
  let {gridWid:gw,gridDim:gd} = this;
    let ph = Object.create(Polyhedron);
  let gdsq = gd*gd;
  let gp = [];
  let hgw = 0.5*gw;
  let delta = gw/(gd-1);
  //let {circleRadius,motionRadius} = this.dropParams;
  let edges = {};
  let vertices = {};
 /* let drops = [];
  const addDrop = (p) => {
    let drop = {motionRadius,dimension:2*circleRadius,point:p};
    drops.push(drop);
  }*/
  let idx=0;
  let eidx =0;
  for (let i=0;i<gd;i++) { // z
    for (let j=0;j<gd;j++) { //y
      for (let k=0;k<gd;k++) { //x
        let p = Point3d.mk(k*delta-hgw,j*delta-hgw,i*delta-hgw);
        let vname = 'v_'+idx;
        vertices[vname] = p;
        let edgex,edgey,edgez;
        if (k<(gd-1)) {
          let edgez = [vname,'v_'+(idx+1)];
          let ename = 'e_'+eidx;
          edges[ename] = edgez;
          eidx++;
        }
        if (j<(gd-1)) {
          let edgey = [vname,'v_'+(idx+gd)];
          let ename = 'e_'+eidx;
          edges[ename] = edgey;
          eidx++;

        }
        if (i<(gd-1)) {
          let edgex = [vname,'v_'+(idx+gdsq)];
          let ename = 'e_'+eidx;
          edges[ename] = edgex;
          eidx++;

        }
        gp.push(p);
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
  let grid= this.grid = this.genGrid();
  grid.lineP = lineP;
  let gridLines = this.set('gridLines',arrayShape.mk());
  grid.lines = gridLines;
  //this.installCircleDrops(cube);
 // this.set('copies',arrayShape.mk());
   let tr = Affine3d.identity ();

  let container = this.container = Shape3d.mk(tr);
  container.set('grid',grid);
    grid.transform = Affine3d.identity ();

  let oneR =(2*Math.PI/(numSteps+1));
  this.stepRotation = Affine3d.mkRotation('z',2*oneR).times(Affine3d.mkRotation('x',oneR));

}

rs.updateState = function  () {
  debugger;
  let {grid,camera,stepRotation:sr,container} = this;
  let cntr = container.transform;
  let ntr =cntr.times(sr);
  container.transform = ntr;
  grid.project(camera);
}

rs.updateStateee = function  () {
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




