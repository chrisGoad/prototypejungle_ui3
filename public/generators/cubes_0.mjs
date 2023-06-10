

debugger;
import {rs as linePP} from '/shape/line.mjs';

import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
addAnimationMethods(rs);



let ht = 630;
let wd=200;
//wd =220;
let nr = 8;
//
nr =3;
rs.setName('cubes_0');
let topParams = {width:wd,height:wd,framePadding:.1*wd,numSteps:200,
 // focalPoint:Point3d.mk(0,0,50),
  focalPoint:Point3d.mk(100,0,0),
  focalLength:100,
  cameraScaling:10,
  cameraAxis:'x',
                 frameStrokee:'rgb(2,2,2)',frameStroke:'green',frameStrokeWidth:10,saveAnimation:1,chopOffBeginning:2,stepInterval:40,scaling:1,
                }
Object.assign(rs,topParams);

rs.showSegs = function (sgs) {
  sgs.forEach((sg) => {
    let line = this.lineP.instantiate();
    line.setEnds(sg.end0,sg.end1)
    this.lines.push(line);
  });
}

rs.a2r = (Math.PI)/180;  
rs.initialize = function () {
  debugger;
  let {a2r} = this;
  let cube = Cube.mk(10);
  let rt = Affine3d.mkRotation('z',30*a2r);
  let rcube = cube.applyTransform(rt);
  this.addFrame();
  let lines = 	this.set('lines',arrayShape.mk());
 let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
 this.initProtos();
 let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
 let prjc = rcube.project(camera);
 this.showSegs(prjc);
 debugger;
}

rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = 2;
  lineP.stroke = 'white';
  
}
rs.updateState = function () {
   debugger;
   this.eye0.oneStep(1);
   this.eye1.oneStep(1);
   //this.eye0.updateState();
   //this.eye1.updateState();
}
  

  
  
export {rs};

