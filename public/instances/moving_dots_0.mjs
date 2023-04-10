import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/moving_dots.mjs';

let rs = generatorP.instantiate();

rs.setName('moving_dots_0');

let wd = 200;
let nr = 10;
nr = 40;
nr=3;
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,frameStroke:'rgb(2,2,2)',stepsPerMove:10,numSteps:1000,
                  frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,chopOffBeginning:400}
Object.assign(rs,topParams);
debugger;


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  //lineP['stroke-width'] = .8;
  lineP.stroke = 'cyan';
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 2;
  circleP.fill = 'cyan';
}

  
rs.addDots = function () {
  let {numRows:nr,numCols:nc} = this;
  for (let i=1;i<14;i++) {
    this.addDot({row:nr-2,col:i*3},'up');
   this.addDot({row:i*3,col:nc-2},'left');
  }

}


export {rs};


