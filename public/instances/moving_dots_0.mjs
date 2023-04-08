import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/moving_dots.mjs';

let rs = generatorP.instantiate();

rs.setName('moving_dots_0');

let wd = 200;
let nr = 10;
nr = 6;
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,frameStroke:'rgb(2,2,2)',stepsPerMove:100,numSteps:1000,
                  frameStrokee:'white',frameStrokeWidth:1,saveAnimation:0}
Object.assign(rs,topParams);
debugger;


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  //lineP['stroke-width'] = .8;
  lineP.stroke = 'white';
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 3;
  circleP.fill = 'red';
}

  
rs.addDots = function () {
  this.addDot({row:0,col:0},'right');
  this.addDot({row:0,col:4},'left');

}


export {rs};


