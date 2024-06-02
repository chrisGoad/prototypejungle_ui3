
import {rs as generatorP} from '/instances/interp_1.mjs';

import {rs as basicP} from '/generators/basics.mjs';

let rs = basicP.instantiate();
//let rs = containerShape.mk();

rs.setName('interp_2');

let wd =100;
let myParams = {width:wd,height:wd};
Object.assign(rs,myParams);

rs.initialize = function () {
  let {width:wd} = this;
  this.setBackgroundColor('white');
  debugger;
  this.addFrame();

  let hwd = 0.5*wd;
  let grid0  = generatorP.instantiate();
  let grid1  = generatorP.instantiate();
  let grid2  = generatorP.instantiate();
  let grid3  = generatorP.instantiate();
  rs.set('grid0',grid0);
  rs.set('grid1',grid1);
  rs.set('grid2',grid2);
  rs.set('grid3',grid3);
  grid0.initialize();
  grid1.initialize();
  grid2.initialize();
  grid3.initialize();
  grid0.moveto(Point.mk(hwd,hwd));
  grid1.moveto(Point.mk(hwd,-hwd));
  grid2.moveto(Point.mk(-hwd,hwd));
  grid3.moveto(Point.mk(-hwd,-hwd));
  //grid0.hide();
} 


export {rs};

