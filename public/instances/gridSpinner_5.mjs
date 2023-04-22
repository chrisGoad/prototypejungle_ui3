

import {rs as generatorP} from '/generators/gridSpinner.mjs';

let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 200;
let nr = 8;
//
nr =4;
rs.setName('gridSpinner_5');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:200,center:Point.mk(0,0),radius:wd/4,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,
                 pauseAtt:[29,30,59,60]}
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
  let iPolygonP = this.iPolygonP = polygonPP.instantiate();
  iPolygonP['stroke-width'] = 0;
  iPolygonP.fill = 'green'; 
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 2;
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  
}

rs.shapeConnector = function (mg) {
  this.shapeConnectorC(mg,10,7);
}

const mkPath0 = function() {
  let d = 0.3;
  let p0 = Point.mk(0.5+d,0.5+d);
  let p1 = Point.mk(0.5-d,0.5+d);
  let p2 = Point.mk(0.5-d,0.5-d);
  let p3 = Point.mk(0.5+d,0.5-d);
  let path = [p0,p1,p2,p3];//,p4,p3,p2,p1,p0];
  return path;
}

const mkPath1 = function () {
  let d = 0.3;
  let p0 = Point.mk(0.5-d,0.5+d);
  let p1 = Point.mk(0.5+d,0.5+d);
  let p2 = Point.mk(0.5+d,0.5);
  let p3 = Point.mk(0.5-d,0.5);
  let p4 = Point.mk(0.5-d,0.5-d);
  let p5 = Point.mk(0.5+d,0.5-d);
  let path = [p0,p1,p2,p3,p4,p5];
  return path;
}


const mkPath2 = function () {
  let d = 0.3;
  let p0 = Point.mk(0.5+d,0.5+d);
  let p1 = Point.mk(0.5-d,0.5-d);
  let p2 = Point.mk(0.5+d,0.5-d);
  let p3 = Point.mk(0.5-d,0.5+d);
  let p4 = Point.mk(0.5+d,0.5+d);

  let path = [p0,p1,p2,p3,p4];
  return path;
}
const mkPath3 = function () {
  let d = 0.3;
  let p0 = Point.mk(0.5-d,0.5+d);
  let p1 = Point.mk(0.5-d,0.5-d);
  let p2 = Point.mk(0.5+d,0.5-d);
  let p3 = Point.mk(0.5+d,0.5+d);
  let p4 = Point.mk(0.5-d,0.5+d);

  let path = [p0,p1,p2,p3,p4];
  return path;
}
rs.addMotions = function () {
  let {cells} = this;
  this.connectedShapes = [];
  let path0 = mkPath0();
  let path1 = mkPath1();
  let path2 = mkPath2();
  let path3 = mkPath3();
  let paths = [path1,path0,path2,path3];
  cells.forEach((cell) =>{
    let {coords} = cell;
    debugger;
    let {x,y} = coords;
    let z = (x+y)%4;
    let path=paths[x];
    //let path=paths[z];
    this.addMotionsForCell(cell,path,30);
  });
 
}
  

  
export {rs};


