import {rs as circlePP} from '/shape/circle.mjs';
import {rs as generatorP} from '/instances/motion_1.mjs'
let rs = generatorP.instantiate();

rs.setName('motion_2');
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:1,stopTime:128,recordingMotion:1,
    numShapes:4,circleRadius:1,ringRadius:ht,fractionAround:1/4};

Object.assign(rs,topParams);



rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  
}


export {rs};



