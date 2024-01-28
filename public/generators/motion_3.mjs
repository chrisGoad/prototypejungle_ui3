import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
import {rs as addIPmethods} from '/mlib/interpolation_path_0.mjs';
import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);
addIPmethods(rs);
addDistanceMethods(rs);

rs.setPathParams = function () {
  let {ipaths,shapesPerPath,speedsPerPath,soffsPerPath,circleP,shapes} = this;
  let np = ipaths.length;
  let activePaths = this.activePaths = [];
  let action =(ap) => {
    let {shape:sh,value:vl} = ap;
    sh.moveto(vl);
  }
  for (let i=0;i<np;i++) {
    let path = ipaths[i];
    let speeds = speedsPerPath[i];
    let spp= shapesPerPath[i];
    let soffs = soffsPerPath[i];
    for (let j=0;j<spp;j++) {
      let crc = circleP.instantiate();
      let ap = this.mkActivePath({startOffset:soffs[j],path,value:Point.mk(0,0)});
      ap.shape = crc;
      ap.action = action;
      ap.speed = speeds[j];
      shapes.push(crc)
      activePaths.push(ap);
    }
  }
}
    
rs.buildApaths = function () {
  let {paths,shapesPerPath:spp,speedFun,shapes,circleP} = this;
  let apaths = [];
  let action =(ap) => {
    let {shape:sh,value:vl} = ap;
    sh.moveto(vl);
  }  
  let np = paths.length;
  for (let i = 0;i<np;i++) {
    let path = paths[i];
    for (let j=0;j<spp;j++) {
      let jodd = j%2;
      let soff = j/spp;
      let shape = circleP.instantiate();
      shapes.push(shape);   
      let params = {speed:speedFun(j,i),path,shape,action,startOffset:soff,value:Point.mk(0,0)};
      let ap = this.mkActivePath(params);
      apaths.push(ap);
    }
  }
  return apaths;
}


rs.addColorPath = function (colors,speed,shapes) {
  let apath = this.mkColorApath(colors,shapes,speed);
  this.activePaths.push(apath);
}
export {rs};
