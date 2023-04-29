

debugger;
import {rs as generatorP} from '/generators/gridSpinner.mjs';
let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 200;
let nr = 8;
//
nr =1;
rs.setName('gridSpinner_10');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:300,center:Point.mk(0,0),radius:wd/4,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,
                 pauseAtt:[29,30,59,60],numConnections:160,numPhases:200,showThePath:0,showIntersections:0}
                // pauseAtt:[29,30,59,60],numConnections:100,numPhases:240,showThePath:0}
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
  circleP.dimension= 1;
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
   let icircleP = this.icircleP = circlePP.instantiate();
  icircleP.dimension= 2;
  icircleP.fill = 'red';
  icircleP['stroke-width'] = 0;
   let icircleP2 = this.icircleP2 = circlePP.instantiate();
  icircleP2.dimension= 2;
  icircleP2.fill = 'blue';
  icircleP['stroke-width'] = 0;
  
  
  
}

rs.connectIndices = function (params) {
  let {cell,pathIndex:pi,connectIndex:ci,numPhases:ln} = params;
  if (pi === 4) {
    debugger;
  }

  let e0si = Math.floor(Math.random()*ln);
  //let e1si = (e0si+Math.floor(Math.random()*9))%ln;
  let e1si = (e0si+Math.floor(Math.random()*9))%ln;
  let e1pi;
  if (pi === 0) {e1pi = 1};
  if (pi === 1) {e1pi = 0};
  if (pi === 2) {e1pi = 3};
  if (pi === 3) {e1pi = 2};
  if (pi === 4) {e1pi = pi;e1si = (e0si + 5)%ln;}
  //e1pi = pi;//remove
  ///if (pi === 4) {e1pi = pi;e1si = (e0si + 0)%ln;}
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}


rs.addMotions = function () {
  debugger;
    let {cells,numPhases,shapeConnector,icircleP2} = this;

  let np =  5;
  let radius = 0.25;
  let startAngle = 0;
  let d1 = .1;
  let d2 = .21
  let d3 = d1+d2;
  let d4 = d3+.05;
  let crn0 = Point.mk(0,0);
  let crn1 = Point.mk(d1,d1);
  let crn2 = Point.mk(d2,d2);
  let crn3 = Point.mk(d3,d3);
  let crn4 = Point.mk(d4,d4);
  let ext0 = Point.mk(1,1);
  let ext1 = Point.mk(1-2*d1,1-2*d1);
  let ext2 = Point.mk(1-2*d2,1-2*d2);
  let ext3 = Point.mk(1-2*d3,1-2*d3);
  let ext4 = Point.mk(1-2*d4,1-2*d4);
    debugger;

   let rect0 = Rectangle.mk(crn0,ext0);
   let rect1 = Rectangle.mk(crn1,ext1);
   let rect2 = Rectangle.mk(crn2,ext2);
   let rect3 = Rectangle.mk(crn3,ext3);
   let rect4 = Rectangle.mk(crn4,ext4);
  debugger;
  let path0 = this.mkRectangularPath(rect0);
  let path1 = this.mkRectangularPath(rect1);
  let path2 = this.mkRectangularPath(rect2).reverse();
  let path3 = this.mkRectangularPath(rect3).reverse();
    let path4 = this.thePath = this.mkRandomPath({rectangle:rect4,numPoints:5});
    path4.numConnections = 35;
    path4.numPhases = 50;
    path4.doNotIntersect = 1;
   // path4.ishapeP = icircleP2;
  this.addMotionsForCell({cell:cells[0],paths:[path0,path1,path2,path3,path4],numPhases,shapeConnector});
  //this.addMotionsForCell({cell:cells[0],paths:[path4],numPhases,shapeConnector});
}
 
rs.showPaths= function () {
   debugger;
   let {connectorP,thePath} = this;
  this.showPath(thePath,100,connectorP);
  //return 1;
}
  

  
export {rs};


