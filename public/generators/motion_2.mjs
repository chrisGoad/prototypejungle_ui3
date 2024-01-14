import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addIPmethods} from '/mlib/interpolation_path_0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);
addIPmethods(rs);

rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2; 
}

rs.buildPaths = function () {
  let {ringRadii,ringCenters,shapesPerRing,speeds,segsPerCircle,shapes,circleP} = this;
  let ringPaths = this.ringPaths = [];
  let ringActivePaths = this.ringActivePaths = [];
  let activePaths = this.activePaths = [];
  let nr = ringRadii.length;
  let action =(ap) => {
    let {shape:sh,value:vl} = ap;
    sh.moveto(vl);
  }
  for (let i=0;i<nr;i++) {
    let radius = ringRadii[i]
    let center = ringCenters[i];
    let circle = Circle.mk(center,radius);
    let path = this.circleToPath(circle,segsPerCircle);
    let rspeeds = speeds[i];
    let spr = shapesPerRing[i];
    for (let j=0;j<spr;j++) {
       let crc = circleP.instantiate();
      let ap = this.mkActivePath({startOffset:j/spr,speed:rspeeds[j],path,value:Point.mk(0,0)});
      ap.shape = crc;
      ap.action = action;
      shapes.push(crc)
      activePaths.push(ap);
    }
  }
}
    

export {rs};
