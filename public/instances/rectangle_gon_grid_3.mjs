debugger;
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/instances/rectangle_gon_grid_1.mjs'
let rs = generatorP.instantiate();
debugger;

rs.setName('rectangle_gon_grid_3');
rs.randomColors = 0;
let cornerColors = {ULC:[240,66,207],URC:[101,153,125],LLC:[126,18,61],LRC:[223,204,20]};
cornerColors = {ULC:[74,134,30],URC:[10,127,201],LLC:[17,171,209],LRC:[39,22,17]}
cornerColors = {ULC:[55,72,197],URC:[230,120,25],LLC:[237,37,160],LRC:[227,47,244]}
cornerColors = {ULC:[33,136,51],URC:[141,209,24],LLC:[232,235,72],LRC:[154,196,239]};
/*rs.ULC = [ 240 , 66 , 207 ];
rs.URC = [ 101 , 153 , 125 ];
rs.LLC = [ 126 , 18 , 61 ]	
rs.LRC = [ 223 , 204 , 20 ];*/
rs.cornerColors=cornerColors;


let subParams = {lowX:75,highX:125,lowY:0,highY:200};
let subColors = {ULC:[78,248,164],URC:[46,201,15],LLC:[39,156,238],LRC:[239,40,112]};
subColors = {ULC:[218,223,172],URC:[245,116,200],LLC:[212,116,201],LRC:[131,56,112]}
subColors = {ULC:[100,179,87],URC:[235,173,166],LLC:[226,156,172],LRC:[23,78,13]};
subColors = {ULC:[26,23,41],URC:[131,71,130],LLC:[175,45,127],LRC:[140,191,150]};
subParams.cornerColors = subColors;
//rs.subParamsA = [{lowX:75,highX:125,lowY:0,highY:200,ULC:[ 78 , 248 , 164 ],URC: [ 46 , 201 , 15 ],LLC: [ 39 , 156 , 238 ],LRC:[ 239 , 40 , 112 ]}];
rs.subParamsA = [subParams];

export {rs};



