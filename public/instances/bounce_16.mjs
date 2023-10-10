import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs'
let rs = generatorP.instantiate();

rs.setName('bounce_16');
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:0.15,stopTime:200,stopStep:1000,		
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.9*ht,speedup:1,swp:1,numParticles:4}
	
Object.assign(rs,topParams);


rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250},{r:0,g:0,b:250},{r:0,g:150,b:0},{r:150,g:0,b:0}];
rs.fills = [{r:0,g:0,b:0},{r:0,g:0,b:250},{r:0,g:150,b:0},{r:150,g:0,b:0}];
rs.mkBFillsI = function (params,) {
  let {r,g,b,min,max,n} = params;
  let bfs = [];
  let delta = max-min;
  let inc = delta/(n-1);
  
  for (let i=0;i<n;i++) {
    let grv = Math.floor(min+i*inc);
    let rv = (r===undefined)?grv:r;
    let gv = (g===undefined)?grv:g;
    let bv = (b===undefined)?grv:b;
    let fs ={r:rv,g:gv,b:bv};
    bfs.push(fs);
  }
  return bfs;
}

rs.mkBFills = function () {
  debugger;
  let params1 = {min:0,max:150,n:4};
  let bfs = this.mkBFillsI(params1);
  return bfs;
}
     
  debugger;
rs.backgroundFills = rs.fills;
//rs.backgroundFills = rs.mkBFills();
//rs.backgroundFills = [{r:0,g:0,b:0},{r:50,g:50,b:50},{r:100,g:100,b:100},{r:50,g:50,b:50}];


// this is called whenever there is a collision
rs.updateColorsOnCollidePP = function (prt1,prt2) {
  let {particles} = this;
  let pln = particles.length
  //this.exchangeColors(prt1,prt2);
  let maxIndex = Math.max(prt1.index,prt2.index);
  //if (maxIndex < (pln-1)) {
    this.nextColors(prt1,prt2);
      this.nextBackgroundColor();

  //}
}


rs.updateColorsOnCollideLSS = function () {
  console.log('ZZZZZ');
  debugger;
  this.nextBackgroundColor();
}
rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .1;
}

rs.particlePairs = [];

rs.mkParticles = function (params) {
  let {eradius,mass,radius,speed,distanceFromEnclosure:dfe,numParticles:np,inside}= params;
  let {fills,particlePairs} = this;
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
    particlePairs.push([prt,prthw]);
   
  }
  return prts;
  let ln = prts.length;
  for (let i=0;i<ln;i++) {
    particlePairs.push([prts[i],prts[(i+3)%ln]]);
  }
  return prts;
}

rs.drawLines = function () {
  let {particlePairs} = this;
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
      let pn= n-54;
      if (1 && (pn>=0)) {
        let sh = this['line_'+pn];
        sh.hide();
      }
    } else {
      line.setEnds(prt1.position,prt2.position);
      line.update();
     
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
  this.particlePairs = [];
  this.setNumSteps();
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
  this.mkCirclesForParticles(prts,.1);
  this.currentTime = 0;
  this.updatePositions(0);
  this.nextC = this.particleCollisions();  
}

export {rs};



