import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs';
let rs = generatorP.instantiate();

rs.setName('bounce_4');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:0.15,stopTime:200,
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.8*ht,speedup:1,swp:1}

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
  
rs.aParticle = function (params) {
  let {circleDs} = this;
  let {radius,mass,velocity:v,pos} = params;
   if (this.collides(pos,radius,circleDs)) {
    return undefined;
  }
  let circleD = {point:pos,collideRadius:radius}
  circleDs.push(circleD);
  let ray = {initialPosition:pos,velocity:v};
  let prt = {ray,startTime:0,mass,radius};
  return prt;
}

rs.particleColumnOrRow = function (params) {
  let {boxD,particles:prts,fills} = this;
  let {numParticles,x,y,velocity:v} = params;
  let nump=0;
  let numtries = 0;
  while (nump<numParticles) {
    let numtries = 0;
    let found = 0;
 
    let delta = boxD/numParticles;
    let hbd = 0.5*boxD;
    let pos;
    if (x===undefined) {
      let x =  delta*(nump+.5)-hbd;
      pos = Point.mk(x,y);
    } else {
      let y =  delta*(nump+.5)-hbd;
      pos = Point.mk(x,y);
    }
    params.pos = pos;
    let prt = this.aParticle(params);
    if (prt) {
      prts.push(prt);
      found = 1;
      prt.fillStructure = (x<0)||(y>0)?fills[0]:fills[1];
     // prt.fillStructure = (nump%2)?fills[0]:fills[1];
    }
    nump++;
  }
}

rs.particleColumnsOrRows = function (params) {
  let {boxD} = this;
  let {particlesBy:pbc,velocitiesBy:vbc,isRow} = params;
  let nc = pbc.length;
  let delta = boxD/nc;
  let hbd = 0.5*boxD;
  for (let i = 0; i < nc;i++) {
    params.numParticles = pbc[i];
    params.velocity = vbc[i]
    let vl =  delta*(i+.5)-hbd;
    if (isRow) {
      params.y = vl;
      params.x = undefined;
    } else {
      params.x = vl;
      params.y = undefined;
    }
    this.particleColumnOrRow(params);
  }
}

    


rs.updateColorsOnCollideP = function (prt1,prt2) {
  this.exchangeColors(prt1,prt2);
}


rs.updateColorsOnCollideLS = function (prt) {
  debugger;
  this.flipColor(prt);
}

rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250}];

rs.initialize = function () {
  debugger;
  let {timePerStep,stopTime,collideWithParticle:cwp,numParticles,fills,height:ht,boxD} = this;
  let hht = 0.5*ht;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  this.genBox(21);
  let radius = .5;
  //this.boxToRect(1.2*radius);
  let pparams = {radius,mass:1,speed:4,};
 // let cparams = {radius:5,mass:25,speed:0,position:Point.mk(0,0)};
  let prts  = this.particles = [];
  this.circleDs = [];
  let nump = 0;
  pparams.numParticles = 5;
  //pparams.particlesByColumn = [9,9,9,9,9,9];
  pparams.particlesBy = [13,13];
  pparams.particlesBy = [11,11];
  pparams.isRow = 0;
 // pparams.particlesByColumn = [9,9,9];
 // pparams.particlesByColumn = [5,5];
  pparams.velocitiesBy = [Point.mk(1,0).times(1),Point.mk(1,0).times(-1)];
  let hbd = 0.5*boxD;

 // pparams.val = -.5*hbd;
  debugger;
  this.particleColumnsOrRows(pparams);
  pparams.isRow = 1;
  pparams.velocitiesBy = [Point.mk(0,1).times(1),Point.mk(0,1).times(-1)];

  this.particleColumnsOrRows(pparams);
  this.displaySegments();
  this.mkCirclesForParticles(prts);
  debugger;
  this.currentTime = 0;
  this.updatePositions(0);
  //this.updateCollisions(1);
  this.nextC = this.particleCollisions();

    
}

export {rs};



