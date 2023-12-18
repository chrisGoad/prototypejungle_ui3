import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as motionHistory} from '/motionHistories/motion_1.mjs';
debugger;
let rs = basicP.instantiate();

addAnimationMethods(rs);


rs.setName('playRecording');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,radius:1,fromWhere:'motion_1'}

Object.assign(rs,topParams);


rs.updatePositions = function (positions) {
  debugger;
  let {shapes} = this;
  let ln = shapes.length;
  for (let i=0;i<ln;i++) {
    let pos = positions[i];
    let shape = shapes[i];
    shape.moveto(pos);
  }
}

rs.mkShapes = function (colors) {
  let {radius,motionHistory:mh,shapes,circleP} = this;
  let ln = mh[0].points.length;
  let dim = 2*radius;
  for (let i=0;i<ln;i++) {
    let shape = circleP.instantiate();
    shape.dimension = dim;
    shape.show();
    shape.fill = colors?colors[i]:'white';
    shapes.push(shape);
  }
}
     

rs.updateState =function () {
  let {motionHistory:mh,stepsSoFar:ssf} = this;
  debugger;
  let positions = mh[ssf].points;
  this.updatePositions(positions);
}



rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
}

rs.historyRadius = function (mh) {
  let maxr= -Infinity;
  mh.forEach((m)=>{
    let {points} =m;
    points.forEach( (p) => {
     let {x,y} = p;
     let ax = Math.abs(x);
     let ay = Math.abs(y);
     maxr = Math.max(ax,ay);
    });
  });
  return maxr;
}


rs.initialize = function () {
  let {fromWhere} = this;
  debugger;
  let shapes = this.set('shapes',arrayShape.mk());
  this.initProtos();
  let mh = this.motionHistory = this.processHistory(motionHistory);
 // this.getMotionHistory(fromWhere,(mh) => {
 //   this.motionHistory = mh;
  let hr = this.historyRadius(mh);
  let nr = 1.1*hr;
  this.width = 2*nr;
  this.height = 2*nr;
  this.addFrame();
  this.numSteps = mh.length;
  this.mkShapes();
  this.updateState();
  //});
}


export {rs}
  

  