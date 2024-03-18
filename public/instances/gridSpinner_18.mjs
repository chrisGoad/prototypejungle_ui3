

debugger;
import {rs as generatorP} from '/generators/gridSpinner_4_25_23.mjs';

let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 200;
let nr = 8;
//
nr =1;
rs.setName('gridSpinner_18');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,numConnections:400,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:400,center:Point.mk(0,0),radius:wd/4,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,
           //      pauseAtt:[29,30,59,60],numConnections:100,numPhases:102,showThePath:1,showIntersections:1}
                 pauseAtt:[29,30,59,60],numConnections:10,numPhases:100,showThePath:0,showIntersections:0,numSpokes:11}
            //     pauseAtt:[29,30,59,60],numConnections:4,numPhases:80,showThePath:0,showIntersections:1,numSpokes:5}
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
  let e0si = ci;//Math.floor(Math.random()*nc);
  this.numCisCalls = ncc+1;
  let e1pi; 
  if ((pi === 0)||(pi == 2)) {
    e1pi = pi+1;
    e1pi = pi;
  }
  if ((pi === 1)||(pi == 3)) {
    e1pi = pi-1;
    e1pi = pi;
  }
  let e1si =(e0si+Math.floor(Math.random()*3))%np;
  //debugger;
  console.log('e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}



rs.addMotions = function () {
  debugger;
    let {cells,numPhases,shapeConnector,numSpokes} = this;
  let radius = .25;
  let startAngle = 0;//.25*(2*Math.PI);
  let center = Point.mk(.5,.5);
  let path0 = this.mkCircle({radius:0.4,numPoints:10,center});
  let path1 = this.mkCircle({radius:0.3,numPoints:10,center});
  let path2 = this.mkCircle({radius:0.2,numPoints:10,center,startAngle});//.reverse();
  let path3 = this.mkCircle({radius:0.1,numPoints:10,center,startAngle});//.reverse();
  let ipath0 = this.interpolatePaths(path0,path2);
  let ipath1 = this.interpolatePaths(path1,path3);
 // let fpath0 = path0.concat(ipath0.concat(path2))
  let fpath0 = path0.concat(ipath0,path2,path2);
  //let fpath1 = path1.concat(ipath1.concat(path3))
  let fpath1 = path1.concat(ipath1,path3,path3)
  this.thePath = fpath1;
  //t paths= [path0,path1,path2,path3];
  //let paths= [ipath0,ipath1];
  let paths= [fpath0,fpath1];
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


