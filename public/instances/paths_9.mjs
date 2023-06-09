

debugger;
import {rs as generatorP} from '/generators/paths.mjs';
let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 200;
let nr = 8;
//
nr =1;
rs.setName('paths_9');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,numConnections:400,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:300, 
  focalPoint:Point3d.mk(100,0,0),
  focalLength:100,
  cameraScaling:1,
  cameraAxis:'x',

                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,lowFadee:0,scaling:1,
                 pauseAtt:[29,30,59,60],numConnections:60,numPhases:60/*100*/,showThePaths:1,showIntersections:0,chopOffBeginning:2,chopOffEnd:0,newCoords:1}
Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke = 'cyan';
   let connectorP = this.connectorP = linePP.instantiate();
  connectorP['stroke-width'] = .4;
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
  circleP.dimension= 2;
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
  let e1pi = (pi+1)%4;
//  let e1pi = pi;
  let e1si =(e0si+16)%np;
  //debugger;
  console.log('pi',pi,'e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}



rs.addMotions = function () {
  debugger;
    let {numSteps,circleP,cycles} = this;

    let {cells,numPhases,shapeConnector,numSpokes} = this;
  let numPoints  = 10;
  let h =30;
  let d = 30;
  let LLB =Point3d.mk(-d,d,-h);
  let LLT =Point3d.mk(-d,d,h);
  let ULB =Point3d.mk(-d,-d,-h);
  let ULT =Point3d.mk(-d,-d,h);
  let URB =Point3d.mk(d,-d,-h);
  let URT =Point3d.mk(d,-d,h);
  let LRB =Point3d.mk(d,d,-h);
  let LRT =Point3d.mk(d,d,h);
  let LLpath = [LLB,LLT];
  let ULpath = [ULB,ULT];
  let URpath = [URB,URT];
  let LRpath = [LRB,LRT];
  let paths = [LLpath,ULpath,URpath,LRpath];
  /*let p1 =Point3d.mk(0,0,d);
  let p2 =Point3d.mk(0,d,d);
  let p3 =Point3d.mk(0,d,0);
  let path0 = [p0,p1,p2,p3,p0];*/
  let a2r = (Math.PI)/180;  
  let rt = Affine3d.mkRotation('z',30*a2r);
  //let path1 = this.transformPath(path0,rt);
  let rpaths = this.transformPaths(paths,rt);
  debugger;
  this.thePaths = this.paths=rpaths;
  //let paths= this.thePaths =this.paths = [path1];
  debugger;
  let params = {numPhases,paths:rpaths,cycles,shapeP:circleP,shapeConnector,duration:numSteps};
  this.mkPathMotionGroup(params);
  //let {focalPoint,focalLength,cameraScaling,cameraAxis} = this;
   //let camera = this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,cameraAxis);
}

  
export {rs};


