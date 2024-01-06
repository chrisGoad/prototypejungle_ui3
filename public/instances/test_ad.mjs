import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addNearestMethods} from '/mlib/nearest_0.mjs';
import {rs as generatorP} from '/generators/motion_1.mjs'

let rs = generatorP.instantiate();
addNearestMethods(rs);

rs.setName('test_ad');
let ht=50;
let stt=2;


let topParams = {width:ht,height:ht,framePadding:0.3*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/4,stopTime:stt,recordingMotion:1,saveAnimation:1,
    circleRadius:.2,ringRadii:[],nearestCount:6,nearestFadeFactor:20,toAngle:2*Math.PI};

Object.assign(rs,topParams);

/*
 let {attackDuration} = ad;
    let applicator = (shape,value) => {
      let stroke = this.arrayToRGB(value);
      shape.stroke = stroke;
      shape.show();
      shape.update();
    }
    let zeroValue = [0,0,0];
    aparams = {attackDuration,zeroValue,applicator};
  }
*/

  
rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .4; 
}

rs.initialize = function () {
   debugger;
   this.initProtos();
  let {stopTime:stp,timePerStep:tps,lineP} = this;

  this.addFrame();
  this.numSteps =stp/tps;
  this.numSteps = 101;
  let lines = this.set('lines',arrayShape.mk());
  let line  = lineP.instantiate();
  line.setEnds(Point.mk(-10,0),Point.mk(10,0));
  line.show();
  lines.push(line);
  this.ADstates =[];
  this.ADpool =[];
  let applicator = (shape,value) => {
    let stroke = this.arrayToRGB(value);
    shape.stroke = stroke;
    shape.show();
    shape.update();
  }
  let zeroValue = [0,0,0];
  let value = [200,0,200]
  this.aparams = {attackDuration:1,zeroValue,applicator,shape:line,value};
}



rs.updateState = function () {
  debugger;
  let {stepsSoFar:ssf,currentTime:t,nearestCount,nearestFadeFactor:nff,aparams,attackStarted:ast} = this;
  console.log('steps',ssf,'time',t);
  if (!ast) {
    this.startAttack(aparams);
    this.attackStarted =1;
  }
  this.execADs();
}




    
 
export {rs};



