
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addPowerGridMethods} from '/mlib/PowerGrid.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);
addRandomMethods(rs);
addPowerGridMethods(rs);
	
rs.setName('grid_quilt_1');

rs.powerParams  = {
  root:2,
  sizeMap:[1.5,1,2,3,4,0,0]
};

let nr = 64;
let wd = 100; 
let topParams = {randomizeOrder:1,pointJiggle:2,numRows:nr,numCols:nr,width:wd,height:wd}

Object.assign(rs,topParams);

rs.colorSetter = function (shape,fc) {
  let r = 100 + Math.random() * 155;
  let g = 100 +Math.random() * 155;
  let b = 100 + Math.random() * 155;
  if (fc >= 2) {
    shape.fill = 'rgba(255,255,255,0.5)';
  } else {
    shape.fill = `rgba(${r},${g},${b},0.5)`;
  }
}

let rwd = 50; 
rs.initProtos = function () {
  this.rectP = rectPP.instantiate();
  this.rectP.stroke = 'rgba(0,0,0,.8)';
  this.rectP['stroke-width'] = 0.4;
}

rs.shapeGenerator = function () {
  return this.rectP.instantiate().show();
}

rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.generateGrid();
}  

export {rs};



