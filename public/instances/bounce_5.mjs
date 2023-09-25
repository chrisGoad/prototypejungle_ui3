import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs';
let rs = generatorP.instantiate();

rs.setName('bounce_5');
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
rs.mkEnclosure = function (params) {
  let {emass,eradius,evelocityI,eInitialPositionI:eipi,cmass,cradius,initialPositions,velocities} = params;
  let contents = [];
  let evelocity = evelocityI?evelocityI:Point.mk(0,0);
  let eip = eipi?eipi:Point.mk(0,0);
  let ips = initialPositions;
  let vs = velocities;
  let nc = initialPositions.length;
  let eray = {initialPosition:Point.mk(0,0),velocity:evelocity};
  let enc = {ray:eray,mass:emass,radius:eradius,startTime:0};
  for (let i=0;i<nc;i++) {
    let ray = {initialPosition:ips[i],velocity:vs[i]}
    let prt = {mass:cmass,radius:cradius,startTime:0,ray,inside:enc};
    contents.push(prt);
  }
  enc.contents = contents;
  return enc;
}
  

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

rs.particleArray =function (enclosure) {
  let {contents}=enclosure;
  if (!contents) {
    return [enclosure];
  }
  let pa = [];
  contents.forEach((prt) => {
    let prtpa = this.particleArray(prt);
    prtpa.forEach( (sprt) => {
      pa.push(sprt);
    });
  });
  pa.push(enclosure);
  return pa;
}
    
    
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
 /* let radius1 = .5;
  let radius2 = 5;
  let mass1 = 1;
  let mass2 = 10;
  let ip1 = Point.mk(2,0);
  let ip2 = Point.mk(0,0);
  let v1 = Point.mk(2,1);
  let v2 = Point.mk(0,0);
  let ray1 = {initialPosition:ip1,velocity:v1};
  let ray2 = {initialPosition:ip2,velocity:v2};
  let prt2 = {ray:ray2,startTime:0,mass:mass2,radius:radius2};
  let prt1 = {ray:ray1,startTime:0,mass:mass1,radius:radius1,inside:prt2};

  //this.boxToRect(1.2*radius);
  let params1 = {radius:radius1,mass:5,speed:0,position:Point.mk(0,0)};
  let prts  = this.particles = [prt1,prt2];
 */
 debugger;
 let enc = this.mkEnclosure0({emass:.20,eradius:5,cmass:1,cradius:1,speed:1,distanceFromEnclosure:1.5});
 let prts = this.particles = this.particleArray(enc);
  let hbd = 0.5*boxD;
  this.displaySegments();
  this.mkCirclesForParticles(prts);
  //debugger;
  this.currentTime = 0;
  this.updatePositions(0);
  //this.updateCollisions(1);
  debugger;
  this.nextC = this.particleCollisions();

    
}

export {rs};



