

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
rs.setName('gridSpinner_23');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,numConnections:400,framePadding:.2*wd,stepsPerMove:10,numStepss:24,numSteps:400,center:Point.mk(0,0),radius:wd/4,
                 cycles:1,frameStroke:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,
           //      pauseAtt:[29,30,59,60],numConnections:100,numPhases:102,showThePath:1,showIntersections:1}
                 pauseAtt:[29,30,59,60],numConnections:100,numPhases:100,showThePath:0,showIntersections:0,numSpokes:11,randomOffset:0}
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
  if (!(pi % 2)) {
    e1pi = pi+1;
    //e1pi = pi;
  } else {
    return;
  }
  if ((pi === 1)||(pi == 3)) {
    e1pi = pi-1;
   // e1pi = pi;
  }
  let e1si =(e0si+3+Math.floor(Math.random()*2))%np;
  //debugger;
  console.log('e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}



rs.addMotions = function () {
  debugger;
    let {cells,numPhases,shapeConnector,numSpokes} = this;
 
  let numPoints = 20;
  const mk2Paths =  (rect,reverse)=>{
    let nc = rect.namedCorners();
    let {UL,UR,LL,LR} = nc;
    let  upathi = this.setPathLength([UL,UR],numPoints);
    let  lpathi = this.setPathLength([LL,LR],numPoints);
    let upath = reverse?upathi.reverse():upathi;
    let lpath = reverse?lpathi.reverse():lpathi;
    return [upath,lpath];
  }

  let rwd = 0.9;
  let rht = 0.05;
  const mkRect = (y) => {
    return Rectangle.mk(Point.mk(0.5*(1-rwd),y),Point.mk(rwd,rht));
  }
  const mkPaths = (y,reverse) => {
    let rect = mkRect(y);
    let paths = mk2Paths(rect,reverse);
    return paths;
  }
  let paths =[]
  for (let i = 1;i<20;i++) {
    paths = paths.concat(mkPaths(i*.05,i%2));
  }
    
  this.addMotionsForCell({cell:cells[0],paths,numPhases,shapeConnector});

}


rs.placeConnector = function (connection) {
  debugger;
  let {stepsSoFar:ssf,numSteps} = this;
  let {shape0:c0,shape1:c1,numPhases,path,randomOffset0:roff0,randomOffset1:roff1} = connection;
  let tr0 = c0.getTranslation();
  let tr1 = c1.getTranslation();
  let ap0 = c0.alongPath;
  let ap1 = c1.alongPath;
  let fr0 = 2*Math.min(ap0,1-ap0);
  let fr1 = Math.pow(fr0,5);
  let rtr0 = tr0.plus(roff0.times(fr1));
  let rtr1 = tr1.plus(roff1.times(fr1));
  let r0y = rtr0.y;
  rtr0.y = Math.min(r0y,100);
  rtr0.y = Math.max(r0y,-100);
  let r1y = rtr1.y;
  rtr1.y = Math.min(r1y,100);
  rtr1.y = Math.max(r1y,-100);
  return [rtr0,rtr1]
}

rs.annotateConnection = function (cn) {
  let {end0ShapeIndex:e0i,numPhases:np} = cn;
  let rf = 40;
  const randomPoint = () => {
    let x = rf * (Math.random()-0.5);
    let y = rf * (Math.random()-0.5);
    return Point.mk(x,y);
  }
  cn.randomOffset0 = randomPoint();
  cn.randomOffset1 = randomPoint();
}
  
rs.showPaths= function () {
   debugger;
   let {connectorP,thePath} = this;
  //return 0;
  this.showPath(thePath,100,connectorP);
  return 1;
}
  

  
export {rs};


