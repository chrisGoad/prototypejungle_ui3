

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
rs.selj = function (cell,i,ln) {
  let {coords} = cell;
  let {x,y} = coords;
  return (i+y)%ln;
  return Math.floor(Math.random()*ln);
}
rs.selk = function (cell,j,ln) {
  //return j+Math.floor(Math.random()*36)%ln;
  return (j+36)%ln;
}



rs.shapeConnector = function (mg,cell) {
  debugger;
  let {selj,selk} = this;
  this.shapeConnectorC({motionGroup:mg,cell,numConnections:25,selj,selk});
}
/*rs.shapeConnector = function (mg,cell) {
  let {selj,selk} = this;
  this.shapeConnectorC(mg,cell,25,selj,selk);
}*/

const mkWavyCircle = function (params) {
  let {radius:r,deltaRadius:dr,numWaves,numPoints:np,center,startAngle:sa} = params;
  let da = (2*Math.PI)/(np+1);
  let path = [];
  for (let i=0;i<=np;i++) {
    let a = sa+i*da;
    let vec = Point.mk(Math.cos(a),Math.sin(a)).times(r);
    let dvec = vec.plus(center);
    path.push(dvec);
  }
  return path;
}

const twoCircles = function (params) {
  let {centers,startAngles} = params;
  
  let params0 = Object.assign({},params);
  let params1 = Object.assign({},params);
  Object.assign(params0,{center:centers[0],startAngle:startAngles[1]});
  Object.assign(params1,{center:centers[1],startAngle:startAngles[1]});
  let c0 = mkCircle(params0);
  let c1 = mkCircle(params1);
  let path = c0.concat(c1.reverse());
  return path;
}

const threeCircles = function (params) {
  let {centers,startAngles} = params;
  
  let params0 = Object.assign({},params);
  let params1 = Object.assign({},params);
  let params2 = Object.assign({},params);
  Object.assign(params0,{center:centers[0],startAngle:startAngles[1]});
  Object.assign(params1,{center:centers[1],startAngle:startAngles[1]});
  Object.assign(params2,{center:centers[2],startAngle:startAngles[2]});
  let c0 = mkCircle(params0);
  let c1 = mkCircle(params1);
  let c2 = mkCircle(params2);
  let path = c0.concat(c1.reverse().concat(c2));
  return path;
}


const mkSpiral = function(params) {
  let {turns,pointsPerTurn:ppt,iRadius:ir,deltaRadius:dr,center} = params;
  let path =[];
  for (let i=0;i<turns;i++) {
    let sr = ir - i*dr;
    let fr = ir - (i+1)*dr;
    let da = (2*Math.PI)/(ppt+1);
    let idr = (fr-sr)/ppt;
    for (let j=0;j<=ppt;j++) {
      let a = j*da;
      let cr = sr + j*idr;
      let vec = Point.mk(Math.cos(a),Math.sin(a)).times(cr);
      let dvec = vec.plus(center);
      path.push(dvec);
    }
  }
  return path;
}
    
rs.mkMyPath = function () {
  let radius = 0.25;
  let np = 18;
  
  let centers = [Point.mk(.25,0.25),Point.mk(0.75,0.25),Point.mk(0.5,0.75)];
  //let startAngles = [-0.5*Math.PI,0.5*Math.PI,0.5*Math.PI];
  let startAngles = [-0.5*Math.PI,0.5*Math.PI,0.5*Math.PI];
  let path = this.threeCircles({radius,numPoints:np,centers,startAngles}); 
 return path;
} 
rs.addMotions = function () {
  let {cells} = this;
 /* let path0 = mkPath0();
  let path1 = mkPath1();
  let path2 = mkPath2();
  let path3 = mkPath3();
  let paths = [path1,path0,path2,path3];*/
  let iRadius = 0.25;
  let deltaRadius = 0.1* iRadius;
   /* let radius = 0.25;

  let np = 8;
  let centers,startAngles,path;
  centers = [Point.mk(0.5,0.75),Point.mk(0.5,0.25)];
  startAngles = [-0.5*Math.PI,0.5*Math.PI];
  debugger;
  path = this.twoCircles({radius,numPoints:np,centers,startAngles});
   centers = [Point.mk(.25,0.25),Point.mk(0.75,0.25),Point.mk(0.5,0.75)];
  startAngles = [-0.5*Math.PI,0.5*Math.PI,0.5*Math.PI];*/
  debugger;
  let path = this.mkMyPath();

  this.addMotionsForCell(cells[0],path,100,this.shapeConnector);// put back
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
    this.addMotionsForCell(cell,path,30,this.shapeConnector);// put back
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


