import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs';
let rs = generatorP.instantiate();

rs.setName('bounce_2');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:0.1,stopTime:100,
                 collideWithParticle:1,numParticles:80,saveAnimation:1}

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
  let {radius,mass,speed,position} = params;
  let ra = Math.random()*2*Math.PI;
  let v = Point.mk(Math.cos(ra),Math.sin(ra)).times(speed);
  let p = position?position:this.genRandomPoint(ibox);
  if (this.collides(p,radius,circleDs)) {
    return undefined;
  }
  let circleD = {point:p,collideRadius:radius}
  circleDs.push(circleD);
  let ray = {initialPosition:p,velocity:v};
  let prt = {ray,startTime:0,mass,radius};
  return prt;
}
  

rs.initialize = function () {
  debugger;
  let {timePerStep,stopTime,collideWithParticle:cwp,numParticles} = this;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  this.genBox(21);
  let radius = 1;
  this.boxToRect(1.2*radius);
  let pparams = {radius,mass:1,speed:2};
  let cparams = {radius:5,mass:25,speed:0,position:Point.mk(0,0)};
  let prts  = this.particles = [];
  rs.circleDs = [];
  let prt  = this.randomParticle(cparams);
  prts.push(prt);
  let nump = 0;
  while (nump<numParticles) {
    let prt = this.randomParticle(pparams);
    if (prt) {
      prts.push(prt);
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



