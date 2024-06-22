import {rs as linePP} from '/shape/line.mjs';

import {rs as generatorP} from '/instances/part2_0_I.mjs';

let rs = generatorP.instantiate();


rs.setName('part2_0_I_18');

rs.partParams.rectangular = 1;
let sp = rs.partParams.splitParams = {Case:9,direction:-0.25*Math.PI,radius:0.3,pcs:[.4,1.4,2.4,3.4]};
//let sp = rs.partParams.splitParams = {Case:9,direction:Math.random()*Math.PI,radius:Math.random()*0.4,pcs:[.4,1.4,2.4,3.4]};
debugger;
let wd =200;
let ht = 100;
let nc=80;
let nr = 40;
let myParams = {width:wd,height:ht,numCols:nc,numRows:nr,doNotDisplayParts:1,saveAnimation:1,numSteps:200};
Object.assign(rs,myParams);



rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
}


rs.shapeGenerator = function (rvs,cell) {
//  debugger;
  let {rectP,lineP,numCols,width} = this;
  let cwd = width/numCols;
  let frw =1;
  let scwd = frw*cwd;
  let {x,y} = cell;
  let shape = lineP.instantiate().show();
  let hs = 0.5*scwd;
  shape.setEnds(Point.mk(0,-hs),Point.mk(0,hs));
  shape.stroke = 'white';
  shape.whichGon = (y)%2;
  return shape;
 
}

rs.afterInitialize =function ()  {
  debugger;
  let {width:wd,height:ht,numCols,blackOb,whiteOb} = this;
  let hwd = wd/2;
  let hht = ht/2;
  let UL = Point.mk(-hwd,-hht);
  let UR = Point.mk(hwd,-hht);
  let LR = Point.mk(hwd,hht);
  let LL = Point.mk(-hwd,hht);
  let gon = Polygon.mk([UL,UR,LR,LL]);
  let tp =this.topPart;
 // let gons0 = [tp.P0.polygon,tp.P1.polygon,tp.P2.polygon,tp.P3.polygon];
  let gons0 = [gon];
  let gons1 = gons0.map((gon) => Polygon.mk(gon.corners));
  this.computeSides(gons0);
  this.computeSides(gons1);
  
  const mkValues1 = ()=>[this.randomColorOb(),this.randomColorOb(),this.randomColorOb(),this.randomColorOb()];
    const mkValues0 = ()=>[blackOb,whiteOb,blackOb,whiteOb];
  //  const mkValues1 = ()=>[whiteOb,blackOb,whiteOb,blackOb];

  const setValuesForGon = (gon,fn) => {
    gon.values = fn();
  }
  


  const op = (shp,iv) => {
    debugger;
    let wg = shp.whichGon;
    console.log('wg',wg);
    let cwd = wd/numCols;
    let frw =1;
    let scwd = frw*cwd;
    let hs = 0.5*scwd;
    let qs = 0.25*scwd;
    let hlnl = .4*scwd;
    let off = wg?Point.mk(0,hs):Point.mk(0,-hs);
    let rgb = this.colorObToRgb(iv);
    rgb = 'white';
    shp.stroke = wg?'white':'yellow';//rgb;
    shp.stroke = rgb;
    console.log('iv.r',iv.r);
   // let a = 2*(iv.r/255)*Math.PI+(wg?1*Math.PI:-1*Math.PI);
    let a = 4*(iv.r/255)*Math.PI;
    let p0 = Point.mk(-hlnl*Math.cos(a),-hlnl*Math.sin(a)).plus(off);
    let p1 = Point.mk(hlnl*Math.cos(a),hlnl*Math.sin(a)).plus(off);
    shp.setEnds(p0,p1);
    shp.update();
  }      

  gons0.forEach((gon) => setValuesForGon(gon,mkValues0)) 
  gons1.forEach((gon) => setValuesForGon(gon,mkValues1)) 

    debugger;

  this.generateGrid();
  this.setCells(gons0,op);
  this.setCells(gons1,op);
  return;
  this.displayTitle('Partition 8');
  this.displayPc(0);
  this.displayPc(1);
  this.displayPc(2);
  this.displayPc(3);
 

}


rs.updateState = function () {
  debugger;
  let {numSteps,stepsSoFar:ssf} = this;
  this.partParams.splitParams.direction = (ssf/numSteps)*2*Math.PI;//= {Case:9,direction:-0.25*Math.PI,radius:0.2,pcs:[.4,1.4,2.4,3.4]};
  this.resetShapes();
  this.afterInitialize();
}

export {rs};

