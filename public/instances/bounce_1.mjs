import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs';
let rs = generatorP.instantiate();

rs.setName('bounce_1');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:0.1,stopTime:100,
   saveAnimation:1,collideWithParticle:1,numParticles:100,swp:1,boxD:0.95*ht,speedup:1.00}

Object.assign(rs,topParams);




rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
}

rs.randomParticle = function (params) {
  let {ibox,circleDs} = this;
  debugger;
  //let {radius,mass,speed} = params;
  let {minRadius:minR,maxRadius:maxR,massPerArea:mpa,speed} = params;
  let radius = minR + Math.random()*(maxR - minR);
  let mass = mpa*radius*radius;
  let ra = Math.random()*2*Math.PI;
  let v = Point.mk(Math.cos(ra),Math.sin(ra)).times(speed);
  let p = this.genRandomPoint(ibox);
  if (this.collides(p,radius,circleDs)) {
    return undefined;
  }
  let circleD = {point:p,collideRadius:radius}
  circleDs.push(circleD);
  let ray = {initialPosition:p,velocity:v};
  let prt = {ray,startTime:0,mass,radius};
  return prt;
}


rs.randomizeColors = function (prt1,prt2) {
  let minv = 100;
  let maxv = 255;
  const ranval =  () => {
    let r = minv + Math.floor(Math.random()*(maxv-minv));
    return r;
  }
  let r = ranval();
  let g = r;
  let b = r;
  prt1.fillStructure={r,g,b};
  this.updateFill(prt1);
  if (prt2) {
    r = ranval();
    g = r;
    b = r;
    prt2.fillStructure={r,g,b};
   this.updateFill(prt2);  
  }
}
rs.averageColors = function (prt1,prt2) {
  let FS1 = prt1.fillStructure;
  let FS2 = prt2.fillStructure;
  let {r:r1,g:g1,b:b1} = FS1;
  let {r:r2,g:g2,b:b2} = FS2;
  let r = (r1+r2)/2;
  let g = (g1+g2)/2;
  let b = (b1+b2)/2;
   prt1.fillStructure={r,g,b};
   prt2.fillStructure={r,g,b};
   this.updateFill(prt1);  
   this.updateFill(prt2);  
}
rs.fills = [{r:0,g:150,b:0},{r:100,g:100,b:250}];

rs.updateColorsOnCollideP = function (prt1,prt2) {
  //this.exchangeColors(prt1,prt2);
  //this.randomizeColors(prt1,prt2);
  this.averageColors(prt1,prt2);
}


rs.updateColorsOnCollideLS0 = function (prt) {
  debugger;
  this.randomizeColors(prt);

 // this.flipColor(prt);
}
 

rs.initialize = function () {
  debugger;
  let {timePerStep,stopTime,collideWithParticle:cwp,numParticles,fills} = this;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  this.genBox();
  let radius = 4;
  this.boxToRect(2*radius);
  let pparams = {minRadius:.5,maxRadius:4,massPerArea:1,speed:1}
  let prts  = this.particles = [];
  rs.circleDs = [];
  let nump = 0;
  while (nump<numParticles) {
    let prt = this.randomParticle(pparams);
    if (prt) {
      prts.push(prt);
      prt.fillStructure = (nump%2)?fills[0]:fills[1];
      nump++
    }
  }
  this.displaySegments();
  this.mkCirclesForParticles(prts);
  debugger;
  this.currentTime = 0;
  this.updatePositions(0);
  //this.updateCollisions(1);
  this.nextC = this.particleCollisions();

    
}

export {rs};



