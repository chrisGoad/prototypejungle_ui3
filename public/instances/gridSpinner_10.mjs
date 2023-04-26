

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
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:200,center:Point.mk(0,0),radius:wd/4,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,
                 pauseAtt:[29,30,59,60],numConnections:60,numPhases:100,showThePath:0}
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
   let icircleP = this.icircleP = circlePP.instantiate();
  icircleP.dimension= 2;
  icircleP.fill = 'red';
  icircleP['stroke-width'] = 0;
  
}

rs.connectIndices = function (params) {
  let {cell,pathIndex:pi,connectIndex:ci,numPhases:ln} = params;
  debugger;;
  let e0si = Math.floor(Math.random()*ln);
  let e1pi = (pi+1)%2
  //let e1si = (e0si + 5)%ln;
  let e1si = (e0si+Math.floor(Math.random()*5))%ln;
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}


rs.addMotions = function () {
  debugger;
    let {cells,numPhases,shapeConnector} = this;

  let np =  5;
  let radius = 0.25;
  let startAngle = 0;

let d0 = 0.1;
let d1 = 0.3;
  //let path0 = this.thePath = this.mkCircle({numPoints:np,radius,startAngle,center:Point.mk(0.25,0.5)});
  /*let LL = Point.mk(d,d);
  let UL = Point.mk(d,1-d);
  let UR = Point.mk(1-d,1-d);
  let LR = Point.mk(1-d,d);
  let path0 =  [LL,UL];
  let path1 =  [UL,UR];
  let path2 =  [UR,LR];
  let path3 =  [LR,LL];*/
  debugger;
  let rect0 = Rectangle.mk(Point.mk(d0,d0),Point.mk(1-2*d0,1-2*d0));
  let rect1 = Rectangle.mk(Point.mk(d1,d1),Point.mk(1-2*d1,1-2*d1));
  
  let path0 = this.mkRectangularPath(rect0);
  let path1 = this.mkRectangularPath(rect1);
  /*
  let path0 = this.mkRandomPath({numPoints:2,rectangle:Rectangle.mk(Point.mk(0,0),Point.mk(0.5,0.5))});
  let path1 =  this.mkRandomPath({numPoints:2,rectangle:Rectangle.mk(Point.mk(0.5,0),Point.mk(1,.5))});
  let path2 =  this.mkRandomPath({numPoints:2,rectangle:Rectangle.mk(Point.mk(.5,.5),Point.mk(1,1))});
  let path3 =  this.mkRandomPath({numPoints:2,rectangle:Rectangle.mk(Point.mk(0,.5),Point.mk(.5,1))});*/
  //let pat  this.addMotionsForCell({cell:cells[0],paths:[path],numPhases,shapeConnector});
  this.addMotionsForCell({cell:cells[0],paths:[path0,path1],numPhases,shapeConnector});

  //this.addMotionsForCell(cells[0],[path0,path1],200,this.shapeConnector);// put back
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
    this.addMotionsForCell(cell,[path],30,this.shapeConnector);// put back
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


