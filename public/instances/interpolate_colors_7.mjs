
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/instances/interpolate_colors_5.mjs'
let rs = generatorP.instantiate();


rs.setName('interpolate_colors_7');
let ht= 100;
let nr = 201;
let cornerColors = {ULC:[10,10,10],URC:[238,105,65],LLC:[238,105,65],LRC:[10,10,10]};
let newParams = {numRows:nr,numCols:nr,randomColors:0,
                  framePadding:0.01*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,xgapf:-.1,ygapf:-.1};//50

Object.assign(rs,newParams);
Object.assign(rs,cornerColors);


export {rs};



