import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addIPmethods} from '/mlib/interpolation_path_0.mjs';
import {rs as addEyeMethods} from '/mlib/eye_0.mjs';

let rs = basicP.instantiate();
addEyeMethods(rs);

rs.setName('test_eye');
let ht=50;


let topParams = {width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:-0.1*ht,frameStroke:'white',frameStrokeWidth:.2,
    circleRadius:.2,radius:30,y:25,numSegs:40};

Object.assign(rs,topParams);
let subParams ={speed:10,shapesPerRing:2};



  
rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let polygonP = this.polygonP = polygonPP.instantiate();
  polygonP.fill = 'white';
  polygonP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .05; 
}



rs.initialize = function () {
  debugger;
  this.initProtos();
  let {circleP,radius:r,y,numSegs:n} = this;
  this.addFrame();
  let shapes = this.set('shapes',arrayShape.mk());
  let poly = this.anArc(r,y,n);
  this.set('poly',poly);
  return;
  let pnts = this.anArc(r,y,n);
  pnts.forEach((p) => {
    let c = circleP.instantiate();
    shapes.push(c);
    c.moveto(p);
  });
}



    
 
export {rs};



