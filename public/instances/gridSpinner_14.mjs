

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
rs.setName('gridSpinner_14');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,numConnections:400,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:400,center:Point.mk(0,0),radius:wd/4,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,
           //      pauseAtt:[29,30,59,60],numConnections:100,numPhases:102,showThePath:1,showIntersections:1}
                 pauseAtt:[29,30,59,60],numConnections:40,numPhases:102,showThePath:0,showIntersections:1}
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
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  let icircleP = this.icircleP = circlePP.instantiate();
  icircleP.dimension= 1;
  icircleP.fill = 'red';
  icircleP['stroke-width'] = 0;
  
}
rs.selj = function (cell,i,ln) {
  let {coords} = cell;
  let {x,y} = coords;
  return (i+y)%ln;
  return Math.floor(Math.random()*ln);
}
rs.selk = function (cell,j,ln) {
  return j+Math.floor(Math.random()*50)%ln;
  return (j+6)%ln;
}

rs.shapeConnectorr = function (mg,cell) {
  let {selj,selk} = this;
  this.shapeConnectorC({motionGroup:mg,cell,numConnections:40,selj,selk});
  //this.shapeConnectorC(mg,cell,250,selj,selk);
}


rs.connectIndices = function (params) {
  let {cell,pathIndex:pi,connectIndex:ci,numPhases:ln} = params;
  let e0si = ci;
  let e1pi = pi;
  let e1si = (ci+Math.floor(Math.random()*20))%ln;
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}



rs.addMotions = function () {
  debugger;
    let {cells,numPhases,shapeConnector} = this;
  let radius = .25;
  let center = Point.mk(.5,.5);
  //let path0 = this.thePath = this.mkRectangularPath(Rectangle.mk(Point.mk(0,0),Point.mk(1,1)));
  let path0 = this.thePath = this.mkWavyCircle({numPoints:30,radius:.25,center,deltaRadius:.05,numWaves:6});
  let path1 = [...path0].reverse();
  this.addMotionsForCell({cell:cells[0],paths:[path0,path1],numPhases,shapeConnector});

 // this.addMotionsForCell(cells[0],[path],100,this.shapeConnector);// put back
/*
  let path = mkSpiral({turns:6,pointsPerTurn:18,iRadius,deltaRadius,center});
  cells.forEach((cell) =>{
    let {coords} = cell;
    //debugger;
    let {x,y} = coords;
    let z = (x+y)%4;
    let path=paths[x];
    //let path=paths[z];
    //debugger;
    this.addMotionsForCell(cell,path,130,this.shapeConnector);// put back
  });*/
}
 
rs.showPaths= function () {
   debugger;
   let {connectorP,thePath} = this;
  //return 0;
  this.showPath(thePath,100,connectorP);
  return 1;
}
  

  
export {rs};


