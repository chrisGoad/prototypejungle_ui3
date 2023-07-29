import {rs as generatorP} from '/generators/gons_0.mjs';
let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as gonPP} from '/shape/polygon.mjs';
import {rs as addPathMethods} from '/mlib/path.mjs';	
addPathMethods(rs);

rs.setName('gons_3');
rs.pstate = {pspace:{},cstate:{}};

let wd=100;
let topParams = {width:wd,height:wd,frameStrokee:'white',frameStrokeWidth:0.1,framePadding:.6*wd,stepsPerMove:10,numStepss:24,numSteps:300, numCubes:15,
  dim:40,disp:48,numSegs:15,gray:100,delta:20
 
  };
  


Object.assign(rs,topParams);

rs.addSweepPath = function (params) {
  let {pstate} = this;
  let {cstate,pspace} = pstate;
  let {name:nm,min,max,vel,sinusoidal,bounce,initVal} = params;
  let ps = {kind:'sweep',min,max,sinusoidal,vel,bounce};
  pspace[nm] = ps;
  cstate[nm] = {value:initVal};
}
 // let {sinusoidal,min,max,vel,bounce,startDown,once,startAtStep:sas} = pspc;

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension = 2;
  circleP.fill = 'red';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
   let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
   let gonP = this.gonP = gonPP.instantiate();
  gonP.fill = 'white';
  gonP.stroke = 'white';
  gonP['stroke-width'] = .4;
}


     
rs.initialize = function () {
  debugger;
  //this.setBackgroundColor('rgb(10,10,100)');
  this.setBackgroundColor('rgb(0,0,0)');
  //this.setBackgroundColor('rgb(100,100,100)');
  let {dim,disp,numSegs:nc,gray,delta} = this;
  this.initProtos();
  this.addFrame();
 
  let extent = Point.mk(dim,dim);
 
  const addGon = (nm,d,ps,clr) => {
    let gon = this.genGonGon(extent,d,nc);
    this.set(nm,gon);
    gon.moveto(ps);
    let fill = `rgb(${clr.r},${clr.g},${clr.b})`;
    gon.fill = fill;
  }

  
  let dC = 150;
  let dD = 50;
  //let gclr = {r:0,g:0,b:0};
  let gclr = {r:gray,g:gray,b:gray};

  debugger;
  
   addGon('gon00',dD,Point.mk(-disp,-disp),gclr);
  addGon('gon01',dC,Point.mk(-disp,0),gclr);
  addGon('gon02',dD,Point.mk(-disp,disp),gclr);
  
  addGon('gon10',dC,Point.mk(0,-disp),gclr);
  addGon('gon11',dD,Point.mk(0,0),gclr);
  addGon('gon12',dC,Point.mk(0,disp,-disp),gclr);
  
  addGon('gon20',dD,Point.mk(disp,-disp),gclr);
  addGon('gon21',dC,Point.mk(disp,0),gclr);
  addGon('gon22',dD,Point.mk(disp,disp),gclr);
  this.addSweepPath({name:'x',min:0,max:10,vel:2,initVal:0});
}
rs.updateState = function () {
  let {pstate} = this;
  let {cstate,pspace} = pstate;
  debugger;
  let val = cstate.x.value;
  console.log('value=',val);
}


export {rs};
