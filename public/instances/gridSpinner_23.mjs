

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
                 cycles:4,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,
           //      pauseAtt:[29,30,59,60],numConnections:100,numPhases:102,showThePath:1,showIntersections:1}
                 pauseAtt:[29,30,59,60],numConnections:80,numPhases:100,showThePath:0,showIntersections:0,numSpokes:11,randomOffset:0}
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
  //let e0si = ncc%2?ci:ci+50;
  let e0si = ci;

  this.numCisCalls = ncc+1;
  let e1pi; 
  if ((pi === 0)||(pi == 2)) {
    e1pi = pi+1;
    //e1pi = pi;
  } else {
    return;
  }
  if ((pi === 1)||(pi == 3)) {
    e1pi = pi-1;
   // e1pi = pi;
  }
  let e1si =(e0si+3+Math.floor(Math.random()*5))%np;
  //debugger;
  console.log('e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}



rs.addMotions = function () {
  debugger;
    let {cells,numPhases,shapeConnector,numSpokes} = this;
 
  let numPoints = 20;
  const mkPaths =  (rect)=>{
    let nc = rect.namedCorners();
    let {UL,UR,LL,LR} = nc;
    let  upath = this.setPathLength([UL,UR],numPoints);
    let  lpath = this.setPathLength([LL,LR],numPoints);
    return [upath,lpath];
  }

  let rwd = 0.9;
  let rht = 0.1;
  const mkRect = (y) => {
    return Rectangle.mk(Point.mk(0.5*(1-rwd),y),Point.mk(rwd,rht));
  }
  let rect = mkRect(0.5);
  let paths = mkPaths(rect);
  this.addMotionsForCell({cell:cells[0],paths,numPhases,shapeConnector});

}
 
rs.showPaths= function () {
   debugger;
   let {connectorP,thePath} = this;
  //return 0;
  this.showPath(thePath,100,connectorP);
  return 1;
}
  

  
export {rs};


