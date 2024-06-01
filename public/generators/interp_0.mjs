

import {rs as generatorP} from '/generators/part2_0.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';

let rs = basicP.instantiate();
addGridMethods(rs);

rs.setName('interp_0');

let wd = 100;
let nr = 40;
let colorParams = {redOb:{r:255,g:0,b:0},greenOb:{r:0,g:255,b:0},blueOb:{r:0,g:0,b:255},blackOb:{r:0,g:0,b:0},whiteOb:{r:255,g:255,b:255},
                  cyanOb:{r:0,g:255,b:255}};
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:0.2*wd,frameStroke:undefined,doNotDisplayParts:1,numSteps:30}
Object.assign(rs,topParams);
Object.assign(rs,colorParams);


rs.initProtos = function () {
  this.rectP  = rectPP.instantiate();
  this.rectP.fill = 'white';
  this.rectP['stroke-width'] = 0;
    this.lineP  = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .1;
}




export {rs};

      

