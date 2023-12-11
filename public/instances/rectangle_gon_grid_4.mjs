
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/instances/rectangle_gon_grid_1.mjs'
let rs = generatorP.instantiate();


rs.setName('rectangle_gon_grid_4');
rs.randomColors = 0;
let cornerColors = {ULC:[12,40,64],URC:[210,246,247],LLC:[171,147,67],LRC:[39,87,127]}
rs.cornerColors = cornerColors;

let xdisp = 0,ydisp = 0;
//rs.subParamaA = [];
rs.subParamsA.push({lowX:25+xdisp,highX:75+xdisp,lowY:25+ydisp,highY:75+ydisp});
xdisp = 100;
rs.subParamsA.push({lowX:25+xdisp,highX:75+xdisp,lowY:25+ydisp,highY:75+ydisp});
xdisp = 0;ydisp=100;
rs.subParamsA.push({lowX:25+xdisp,highX:75+xdisp,lowY:25+ydisp,highY:75+ydisp});
xdisp=100;
rs.subParamsA.push({lowX:25+xdisp,highX:75+xdisp,lowY:25+ydisp,highY:75+ydisp});
for (let i=0;i<4;i++) {
  rs.subParamsA[i].cornerColors = cornerColors;
}


export {rs};



