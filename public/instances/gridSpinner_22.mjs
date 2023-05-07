

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
rs.setName('gridSpinner_20');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,numConnections:400,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:400,center:Point.mk(0,0),radius:wd/4,
                 cycles:2,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,
           //      pauseAtt:[29,30,59,60],numConnections:100,numPhases:102,showThePath:1,showIntersections:1}
                 pauseAtt:[29,30,59,60],numConnections:18,numPhases:100,showThePath:0,showIntersections:1,numSpokes:11,randomOffset:20}
            //     pauseAtt:[29,30,59,60],numConnections:4,numPhases:80,showThePath:0,showIntersections:1,numSpokes:5}
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
  circleP.dimension= 2;
  circleP.dimension= 0;
  circleP.fill = 'blue';
  circleP['stroke-width'] = 0;
  let icircleP = this.icircleP = circlePP.instantiate();
  icircleP.dimension= 1;
  icircleP.fill = 'red';
  icircleP['stroke-width'] = 0;
  
}

rs.mkRandomSeq = function () {
  let {numPhases:np,numConnections:nc} = this;
  let a = [];
  for (let i=0;i<nc;i++) {
    let v = Math.floor(Math.random()*np);
    a.push(v)
  }
  return a;
}

rs.rseq = rs.mkRandomSeq();

rs.numCisCalls = 0;

rs.connectIndices = function (params) {
  let {cell,pathIndex:pi,connectIndex:ci} = params;
  let {numCisCalls:ncc,rseq,numPhases:np,numConnections:nc} = this;
 // debugger;
  //let e0si = rseq[ncc%nc];//,Math.floor(Math.random()*ln);
  //let e0si = ci;//Math.floor(Math.random()*nc);
  let e0si = ncc%2?ci:ci+50;

  this.numCisCalls = ncc+1;
  let e1pi; 
  if ((pi === 0)||(pi == 2)) {
    e1pi = pi+1;
    //e1pi = pi;
  }
  if ((pi === 1)||(pi == 3)) {
    e1pi = pi-1;
   // e1pi = pi;
  }
  let e1si =(e0si+6+Math.floor(Math.random()*0))%np;
  //debugger;
  console.log('e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}



rs.addMotions = function () {
  debugger;
    let {cells,numPhases,shapeConnector,numSpokes} = this;
  let radius = .25;
  //let startAngle1 = 0;
  let startAngle0 = -.12*(2*Math.PI);
  let startAngle1 = .12*(2*Math.PI);
  let center0 = Point.mk(.5,.5);
  let top = .8;
  let bot = 1-top;
  let hws = 0.1
  let center1 = Point.mk(.666,.5);
  let numPoints = 20;
  let path0 = this.mkCircle({radius:0.4,numPoints,center:center0,startAngle:startAngle0});
  let path1 = this.mkCircle({radius:0.3,numPoints,center:center0,startAngle:startAngle0});//.reverse();
 // let path2 = this.mkCircle({radius:0.4,numPoints,center:center1,startAngle:startAngle1}).reverse();
 // let path3 = this.mkCircle({radius:0.3,numPoints,center:center1,startAngle:startAngle1});//.reverse();
  let path2 = this.setPathLength([Point.mk(.5-hws,top),Point.mk(.5-hws,bot)],numPoints);
  let path3 = this.setPathLength([Point.mk(.5+hws,top),Point.mk(.5+hws,bot)],numPoints);
 
  this.thePath = path1;
  //t paths= [path0,path1,path2,path3];
  //let paths= [ipath0,ipath1];
  let paths= [path0,path1];
 paths= [path0,path1,path2,path3];
  this.addMotionsForCell({cell:cells[0],paths,numPhases,shapeConnector});

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


