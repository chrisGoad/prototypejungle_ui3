

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
  focalPoint:Point3d.mk(0,0,50),
  focalLength:10,
  cameraScaling:100,
                 frameStrokee:'rgb(2,2,2)',frameStroke:'white',frameStrokeWidth:1,saveAnimation:1,chopOffBeginning:2,stepInterval:40,scaling:1,
                }
Object.assign(rs,topParams);

rs.initialize = function () {
  debugger;
  let cube = Cube.mk(20);
  this.addFrame();
 let {focalPoint,focalLength,cameraScaling} = this;
 this.initProtos();
 this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,'z');
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

