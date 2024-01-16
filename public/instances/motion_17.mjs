import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as generatorP} from '/generators/motion_3.mjs'

let rs = generatorP.instantiate();
addDistanceMethods(rs);

rs.setName('motion_17');
let ht=50;


let topParams = {width:ht,height:ht,framePadding:-0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/(8*32),stopTime:1,recordingMotion:1,saveAnimation:1,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:20,speed:1,segsPerCircle:10,radius:.4*ht,
    bumpyParams:{innerRadius:.4*ht,outerRadius:.4*ht,numBumps:2}};

Object.assign(rs,topParams);
let subParams ={speed:10,shapesPerRing:2};



  
rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .05; 
}



rs.buildParameterArrays  = function () {
  let {nearestCount:nc,ipaths,speed,shapesPerPath:spp} = this;
  let np = ipaths.length;
  this.shapesPerPath = this.uniformArray(spp,np);
  let divisors = [2,3];
  let divln = divisors.length;
  let mdivs = this.repeatArray(divisors,spp/divln +1);
  let speedsEachPath = mdivs.map((v) => speed/v);
  //let speedsEachPath = this.uniformArray(speed,spp);
  this.speedsPerPath = rs.uniformArray(speedsEachPath,np);
  let soffEachPath =  this.steppedArray(0,1,spp+1,1);//start offset each path
  this.soffsPerPath = this.uniformArray(soffEachPath,np);
}

rs.buildIpaths = function () {
  let {radius,segsPerCircle} = this;
  let circle = Circle.mk(Point.mk(0,0),radius);
  let ipath = this.circleToPath(circle,segsPerCircle);
  this.ipaths = [ipath];
}


rs.buildIpaths = function () {
  let {bumpyParams,segsPerCircle} = this;
  bumpyParams.numSegs = segsPerCircle;
  let ipath = this.bumpyCircleToPath(bumpyParams);
  this.ipaths = [ipath];
}

rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP,circleP} = this;
  this.addFrame();
  this.numSteps =stp/tps;
 this.numSteps =19*8;
 // this.stepArrayy = [0].concat(this.sequentialArray(102,120));
  this.set('shapes',arrayShape.mk());
  let lines = this.set('lines',arrayShape.mk());
  let segs = this.segs = [];
  let ints = this.set('ints',arrayShape.mk());
  this.buildIpaths(3,3);
  this.buildParameterArrays();
  this.setPathParams();
  let av = this.allValues();
  this.addLinesBetweenPositions(av,lineP);
  //return;
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
  let {currentTime:ct,activePaths,circ,lineP,segs,ints,stepsSoFar:ssf} = this;
  //let ap = this.activePaths[0]
  console.log('ssf',ssf,'ct',ct);
 // debugger;
  this.runActivePaths();
  //return;
   let av = this.allValues();
  this.updateLines(av);
 //return;
  let intps = allSegmentIntersections(segs);
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
}



    
 
export {rs};



