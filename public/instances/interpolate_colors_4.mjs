
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/instances/interpolate_colors_2.mjs'
let rs = generatorP.instantiate();


rs.setName('interpolate_colors_4');
let ht= 100;
let nr = 201;
let lowX = 75;
let highX = 125;
let lowY = 75;
let highY = 125;
lowY=0;
highY=200;

let subParams = {lowX,lowY,highX,highY};
rs.subParams = subParams;



export {rs};



