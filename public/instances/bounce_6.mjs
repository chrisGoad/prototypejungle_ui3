import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs';
let rs = generatorP.instantiate();

rs.setName('bounce_6');
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:0.15,stopTime:300,
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.9*ht,speedup:1,swp:1}

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

    
/*  
rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250}];
rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250},{r:0,g:0,b:250}];
rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250},{r:0,g:0,b:250},{r:0,g:150,b:0},{r:150,g:0,b:0}];
*/
rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD} = this;
  let hht = 0.5*ht;
  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.initProtos();
  this.addFrame();
  this.genBox();
 
 debugger;
 let irad = 3;
 let radinc = 2;
 let prt0 = {mass:2,radius:irad,startTime:0,ray:{initialPosition:Point.mk(0,0),velocity:Point.mk(0,0),velocityy:Point.mk(5,1)}}
 let prt1 = {mass:2,radius:irad,startTime:0,ray:{initialPosition:Point.mk(0,0),velocity:Point.mk(3,-2)}}
 const nextPart = (prt) => {
   let rd = prt.radius;
   let ray = {initialPosition:Point.mk(0,0),velocity:Point.mk(0,0)};
   let np = {mass:1,radius:rd+radinc,startTime:0,ray,contents:[prt]};
   prt.inside = np;
   return np;
  }
  let cprt0 = prt0;
  for (let i=0;i<3;i++) {
    let nprt = nextPart(cprt0);
    cprt0 = nprt;
  }
  cprt0.mass = 1;
  cprt0.ray.velocity = Point.mk(1,1);
   let cprt1 = prt1;
  for (let i=0;i<3;i++) {
    let nprt = nextPart(cprt1);
    cprt1 = nprt;
  }
  this.moveEnclosureBy(cprt0,Point.mk(-0.22*ht,0));
  this.moveEnclosureBy(cprt1,Point.mk(0.22*ht,0));
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



