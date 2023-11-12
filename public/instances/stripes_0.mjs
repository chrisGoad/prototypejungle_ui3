import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as generatorP} from '/generators/stripes_0.mjs'
let rs = generatorP.instantiate();

rs.setName('stripes_1')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,numSteps:3*4*32};
	
Object.assign(rs,topParams);

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
    let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'white';
  rectP.stroke = 'red';
  rectP['stroke-width'] = 0.05;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .05;
}


rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP,yc,maxifc} = this;
  let hht = 0.5*ht;
  this.initProtos();
  this.addFrame();
  this.set('rectShapes',arrayShape.mk());
  let rect0 = Rectangle.mk(Point.mk(-2,-2),Point.mk(4,4));
  //let rs0 = this.displayRectangle(rect0);
  let params = {stripeWidth:1,stripeInterval:2,numStripes:15,stripePos:20,vertical:1};
 // let rects = [];
  let rects = this.genStripesRects(params);
 // this.addStripeRects(rects,params);
  this.displayRectangles(rects);
}

export {rs}
  

  