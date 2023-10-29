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

rs.updatePolylines = function (phase0,phase1,amplitude0,amplitude1) {
  let {stepsSoFar:ssf,numWaveLines:nln,numWaves:nw,yc,ifc,numLobes:nl,height:ht,oofx0,oofx1} = this;
  this.polyCnt = 0;
  //let hnl = nl/2;
  let off = 1;
  let xsc  = 7/nw;
  
  
  let rd = 20;
  //let iv = rd/n;
  let theta=  (Math.PI/nl);
  let pnts0 = this.approximateCurve(Math.sin,phase0-nw*Math.PI,phase0+nw*Math.PI,100);
  let pnts1 = this.approximateCurve(Math.sin,phase1-nw*Math.PI,phase1+nw*Math.PI,100);

  for (let i=0;i<nln;i++) {
    let phmsf = i?0:ssf*.02*Math.PI;
 //   let phmi = i*.0521*Math.PI;
 //   let mphase = phase+phmsf+phmi;

    if (i===5) {
      debugger;
    }
    let spnts0 = this.scale(pnts0,xsc,amplitude0);
    let spnts1 = this.scale(pnts1,xsc,amplitude1);
    if (ssf ===0) {
      oofx0 = this.oofx0 =spnts0[0].x;
      oofx1 = this.oofx1 =spnts1[0].x;
    }
    let cofx0 = spnts0[0].x;
    let ofx0 = ssf?oofx0-cofx0:0;
    let cofx1 = spnts1[0].x;
    let ofx1 = ssf?oofx1-cofx1:0;
    let tpnts0 = this.translate(spnts0,Point.mk(ofx0,3*(i-0.5*nln)));
    let tpnts1 = this.translate(spnts1,Point.mk(ofx1,3*(i-0.5*nln)));
    
   // let ppnts = this.fromPolar(spnts);
   let rpnts = this.rotate(tpnts1,0.5*Math.PI);
    this.displayPolyline(tpnts0);
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
  this.updatePolylines(0,0,1,1);
  this.phase0 = 0;
  this.phase1 = 0;
}


rs.updateState= function () {
  let {phase0,phase1} = this;
  debugger;
  let ph0 = this.phase0 =  phase0 + .05*Math.PI;
  let ph1 = this.phase1 =  phase1 + .01*Math.PI;
  this.updatePolylines(ph0,ph1,.5,2);
}

export {rs}
  

  