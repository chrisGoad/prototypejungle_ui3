
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/instances/interpolate_colors_5.mjs'
let rs = generatorP.instantiate();


rs.setName('interpolate_colors_6');


let xdisp = 0,ydisp = 0;
//rs.subParamaA = [];
rs.subParamsA.push({lowX:25+xdisp,highX:75+xdisp,lowY:25+ydisp,highY:75+ydisp});
xdisp = 100;
rs.subParamsA.push({lowX:25+xdisp,highX:75+xdisp,lowY:25+ydisp,highY:75+ydisp});
xdisp = 0;ydisp=100;
rs.subParamsA.push({lowX:25+xdisp,highX:75+xdisp,lowY:25+ydisp,highY:75+ydisp});
xdisp=100;
rs.subParamsA.push({lowX:25+xdisp,highX:75+xdisp,lowY:25+ydisp,highY:75+ydisp});


export {rs};



