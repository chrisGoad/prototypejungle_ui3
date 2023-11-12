import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as polygonPP} from '/shape/polygon.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as generatorP} from '/generators/curves_0.mjs'
let rs = generatorP.instantiate();

rs.setName('curves_5')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,numSteps:40,// 2 particle164	,		
                 saveAnimation:1,numWaveLines:2,numWaves:2,maxifc:0.65,numCycles:6,amplitude:1,
                 yc:1,ifc:0,numRings:15} //420 790
	
Object.assign(rs,topParams);

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.dimension = 1;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .15;
  let polygonP = this.polygonP = polygonPP.instantiate();
  polygonP.stroke = 'white';
  polygonP['stroke-width'] = .05;
  polygonP.fill = 'rgb(0,50,50)';
   let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .1;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.stroke = 'red';
  rectP['stroke-width'] = .15;
}
/*

*/

rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP,yc,maxifc} = this;
  let hht = 0.5*ht;
  this.initProtos();
  this.addFrame();
  this.ifc = maxifc;
  this.initCenters();
  this.populateCenterShapes();
  this.updatePolylines(0,1);
  this.phase = 0;
}


rs.updateState= function () {
  let {phase,amplitude,stepsSoFar:ssf} = this;
  debugger;
  //this.amplitude = 0.2+.004*ssf;
  let ph = this.phase =  phase + .05*Math.PI;
  this.updatePolylines(ph,this.amplitude,'green');
}

export {rs}
  

  