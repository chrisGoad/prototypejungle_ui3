import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as generatorP} from '/generators/curves_0.mjs'
let rs = generatorP.instantiate();

rs.setName('curves_1')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,numSteps:200,// 2 particle164	,		
                 saveAnimation:1,numLiness:160,
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
  let {numRings:n,yc,ifc} = this;
  this.polyCnt = 0;
  let off = 1;
  let pnts = this.approximateCurve(Math.sin,off-8*Math.PI,off+8*Math.PI,400);
  let rd = 20;
  let iv = rd/n;
  let theta=  (Math.PI/16);
  for (let i=1;i<n;i++) {
    let spnts = this.scale(pnts,1/8,ifc*i,0,yc*i);
    if (i===3) {
      debugger;
    }
    let ppnts = this.fromPolar(spnts);
    let rpnts = this.rotate(ppnts,theta);
    let ln = rpnts.length
    let min=100000;
    let max = 0;
    for (let i=0;i<ln;i++) {
      let pln = rpnts[i].length();
      if (pln < min) {
       min=pln;
      } 
      if (pln>max) {
        max = pln;
      }
    }
    console.log('min',min,'max',max);
    this.displayPolyline(rpnts);
  }

}

rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP,yc,ifc} = this;
  let hht = 0.5*ht;
  this.initProtos();
  this.addFrame();
  //this.updatePolylines();
}


rs.updateState= function () {
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
  
  


export {rs}
  

  