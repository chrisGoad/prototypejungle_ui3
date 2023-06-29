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

rs.setName('3d_grid_0');
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


rs.genGrid = function (nax) {
  let {gridWid:gw,gridDim:gd} = this;
  let gdsq = gd*gd;
  let gp = [];
  let hgw = 0.5*gw;
  let delta = gw/(gd-1);
  let idx = 0;
  let segs = [];
 
  for (let i=0;i<gd;i++) {
    for (let j=0;j<gd;j++) {
      let p;
      if (nax==='z') {
        p = Point3d.mk(j*delta-hgw,i*delta-hgw,0);
      } else if (nax ==='y') {
        p = Point3d.mk(j*delta-hgw,0,i*delta-hgw);
      } else if (nax ==='x') {
        p = Point3d.mk(j*delta-hgw,0,i*delta-hgw);
      }
      if (j<(gd-1)) {
        let seg = [idx,idx+1]
        segs.push(seg);
      }
      if (i<(gd-1)) {
        let seg = [idx,idx+gd]
        segs.push(seg);
      }
      gp.push(p);
      idx++;
    }
  }
  return {points:gp,segs};
 }

     
rs.initialize = function () {
  debugger;
  this.initProtos();
  let {circleP,lineP,dropParams,numSteps,cubeDim} = this;
  this.addFrame();
  let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
  let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
  let graph3d = this.graph3d = this.genGrid();
  let {points,segs} = graph3d;
  let shapes = this.set('shapes',arrayShape.mk());
  let lines = this.set('lines',arrayShape.mk());
  let pnts2d = graph3d.pnts2d = [];
  points.forEach( (p) => {
    let crc = circleP.instantiate();
    shapes.push(crc);
    pnts2d.push(null);
  });
  let ln = segs.length;
S  for (let i=0;i<ln;i++) {
     lines.push(lineP.instantiate());
  }
 // this.set('copies',arrayShape.mk());
  let oneR =(2*Math.PI/(numSteps+1));
  this.stepRotation = Affine3d.mkRotation('z',2*oneR).times(Affine3d.mkRotation('x',oneR));

}

rs.placeShapes= function (graph3d) {
  let {points:pnts,segs,pnts2d} = graph3d;
  let pnts2d = graph3d.pnts2d = [];
  for (let i=0;i<ln;i++( {
    let p = pnts[i];
    let pnt2d = p.project(camera):point;
    shape.moveto(pnt2d);
    pnts2d[i]=pnt2d;
  });
}



rs.placeLines = function (graph3d) {
  let {lines} = this;
  let {pnts2d,segs} = graph3d;
  let ln = segs.length;
  for (let i=0;i<ln;i++( {
    let line = lines[i];
    let seg = segs[i]'
    let [e0i,e1i] = seg;
    let e0 = pnts2d[e0i];
    let e1 = pnts2d[e1i];
    line.setEnd(eo,e1);
  };
}

rs.updateState = function  () {
  debugger;
  let {graph3d,stepRotation:sr} = this;
  let {drops} = graph3d;
  //this.applyTransformInPlaceToDrops(sr,drops);
   this.placeShapes(graph3d);
   this.placeLines(graph3d);
   //this.set('copies',arrayShape.mk());
 // sr.applyToCollectionInPlace(shapes);
 // this.transformPathsInPlace(paths,srt);
}

export {rs};




