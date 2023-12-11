import {rs as gonPP} from '/shape/polygon.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';


let rs = basicP.instantiate();
addAnimationMethods(rs);
rs.setName('interpolator_0');


let ht= 100;
let nr = 101;
//nr = 5	;

let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,framePadding:0.01*ht,frameStrokee:'white',frameStrokeWidth:.1,saveAnimation:1,oneShot:1,
numSteps:200,chopOffBeginningg:218,stepInterval:50,ULC:[250,0,0],URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0],period:20,xgapf:.1,ygapf:.1};//50
//numSteps:295,chopOffBeginning:218,stepInterval:50,ULC:rs.randomFill('ran','ran','ran',100,250),URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0]};//50

Object.assign(rs,topParams);

rs.interpolateParams = function (params) {
  let {vertices,vParams,pt} = this;
  let ds = vertices.map((v) => pt.distance(v));
  let fcs = ds.map((v)=>1/v);//factors
  let sum =0;
  fcs.forEach((v) => {
    sum=sum+v;
  });
  let nfcs = fcs.map( (v) => v/sum);//normalized factors
  let wvps = [];// weighted parameters
  for (let j=0;j<vl;j++) {
    let vp = vParams[j];
    let nfc = nfcs[j];
    let wvp = vp.map((v)=>nfc*v);
    wvps.push(wvp);
  }
  let suma= this.sumArrays(wvps);  //sum the weights
  return suma;
}  
  

export {rs};



