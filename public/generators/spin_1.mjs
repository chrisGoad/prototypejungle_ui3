
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as gonPP} from '/shape/polygon.mjs';
import {rs as basicP} from '/generators/basics.mjs';
let rs = basicP.instantiate();
import {rs as addPathMethods} from '/mlib/path.mjs';	
addPathMethods(rs);

rs.setName('spin_1');
rs.pstate = {pspace:{},cstate:{}};

let wd=100;
let topParams = {width:wd,height:wd,frameStrokee:'white',frameStrokeWidth:0.1,framePadding:.1*wd,numSteps:8*138/*1000*/,saveAnimation:1,
  numSpinners:32,shapesPerSpinner:15,pulseDurLow:20,pulseDurHigh:50,whereToPause:283
  };
  
rs.addSpinner = function (params) {
  let {name,center,radius,numShapes:ns,shapeP} = params;
  let {pulseDurLow:pDL,pulseDurHigh:pDH,shapesPerSpinner:sps} = this;
  let sp = containerShape.mk();
  let pdDelta = pDH-pDL;
  this.set(name,sp);
  for (let i=0;i<sps;i++) {
    let sh = shapeP.instantiate();
    let nm = 's'+i;
    sp.set(nm,sh);
    let pdnmr = 'pdurr'+i;
    let pdnmg = 'pdurg'+i;
    let pdnmb = 'pdurb'+i;
    let pdr = pDL+ Math.random()*pdDelta;
    let pdg = pDL+ Math.random()*pdDelta;
    let pdb = pDL+ Math.random()*pdDelta;
    sp[pdnmr] = pdr;
    sp[pdnmg] = pdg;
    sp[pdnmb] = pdb;
    sp['pvr'+i] = 1;
    sp['pvg'+i] = 1;
    sp['pvb'+i] = 1;
    sp['pDownr'+i] = 1;
    sp['pDowng'+i] = 1;
    sp['pDownb'+i] = 1;
  }
  sp.numShapes = sps;
  sp.radius = radius;
  sp.center = center;
  return sp;
}

rs.spinTo = function (sp,theta) {
  let {shapesPerSpinner:sps}= this;
  let ns = sp.numShapes;
  let {center,radius} = sp;
 // console.log('theta',theta,'ns',ns,'radius',radius);
  let delta = (2*Math.PI)/ns;
  for (let i=0;i<ns;i++) {
    let a = theta+delta*i;
    let nm = 's'+i;
    let sh = sp[nm];
    if (!sh) {
     debugger;
     return;
    }
    let vec = Point.mk(Math.cos(a),Math.sin(a)).times(radius);
    let p = center.plus(vec);
    sh.moveto(p);
    debugger;
    const forColor = (c) => {
      let pdur = sp['pdur'+c+i];
      let pvid = 'pv'+c+i;
      let pv = sp[pvid];
      let pstep = 1/pdur;
      let pDid = 'pDown'+c+i;
      let pDown = sp[pDid];
      let npv;
      if (pDown) {
        npv = pv - pstep;
        if (npv < 0.0001) {
          sp[pDid] = 0;
        }
      } else {
        npv = pv+pstep;
        if (npv > 0.999) {
          sp[pDid] = 1;
        }
      }
      sp[pvid] =npv;
      let v = 100+Math.floor(npv*150);
      return v;
    }
    let rv = forColor('r');
    let gv = forColor('g');
    let bv = forColor('b');
    let fill = `rgb(${rv},${rv},${bv})`;
   // console.log(i,'i','pdur',pdur,'pv',pv,'pDown',pDown,'npv',npv,'fill',fill);
 //   sh.fill = fill;       
     sh.update();
    sh.show();
  }
}

rs.parabola =function (sp) {
  let ns = sp.numShapes;
  for (let i=0;i<ns;i++) { 
    let i2 = i*i;
    let nm = 's'+i;
    let sh = sp[nm];
    let p = Point.mk(4*i,2*i2);
    if (i>0) {
      let li2=(i-1)*(i-1);
      let sl = i2-li2;
    }
    sh.moveto(p);
  
  }
}

  
  

Object.assign(rs,topParams);


rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension = 1;
  circleP.fill = 'white';
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


rs.addSpinners = function (lowRad,highRad,numSpinners) {
  let delta = (highRad - lowRad)/(numSpinners-1);
  for (let i=0;i<numSpinners;i++) {
    let rad = lowRad+i*delta;
    this.addSpinner({center:Point.mk(0,0),radius:rad,name:'spinner'+i,numShapes:25,shapeP:this.circleP});
  }
}

rs.spinSpinners = function (numSpinners,theta) {
  for (let i=0;i<numSpinners;i++) {
    let sp = this['spinner'+i];
    this.spinTo(sp,theta);
  }
}
     
rs.initialize = function () {
  debugger;
  this.numSteps =2720;
  let {numSpinners:nsp} = this;
  //this.setBackgroundColor('rgb(10,10,100)');
  this.setBackgroundColor('rgb(0,0,0)');
  //this.setBackgroundColor('rgb(100,100,100)');
  let {dim,disp,numSegs:nc,gray,delta} = this;
  this.initProtos();
  this.addFrame();
  //let sp = this.addSpinner({center:Point.mk(0,0),name:'spinner0',numShapes:20,shapeP:this.circleP});
  //this.parabola(sp);
  //return;
  this.addSpinners(10,50,nsp);
  this.spinSpinners(nsp,0);
  let minval = 0;
  let vel = (2*Math.PI)/40;
  let maxval = 2*Math.PI-0.0002;
  let lowVel = (2*Math.PI)/400;
  let highVel = (2*Math.PI)/200;
  let midVel = (2*Math.PI)/100;
  let midi = nsp/2;
  let qi = nsp/4
  let qo = nsp-nsp/4
  //let velDelta = (highVel-lowVel)/(nsp-1);
  let velDelta = (midVel-lowVel)/(nsp-1);
  for (let i=0;i<nsp;i++) {
   // let ifm = midi-Math.abs(i-midi);
    let ifm = midi-Math.min(Math.abs(i-qo),Math.abs(i-qi));
    this.addSweepPath({name:'x'+i,min:minval,max:maxval,vel:lowVel+ifm*velDelta,bounce:0,down:0,sinusoidal:0,initVal:0});
    //this.addSweepPath({name:'x'+i,min:minval,max:maxval,vel:lowVel+i*velDelta,bounce:0,down:0,sinusoidal:0,initVal:0});
  }
  //this.addSweepPath({name:'x',min:minval,max:maxval,vel,bounce:0,down:0,sinusoidal:0,initVal:0});
  //this.addSweepPath({name:'y',min:minval,max:maxval,vel,bounce:1,down:1,sinusoidal:1,initVal:maxval});
 
}
rs.updateState = function () {
  let {numSpinners:nsp,shapesPerSpinner:sps} = this;

  let {pstate} = this;
  let {cstate,pspace} = pstate;
  for (let i=0;i<nsp;i++) {
    let valx = cstate['x'+i].value;
    let sp = this['spinner'+i];
    this.spinTo(sp,valx);
  }
  return;
  console.log('valx',sps*(valx/(2*Math.PI)));
  this.spinSpinners(nsp,valx);
  //console.log('valcx',valcx,'valcy',valcy);
}



export {rs};
