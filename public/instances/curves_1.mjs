import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as generatorP} from '/generators/curves_0.mjs'
let rs = generatorP.instantiate();

rs.setName('curves_1')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:0.15,stopTime:200,stopStep:534,// 2 particle164	,		
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.9*ht,speedup:1,swp:1,numParticles:3,chopOffBeginningg:16,numLines:160} //420 790
	
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
  polylineP['stroke-width'] = .2;
}


rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP} = this;
  let hht = 0.5*ht;
  this.setNumSteps();
  this.initProtos();
  this.addFrame();
  const f = (x) => {
    debugger;
    let y = Math.sin(x);
    let sy = hht*y
    return sy;
  }
  let off = 1;
  let pnts = this.approximateCurve(Math.sin,off-8*Math.PI,off+8*Math.PI,400);
  let rd = 20;8
  let n = 30;
  let iv = rd/n;
//  let theta=  (Math.PI/180)*10;
  let theta=  (Math.PI/16);
  for (let i=1;i<n;i++) {
    //let spnts = this.scale(pnts,1,10*i*iv);
   // let spnts = this.scale(pnts,1/(1.276*Math.PI),.2*Math.pow(i/3,1.9));
   // let spnts = this.scale(pnts,1/8,.1*Math.pow(i/3,1.9));
    let spnts = this.scale(pnts,1/8,1*Math.pow(i/3,1.5));
    let tpnts = this.translate(spnts,Point.mk(0,Math.pow(i,1.1)));
    //let tpnts = this.translate(spnts,Point.mk(0,.2*iv*i));
    let ppnts = this.fromPolar(tpnts);
    debugger;
    let rpnts = this.rotate(ppnts,theta);
    
    this.displayPolyline(rpnts);
  }
  return;
 
}

export {rs}
  

  