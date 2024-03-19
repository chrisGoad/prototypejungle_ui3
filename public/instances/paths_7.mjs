

debugger;
import {rs as generatorP} from '/generators/paths_6_13_23.mjs';
let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 630;
//wd =220;
let nr = 8;
//
nr =3;
rs.setName('paths_7');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,numConnections:400,framePadding:.1*wd,stepsPerMove:10,numStepss:24,numSteps:200,
                 numCircles:6,innerRadius:20,radiusFactor:1.7,showEnds:1,
                 cycles:1,frameStrokee:'rgb(2,2,2)',frameStroker:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,lowFade:0,scaling:1,
                 pauseAtt:[29,30,59,60],numConnections:60,numPhases:60/*100*/,showThePaths:0,showIntersections:0,chopOffBeginning:2,chopOffEnd:0,newCoords:1}
Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = 2;
  lineP.stroke = 'cyan';
   let connectorP = this.connectorP = linePP.instantiate();
  connectorP['stroke-width'] = .5;
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
 // bigCircleP.stroke = 'transparent';
  bigCircleP['stroke-width'] = 1;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 4;
  circleP.fill = 'blue';
  circleP['stroke-width'] = 0;
  let icircleP = this.icircleP = circlePP.instantiate();
  icircleP.dimension= 1;
  icircleP.fill = 'red';
  icircleP['stroke-width'] = 0;
  
}


rs.connectIndices = function (params) {
  debugger;
  let {cell,pathIndex:pi,connectIndex:ci} = params;
  let {numPhases:np,numConnections:nc,piMap,numCircles:ncrc} = this;
  let e0si = ci;
  if (pi >= (ncrc-0)) {
    return;
  }
  let e1pi = (pi%2)?pi-1:pi+1;
  
 //let e1pi = pi+1;
 //let e1pi = pi;
  let e1si =(e0si+12+Math.floor(Math.random()* 0))%np;
  //debugger;
  console.log('pi',pi,'e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}

rs.mkCirclePaths = function (params) {
  let {bigCircleP} = this;
  let {numCircles:nc,radiusFactor:rf,innerRadius:irad} = params;
  let circles = this.set("circles",arrayShape.mk());
  debugger;
  let paths = [];
  let cr = irad;
  let cnt = Point.mk(0,0);
  for (let i=0;i<nc;i++) {
  
   
    let crc = bigCircleP.instantiate();
    crc.dimension = 2*cr;
    circles.push(crc);
    //crc.moveto(cnt);
    crc.show();  
    let path = this.mkCirclePath({radius:cr,numPoints:10,center:cnt}); 
    if ((i%2)&&0) {
      path = path.reverse();
    }
    cr=cr*rf;
    paths.push(path);    
  }
  return paths;
}
  
    


      
rs.addMotions = function () {
  debugger;
    let {numSteps,circleP,cycles} = this;

    let {cells,numPhases,shapeConnector,numSpokes} = this;
  debugger;
  let {radiusFactor,innerRadius,numCircles} = this;
  let cparams = {radiusFactor,innerRadius,numCircles};
  let opaths = this.originalPaths =this.mkCirclePaths(cparams);
  let paths = this.paths = this.copyPaths(opaths);
  let params = {numPhases,paths,cycles,shapeP:circleP,shapeConnector,duration:numSteps};
  this.mkPathMotionGroup(params);
}

rs.afterUpdateState = function () {
  let {numSteps,stepsSoFar:ssf,originalPaths:op,paths,circles,numCircles:nc,innerRadius:irad,radiusFactor:rf} = this;
  debugger;
  let fr = ssf/numSteps;
  let a = (2*Math.PI)*fr;
  let rfac = .05;
  let boff=8;
  //let ln = circles.length;
  let cr = irad;
  let rads = [9,9.7,10.9,12.13,50,56];
  for (let i=0;i<nc;i++) {
    let phase = (2*Math.PI)*(i/nc);
    let pha = a+phase;
    let rad = boff+rfac*cr;
    rad = rads[i];
    let roffset = Point.mk(Math.cos(pha),Math.sin(pha)).times(rad);

    let crc = circles[i];
    crc.moveto(roffset);
    let opath=op[i];
    let path = paths[i];
    let tr = Transform.mk({translation:roffset});
    let tpath = this.transformPath(opath,tr);
    this.copyPathTo(path,tpath);
    cr = cr*rf;
  }
}
  

  
  
export {rs};

