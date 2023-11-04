import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as polygonPP} from '/shape/polygon.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as generatorP} from '/generators/curves_0.mjs'
let rs = generatorP.instantiate();

rs.setName('curves_6')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,numSteps:120,spikeWidthFactor:.95,spinPerStep:0.01*Math.PI,	
                 saveAnimation:1,numWaveLines:2,numWaves:2,maxifc:0.65,numCycles:6,amplitude:1,innerDim:10,outerDim:20,numSpikes:15,baseTheta:0,
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
  polygonP['stroke-width'] = .0;
  polygonP.fill = 'white';
   let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .05;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.stroke = 'red';
  rectP['stroke-width'] = .15;
}


rs.polygonAt = function (theta,fill) {
  let {innerDim:indim,outerDim:outdim,spikeWidthFactor:swf,numSpikes,baseTheta} = this;
  let deltaTheta = (swf*0.5*Math.PI*2)/numSpikes;
  let minTheta = baseTheta+theta-deltaTheta;
  let maxTheta = baseTheta+theta+deltaTheta;
  const pointAt = (theta,dim) => {
    let p = Point.mk(Math.cos(theta),Math.sin(theta)).times(dim);
    return p;
  }
  let p0 = pointAt(minTheta,indim);
  let p1 = pointAt(maxTheta,indim);
  let p2 = pointAt(maxTheta,outdim);
  let p3 = pointAt(minTheta,outdim);
  let pnts = [p0,p1,p2,p3];
  this.displayPolygon(pnts,fill);
 }

rs.displaySpikes = function (fill) {
  let {numSpikes:ns} =this;
  this.polygonCnt = 0;
  let deltaTheta = (2*Math.PI)/ns;
  for (let i=0;i<ns;i++) {
    let theta = i*deltaTheta;
    this.polygonAt(theta,fill);
  } 
}
  
  
  
rs.initialize = function () {
   debugger;
   let {width:wd} = this;
   //this.setBackgroundColor('red');
   debugger;
  
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP,yc,maxifc,innerDim:indim,outerDim:outdim} = this;
  let hht = 0.5*ht;
  this.initProtos();
   let innerC = this.circleP.instantiate();
   let outerC = this.circleP.instantiate();
   innerC.dimension = 2*indim;
   outerC.dimension = 2*outdim;
   innerC.fill = 'black';
   outerC.fill = 'green';
   this.set('outerC',outerC);
      this.set('innerC',innerC);

  this.addFrame();

  //this.displaySpikes();
 
}


rs.updateState= function () {
  let {phase,amplitude,stepsSoFar:ssf,numSteps:ns,brect,spinPerStep:sps,outerC} = this;
  debugger;
  this.baseTheta = ssf*sps;
  let hns = 0.5*ns-2;
  let swf,fill,v;
  if (ssf<=hns) {
    swf = ssf/hns;
    fill = 'white';
    v = Math.floor(swf*255);
  } else {
    swf = (ssf-hns)/hns;
    fill = 'black';
    v = Math.floor((1-swf)*255);
  }    
  outerC.fill = `rgb(${v},${v},${v})`;
  outerC.update();
  //this.amplitude = 0.2+.004*ssf;
  this.spikeWidthFactor = swf;
  debugger;
  this.displaySpikes(fill);
}

export {rs}
  

  