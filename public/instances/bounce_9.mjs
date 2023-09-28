import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs';
let rs = generatorP.instantiate();

rs.setName('bounce_9');
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:0.15,stopTime:300,
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.9*ht,speedup:1,swp:1,numParticles:4}

Object.assign(rs,topParams);




rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
}

    
/*

rs.updateColorsOnCollideP = function (prt1,prt2) {
  //this.exchangeColors(prt1,prt2);
  this.nextColors(prt1,prt2);
}


rs.updateColorsOnCollideLS = function (prt) {
  debugger;
  //this.flipColor(prt);
  this.nextColor(prt);
}
*/
rs.mkParticles = function (params) {
  let {eradius,mass,radius,speed,distanceFromEnclosure:dfe,numParticles:np,inside}= params;
  let dfc = eradius - radius - dfe;
  let ai = (Math.PI*2)/np;
  let prts= [];
  for (let i = 0;i<np;i++) {
    let ca = i*ai;
    let ip = Point.mk(Math.cos(ca),Math.sin(ca)).times(dfc);
    let na = ca + Math.PI/2;
    let vs = Point.mk(Math.cos(ca),Math.sin(ca)).times(speed);
    let ray = {initialPosition:ip,velocity:vs};
    let prt = {mass,radius,initialPositions:ip,velocities:vs,startTime:0,inside};
    prts.push(prt);
   
  }
  return prts;
}

rs.mkEnclosures= function (params) {
  let {emass,eradius,cmass,cradius,speed,distanceFromEnclosure:dfe,numParticles:np}= params;
  let dfc = eradius - cradius - dfe;
  let ai = (Math.PI*2)/np;
  let encs = [];
  for (let i = 0;i<np;i++) {
    let ca = i*ai;
    let ips = Point.mk(Math.cos(ca),Math.sin(ca)).times(dfc);
    let na = ca + Math.PI/2;
    let vs = Point.mk(Math.cos(ca),Math.sin(ca)).times(speed);
    let cparams = {emass,eradius,cmass,cradius,initialPositions:ips,velocities:vs};
    let enc = this.mkEnclosure(cparams);
    encs.push(enc);
  }
  return encs;
}
  

rs.particlesMaxLength = function () {
  let {numParticles:numP,particles} = this;
  let maxL = 0;
  for (let i = 0; i< numP; i++) {
    let prt = particles[i];
    let pos = prt.position;
    let pln = pos.length()
    if (pln > maxL) {
      maxL = pln;
    }
  }
  return maxL;   
}

rs.onUpdate = function () {
  let {stepsSoFar:ssf,particles,currentTime:t} = this;
  let eps = .5;
  let pln = this.particlesMaxLength();
  if (pln<eps) {
    let pos = particles[0].position;
    console.log('particles align length=',pln,'position x' , pos.x,'steps',ssf,'time',t);
    //debugger;
  }
}
    
/*  
rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250}];
rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250},{r:0,g:0,b:250}];
rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250},{r:0,g:0,b:250},{r:0,g:150,b:0},{r:150,g:0,b:0}];
*/
rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP} = this;
  let hht = 0.5*ht;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  this.genBox();
 
  let emass = 50;
  let eradius = 9;
  let cparams = {eradius,mass:1,cradius:1,speed:4,distanceFromEnclosure:6.3};
  //let eparams = {emass:50,eradius:9,cmass:1,cradius:1,speed:4,distanceFromEnclosure:6.3};
  let encs = [];
  for  (let i=1;i<=4;i++) {
    let enc = {mass:emass,radius:eradius,startTime:0,ray:{initialPosition:Point.mk(0,0),velocity:Point.mk(0,0)}};
    cparams.numParticles = i;
    cparams.inside = enc;
    let prts = this.mkParticles(cparams);
    encs.push(enc);
  }
 
  this.moveEnclosureBy(encs[0],Point.mk(-0.22*ht,-0.22*ht));
  this.moveEnclosureBy(encs[1],Point.mk(0.22*ht,-0.22*ht));
  this.moveEnclosureBy(encs[2],Point.mk(-0.22*ht,0.22*ht));
  this.moveEnclosureBy(encs[3],Point.mk(0.22*ht,0.22*ht));
  //this.moveEnclosureBy(cprt1,Point.mk(0.22*ht,-0.22*ht));
  let prts = this.particles = this.particleArray(encs[0]);
  //let prts = this.particles = this.particleArray(encs);
  let hbd = 0.5*boxD;
  this.displaySegments();
  this.mkCirclesForParticles(prts);
  this.currentTime = 0;
  this.updatePositions(0);
  debugger;
  this.nextC = this.particleCollisions();  
}

export {rs};



