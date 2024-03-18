import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
//import {rs as basicP} from '/generators/basics.mjs';
//import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as generatorP} from '/generators/motion_3.mjs'

let rs = generatorP.instantiate();
//addDistanceMethods(rs);

rs.setName('motion_21');
let ht=50;


let topParams = {width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:-0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:1/(16*32),stopTime:1,recordingMotion:1,
saveAnimation:1,whereToPause:1000,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:50,speed:1,segsPerCircle:20,radius:.4*ht,numSlices:8};

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
   let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .5; 
}







rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP,circleP,radius} = this;
  this.addFrame();
  this.numSteps =stp/tps;
 // this.numSteps =100;
  this.set('shapes',arrayShape.mk());
  let lines = this.set('lines',arrayShape.mk());
  let polylines = this.set('polylines',arrayShape.mk());
  let path = this.spiralToPath({radius,numTurns:2,segsPerTurn:20});
  //this.show2dPath(path);
//  this.paths = [path];
  this.speedFun = (j) => {
    let jodd = j%2;
    return jodd?2:1;
  }
  this.activePaths = this.buildApaths([path]);
 // return;
  let av = this.allValues();
  this.addLinesBetweenPositions(av,lineP);
//  let colors = [[250,250,0],[0,250,0],[0,250,250],[100,250,250],[250,250,250],[250,250,100]];
  let colors = [[0,250,250],[0,250,0],[0,250,250],[100,250,250],[250,250,250],[250,250,100]];
  this.addColorPath(colors,1,lines);
}

rs.updateState = function () {
  let {currentTime:ct,activePaths,circ,lineP,segs,ints,stepsSoFar:ssf,radius} = this;
  console.log('ssf',ssf,'ct',ct);
  debugger;
  this.runActivePaths();
 // return;
  let av = this.allValues();
  let apnts = av.filter( (v) => !Array.isArray(v));
  const fn = (line,dist) => {
    if (dist>8) {
      line.hide();
    } else {
      line.show();
    }
  }
  this.updateLines(apnts,fn);
  this.pauseAnimationMaybe();
}



    
 
export {rs};



