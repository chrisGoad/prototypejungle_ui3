
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/instances/interpolate_colors_5.mjs'
let rs = generatorP.instantiate();


rs.setName('interpolate_colors_7');
let ht= 100;
let nr = 201;

let colors=[[250,0,10],[238,105,65],[10,10,250],[10,10,10]];
let newParams = {numRows:nr,numCols:nr,randomColors:0,
                  framePadding:0.01*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,
ULC:colors[3],URC:colors[1],LLC:colors[1],LRC:colors[3],CNC:colors[3],xgapf:-.1,ygapf:-.1};//50
//numSteps:295,chopOffBeginning:218,stepInterval:50,ULC:rs.randomFill('ran','ran','ran',100,250),URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0]};//50

Object.assign(rs,newParams);



export {rs};



