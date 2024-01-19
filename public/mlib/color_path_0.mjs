import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
const rs = function (item) {

item.mkColorApath = function (colorArrays,shape,speed) {
  let path = this.mkUniformPath(colorArrays);
  let action =(ap) => {
    let {shape:sh,value:vl} = ap;
    let fill = this.arrayToRGB(vl);
    sh.fill = fill;
    sh.update();
  }
  let value = this.deepCopy(colorArrays[0]);
  let params = {path,speed,shape,value};
  let ap = this.mkActivePath(params);
  return ap;
}

export {rs};
