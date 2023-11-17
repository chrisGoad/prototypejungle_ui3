import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as generatorP} from '/generators/stripes_1.mjs'
let rs = generatorP.instantiate();

rs.setName('stripes_1')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,numSteps:4*3*4*32,version:0};
	
Object.assign(rs,topParams);

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
    let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'white';
  rectP.stroke = 'red';
  rectP['stroke-width'] = 0;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .05;
}


rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP,yc,maxifc,version} = this;
  let hht = 0.5*ht;
  this.initProtos();
  this.addFrame();
  let stripes = this.stripes=[];
  this.set('rectShapes',arrayShape.mk());
  let rect0 = Rectangle.mk(Point.mk(-2,-2),Point.mk(4,4));
  //let rs0 = this.displayRectangle(rect0);
  //let params = {stripeWidth:1,stripeLength:30,numStripes:10,vertical:1};
  let bws = this.exponentialSeries(.8,15);
  debugger;
  let ps = this.perspectiveSeries(Point.mk(0,100),Point.mk(5,10),1,9);
  let params = {stripeLength:48,stripeWidthFactor:0.2,bandWidths:ps,vertical:1,fill:'white',whereInBand:0};
  //let vs = this.genStripes(params);
  this.allocStripesV(params);
  let numVstripes = this.numVstripes = stripes.length+1;
  params.vertical = 0;
  params.fill = 'blue';
  params.fill = 'rgba(0,0,0,0)';
  params.fill = 'white';
  this.allocStripesV(params);
  this.updateStripesV(params);
  this.uparams = params;

}

rs.updateState= function () {
  let {stepsSoFar:ssf,uparams} = this;
  let whib = 0.025*(ssf%40) -.5;
  uparams.whereInBand = -whib;
  this.updateStripesV(uparams);
}
  
  


export {rs}
  

  