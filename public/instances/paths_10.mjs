

//debugger;
import {rs as generatorP} from '/generators/paths.mjs';
let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 80;
let nr = 8;
//
nr =1;
rs.setName('paths_10');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:300, 
  focalPoint:Point3d.mk(100,0,0),
  focalLength:100,
  cameraScaling:1,
  cameraAxis:'x',

                 cycles:1,frameStroked:'rgb(2,2,2)',frameStrokem:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,lowFadee:0,scaling:1,
                 pauseAtt:[29,30,59,60],numConnections:20,numPhases:60/*100*/,showThePaths:1,showIntersections:0,chopOffBeginning:2,chopOffEnd:0,newCoords:1,
                 showEnds:1}
Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke = 'cyan';
   let connectorP = this.connectorP = linePP.instantiate();
  connectorP['stroke-width'] = .2;
  connectorP.stroke = 'cyan';
  let gridPolygonP = this.gridPolygonP = polygonPP.instantiate();
  gridPolygonP['stroke-width'] = .4;
  gridPolygonP['stroke-width'] = 0;
  gridPolygonP.stroke = 'cyan';
  gridPolygonP.fill = 'red';
  gridPolygonP.fill = 'black';
  let iPolygonP = this.iPolygonP = polygonPP.instantiate();
  iPolygonP['stroke-width'] = 0;
  iPolygonP.fill = 'green'; 
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 1;
  circleP.fill = 'blue';
  circleP['stroke-width'] = 0;
  let icircleP = this.icircleP = circlePP.instantiate();
  icircleP.dimension= 1;
  icircleP.fill = 'red';
  icircleP['stroke-width'] = 0;
  
}


rs.connectIndices = function (params) {
  //debugger;
  let {cell,pathIndex:pi,connectIndex:ci} = params;
  let {numPhases:np,numConnections:nc,piMap} = this;
  let e0si = ci;
  //let e1pi = (pi+1)%4;
  let e1pi = pi;
  let e1si =(e0si+10)%np;
  //debugger;
  console.log('pi',pi,'e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}

rs.afterUpdateState = function  () {
  let {paths,stepRotation:srt} = this;
  debugger;
  this.showPaths();
  this.transformPathsInPlace(paths,srt);
}


rs.addMotions = function () {
  //debugger;
    let {numSteps,circleP,cycles} = this;

    let {cells,numPhases,shapeConnector,numSpokes} = this;
  let hp = this.mkHelicalStairCase({dh:30,dv:30,numLevels:3});
 
  let paths = [hp];
  let a2r = (Math.PI)/180;  
  let irt = Affine3d.mkRotation('z',30*a2r).times(Affine3d.mkRotation('x',55*a2r));
  this.stepRotation = Affine3d.mkRotation('z',(2*Math.PI/(numSteps+1)));//.times(Affine3d.mkRotation('x',1*a2r));
  let rpaths = this.transformPaths(paths,irt);
  debugger;
  this.setPaths(rpaths);
  //this.thePaths = this.paths=rpaths;
 // debugger;
  let params = {numPhases,paths:rpaths,cycles,shapeP:circleP,shapeConnector,duration:numSteps};
  this.mkPathMotionGroup(params);
  //let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
   //let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
}

  
export {rs};


