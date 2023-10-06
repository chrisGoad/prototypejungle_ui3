import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs'
let rs = generatorP.instantiate();

rs.setName('bounce_14');
let ht=43;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:0.15,stopTimee:18,stopTime:25.6,
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.9*ht,speedup:1,swp:1,numParticles:4}

Object.assign(rs,topParams);


rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250},{r:0,g:0,b:250},{r:0,g:150,b:0},{r:150,g:0,b:0}];
rs.fills = [{r:0,g:0,b:0},{r:0,g:0,b:250},{r:0,g:150,b:0},{r:150,g:0,b:0}];
rs.fills = [{r:0,g:0,b:250},{r:0,g:150,b:0},{r:150,g:0,b:0}];
rs.fills = [{r:250,g:0,b:0},{r:0,g:250,b:0},{r:0,g:0,b:250}];
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
    //  this.nextBackgroundColor();

  //}
}


rs.updateColorsOnCollideLS = function () {
  console.log('ZZZZZ');
  //this.nextBackgroundColor();
}
rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
}
/*
rs.closestParticle = function (prt,excluded) {
  let {particles} = this;
 */ 
  
rs.a2r = (Math.PI)/180;
rs.mkParticles = function (params) {
  let {eradius,mass,radius,speed,distanceFromEnclosure:dfee,numParticles:np,inside}= params;
  let {fills,a2r,boxD} = this;
  debugger;
  let dfe = 0;
  //let dfc = eradius - radius - dfe;
  let dfc = (boxD/2) - radius - dfe;
  let ai = (Math.PI*2)/np;
  let prts= [];
  for (let i = 0;i<np;i++) {
    let ca = i*ai-0*a2r;
    let ip = Point.mk(Math.cos(ca),Math.sin(ca)).times(dfc);
    let np= Point.mk(Math.cos(ca+ai),Math.sin(ca+ai)).times(dfc);
    let vec = np.difference(ip);
    let vln = vec.length();
    let hwp = ip.plus(vec.times(1/2));
   //let hwp = ip.plus(np).times(.5);
     let twp = ip.plus(vec.times(1/3));
    let ttwp = ip.plus(vec.times(2/3));

    //let twp = ip.plus(np).times(1/3);
    //let ttwp = ip.plus(np).times(2/3);
    let lnip = ip.length();
    let lnnp = np.length();
    let lnhwp = hwp.length();
    let lntwp = twp.length();
    let lnttwp = ttwp.length();
    console.log('i',i,'lengths',lnip,lnnp,lnhwp);
    let na = ca + Math.PI/2;
    let vs = vec.times(speed/vln);
    let ray = {initialPosition:ip,velocity:vs};
    let rayhw  = {initialPosition:hwp,velocity:Point.mk(0,0)};
    let raytw  = {initialPosition:twp,velocity:Point.mk(0,0)};
    let rayttw  = {initialPosition:ttwp,velocity:Point.mk(0,0)};
    let prt = {mass,radius,ray,startTime:0,inside,fillNumber:0,fillStructure:fills[0]};
    prts.push(prt);
    //let prthw = {mass,radius,ray:rayhw,startTime:0,inside,fillNumber:1,fillStructure:fills[0]};
    let prttw = {mass,radius,ray:raytw,startTime:0,inside,fillNumber:1,fillStructure:fills[1]};
    let prtttw = {mass,radius,ray:rayttw,startTime:0,inside,fillNumber:1,fillStructure:fills[2]};
    if (1||(np>1)) {
      prts.push(prttw);
      //prts.push(prthw);

      prts.push(prtttw);
    }
   
  }
  return prts;
}

rs.onUpdate = function () {
  let {stepsSoFar:ssf,currentTime:t} = this;
  console.log('steps',ssf,'time',t);
  if (ssf >= 680) {
    this.paused = 1;
  }
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
  let dradius = .8;
  let cparams = {eradius,mass:1,radius:.2,speed:3,distanceFromEnclosure:0.0,numParticles:4};
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
  this.mkCirclesForParticles(prts,dradius);
  this.currentTime = 0;
  this.updatePositions(0);
  this.nextC = this.particleCollisions(); 
  let hb = 0.5*boxD;
  //this.displayLine(Point.mk(0,-hb),Point.mk(0,hb));
  //this.displayLine(Point.mk(-hb,0),Point.mk(hb,0));
}

export {rs};



