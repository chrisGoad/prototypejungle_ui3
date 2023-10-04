import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs'
let rs = generatorP.instantiate();

rs.setName('bounce_12');
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:0.15,stopTime:260,
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.9*ht,speedup:1,swp:1,numParticles:4}

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

rs.addParticleRow = function (parts,params){ 
  let {boxD,fills} = this;
  let {mass,radius,speed,numParticles:np,y,goingRight:GR,row}= params;
  let inc = boxD/(np+1);
  let hb = 0.5*boxD;
  let cp = inc-hb;
  for (let i=0;i<np;i++) {
    //let yv = (GR?i===(np-1):i===0)?Math.sqrt(2)*radius+y:y;
    let yv = (GR?i===(np-1):i===0)?1.99*radius+y:y;
    let vx = (!i)?Point.mk(speed,0):Point.mk(0,0);
    let ip = Point.mk(cp,y);
    let ray = {initialPosition:ip,velocity:vx};
    let prt = {mass,radius,ray,startTime:0,fillNumber:0,fillStructure:fills[0]};
    parts.push(prt);
    cp = cp+inc;
  }
}
rs.mkParticles = function (params) {
  let {mass,radius,speed,numRows:nr}= params;
  let {boxD} = this;
  let inc = boxD/(nr+1);
  let hb = 0.5*boxD;
  let cp = inc-hb;
  let prts = [];
  for (let i=0;i<nr;i++) {
    params.goingRight = i%2===0;
    params.y = cp;
    params.row = i;
    this.addParticleRow(prts,params);
    cp = cp+inc;

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
  this.initProtos();
  this.addFrame();
  this.genBox();
  let emass = 50000;
  let eradius = 18;
  let cparams = {mass:1,radius:1,speed:3,numParticles:8,numRows:5};
  let encs = [];
  let grv = 100;
  //let enc = {mass:emass,radius:eradius,startTime:0,ray:{initialPosition:Point.mk(0,0),velocity:Point.mk(0,0)},fillStructure:{r:grv,g:grv,b:grv}};
  //cparams.numParticles = i;
 // cparams.inside = enc;
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



