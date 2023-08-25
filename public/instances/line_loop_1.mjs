import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/line_loop_0.mjs';
let rs = generatorP.instantiate();

rs.setName('line_loop_1');


let ht = 100;
let topParams = {width:ht,height:ht,framePadding:.0*ht,frameStrokee:'red',numSteps:20,speed:1,numSteps:20,numSpokes:200,
   //sides:['top','bot']};
   saveAnimation:1};

Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke= 'rgb(255,255,255)';
  lineP['stroke-width'] = .1;
}

rs.addTheSegments = function () {
  let {width,numSpokes:ns} = this;
  let hwd = 0.5*width;
  let center = Point.mk(0,0);
  const addSeg = (a) => {
    let e1 = Point.mk(Math.cos(a),Math.sin(a)).times(2*hwd*Math.random());
   
     this.addSegment(center,e1);
  }
  for (let i=0;i<=ns;i++) {
    let a = (i*2*Math.PI)/ns;
    addSeg(a);
  }
}
  
export {rs};
