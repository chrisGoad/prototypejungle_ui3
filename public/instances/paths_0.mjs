

debugger;
import {rs as generatorP} from '/generators/paths.mjs';
let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 200;
let nr = 8;
//
nr =1;
rs.setName('paths_0');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,numConnections:400,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:300,center:Point.mk(0,0),radius:wd/4,
                 cycles:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,lowFade:0,scaling:wd,
           //      pauseAtt:[29,30,59,60],numConnections:100,numPhases:102,showThePath:1,showIntersections:1}
                 pauseAtt:[29,30,59,60],numConnections:60,numPhases:60/*100*/,showThePath:0,showIntersections:0,chopOffBeginning:2,chopOffEnd:0,newCoords:1}
            //     pauseAtt:[29,30,59,60],numConnections:4,numPhases:80,showThePath:0,showIntersections:1,numSpokes:5}
Object.assign(rs,topParams);

rs.currentRotation = 0

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
  icircleP.dimension= 0.5;
  icircleP.fill = 'red';
  icircleP.fill = 'white';
  icircleP.fill = 'black';
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
rs.piMap = [1,-1,3,-1,5,-1,7,-1];
rs.connectIndices = function (params) {
  //debugger;
  let {cell,pathIndex:pi,connectIndex:ci} = params;
  let {numCisCalls:ncc,rseq,numPhases:np,numConnections:nc,piMap} = this;
  let e0si = ci;
  this.numCisCalls = ncc+1;
  let e1pi = piMap[pi];
  if (e1pi<0) {
    //debugger;
    return;
  }
 
  let e1si =(e0si+16+Math.floor(Math.random()*0))%np;
  //debugger;
  console.log('pi',pi,'e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  if (e1si===6) {
    debugger;
  }
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}



rs.addMotions = function () {
  debugger;
    let {numSteps,circleP,cycles} = this;

    let {cells,numPhases,shapeConnector,numSpokes} = this;
  let radius = .25;
  let startAngle = 0*(2*Math.PI);
  let stopAngle = .5*(2*Math.PI);
  //let center = Point.mk(.5,.5);
  //let center = Point.mk(.5,.5);
  let center = Point.mk(0,0);
  let numPoints = 20;
  let twoPI = this.twoPI = 2*Math.PI;
  let path0 = this.mkCircle({radius:0.4,numPoints,center});
  let path1 = this.mkCircle({radius:0.18,numPoints,center});
  let path2 = this.mkCircle({radius:0.4,numPoints,center});
  let path3 = this.mkCircle({radius:0.18,numPoints,center});
  let path4 = this.mkCircle({radius:0.4,numPoints,center});
  let path5 = this.mkCircle({radius:0.18,numPoints,center});
  let path6 = this.mkCircle({radius:0.4,numPoints,center});
  let path7 = this.mkCircle({radius:0.18,numPoints,center});
  //path1.transform = Transform.mk(Point.mk(.25,.25));
  this.thePath = path0;
  //t paths= [path0,path1,path2,path3];
  //let paths= [ipath0,ipath1];
  let paths= this.paths = [path0,path1,path2,path3,path4,path5,path6,path7];
  debugger;
  let params = {numPhases,paths,cycles,shapeP:circleP,shapeConnector,duration:numSteps};
  this.mkPathMotionGroup(params);

 // this.addMotionsForCell({cell:cells[0],paths,numPhases,shapeConnector});

}

rs.cPath0 = [Point.mk(-.25,-.25),Point.mk(.25,.25),Point.mk(-.25,-.25)];
rs.cPath0 = [Point.mk(-.25,-.25),Point.mk(.25,.25),Point.mk(-.25,-.25)];
rs.cPath1 = [Point.mk(-.25,.25),Point.mk(.25,-.25),Point.mk(-.25,.25)];
rs.cPath2 = [Point.mk(.25,.25),Point.mk(-.25,-.25),Point.mk(.25,.25)];
rs.cPath3 = [Point.mk(.25,-.25),Point.mk(-.25,.25),Point.mk(.25,-.25)];


rs.cPath0 = [Point.mk(-.25,-.25),Point.mk(.25,.25)];
rs.cPath1 = [Point.mk(-.25,.25),Point.mk(.25,-.25)];
rs.cPath2 = [Point.mk(.25,.25),Point.mk(-.25,-.25)];
rs.cPath3 = [Point.mk(.25,-.25),Point.mk(-.25,.25)];

rs.afterUpdateState = function () {
  debugger;
  let {paths,stepsSoFar:ssf,twoPI,numSteps,cPath0,cPath1,cPath2,cPath3} = this;
  let fr = (ssf/(numSteps-0));
  const setTransform = (targetPath,path,fr) => {
    let p = this.alongPath(path,fr);
    let tr = Transform.mk({translation:p});
    targetPath.transform = tr;
  }
  setTransform(paths[1],cPath0,fr);
  setTransform(paths[3],cPath1,fr);
  setTransform(paths[5],cPath2,fr);
  setTransform(paths[7],cPath3,fr);
 
}
rs.computeRgb = function (params) {
  let cn = params.connector;
  let i = cn.index;
  let rgb;
  let im = i%3;
  let mc = 250;
  let oc = 150;
  oc = 250;
  if (im === 0) {
    rgb = {r:oc,g:mc,b:oc}
  } else if (im ===1) {
    rgb = {r:oc,g:oc,b:mc};
  } else if (im===2) {
    rgb = {r:mc,g:oc,b:oc};
  }

  return rgb;
}
  

  

 
rs.showPaths= function () {
   debugger;
   let {connectorP,thePath} = this;
  //return 0;
  this.showPath(thePath,100,connectorP);
  return 1;
}
  

  
export {rs};


