import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
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
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .15;
}

rs.updatePolylines = function (phase,amplitude) {
  let {stepsSoFar:ssf,numWaveLines:nln,numWaves:nw,yc,ifc,numLobes:nl,height:ht,oofx} = this;
  this.polyCnt = 0;
  //let hnl = nl/2;
  let off = 1;
  let xsc  = 7/nw;
  
  
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
    this.displayPolyline(tpnts);
    this.displayPolyline(rpnts);
  }

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
  

  