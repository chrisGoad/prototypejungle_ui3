import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as generatorP} from '/generators/stripes_0.mjs'
let rs = generatorP.instantiate();

rs.setName('stripes_0')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,numSteps:3*4*32,version:0};
	
Object.assign(rs,topParams);

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
    let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'white';
  rectP.stroke = 'red';
  rectP['stroke-width'] = 0.0;
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
  this.set('rectShapes',arrayShape.mk());
  let rect0 = Rectangle.mk(Point.mk(-2,-2),Point.mk(4,4));
  //let rs0 = this.displayRectangle(rect0);
  let params = (version===0)?{stripeWidth:1,stripeInterval:1,numStripes:19,vertical:1}:
                             {initialStripeWidth:1,finalStripeWidth:4,initialStripeInterval:3,numStripes:13};
 // let rects = [];
  let stripes = (version===0)? this.genStripesRects(params):this.genStripesRectsV(params);
  let {vstripes:vs,hstripes:hs} = stripes;
  let vstripes = this.vstripes = [];
  let hstripes = this.hstripes = [];
  hs.forEach((s) => hstripes.push(this.displayRectangles(s)));
  vs.forEach((s) => vstripes.push(this.displayRectangles(s)));
  let hcolor = (version==0)?'rgb(10,10,10)':'red';
  let vcolor = (version==0)?'rgb(200,200,200)':'blue';
  this.paintStripes(hstripes,hcolor,vcolor,0);
  this.paintStripes(vstripes,hcolor,vcolor,1);

 // this.paintStripes(hstripes,'rgb(10,10,10)','rgb(200,200,200)');
 // this.paintStripes(vstripes,'rgb(100,100,100)','rgb(200,200,200)',1);
 // this.addStripeRects(rects,params);
 // this.displayRectangles(hstripes);
  //this.displayRectangles(vstripes);
}

export {rs}
  

  