

debugger;
import {rs as generatorP} from '/generators/paths.mjs';
let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 200;
let nr = 8;
//
nr =3;
rs.setName('paths_6');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,numConnections:400,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:300,
                 numCircles:7,innerRadius:35,outerRadius:60,
                 cycles:1,frameStrokee:'rgb(2,2,2)',frameStroke:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,lowFade:0,scaling:1,
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
  let bigCircleP = this.bigCircleP = circlePP.instantiate();
  bigCircleP.dimension= 2;
  bigCircleP.fill = 'transparent';
  bigCircleP.stroke = 'white';
  bigCircleP.stroke = 'transparent';
  bigCircleP['stroke-width'] = 1;
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
  let e1pi = (pi+2)%7;
 // let e1pi = pi;
  let e1si =(e0si+5+Math.floor(Math.random()* 0))%np;
  //debugger;
  console.log('pi',pi,'e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}

rs.mkCirclePaths = function (params) {
  let {bigCircleP} = this;
  let {numCircles:nc,outerRadius:orad,innerRadius:irad} = params;
  let circles = this.set("circles",arrayShape.mk());
  let paths = [];

  let da = (2*Math.PI)/nc;
  for (let i=0;i<nc;i++) {
    let a = i*da;
    let cnt = Point.mk(Math.cos(a),Math.sin(a)).times(orad);
    let crc = bigCircleP.instantiate();
    crc.dimension = 2*irad;
    circles.push(crc);
    crc.moveto(cnt);
    crc.show();  
    let path = this.mkCirclePath({radius:irad,numPoints:10,center:cnt}); 
    if (i%2) {
      path = path.reverse();
    }
    paths.push(path);    
  }
  return paths;
}
  
    


      
rs.addMotions = function () {
  debugger;
    let {numSteps,circleP,cycles} = this;

    let {cells,numPhases,shapeConnector,numSpokes} = this;
  debugger;
  let {outerRadius,innerRadius,numCircles} = this;
  let cparams = {outerRadius,innerRadius,numCircles};
  let opaths = this.originalPaths =this.mkCirclePaths(cparams);
  let paths = this.paths = this.copyPaths(opaths);
  let params = {numPhases,paths,cycles,shapeP:circleP,shapeConnector,duration:numSteps};
  this.mkPathMotionGroup(params);
}

rs.afterUpdateState = function () {
  let {numSteps,stepsSoFar:ssf,originalPaths:op,paths} = this;
  debugger;
  let fr = ssf/numSteps;
  let a = (2*Math.PI)*fr;
  let tr = Transform.mk({rotation:a});
  let tpaths = this.transformPaths(op,tr);
  this.copyPathsTo(paths,tpaths);
}
  

  
  
export {rs};


