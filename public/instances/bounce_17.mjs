import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs'
let rs = generatorP.instantiate();

rs.setName('bounce_17')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:0.15,stopTime:200,stopStep:1000	,		
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.9*ht,speedup:1,swp:1,numParticles:4,chopOffBeginning:40,numLines:200} //420 790
	
Object.assign(rs,topParams);


rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250},{r:0,g:0,b:250},{r:0,g:150,b:0},{r:150,g:0,b:0}];
rs.fills = [{r:0,g:0,b:0},{r:0,g:0,b:250},{r:0,g:150,b:0},{r:150,g:0,b:0}];

  
rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .1;
}


rs.particleRow = function (params) {
  debugger;
  let {boxD,particles:prts,particlePairs:pp,fills} = this;
  let {numParticles:numP,y,xVals,speed,mass,radius,particles} = params;
  let delta = boxD/numP;
  let hbd = 0.5*boxD;
  for (let i=0;i<numP;i++) {
    let x =  delta*(i+.5)-hbd;
    let v = Point.mk(speed,0.0*(1 + 0.00*Math.random()) *speed);
    let pos = Point.mk(x,y);
    params.pos = pos;
    let ray = {initialPosition:pos,velocity:v};
    let prt = {ray,startTime:0,mass,radius};
    particles.push(prt);
    
  }
}


rs.particlePairs = [];

rs.mkParticles = function (params) {
  let {mass,radius,speedd,numParticles:np}= params;
  let {fills,particlePairs} = this;
  params.y = 0;
  params.speed = 3;
  let prts =  [];
  params.particles = prts;
  this.particleRow(params);
  params.y = 20;
  params.speed = 1.5;
  this.particleRow(params);
  params.y = -20;
  this.particleRow(params);
  let reflect = 1;
  debugger;
  return prts;
  let ln = prts.length;
  for (let i=0;i<ln;i++) {
    particlePairs.push([prts[i],prts[(i+3)%ln]]);
  }
  return prts;
}

rs.drawLines = function () {
  let {particlePairs,numLines:nl} = this;
  particlePairs.forEach((pp) =>{
    let [prt1,prt2] = pp;
    let line = prt1.line;
    if (!line) {
       debugger;
      let line = this.displayLine(prt1.position,prt2.position,'white');
    //  prt1.line = line;
      let nm = line.__name;
      let sp = nm.split('_');
      let n =  parseInt(sp[1]);
      let pn= n-nl;//404;
      if (1 && (pn>=0)) {
        let sh = this['line_'+pn];
        sh.hide();
        
      }
    } else {
      if (!line.hidden()) {
        line.setEnds(prt1.position,prt2.position);
        line.update();
      }  
    }
  });
}

rs.onUpdate = function () {
  let {stepsSoFar:ssf,currentTime:t} = this;
  console.log('steps',ssf,'time',t);
  if (!(ssf%1)){
  this.drawLines();
  }
}
   
rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP} = this;
  let hht = 0.5*ht;
  let pp = this.particlePairs = [];
  this.setNumSteps();
  this.initProtos();
  this.addFrame();
  this.genBox();
  let cparams = {mass:1,radius:2,speed:3,numParticles:2};
  let prts = this.particles =this.mkParticles(cparams);
  let np = prts.length;
  for (let i=0;i<np;i++) {
    if (i%2) {
      let prt1 = prts[i-1]
      let prt2 = prts[i];
      pp.push([prt1,prt2]);
    }
    let ip = (i+3)%np;
    let ip2 = (i+5)%np;
    pp.push([prts[i],prts[ip]]);
    pp.push([prts[i],prts[ip2]]);
  }
  this.displaySegments();
  this.mkCirclesForParticles(prts,.01);
  this.currentTime = 0;
  this.updatePositions(0);
  this.nextC = this.particleCollisions();  
}

export {rs};



