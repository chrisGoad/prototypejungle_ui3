import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs';
let rs = generatorP.instantiate();

rs.setName('bounce_6');
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:0.15,stopTime:300,
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.9*ht,speedup:1,swp:1,numParticles:3}

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
/*

rs.mkEnclosure0= function (params) {
  let {emass,eradius,cmass,cradius,speed,distanceFromEnclosure:dfe}= params;
  let dfc = eradius - cradius - dfe;
  let ips = [Point.mk(-dfc,0),Point.mk(0,dfc),Point.mk(dfc,0),Point.mk(0,-dfc)];
  //let ips = [Point.mk(-dfc,0),Point.mk(dfc,0)];
  //let ips = [Point.mk(-dfc,0),Point.mk(0,dfc-1)];
  let vs = [Point.mk(0,speed),Point.mk(speed,0),Point.mk(0,-speed),Point.mk(-speed,0)];
  //let vs = [Point.mk(speed,0),Point.mk(-speed,0)];
  let cparams = {emass,eradius,cmass,cradius,initialPositions:ips,velocities:vs};
  let enc = this.mkEnclosure(cparams);
  return enc;
}
*/   

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


rs.onUpdate = function () {
  let {stepsSoFar:ssf,currentTime:t,particles:prts} = this;
  const vOf = (prt) =>  {
    let v = prt.ray.velocity;
    let vs = '('+v.x+','+v.y+')';
    return vs;
  }
  const vels = () => {
    let vs = vOf(prts[0])+vOf(prts[1])+vOf(prts[2])+vOf(prts[3])+vOf(prts[4]);
    return vs;
  }
  console.log( 'steps',ssf,'time',t,'vels',vels());
    //debugger;
  
}
rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP} = this;
  let hht = 0.5*ht;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  this.genBox();
 
 debugger;
 let irad = 1;
 let rad1 = 5;
 let radinc = 2;
 let prt0a = {mass:1,radius:irad,startTime:0,ray:{initialPosition:Point.mk(irad,0),velocity:Point.mk(0,0),velocity:Point.mk(0,0)}}
 let prt0b = {mass:1,radius:irad,startTime:0,ray:{initialPosition:Point.mk(-irad,0),velocity:Point.mk(0,0),velocity:Point.mk(5,0)}}
 let prt1 = {mass:2,radius:irad,startTime:0,ray:{initialPosition:Point.mk(irad+1,0),velocity:Point.mk(0,0)}}
 const nextPart = (prt1,prt2) => {
   let rd = prt1.radius;
   let ray = {initialPosition:Point.mk(0,0),velocity:Point.mk(0,0)};
   let np = {mass:1,radius:prt2?rad1:rd+radinc,startTime:0,ray,contents:prt2?[prt1,prt2]:[prt1]};
   prt1.inside = np;
   if (prt2) {
     prt2.inside = np;
  }
   return np;
  }
  let cprt0 = nextPart(prt0a,prt0b);
  
  for (let i=0;i<numP-1;i++) {
    let nprt = nextPart(cprt0);
    cprt0 = nprt;
  }
  cprt0.mass = 1;
  let speed = 0;//3.9999;
  cprt0.ray.velocity = Point.mk(speed,0);
  /* let cprt1 = prt1;
  for (let i=0;i<3;i++) {
    let nprt = nextPart(cprt1);
    cprt1 = nprt;
  }*/
 // this.moveEnclosureBy(cprt0,Point.mk(-0.22*ht,0));
  //this.moveEnclosureBy(cprt1,Point.mk(0.22*ht,-0.22*ht));
 let prts = this.particles = this.particleArray([cprt0]);
  let hbd = 0.5*boxD;
  this.displaySegments();
  this.mkCirclesForParticles(prts);
  this.currentTime = 0;
  this.updatePositions(0);
  debugger;
  this.nextC = this.particleCollisions();  
}

export {rs};



