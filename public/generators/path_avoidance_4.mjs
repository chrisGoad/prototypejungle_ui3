import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
//import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addPathMethods} from '/mlib/path.mjs';	

let rs = basicP.instantiate();
addPathMethods(rs);
debugger;
rs.setName('path_avoidance_4');
let ht = rs.ht= 100;
let d=0.5*ht;
let fade = 1;
let topParams = {width:rs.ht,height:rs.ht,framePadding:1*ht,frameStrokee:'white',frameStrokeWidth:1}

Object.assign(rs,topParams);
rs.numH = 2;

rs.ngaps = function (x) {
  let g0 = -x-2*d;
  let g1 = x;
  let g2 = -x;
  let g3 = x+ 2*d;
  return [g0,g1,g2,g3];
}

rs.pgaps = function (x) {
  let g0 = x-2*d;
  let g1 = -x;
  let g2 = x;
  let g3 = 2*d -x;
  return [g0,g1,g2,g3];
}

rs.zgaps = function () {
  let g0 = -2*d;
  let g1 = 0;
  let g2 = 2*d;
  return [g0,g1,g2];
}

rs.gap = 5;
rs.gap = 10;

rs.addLines = function (x) {
  debugger;
  let {gap,lineP,lines,lineData} = this;
  let tgap = 2*gap;
  let gaps;
  if  (x<0) {
    gaps = this.ngaps(x);
  } else if (x>0) {
    gaps = this.pgaps(x);
  } else {
    gaps = this.zgaps();
  }
  let [g0,g1,g2,g3,g4] = gaps;
  let L0e0 = Point.mk(x,-2*d);
  let L0e1 = Point.mk(x,g0-gap);
  let L1e0 = Point.mk(x,g0+gap);
  let L1e1 = Point.mk(x,g1-gap);
  let L2e0 = Point.mk(x,g1+gap);
  let L2e1 = Point.mk(x,g2-gap); 
 let L3e0 = Point.mk(x,g2+gap);
  let L3e1 = Point.mk(x,g3-gap); 
  let L4e0 = Point.mk(x,g3+gap);
  let L4e1 = Point.mk(x,2*d); 
  const addLine = (e0,e1) => {
    if (e0.distance(e1) > tgap) {
      let line = lineP.instantiate();
      line.setEnds(e0,e1);
      let lineDat = {line,e0,e1};
      lineData.push(lineDat);
      line.show();
      lines.push(line);
      line.update();

    } 
  }
  addLine(L0e0,L0e1);
  addLine(L1e0,L1e1);
  addLine(L2e0,L2e1);
  addLine(L3e0,L3e1);
  addLine(L4e0,L4e1);
}

rs.numV = 8; //on each side

rs.addAllLines = function () {
  let {numV} = this;
  let delta = d/numV;
  for (let i=0;i<numV;i++) {
    this.addLines(-i*delta);
  }
  for (let i=1;i<numV;i++) {
    this.addLines(i*delta);
  }
}

rs.adjustLine = function (ld,y) {
  let {line,e0,e1} = ld;
  let ae0y = y+e0.y;
  let ae1y = y+e1.y;
  if (ae0y >d)  {
    line.hide();
  } else if (ae1y < -d)  {
    line.hide();
  } else {
    ae1y = Math.min(ae1y,d);
    ae0y = Math.max(ae0y,-d);
    let ae0 = Point.mk(e0.x,ae0y);
    let ae1 = Point.mk(e1.x,ae1y);
    line.show();
    line.setEnds(ae0,ae1);
  }
  line.update();
}

rs.adjustLines = function (y) {
 // debugger;
  let {lineData} = this;
  lineData.forEach((ld) => {
   this.adjustLine(ld,y);
  });
}
 
   



  
 let initState = {time:0};
  let pspace = {};
rs.pstate = {pspace,cstate:initState}
let stepH = 1;
let stepV = 1;
let minH = -d;
let maxH = d;


rs.addHpaths = function () {
  debugger;
  let nm0 = 'h0';
  let nm1 = 'h1';
  pspace[nm0] ={kind:'sweep',step:stepH,min:minH,max:maxH,interval:1,once:0};
  initState[nm0] = {value:minH,y:0};
  pspace[nm1] ={kind:'sweep',step:stepH,min:minH,max:maxH,interval:1,once:0};
  initState[nm1] = {value:minH,y:0};
}



rs.updateStateOfH= function (n){
  //debugger;
  let {stepsSoFar:ssf} = this;
  let nm = 'h'+n;
    let stt = Math.floor(1.0*(ht/stepH));
  let {hTravelers,pstate} = this;
  let {pspace,cstate} = pstate;
  let cs = cstate[nm];
  let {value:iv,done,y} = cs;
 // let v = (n===0)?iv: -5-iv;
  let v = (n===0)?iv: -iv;
  let pos = Point.mk(v,y);
  let tr = hTravelers[n];
  /*if (((ssf>stt)&&(n===0))||((ssf <= stt)&&(n===1))) {
    tr.hide();
  } else {*/
    tr.show();
    tr.moveto(pos);
  //}
  tr.update();
}
let vStep=5;
rs.interpolateThru = function (fr,indist,inpnt) {
  let efr;
  if (fr < indist) {
     efr = (fr/indist)*inpnt;
  } else {
    efr = inpnt +(fr-indist)/(1-indist)*(1-inpnt);
  } 
  console.log('efr',efr);
  return efr;
}
rs.frFunctionD = function (fr) {
  let efr = this.interpolateThru(fr,0.7,0.2);
  return 1 - efr;
 /* let inpnt = 0.2;
  let indist = 0.7;
  let efr;
  if (fr < indist) {
     efr = (fr/indist)*inpnt;
  } else {
    efr = inpnt +(fr-indist)/(1-indist)*(1-inpnt);
  } console.log('efr',efr);
  return 1-efr;*/
}
rs.frFunctionU = function (fr) {
  let efr = this.interpolateThru(fr,0.4,0.3)
  return efr;
 /* let inpnt = 0.2;
  let indist = 0.7;
  let efr;
  if (fr < indist) {
     efr = (fr/indist)*inpnt;
  } else {
    efr = inpnt +(fr-indist)/(1-indist)*(1-inpnt);
  } console.log('efrU',efr);*/
  return efr;
}
rs.updateState = function () {
  //debugger;
  let {stepsSoFar:ssf,numSteps,cycleTime,lines} = this;
  console.log('ssf',ssf);
  if (ssf < 2*cycleTime) {
    this.adjustLines(stepV*ssf-2-d);
  }  else { 
    this.adjustLines(stepV*(ssf-2*cycleTime)-2-d);
  }
  this.updateStateOfH(0);
  this.updateStateOfH(1);
  if (fade) {
    if (ssf==2*cycleTime) {
      this.adjustLines(-2-d);
    }
    const colorLines = (fr) => {
      let v = Math.max(0,Math.floor(fr*255));
      let clr = `rgb(${v},${v},${v})`;
      lines.forEach( (L) => {
        L.stroke = clr;
        L.update();
      });
    }
    if (ssf<=cycleTime) {
//      let fr = (cycleTime - ssf)/cycleTime;
      let fr = ssf/cycleTime;
      colorLines(this.frFunctionD(fr));
    } else if (ssf>2*cycleTime) {
      debugger;
      let fr =(ssf-2*cycleTime)/cycleTime;
      colorLines(this.frFunctionU(fr));
    }
  

    
  }
}
  
  
rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  circleP.dimension =0.025*this.ht;
    let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = 2;
}  


rs.numSteps = 2.4*Math.floor(ht/stepH);
rs.numSteps = 2*Math.floor(ht/stepH);
let cycleTime = rs.cycleTime = Math.floor(ht/stepH); 
rs.numSteps = 2*cycleTime;
rs.numSteps = 3*cycleTime+2;
rs.chopOffBeginning =1;
rs.saveAnimation = 1;
rs.initialize = function () {
  debugger;
  let {numH,numV} = this;
 this.setBackgroundColor('black');

  this.initProtos();
  this.addFrame();
  let hTtravelers = this.set('hTravelers',arrayShape.mk());
  let lines = this.set('lines',arrayShape.mk());
  let lineData = this.lineData = [];
   let crc0 = this.circleP.instantiate();
   crc0.fill = 'blue';
   hTtravelers.push(crc0);
    let crc1 = this.circleP.instantiate();
   crc1.fill = 'blue';
   hTtravelers.push(crc1);
   this.addAllLines()
    this.adjustLines(-2-d);

  this.addHpaths();
  
}

export {rs};


