
import {rs as generatorP} from '/instances/part2_0_I_16.mjs';

let rs = generatorP.instantiate();


rs.setName('part2_0_I_16_1');

let wd =100;
let nc=40;
let myParams = {width:wd,height:wd,numCols:nc,numRows:nc};
Object.assign(rs,myParams);

export {rs};

