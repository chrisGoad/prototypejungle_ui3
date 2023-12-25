import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);

rs.setName('motion_0');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1,stopTime:100}

Object.assign(rs,topParams);


rs.updatePosition = function (shape,t) {
  let {currentFrame:cf,positions} = this;
  let index = shape.index;
  let pos = this.computePosition(shape,t);
  let pnm = 'p_'+index;
  cf[pnm] = pos;
  positions.push(pos);
  shape.moveto(pos);
}



rs.updatePositions = function () {
  let {timePerStep:tps,stepsSoFar:ssf,motionHistory:mh,recordingMotion:rm,lastTime:lt}=this;
  let t = ssf*tps;
  let positions = this.positions = [];
  this.currentTime = t;
  let {shapes} = this;
  let cf = this.currentFrame = {time:t};
  if (rm) {
    if (!mh) {
      mh = this.motionHistory = [];
    }
    if (Math.abs(t-lt) > .1) {
      mh.push(cf);
    }
    this.lastTime = t;
  }
  let ns =shapes.length;
  for (let i=0;i<ns;i++) {
    let shape = shapes[i];
    let pos = this.computePosition(shape,t);
    this.updatePosition(shape,t);
  }
}
    
    
rs.updateState = function () {
  debugger;
  let onUp = this.onUpdate;
  this.updatePositions();
  if (onUp) {
    this.onUpdate();
    
  }
}


export {rs}
  

  