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
let topParams = {width:wd,height:wd,frameStrokee:'white',frameStrokeWidth:0.1,framePadding:.6*wd,stepsPerMove:10,numCubes:15,
  dim:40,disp:50,numSegs:10,gray:100,delta:20,saveAnimation:1,whereToPause:43,
 
  };
  


Object.assign(rs,topParams);
/*
rs.addSweepPath = function (params) {
  let {pstate} = this;
  let {cstate,pspace} = pstate;
  let {name:nm,min,max,vel,sinusoidal,bounce,initVal,down} = params;
  let ps = {kind:'sweep',min,max,sinusoidal,vel,bounce};
  pspace[nm] = ps;
  cstate[nm] = {value:initVal,down};
}
 // let {sinusoidal,min,max,vel,bounce,startDown,once,startAtStep:sas} = pspc;
*/
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
 
  let extent = this.extent = Point.mk(dim,dim);
 

  
  let dVH = 150;//  inner vertical and horizontal
  let dD = 50;//diagonal
  //let gclr = {r:0,g:0,b:0};
  let gclr = this.gclr = {r:gray,g:gray,b:gray};

  debugger;
  this.adjustGons(dD,dVH);
  let minval = Math.sqrt(30);
  let maxval = Math.sqrt(250);
  let rng = maxval - minval;
  let vel = 0.125;
  this.numSteps = 2*Math.floor(rng/vel);
  console.log('numSteps',this.numSteps,'vel',vel);
  vel = 0.25*(rng/vel)/this.numSteps;
  this.numSteps = this.numSteps*3+1;
   //this.numSteps = 2*Math.floor(rng/vel);
     console.log('numSteps',this.numSteps,'vel',vel);

  this.addSweepPath({name:'x',min:minval,max:maxval,vel,bounce:1,down:1,sinusoidal:1,initVal:minval+0.5*rng});
  this.addSweepPath({name:'y',min:minval,max:maxval,vel,bounce:1,down:1,sinusoidal:1,initVal:maxval});
  let mincval=100;
  let maxcval=200;
  let crng = maxcval - mincval;;
  let cvel = (crng/rng)*vel;
  this.addSweepPath({name:'cx',min:mincval,max:maxcval,vel:cvel,bounce:1,down:1,sinusoidal:1,initVal:mincval+0.5*crng});
  this.addSweepPath({name:'cy',min:mincval,max:maxcval,vel:cvel,bounce:1,down:1,sinusoidal:1,initVal:maxcval});

}

rs.adjustGon = function (nm,d,extent,ps,clr) {
  debugger;
  let {numSegs} = this;
  let gon = this[nm];
  let newgon = this.genGonGon(extent,d,numSegs,gon);
  let fill = `rgb(${clr.r},${clr.g},${clr.b})`;
  if (gon) {
  gon.fill = fill;
    gon.update();
    gon.show();
    return;
  }
  this.set(nm,newgon);
  newgon.moveto(ps);
  newgon.fill = fill;
}
rs.adjustGons = function (dD,dVH,cD,cVH) {
  let {disp,extent} = this;
 // let clrD  = {r:cD,g:0,b:255-cD};
  let clrD  = {r:cD,g:0,b:0};
  //let clrVH  = {r:cVH,g:0,b:255-cVH};
  let clrVH  = {r:cVH,g:0,b:0};
  this.adjustGon('gon00',dD,extent,Point.mk(-disp,-disp),clrD);
  this.adjustGon('gon01',dVH,extent,Point.mk(-disp,0),clrVH);
  this.adjustGon('gon02',dD,extent,Point.mk(-disp,disp),clrD);
  
  this.adjustGon('gon10',dVH,extent,Point.mk(0,-disp),clrVH);
  this.adjustGon('gon11',dD,extent,Point.mk(0,0),clrD);
  this.adjustGon('gon12',dVH,extent,Point.mk(0,disp,-disp),clrVH);
  
  this.adjustGon('gon20',dD,extent,Point.mk(disp,-disp),clrD);
  this.adjustGon('gon21',dVH,extent,Point.mk(disp,0),clrVH);
  this.adjustGon('gon22',dD,extent,Point.mk(disp,disp),clrD);
}
rs.updateState = function () {
  let {pstate} = this;
  let {cstate,pspace} = pstate;
  debugger;
  let valx = cstate.x.value;
  let valcx = cstate.cx.value;
  let valy = cstate.y.value;
  let valcy = cstate.cy.value;
  let valxsq = valx*valx;
  let valysq = valy*valy;
  //console.log('x',valxsq,'y',valysq,'valcx',valcx,'valcy',valcy);
  console.log('valcx',valcx,'valcy',valcy);
  this.adjustGons(valxsq,valysq,valcx,valcy);
}


export {rs};
