import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs'
let rs = generatorP.instantiate();

rs.setName('bounce_18')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:0.15,stopTime:200,stopStep:534,// 2 particle164	,		
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.9*ht,speedup:1,swp:1,numParticles:3,chopOffBeginningg:16,numLines:160} //420 790
	
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
  let delta = boxD/(numP*2);
  let hbd = 0.25*boxD;
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
  let {mass,radius,speedd,numParticles:np,numRows:nr}= params;
  let {fills,particlePairs,boxD} = this;
  params.y = 0;
  params.speed = 3;
  let prts =  [];
  let ydelta = boxD/nr;
  let bh = boxD/2;
    params.particles = prts;

  for (let i = 1;i<nr;i++) {
    let y = i*ydelta - bh;
    params.numParticles = 5;
    params.y=y;
    params.speed = i%2?1:0.5;
    params.speed = (i<4)||(i>6)?2:1;
    this.particleRow(params);
  }
  return prts;

}

rs.drawLines = function () {
  let {particlePairs,numLines:nl,stepsSoFar:ssf} = this;
  if (ssf > 50) {
   // debugger;
  }
  particlePairs.forEach((pp) =>{
    let [prt1,prt2] = pp;
    let line = prt1.line;
    if (!line) {
    
      let line = this.displayLine(prt1.position,prt2.position,'white');
    //  prt1.line = line;
      let nm = line.__name;
      let sp = nm.split('_');
      let n =  parseInt(sp[1]);
      let pn= n-nl;//404;
      if (1 && (pn>=0)) {
        let sh = this['line_'+pn];
        sh.hide();
      } else {
 //       debugger;
      }
    } else {
      //if (!line.hidden()) {
        line.setEnds(prt1.position,prt2.position);
        line.update();
      //}  
    }
  });
}

rs.onUpdate = function () {
  let {stepsSoFar:ssf,currentTime:t,particles:prts,initialPositions:ips,chopOffBeginning:cob} = this;
    console.log('steps',ssf,'time',t);
  if (ssf === 144) {
    debugger;
  }
   if (ssf === cob) {
    debugger;
  }
  let maxd = 0;
  if (!ips) {
    let inps = [];
    let ln = prts.length;
    for (let i=0;i<ln;i++) {
      let p = prts[i].position;
      inps.push(p.copy());
    }
    this.initialPositions = inps;
  } else {
    let ln = prts.length;
    for (let i=0;i<ln;i++) {
      let ip = ips[i];
      let cp = prts[i].position;
      let d = cp.distance(ip);
      if (d > maxd) {
        maxd = d;
      }
    }
  }
  if (0&&(maxd<1)&&(ssf>20)) {
    console.log('steps',ssf,'time',t,'maxd',maxd);
    this.paused = 1;
  }
  if (!(ssf%1)){
  //  this.drawLines();
  }
  if (ssf===161) {
    //this.paused = 1;
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
  let cparams = {mass:1,radius:.5,speed:1,numParticles:numP,numRows :10};
  let prts = this.particles =this.mkParticles(cparams);
  let np = prts.length;
  for (let i=0;i<np;i++) {
    if (i%2) {
      let prt1 = prts[i-1]
      let prt2 = prts[i];
   //   pp.push([prt1,prt2]);
    }
    let ip = (i+3)%np;
    let ip2 = (i+5)%np;
    pp.push([prts[i],prts[ip]]);
    pp.push([prts[i],prts[ip2]]);
  }
  this.displaySegments();
  this.mkCirclesForParticles(prts);
  this.currentTime = 0;
  this.updatePositions(0);
  this.nextC = this.particleCollisions();  
}

export {rs};



