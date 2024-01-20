import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as generatorP} from '/generators/motion_3.mjs'

let rs = generatorP.instantiate();
addDistanceMethods(rs);

rs.setName('motion_18');
let ht=50;


let topParams = {width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:-0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/(8*32),stopTime:1,recordingMotion:1,saveAnimation:1,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:2,speed:1,segsPerCircle:4,radius:.4*ht,numSlices:32};

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




rs.buildApaths = function () {
  let {radius,numSlices:ns,shapesPerPath:spp,speed,shapes,circleP,angleOffset:aoff} = this;
  let inc = (2*Math.PI)/ns;
  let apaths = [];
 let action =(ap) => {
    let {shape:sh,value:vl} = ap;
    sh.moveto(vl);
  }  
  for (let i = 0;i<ns;i++) {
    let p0 = Point.mk(0,0);
    let p1 = Point.mk(Math.cos(aoff+i*inc),Math.sin(aoff+i*inc)).times(radius);
    let p2 = Point.mk(Math.cos(aoff+(i+1)*inc),Math.sin(aoff+(i+1)*inc)).times(radius);
    let odd = i%2;
    let dp1 = odd?p1:p2;
    let dp2 = odd?p2:p1;
    let ipath = [{pathTime:0,value:p0},{pathTime:radius,value:dp1},{pathTime:radius*(1+inc),value:dp2},{pathTime:radius*(2+inc),value:p0}];
    let path = this.normalizePath(ipath);
   /// let speed = i%2?ispeed:-ispeed;
    for (let j=0;j<spp;j++) {
      let jodd = j%2;
      let soff = j/spp;
      let shape = circleP.instantiate();
      shapes.push(shape);
      let params = {speed:jodd?1*speed:1*speed,path,shape,action,startOffset:soff,value:Point.mk(0,0)};
      let ap = this.mkActivePath(params);
      apaths.push(ap);
    }
  }
  this.activePaths = apaths;
}

rs.addColorPath = function (speed,shapes) {
  //let colors = [[250,0,0],[250,250,0],[0,250,0],[0,250,250],[0,0,250],[100,100,250],[250,250,250],[250,100,100]];
  let colors = [[250,250,0],[0,250,0],[0,250,250],[100,250,250],[250,250,250],[250,250,100]];
  let apath = this.mkColorApath(colors,shapes,speed);
  this.activePaths.push(apath);
}

rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP,circleP} = this;
  this.addFrame();
  this.numSteps =stp/tps;
 //this.numSteps =19*8;
 // this.stepArrayy = [0].concat(this.sequentialArray(102,120));
  this.set('shapes',arrayShape.mk());
  let lines = this.set('lines',arrayShape.mk());
  let segs = this.segs = [];
  let ints = this.set('ints',arrayShape.mk());
  this.buildApaths();
  let av = this.allValues();
  this.addLinesBetweenPositions(av,lineP);
  this.addColorPath(1,lines);
  return;
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
  debugger;
  this.runActivePaths();
   let av = this.allValues();
   let apnts = av.filter( (v) => !Array.isArray(v));
  this.updateLines(apnts);
 return;
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



