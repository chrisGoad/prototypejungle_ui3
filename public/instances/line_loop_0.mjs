import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/line_loop_0.mjs';
let rs = generatorP.instantiate();

rs.setName('line_loop_)');


let ht = 100;
let topParams = {width:ht,height:ht,framePadding:.0*ht,frameStrokee:'red',numSteps:20,speed:1,numSteps:20,
   //sides:['top','bot']};
   saveAnimation:1};

Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke= 'rgb(255,255,255)';
  lineP['stroke-width'] = .5;
}

rs.addTheSegments = function () {
  let {width} = this;
  let hwd = 0.5*width;
  const addSegPair = (x) => {
    let left = Point.mk(x-hwd,0);
    let top = Point.mk(x+hwd,-hwd);
    let bot = Point.mk(x+hwd,hwd);
     this.addSegment(left,top);
     this.addSegment(left,bot);
  }
  for (let i=0;i<=10;i++) {
    addSegPair(i*5);
  }
}
  
export {rs};
