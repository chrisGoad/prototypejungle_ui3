
import {rs as generatorP} from '/instances/part_0_D.mjs';

let rs = generatorP.instantiate();

rs.setName('part_0_D_3');

rs.partParams.rectangular = 1;
rs.partParams.splitParams = {Case:6,vertexNum:0,pcs:0.7,0.7]};
//rs.partParams.splitParams = {Case:2,vertexNum:0,fr0:0,fr2:0.7};

rs.afterInitialize =function ()  {
  let {width:wd} = this;
  let hwd = 0.5*wd;
  let ff = 0.05*wd;
  this.addT('Case',2,Point.mk(0*ff,-(hwd+3*ff)));

  //this.addT('P',1,Point.mk(-1*ff,hwd-5.5*ff));
  //this.addT('P',0,Point.mk(1*ff,-2.5*ff));
  this.addT('fr',0,Point.mk(-(hwd+ff),-4*ff));
  this.addT('fr',2,Point.mk(hwd+ff,4*ff));
}

export {rs};


