import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs';
let rs = generatorP.instantiate();

rs.setName('bounce_3');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:0.1,stopTime:100,
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.8*ht,speedup:1}

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
  
rs.xParticle = function (params) {
  debugger;
  let {circleDs} = this;
  let {radius,mass,velocity:v,pos} = params;
 // let v = Point.mk(1,.01).times(speed);
  //let v = Point.mk(1,.338).times(speed);
  if (0&&this.collides(pos,radius,circleDs)) {
    return undefined;
  }
  let circleD = {point:pos,collideRadius:radius}
  circleDs.push(circleD);
  let ray = {initialPosition:pos,velocity:v};
  let prt = {ray,startTime:0,mass,radius};
  return prt;
}

rs.particleColumn = function (params) {
  debugger;
  let {boxD,particles:prts,fills} = this;
  let {numParticles,x} = params;
  let nump=0;
  while (nump<numParticles) {
  let delta = boxD/numParticles;
    let hbd = 0.5*boxD;
    let y =  delta*(nump+.5)-hbd;
    let pos = Point.mk(x,y);
    params.pos = pos;
    let prt = this.xParticle(params);
    if (prt) {
      prts.push(prt);
      prt.fill = (nump%2)?fills[0]:fills[1];
      nump++
    }
  }
}

rs.particleColumns = function (params) {
  let {boxD} = this;
  let {particlesByColumn:pbc,velocitiesByColumn:vbc} = params;
  let nc = pbc.length;
  let delta = boxD/nc;
  let hbd = 0.5*boxD;
  for (let i = 0; i < nc;i++) {
    params.numParticles = pbc[i];
    params.velocity = vbc[i]
    let x =  delta*(i+.5)-hbd;
    params.x = x;
    this.particleColumn(params);
  }
}

    



rs.fills = ['black','white'];

rs.initialize = function () {
  debugger;
  let {timePerStep,stopTime,collideWithParticle:cwp,numParticles,fills,height:ht,boxD} = this;
  let hht = 0.5*ht;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  this.genBox(21);
  let radius = 2;
  //this.boxToRect(1.2*radius);
  let pparams = {radius,mass:1,speed:4};
 // let cparams = {radius:5,mass:25,speed:0,position:Point.mk(0,0)};
  let prts  = this.particles = [];
  this.circleDs = [];
  let nump = 0;
  pparams.numParticles = 5;
  pparams.particlesByColumn = [9,9,9,9,9,9];
 // pparams.particlesByColumn = [9,9,9];
 // pparams.particlesByColumn = [5,5];
  pparams.velocitiesByColumn = [Point.mk(1,.338).times(1),Point.mk(0,.338).times(1),Point.mk(0,.338).times(1),Point.mk(0,.338).times(1),Point.mk(0,.338).times(1),Point.mk(0,.338).times(1)]
  let hbd = 0.5*boxD;

  pparams.x = -.5*hbd;
  this.particleColumns(pparams);
  /*
  while (nump<numParticles) {
    let delta = boxD/numParticles;
    let y =  delta*(nump+.5)-hbd;
    let x = 0;
    let pos = Point.mk(x,y);
    pparams.pos = pos;
    let prt = this.xParticle(pparams);
    if (prt) {
      prts.push(prt);
      prt.fill = (nump%2)?fills[0]:fills[1];
      nump++
    }
  }*/
  this.displaySegments();
  this.mkCirclesForParticles(prts);
  debugger;
  this.currentTime = 0;
  this.updatePositions(0);
  //this.updateCollisions(1);
  this.nextC = this.particleCollisions();

    
}

export {rs};



