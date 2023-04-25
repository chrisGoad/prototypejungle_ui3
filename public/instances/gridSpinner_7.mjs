

import {rs as generatorP} from '/generators/gridSpinner.mjs';

let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 200;
let nr = 8;
//
nr =1;
rs.setName('gridSpinner_7');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:200,center:Point.mk(0,0),radius:wd/4,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,
                 pauseAtt:[29,30,59,60],showThePath:0}
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
  
}
rs.connectIndices = function (params) {
  let {cell,pathIndex:pi,connectIndex:ci,pathLength:ln} = params;
  let {coords} = cell;
  let {x,y} = coords;
  let e0si = ci;
  let e1pi = pi;
  let e1si = (ci+36)%ln;
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};

}




rs.shapeConnector = function (mg,cell) {
  debugger;
  let {connectIndices} = this;
  this.shapeConnectorC({motionGroup:mg,cell,numConnections:25,connectIndices});
}


    
rs.mkMyPath = function () {
  let radius = 0.25;
  let np = 18;
  np = 3;
  let centers = [Point.mk(.25,0.25),Point.mk(0.75,0.25),Point.mk(0.5,0.75)];
  let startAngles = [-0.5*Math.PI,0.5*Math.PI,0.5*Math.PI];
  let path = this.threeCircles({radius,numPoints:np,centers,startAngles}); 
 return path;
} 
rs.addMotions = function () {
  let {cells} = this;
  let path = this.mkMyPath();

  this.addMotionsForCell(cells[0],[path],100,this.shapeConnector);
/*
 // let path = mkSpiral({turns:6,pointsPerTurn:18,iRadius,deltaRadius,center});

  cells.forEach((cell) =>{
    let {coords} = cell;
    //debugger;
    let {x,y} = coords;
    let z = (x+y)%4;
    let path=paths[x];
    //let path=paths[z];
    //debugger;
    this.addMotionsForCell(cell,path,30,this.shapeConnector);
  });*/
}
 
rs.showPaths= function () {
   debugger;
   let {connectorP} = this;
  //return 0;
  let path = this.mkMyPath(); 
  this.showPath(path,100,connectorP);
  return 1;
}
  

  
export {rs};


