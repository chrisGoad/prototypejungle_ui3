
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/instances/interpolate_colors_5.mjs'
let rs = generatorP.instantiate();


rs.setName('interpolate_colors_6');
rs.randomColors = 0;
let cornerColors = {ULC:[12,40,64],URC:[210,246,247],LLC:[171,147,67],LRC:[39,87,127]}
Object.assign(rs,cornerColors);

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
  Object.assign(rs.subParamsA[i],cornerColors);
}


export {rs};



