

debugger;
import {rs as generatorP} from '/generators/paths_6_13_23.mjs';
let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 200;
let nr = 8;
//
nr =3;
rs.setName('paths_5');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,numConnections:400,framePadding:.2*wd,stepsPerMove:10,numStepss:24,numSteps:300, cycles:1,frameStrokee:'rgb(2,2,2)',frameStroke:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,lowFade:0,scaling:1,
whereToPause:200,
pauseAtt:[29,30,59,60],numConnections:60,numPhases:60/*100*/,showThePaths:0,showIntersections:0,chopOffBeginning:2,chopOffEnd:0,newCoords:1}
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
 // let e1pi = (pi+1)%2;
  let e1pi = pi;
  let e1si =(e0si+5+Math.floor(Math.random()* 20))%np;
  //debugger;
  console.log('pi',pi,'e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}


rs.mkGridOfRectangles = function () {
  let {numRows:nr,numCols:nc,width:wd,height:ht} = this;
  let dx = wd/nc;
  let dy = ht/nr;
  let minX = -0.5*wd;
  let minY = -0.5*ht;
  let rects = [];
  for (let i=0;i<nc;i++) {
    let cx = minX + i*dx;
    for (let j=0;j<nr;j++) {
      let cy = minY+j*dy;
      let corner= Point.mk(cx,cy);
      let extent = Point.mk(dx,dy);
      let rect = Rectangle.mk(corner,extent);
      rects.push(rect);
    }
  }
  return rects;
}
rs.mkGridOfPaths = function () {
  let rects = this.mkGridOfRectangles();
  let paths = rects.map((rect) => this.mkRectangularPath(rect));
  return paths;
}

      
rs.addMotions = function () {
  debugger;
    let {numSteps,circleP,cycles} = this;

    let {cells,numPhases,shapeConnector,numSpokes} = this;
  let paths = this.mkGridOfPaths(); 
  debugger;
  let params = {numPhases,paths,cycles,shapeP:circleP,shapeConnector,duration:numSteps};
  this.mkPathMotionGroup(params);
}

  
export {rs};


