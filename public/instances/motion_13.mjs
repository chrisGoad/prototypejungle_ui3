import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as generatorP} from '/generators/motion_1.mjs'

let rs = generatorP.instantiate();
addDistanceMethods(rs);

rs.setName('motion_13');
let ht=50;
let stt=2;


let topParams = {width:ht,height:ht,framePadding:0.3*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/50,stopTime:12,recordingMotion:1,saveAnimation:1,
    circleRadius:.1,ringRadii:[],nearestCount:6,nearestFadeFactor:20,toAngle:2*Math.PI,particleColor:'blue'};

Object.assign(rs,topParams);
let subParams ={speed:10,shapesPerRing:2};

/* particle
{ring,radius,indexInRing,currentAngle,speed,index,initialAngle,initialTime}

// and maybe mass
*/


  
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
  this.ringRadii = [.6*ht,.6*ht];
  let nr = this.ringRadii.length;
  let spr = 12;// shapesPerRing
  let rspeed = 32;
  this.shapesPerRing = this.uniformArray(spr,nr);
  this.ringCenters = [Point.mk(-1,0),Point.mk(1,0)];
  //let ringSpeeds = this.arrayFromFunction ((i)=>rspeed*Math.random(),spr);
 // let divisors = [2,3,4,5];
  let divisors = [2,3,4];
  //let mdivs = divisors.concat(divisors).concat(divisors).concat(divisors);
  let mdivs = this.repeatArray(divisors,4);
  let fc = 2*Math.PI;
  //let ringSpeeds = mdivs.map((v) => (fc*60)/v)
  let ringSpeed0 = mdivs.map((v) => fc/v)
  let ringSpeed1 = mdivs.map((v) => -fc/v)
 //let ringSpeeds = this.arrayFromFunction ((i)=>rspeed*Math.random(),spr);
  this.speeds = [ringSpeed0,ringSpeed1];
  debugger;
  let iar =  this.steppedArray(0,2*Math.PI,spr+1,1);//initial angles per ring
  this.initialAngles = this.uniformArray(iar,nr);
  this.lineColors = this.cyclingArray([[255,95,0],[255,0,0]],nc);
  return;
  let colors = ['red','green','blue'];
  for (let i=0;i<9;i++) {
    colors.push('gray');
  }
  //this.particleColors = this.repeatArray(colors,4);
  this.particleColors = colors;
}


rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP,circleP} = this;
  this.addFrame();
  this.numSteps =stp/tps;
 // this.numSteps = 1010;
  let cs=100;
  this.stepArrayy = [0].concat(this.sequentialArray(102,120));
  this.set('shapes',arrayShape.mk());
  let lines = this.lines=[];
  let ints = this.set('ints',arrayShape.mk());

  let spr = 6;
  let speed =2;
  this.buildParameterArrays(subParams);
  this.particles = [];
  let positions = this.positions = [];
  this.particlesByRing = [];
  this.buildParticles();
  this.buildShapes();
  this.addLinesBetweenPositions(positions,lineP,1);//1 means add segments not lines
  let nln = lines.length;
  let nints = nln*nln;
  for (let i =0;i<nints;i++) {
    let crc = circleP.instantiate();
    crc.hide();
    ints.push(crc);
  }
  this.mind = Infinity;
  this.maxd = -Infinity;
}



rs.updateState = function () {
  debugger;
  let {stepsSoFar:ssf,currentTime:t,linesAdded:la,positions,mind,maxd,lines,ints} = this;
  let color = [255,95,0];
  let black = [0,0,0];
 
  //return;
  console.log('steps',ssf,'time',t);
  this.updateAngles(t);
  this.displayPositions();
  this.updateLines(positions,null,1);
  let intps = allSegmentIntersections(lines);
  let nints = ints.length;
  for (let i=0;i<nints;i++) {
    let crc = ints[i];
    crc.hide();
    crc.update();
  }
  let nintps = intps.length;
  for (let i=0;i<nintps;i++) {
    let crc = ints[i];
    let p = intps[i];
    crc.show();
    crc.moveto(p);
    //crc.update();
  }
 // this.displayNearestPositions(positions,nearestCount,nff,{attackDuration:0.05}); 
}




    
 
export {rs};



