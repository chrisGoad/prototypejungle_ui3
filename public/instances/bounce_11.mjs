import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs'
let rs = generatorP.instantiate();

rs.setName('bounce_11');
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:0.15,stopTime:255,
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.9*ht,speedup:1,swp:1,numParticles:4,recordingMotion:1}

Object.assign(rs,topParams);


rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250},{r:0,g:0,b:250},{r:0,g:150,b:0},{r:150,g:0,b:0}];


// this is called whenever there is a collision
rs.updateColorsOnCollideP = function (prt1,prt2) {
  let {particles} = this;
  let pln = particles.length
  //this.exchangeColors(prt1,prt2);
  let maxIndex = Math.max(prt1.index,prt2.index);
  //if (maxIndex < (pln-1)) {
    this.nextColors(prt1,prt2);
  //}
}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
}

   
rs.mkParticles = function (params) {
  let {eradius,mass,radius,speed,distanceFromEnclosure:dfe,numParticles:np,inside}= params;
  let {fills} = this;
  debugger;
  let dfc = eradius - radius - dfe;
  let ai = (Math.PI*2)/np;
  let prts= [];
  for (let i = 0;i<np;i++) {
    let ca = i*ai;
    let ip = Point.mk(Math.cos(ca),Math.sin(ca)).times(dfc);
    let np= Point.mk(Math.cos(ca+ai),Math.sin(ca+ai)).times(dfc)
    let hwp = ip.plus(np).times(.5);
    let lnip = ip.length();
    let lnnp = np.length();
    let lnhwp = hwp.length();
    console.log('i',i,'lengths',lnip,lnnp,lnhwp);
    let na = ca + Math.PI/2;
    let vec = np.difference(ip);
    let vln = vec.length();
    let vs = vec.times(speed/vln);
    let ray = {initialPosition:ip,velocity:vs};
    let rayhw  = {initialPosition:hwp,velocity:Point.mk(0,0)};
    let prt = {mass,radius,ray,startTime:0,inside,fillNumber:0,fillStructure:fills[2]};
    prts.push(prt);
    let prthw = {mass,radius,ray:rayhw,startTime:0,inside,fillNumber:1,fillStructure:fills[3]};
    if (1||(np>1)) {
      prts.push(prthw);
    }
   
  }
  return prts;
}

rs.onUpdate = function () {
  let {stepsSoFar:ssf,currentTime:t} = this;
  console.log('steps',ssf,'time',t);
}
   
rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP} = this;
  let hht = 0.5*ht;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.numSteps = 100;
  this.initProtos();
  this.addFrame();
  this.genBox();
  let emass = 50000;
  let eradius = 18;
  let cparams = {eradius,mass:1,radius:2,speed:3,distanceFromEnclosure:0.0,numParticles:4};
  let encs = [];
  let grv = 100;
  let enc = {mass:emass,radius:eradius,startTime:0,ray:{initialPosition:Point.mk(0,0),velocity:Point.mk(0,0)},fillStructure:{r:grv,g:grv,b:grv}};
  //cparams.numParticles = i;
  cparams.inside = enc;
  let prts = this.particles =this.mkParticles(cparams);
  //enc.contents =prts;
  //encs.push(enc);
  //let prta= this.particles = this.particleArray(encs);
  let hbd = 0.5*boxD;
  this.displaySegments();
  this.mkCirclesForParticles(prts);
  this.currentTime = 0;
  this.updatePositions(0);
  this.nextC = this.particleCollisions();  
}

export {rs};



