import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addIPmethods} from '/mlib/interpolation_path_0.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();
addIPmethods(rs);

addAnimationMethods(rs);

rs.setName('ip_test_2');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/4,stopTime:100}

Object.assign(rs,topParams)




  
rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.dimension = cr*2;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .05;
   let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .05;   
}

rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,circleP} = this;
  this.addFrame();
  this.numSteps =stp/tps;
  this.set('polylines',arrayShape.mk());
  
  let wl = 10;
  let sinp0 = {waveLength:wl,amplitude:-8,startX:-4*wl,thetaAtStart:-8*Math.PI,thetaAtEnd:8*Math.PI,baseY:10};
  let sinp1 = {waveLength:wl,amplitude:8,startX:-4*wl,thetaAtStart:-8*Math.PI,thetaAtEnd:8*Math.PI,baseY:-10};
  let p0 = this.sinWaveToPath(sinp0);
  let p1 = this.sinWaveToPath(sinp1);
  let numPaths = 60;
  for (let i=0;i<=numPaths;i++) {
    let fr = i/numPaths;
    let ip = this.interpolatePaths(p0,p1,fr);
    this.show2dPath(ip,300);
  }
 // this.show2dPath(p1,300);
  //this.show2dPath(ip,300);
  
}  
rs.updateState = function () {
  let {currentTime:ct,activePaths,circ} = this;
  let ap = this.activePaths[0]
 // debugger;
  this.runActivePaths();
  let vl = ap.value;
  console.log('time',ct,'value',vl);
  //circ.moveto(vl);
}


export {rs}
  

  