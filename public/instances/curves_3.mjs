import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as generatorP} from '/generators/curves_0.mjs'
let rs = generatorP.instantiate();

rs.setName('curves_1')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,numSteps:3*4*32,// 2 particle164	,		
                 saveAnimation:1,numLobes:2,maxifc:0.65,numCycles:6,
                 yc:1,ifc:0,numRings:15} //420 790
	
Object.assign(rs,topParams);

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .05;
}

rs.updatePolylines = function () {
  let {numRings:n,yc,ifc,numLobes:nl,height:ht} = this;
  this.polyCnt = 0;
  let hnl = nl/2;
  let off = 1;
  let pnts = this.approximateCurve(Math.sin,off-hnl*Math.PI,off+hnl*Math.PI,400);
  let rd = 20;
  let iv = rd/n;
  let theta=  (Math.PI/nl);
  for (let i=1;i<n;i++) {
    if (i===5) {
      debugger;
    }
    let spnts = this.scale(pnts,0.25*(1/nl)*ht,ifc*i,0,-yc*i);
   // let ppnts = this.fromPolar(spnts);
  //  let rpnts = this.rotate(ppnts,theta);
    this.displayPolyline(spnts);
  }

}

rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP,yc,maxifc} = this;
  let hht = 0.5*ht;
  this.initProtos();
  this.addFrame();
  this.ifc = maxifc;
  this.updatePolylines();
}


const between = function (x,lb,ub) {
  return (lb<=x)&&(x<ub);
}

const betweenI = function (x,lb,ub) {
  return (lb<=x)&&(x<=ub);
}

rs.numLobesPerCycle = [2,4,8,16,64];
rs.numLobesPerCycle = [64,8];
rs.execCycle = function (n) {
  let {numSteps,stepsSoFar:ssf,maxifc,numLobesPerCycle:nlpc} = this;
  let numCycles = nlpc.length;
  let numLobes = nlpc[n];
  this.numLobes = numLobes;
  let spc = numSteps/numCycles;
  let spsc = spc/3;
  let sc  = n*spc;
  let sc0 = sc;
  let sc1 = sc+spsc;
  let sc2=sc +2*spsc;
  let ec = sc+spc;
  
  if (betweenI(ssf,sc0,sc1)) {
    this.ifc = maxifc*((ssf-sc0)/spsc);
  } else if (betweenI(ssf,sc1,sc2)) {
    let fr = (ssf-sc1)/spsc;
    this.yc = 1+maxifc*fr;
    this.ifc = maxifc*(1-fr);
  } else if (betweenI(ssf,sc2,ec)) {
    let fr = (ssf-sc2)/spsc;
    this.yc = 1+maxifc*(1-fr);
  }
  this.updatePolylines()  
}  

rs.whichCycle = function () {
  let {stepsSoFar:ssf,numSteps,numLobesPerCycle:nlpc}  = this;
  let numCycles = nlpc.length;
  let spc = numSteps/numCycles;
  let wc = Math.floor(ssf/spc);
  return wc;
}


rs.updateState= function () {
  debugger;
  let wc = this.whichCycle();
  this.execCycle(wc);
}
/*
  let {stepsSoFar:ssf,yc,ifc,numSteps} = this;
  debugger;
  let hns = numSteps/2
  let maxifc = 0.65;
  if (ssf <= hns) {
    this.ifc = maxifc*(ssf/hns);
  } else {
    let fr = (ssf-hns)/hns;
    this.yc = 0.9*(1+fr);
    this.ifc = maxifc*(1-fr);
  }
  this.updatePolylines();
}
  
  */


export {rs}
  

  