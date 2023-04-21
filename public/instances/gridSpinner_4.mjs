

import {rs as generatorP} from '/generators/gridSpinner.mjs';

let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 200;
let nr = 8;
//
nr =4;
rs.setName('gridSpinner_4');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:200,center:Point.mk(0,0),radius:wd/4,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,pauseAtt:[29,30,59,60]}
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

/*
rs.toQuad = function(p) {
  let {corners} = this;
  let qp = this.rc2qpoint(p,corners);
  return qp;
}


rs.shapeConnector = function (mg,numConnections,connectJump) {
  let {connectedShapes:cns} = this;
  let shapes = mg.shapes;
  let ln = shapes.length;
  for (let i=0;i<numConnections;i++) {
    let sh0 = shapes[i];
    let j = Math.floor(Math.random()*ln);
   // let sh1 = shapes[i+connectJump];
    let sh1 = shapes[j];
    cns.push([sh0,sh1]);
  }
}
*/
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
/*
rs.addMotionsForCell = function (cell,path,numPhases) {
  let {deltaX,numSteps,circleP,iPolygonP,shapeConnector0,cycles} = this;
  //let radius = 0.4*0.5*deltaX;
 // let radius = 0.2;
  //let cycles = 4;
  let duration = numSteps;
  //let numPhases=17;
  let ip = 1/numPhases;
  let phases =[];
  for (let i=0;i<numPhases;i++) {
    phases.push(i*ip);
  }
  let {polygon,coords} = cell;
  let {x,y} = coords;
  let shapeP=circleP;
  this.mkPathMotionGroup({phases,path,cycles,duration,shapeP,oPoly:polygon,shapeConnector:shapeConnector0});
}
*/

rs.addMotions = function () {
  let {cells} = this;
  this.connectedShapes = [];
  let path = mkPath1();
  cells.forEach((cell) =>{
    this.addMotionsForCell(cell,path,17);
  });
 
}
       
/*
rs.initialize = function() { 
  debugger;
  this.initProtos();
  let {corners,polygonP} =this;
  this.addFrame();
  this.initGrid();
  this.motionGroups = [];
  this.set('mshapes',arrayShape.mk());
  this.addMotions();
  this.connectShapes();
  this.hideUnconnectedShapes();
  debugger;
} 
 */ //this.updateState();

  

rs.updateState = function () {
  let {stepsSoFar:ssf} =this;
//  debugger;
  this.execMotionGroups(ssf);
} 


    

  
export {rs};


