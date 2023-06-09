

debugger;
import {rs as generatorP} from '/generators/gridSpinner.mjs';
let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

let wd = 200;
let nr = 8;
//
nr =2;
rs.setName('gridSpinner_26');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,numConnections:400,framePadding:.15*wd,stepsPerMove:10,numStepss:24,numSteps:400,center:Point.mk(0,0),radius:wd/4,
                 cycles:2,frameStroke:'white',frameStrokeWidth:1,saveAnimation:1,stepInterval:40,randomConnections:1,
           //      pauseAtt:[29,30,59,60],numConnections:100,numPhases:102,showThePath:1,showIntersections:1}
                 pauseAtt:[29,30,59,60],numConnections:20,numPhases:21,showThePath:0,showIntersections:1,numSpokes:3,randomOffset:0}
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

const interpolateColors = (clr0,clr1,fr) => {
  debugger;
  let {r:r0,g:g0,b:b0}=clr0;
  let {r:r1,g:g1,b:b1}=clr1;
  let nr = Math.floor(r0 + fr*(r1-r0));
  let ng = Math.floor(g0 + fr*(g1-g0));
  let nb = Math.floor(b0 + fr*(b1-b0));
  return {r:nr,g:ng,b:nb};
}



const sColor = {r:255,g:0,b:0};
const fColor = {r:0,b:255,g:0};

interpolateColors(sColor,fColor,.5)


  
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
  let {numCisCalls:ncc,rseq,numPhases:np,numConnections:nc,numSpokes:ns} = this;
 // debugger;
  //let e0si = rseq[ncc%nc];//,Math.floor(Math.random()*ln);
  //let e0si = ci;//Math.floor(Math.random()*nc);
  //let e0si = ncc%2?ci:ci+50;
  let e0si = ci;

  this.numCisCalls = ncc+1;
  let e1pi= (pi+1)%ns; 
  let e1si =(e0si+0+Math.floor(Math.random()*0))%np;
  //debugger;
  //console.log('e0si',e0si,'e1pi',e1pi,'e1si',e1si);
  return {end0ShapeIndex:e0si,end1PathIndex:e1pi,end1ShapeIndex:e1si};
}



rs.addMotions = function () {
  debugger;
  let {cells,numPhases,shapeConnector,numSpokes} = this;

  let spaths = this.mkSpokePaths({numSpokes,innerRadius:.05,outerRadius:.48,center:Point.mk(.5,.5),startAngle:(1/12+1/2)*(2*Math.PI)});
  //let paths = this.reversePaths(spaths);
  let paths = spaths;
 // this.addMotionsForCell({cell:cells[0],paths,numPhases,shapeConnector});
 cells.forEach((cell) =>{
    let {coords} = cell;
    debugger;
    let {index} = cell;
    let backwards;
    if (index===0) backwards = 0;
    if (index===1) backwards = 1;
    if (index===2) backwards = 0;
    if (index===3) backwards = 1;

   /* if (index === 4) {
      cell.numConnections = 10;
    }
    let {x,y} = coords;
    let z = (x+y)%4;*/
      this.addMotionsForCell({cell,paths,numPhases,shapeConnector,backwards});
  });
}


rs.placeConnector = function (connection) {
  debugger;
  let {stepsSoFar:ssf,numSteps} = this;
  let {shape0:c0,shape1:c1,numPhases,path,randomOffset0:roff0,randomOffset1:roff1,cell} = connection;
  let {index} = cell;
  let tr0 = c0.getTranslation();
  let tr1 = c1.getTranslation();
  let d = tr1.distance(tr0);
  //console.log('d',d);
  let ap0 = c0.alongPath;
  let ap1 = c1.alongPath;
  //let fr0 = 2*Math.min(ap0,1-ap0);
  let ech = (index===0) || (index ===1);
  if (index===0) ech = 0;
  if (index===1) ech = 1;
  if (index===2) ech = 1;
  if (index===3) ech = 0;
  let fr0 = ech?ap0:1-ap0;
  let fr1 = Math.pow(fr0,3);
  let rtr0 = tr0.plus(roff0.times(fr1));
  let rtr1 = tr1.plus(roff1.times(fr1));
  const placeInInterval = (v,lb,ub) => {
    let v0 = Math.max(lb,v);
    let v1 = Math.min(ub,v0);
    return v1;
  }
  rtr0.x = placeInInterval(rtr0.x,-100,100);
  rtr0.y = placeInInterval(rtr0.y,-100,100);
  rtr1.x = placeInInterval(rtr1.x,-100,100);
  rtr1.y = placeInInterval(rtr1.y,-100,100);
  
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

rs.afterUpdateState = function () {
  let {stepsSoFar:ssf,numSteps} = this;
  let fr = ssf/numSteps;
  let clr = interpolateColors(sColor,fColor,fr);
  let {r,g,b} = clr;
  let fill = `rgb(${r},${g},${b})`;
  this.icircleP.fill = fill;
  if (!(ssf%10)) {
    console.log('ssf',ssf,'fill',fill);
  }
}

export {rs};


