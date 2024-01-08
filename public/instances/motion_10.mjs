import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as generatorP} from '/generators/motion_1.mjs'

let rs = generatorP.instantiate();
addDistanceMethods(rs);

rs.setName('motion_10');
let ht=50;
let stt=2;


let topParams = {width:ht,height:ht,framePadding:0.3*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/128,stopTime:12,recordingMotion:1,saveAnimation:1,
    circleRadius:.2,ringRadii:[],nearestCount:6,nearestFadeFactor:20,toAngle:2*Math.PI};

Object.assign(rs,topParams);
let subParams ={speed:10,shapesPerRing:2};

/* particle
{ring,radius,indexInRing,currentAngle,speed,index,initialAngle,initialTime}

// and maybe mass
*/
const generateGrid = function (nppr,wd) {
  let inc = wd/(nppr-1);
  let a = [];
  let lvl = -wd/2;
  for (let i = 0;i<nppr;i++) {
    let x = lvl+inc*i
    for (let j =0 ;j<nppr;j++) {
      let p = Point.mk(x,lvl+inc*j);
      a.push(p);
    }
  }
  return a;
}
let pointsPerRow = 5;
debugger;
rs.ringCenters = generateGrid(pointsPerRow,0.8*ht).concat([Point.mk(0,0)]);

let numPoints = pointsPerRow*pointsPerRow+1;

  
rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .15; 
}



rs.buildParameterArrays  = function () {
  let {nearestCount:nc} = this;
  this.ringRadii = [.4*ht];
  let nr = this.ringRadii.length;
  let spr = 12;// shapesPerRing
  let rspeed = 32;
  this.shapesPerRing = this.uniformArray(spr,nr);
  this.ringCenters = [Point.mk(0,0)];
  //let ringSpeeds = this.arrayFromFunction ((i)=>rspeed*Math.random(),spr);
 // let divisors = [2,3,4,5];
  let divisors = [2,3,4];
  let mdivs = divisors.concat(divisors).concat(divisors).concat(divisors);
  let fc = 1;
  //let ringSpeeds = mdivs.map((v) => (fc*60)/v)
  let ringSpeeds = mdivs.map((v) => (fc*12)/v)
 //let ringSpeeds = this.arrayFromFunction ((i)=>rspeed*Math.random(),spr);
  this.speeds = rs.uniformArray(ringSpeeds,nr);
  debugger;
  let iar =  this.steppedArray(0,2*Math.PI,spr+1,1);//initial angles per ring
  this.initialAngles = this.uniformArray(iar,nr);
  this.lineColors = this.cyclingArray([[255,95,0],[255,0,0]],nc);
}


rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP} = this;
  this.addFrame();
  this.numSteps =stp/tps;
 // this.numSteps = 1010;
  let cs=100;
  this.stepArrayy = [0].concat(this.sequentialArray(102,120));
  this.set('shapes',arrayShape.mk());
  this.set('lines',arrayShape.mk());
  let spr = 6;
  let speed =2;
  this.buildParameterArrays(subParams);
  this.particles = [];
  let positions = this.positions = [];
  this.particlesByRing = [];
  this.buildParticles();
  this.buildShapes();
  this.addLinesBetweenPositions(positions,lineP);
  this.mind = Infinity;
  this.maxd = -Infinity;
}



rs.updateState = function () {
  debugger;
  let {stepsSoFar:ssf,currentTime:t,linesAdded:la,positions,mind,maxd} = this;
  let color = [255,95,0];
  let black = [0,0,0];
  const fn = (line,dist) => {
    //console.log('DIST',dist);
    let fr = dist/77;
    let pow = 4;
    let pfr = Math.pow(1-fr,pow);
    //let pfrpow = Math.pow(pfr,1/pow);
   // console.log('fr',fr,'pfr',pfr,'pfrpow',pfrpow);
    console.log('fr',fr,'pfr',pfr);
    let icolor = this.interpolate(black,color,pfr);
    let sw = .8;
    let stroke = this.arrayToRGB(color);
    if (line) {
      line.stroke = stroke;
      line['stroke-width'] = sw*Math.pow(pfr,1);
      line.update();
    }
  }
  let ns = 20;
  for (let i=0;i<ns;i++) {
    let d = (i/ns)*77;
    fn(null,d);
  } 
  //return;
  console.log('steps',ssf,'time',t);
  this.updateAngles(t);
  this.displayPositions();
  let dists = this.updateLines(positions,fn);
  let {mind:tmin,maxd:tmax} = dists;
  if (tmin < mind) {
    this.mind = tmin;
  }
  if (tmax > maxd) {
    this.maxd = tmax;
  }
  
  console.log('cmin',this.mind,'cmax',this.maxd);
 // this.displayNearestPositions(positions,nearestCount,nff,{attackDuration:0.05}); 
}




    
 
export {rs};



