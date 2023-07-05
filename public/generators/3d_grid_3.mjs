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
let topParams = {width:wd,height:wd,frameStrokee:'white',frameStrokeWidth:0.1,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:300, 
  focalPoint:Point3d.mk(100,0,0),
  focalLength:100,
  cameraScaling:1,
  cameraAxis:'x',
  saveAnimation:1,
  cubeDim:0.5*wd,
  planeTranslation:0.5*wd,
  includeLines:1,
  gridDim:3,
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
  lineP['stroke-width'] = .0303;
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
      let p = Point3d.mk(j*delta-hgw,i*delta-hgw,0);
      let vname = 'v_'+idx;
      vertices[vname] = p;
      let edgex,edgey;
      if (j<(gd-1)) {
        let edgey = [vname,'v_'+(idx+1)];
        let ename = 'e_'+eidx;
        edges[ename] = edgey;
        eidx++;
      }
      if (i<(gd-1)) {
        let edgex = [vname,'v_'+(idx+gd)];
        let ename = 'e_'+eidx;
        edges[ename] = edgex;
        eidx++;

      }
      gp.push(p);
      idx++;
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
  let itr = Affine3d.identity ();
  let container = this.container = Shape3d.mk(itr);
  const mkAGrid = (pln) => {
    let grid = this['grid'+pln] = this.genGrid();
    grid.lineP = lineP;
    grid.vertexP = circleP;
    let gridLines = this.set('grid'+pln+'Lines',arrayShape.mk());
    grid.lines = gridLines;
    let gridVertices= this.set('grid'+pln+'vertices',arrayShape.mk());
    grid.vertexShapes = gridVertices;
    container.set('grid'+pln,grid);
    this.ttr =   Affine3d.mkRotation('y',po2);

    return grid; 
  }
  let po2 = Math.PI/2;
  
  let gridxy = mkAGrid('xy');
  gridxy.transform = itr;

  let gridyz = mkAGrid('yz');
  gridyz.transform = Affine3d.mkRotation('x',po2);
  
  let gridxz = mkAGrid('xz');
  gridxz.transform = Affine3d.mkRotation('y',po2);
/*
  debugger;
  let ttr = this.ttr =   Affine3d.mkRotation('x',po2);
  let px = Point3d.mk(1,0,0);
  let py = Point3d.mk(0,1,0);
  let tpx = px.applyTransform(ttr);
  let tpy = py.applyTransform(ttr);
*/

  let oneR =(2*Math.PI/(numSteps+1));
  this.stepRotation = Affine3d.mkRotation('z',oneR).times(Affine3d.mkRotation('x',0.5*oneR));
  this.trPerStep = this.planeTranslation/numSteps;
  this.trStart = -0.5*this.planeTranslation;
}

rs.updateState = function  () {
  debugger;
  let {gridxy,gridyz,gridxz,camera,stepRotation:sr,container,ttr,stepsSoFar:ssf,trPerStep,trStart} = this;
  let cntr = container.transform;
  let ntr =cntr.times(sr);
  let translation = trStart + ssf *trPerStep;
  container.transform = ntr;//Affine3d.identity ();
  gridxy.transform = Affine3d.mkTranslation(Point3d.mk(0,0,translation));
  let po2 = Math.PI/2;
  //gridyz.transform = Affine3d.mkRotation('x',po2).times(Affine3d.mkTranslation(Point3d.mk(translation,0,0)));
  gridyz.transform = Affine3d.mkTranslation(Point3d.mk(translation,0,0)).times(Affine3d.mkRotation('x',po2));
  gridxz.transform = Affine3d.mkTranslation(Point3d.mk(0,translation,0)).times(Affine3d.mkRotation('y',po2));
  //gridxz.transform = Affine3d.mkRotation('y',po2).times(Affine3d.mkTranslation(Point3d.mk(0,translation,0)));

  gridxy.project(camera);
  gridyz.project(camera);
  gridxz.project(camera);
}

export {rs};




