import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/bounce_0.mjs'
let rs = generatorP.instantiate();

rs.setName('bounce_12');
let ht=50;


let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:0.15,stopTime:260,stopStep:258,
                 saveAnimation:1,boxD:0.9*ht,speedup:1,particlesPerRow:3,swp:1,columnPositions:[-18,-6,6],rowPositions:[-12,0,12],
      //           saveAnimation:1,boxD:0.9*ht,speedup:1,particlesPerRow:3,swp:1,columnPositions:[-18,-12,-6,0,6],rowPositions:[-12,-6,0,6,12],
                 positionsOnRow:[-12,0,12],positionsOnColumn:[-12,-6,6],chopOffBeginning:72}

Object.assign(rs,topParams);


rs.fills = [{r:0,g:0,b:0},{r:250,g:250,b:250},{r:0,g:0,b:250},{r:0,g:250,b:0},{r:150,g:0,b:0}];


// this is called whenever there is a collision
rs.updateColorsOnCollidePP = function (prt1,prt2) {
  let {particles} = this;
  let pln = particles.length
  //this.exchangeColors(prt1,prt2);
  let maxIndex = Math.max(prt1.index,prt2.index);
  //if (maxIndex < (pln-1)) {
    this.nextColors(prt1,prt2);
  //}
}



rs.updateColorsOnCollideLS = function () {
   let {stepsSoFar:ssf,currentTime:t} = this;
  //console.log('sideCollision ssf',ssf,'time',t);
}
   
rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
}

rs.addParticleRow = function (parts,params){ // or column
  let {boxD,fills,positionsOnRow:por,positionsOnColumn:poc} = this;
  let {mass,radius,speed,particlesPerRoww:npp,y,goingRight:GR,row,vertical:v}= params;
  let po = v?poc:por;
  let np = po.length;
  // let inc = boxD/(np+1);
  //let hb = 0.5*boxD;
  //let cp = inc-hb;
 // console.log('row',row,'po',po,'vertical',v);
 // console.log('row',row,'y',y,'vertical',v);
  if ((row === 2) && v) {
    debugger;
  }
  for (let i=0;i<np;i++) {
    let cp = po[i];
  //  console.log('cp',cp);
    //let yv = (GR?i===(np-1):i===0)?Math.sqrt(2)*radius+y:y;
    //let yv = (GR?i===(np-1):i===0)?1.99*radius+y:y;
    let vx = (!i)?(v?Point.mk(0,speed):Point.mk(speed,0)):Point.mk(0,0);
    let ip = v?Point.mk(y,cp):Point.mk(cp,y);
   // console.log('ip[',ip.x,ip.y,'] vx',vx.x,vx.y,']');
    let ray = {initialPosition:ip,velocity:vx};
    let prt = {mass,radius,ray,startTime:0,fillNumber:v?1:2,fillStructure:fills[v?2:3]};
    parts.push(prt);
  }
}

rs.mkParticles = function (params) {
  let {mass,radius,speed,numRows:nr,columnPositions,rowPositions}= params;
  let {boxD,columnPositions:colps,rowPositions:rowps,positionsOnRow:por,positionsOnCol:poc} = this;
  let inc = boxD/(nr+1);
  let hb = 0.5*boxD;
  let cp = inc-hb;
  let prts = [];
  let numr = rowps.length;
  let numc = colps.length;
  params.vertical = 0;
  for (let i=0;i<numr;i++) {
    params.goingRight = i%2===0;
    params.y = rowps[i];
    params.row = i;
    this.addParticleRow(prts,params);
  }
  params.vertical = 1;
  for (let i=0;i<numc;i++) {
    params.goingRight = i%2===0;
    params.y = colps[i];
    params.row = i;
    this.addParticleRow(prts,params);
  }
  return prts;
}

rs.onUpdate = function () {
  let {stepsSoFar:ssf,currentTime:t} = this;
 // console.log('steps',ssf,'time',t);
}
rs.update = function () {
}

rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,stopStep,fills,height:ht,boxD,numParticles:numP} = this;
  let hht = 0.5*ht;
//  this.numSteps = Math.ceil(stopTime/timePerStep);
  this.numSteps = stopStep?stopStep:Math.ceil(stopTime/timePerStep);

  this.initProtos();
  this.addFrame();
  this.genBox();
  let emass = 50000;
  let eradius = 18;
  let cparams = {mass:1,radius:.5,speed:3,particlesPerRow:4,numRows:3};
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
  this.displaySegments('white');
  this.mkCirclesForParticles(prts,1);
  this.currentTime = 0;
  this.updatePositions(0);
  this.nextC = this.particleCollisions();  
}

export {rs};



