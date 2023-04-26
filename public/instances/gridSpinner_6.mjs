

import {rs as generatorP} from '/generators/gridSpinner.mjs';

let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 200;
let nr = 8;
//
nr =4;
rs.setName('gridSpinner_6');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:200,center:Point.mk(0,0),radius:wd/4,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,
                 pauseAtt:[29,30,59,60],numConnections:5,numPhases:30}
Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke = 'cyan';
   let connectorP = this.connectorP = linePP.instantiate();
  connectorP['stroke-width'] = .9;
  connectorP.stroke = 'cyan';
  let gridPolygonP = this.gridPolygonP = polygonPP.instantiate();
  gridPolygonP['stroke-width'] = .4;
  gridPolygonP.stroke = 'cyan';
  gridPolygonP.fill = 'red';
  gridPolygonP.fill = 'black';
  let iPolygonP = this.iPolygonP = polygonPP.instantiate();
  iPolygonP['stroke-width'] = 0;
  iPolygonP.fill = 'green'; 
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 2;
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
 let icircleP = this.icircleP = circlePP.instantiate();
  icircleP.dimension= 2;
  icircleP.fill = 'red';
  icircleP['stroke-width'] = 0; 
}



rs.connectIndices = function (params) {
  debugger;
  let {cell,pathIndex:pi,connectIndex:ci,numPhases:ln} = params;
  
  let e0si = Math.floor(Math.random()*ln);
  let e1pi = pi;
  let e1si = (e0si+13)%ln;
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}

rs.shapeConnectorr = function (mg,cell) {
  debugger;
  let {connectIndices} = this;
  this.shapeConnectorC({motionGroup:mg,cell,numConnections:5,connectIndices});
}

rs.addMotions = function () {
  let {cells,numPhases,shapeConnector} = this;
  this.connectedShapes = [];
  let path0 = this.mkPath0();
  let path1 =this.mkPath1();
  let path2 = this.mkPath2();
  let path3 = this.mkPath3();
  let paths = [path1,path0,path2,path3];
  cells.forEach((cell) =>{
    let {coords} = cell;
    //debugger;
    let {x,y} = coords;
    let z = (x+y)%4;
    let path=paths[x];
    //let path=paths[z];
    //debugger;
    this.addMotionsForCell({cell,paths:[path],numPhases,shapeConnector});

    //this.addMotionsForCell(cell,[path],30,this.shapeConnector);// put back
  });
}
 
rs.showPaths= function () {
   debugger;
   return 0;
  this.showPath(mkPath0(),100);
  return 1;
}
  

  
export {rs};


