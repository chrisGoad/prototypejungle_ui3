import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as generatorP} from '/generators/curves_0.mjs'
let rs = generatorP.instantiate();

rs.setName('curves_3')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,numSteps:3*4*32,// 2 particle164	,		
                 saveAnimation:1,numWaveLines:9,numWaves:2,maxifc:0.65,numCycles:6,
                 yc:1,ifc:0,numRings:15} //420 790
	
Object.assign(rs,topParams);

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.dimension = .2
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'red';
  lineP['stroke-width'] = .15;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .05;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.stroke = 'red';
  rectP['stroke-width'] = .15;
}

rs.updatePolylines = function (phase,amplitude) {
  let {stepsSoFar:ssf,numWaveLines:nln,numWaves:nw,yc,ifc,numLobes:nl,height:ht,oofx} = this;
  this.polyCnt = 0;
  //let hnl = nl/2;
  let off = 1;
  let xsc  = 7/nw;
  let horizontals = this.horizontals = [];
  let verticals = this.verticals = [];
  
  let rd = 20;
  //let iv = rd/n;
  let theta=  (Math.PI/nl);
  
  for (let i=0;i<nln;i++) {
    let phmsf = i?0:ssf*.02*Math.PI;
    let phmi = i*.0521*Math.PI;
    let mphase = phase+phmsf+phmi;
    let pnts = this.approximateCurve(Math.sin,phase-nw*Math.PI,phase+nw*Math.PI,100);

    if (i===5) {
      debugger;
    }
    let spnts = this.scale(pnts,xsc,amplitude);
    if (ssf ===0) {
      oofx = this.oofx =spnts[0].x;
    }
    let cofx = spnts[0].x;
    let ofx = ssf?oofx-cofx:0;
    let tpnts = this.translate(spnts,Point.mk(ofx,3*(i-0.5*nln)));
    
   // let ppnts = this.fromPolar(spnts);
   let rpnts = this.rotate(tpnts,0.5*Math.PI);
   horizontals.push(tpnts);
   verticals.push(rpnts);
    this.displayPolyline(tpnts);
    this.displayPolyline(rpnts);
  }
  let h0 = horizontals[0]
  let v0 = verticals[0];
  debugger;
  let ipnt = this.intersectPointSets(h0,v0);
  return ipnt;
}

rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP,yc,maxifc} = this;
  let hht = 0.5*ht;
  this.initProtos();
  this.addFrame();
  this.ifc = maxifc;
  this.updatePolylines(0,1);
  this.phase = 0;
}


rs.updateState= function () {
  let {phase} = this;
  debugger;
  let ph = this.phase =  phase + .05*Math.PI;
  this.updatePolylines(ph,.5);
}

export {rs}
  

  