import {rs as linePP} from '/shape/line.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

import {rs as basicP} from '/generators/basics.mjs';

let rs = basicP.instantiate();
addAnimationMethods(rs);


rs.setName('mutate');
let ht=25;
ht=100;;
let nr = 16;
//nr=8;
let topParams = {numRows:nr,numCols:nr,width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:.1*ht,frameStroke:'white',frameStrokeWidth:.2,
timePerStep:1/(16*32),stopTime:1,recordingMotion:1,saveAnimation:1,distanceThreshold:3,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:200,speed:1,segsPerCircle:20,radius:.4*ht,numSlices:8,bendRadius:1.5};

Object.assign(rs,topParams);




  
rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .4; 
}

rs.addLines = function (n) {
  let {lines,lineP} = this;
  let ln = lines.length;
  for (let i=0;i<n;i++) {
    let line =lineP.instantiate();
    lines.push(line);
  }
  return ln;
}

rs.addLinesForGrid = function (n) {
  let {numRows:nr,numCols:nc} = this;
  for (let i=0;i<nr;i++) {
    for (let j=0;j<nc;j++){
      this.addLines(n);
    }
  }
}

rs.gridCellCenter = function (i,j) {
  let {width:wd,height:ht,numRows:nr,numCols:nc} = this;
  let deltaX = wd/nr;
  let deltaY = ht/nc;
  let minX = deltaX/2-wd/2;
  let minY = deltaY/2-ht/2;
  let y = minX+i*deltaX;
  let x = minY+j*deltaY;
  let c = Point.mk(x,y);
  return c;
}

rs.gridCellIndex = function (i,j) {
  let {numRows:nr,numCols:nc} = this;
  let idx = i*nc+j;
  return idx;
}

//The params arra (paramsA) is of length 6 and contains initial params h and v, middle params h and v, final params h and v
rs.adjustParamsAforGridCell = function (i,j,paramsA) {
  let c = this.gridCellCenter(i,j);
  let idx = this.gridCellIndex(i,j)*12;
  paramsA.forEach((pa) => {
    pa.center = c;
    pa.index = idx;
  });
  return paramsA;
}

// each
rs.buildParamsAforGrid = function (paramsAtemplate) {
  let {numRows:nr,numCols:nc} = this;
  let pln = paramsAtemplate.length;
  let gpa = this.gridParamsArrays = [];
  for (let i=0;i<nc;i++) {
    for (let j=0;j<nr;j++) {
      let paramsA = [];
      for (let k=0;k<pln;k++) {
        let params = paramsAtemplate[k];
        let nparams = {};
        Object.assign(nparams,params);
        paramsA.push(nparams);
      }
      this.adjustParamsAforGridCell(i,j,paramsA)
      gpa.push(paramsA);
    }
  }
  return gpa;
}

rs.paramsAselect = function (paramsA,k) {
  if (k==='initial') {
    return [paramsA[0],paramsA[1]];
  }
  if (k==='middle') {
    return [paramsA[2],paramsA[3]];
  }
  if (k==='final') {
    return [paramsA[4],paramsA[5]];
  }
}

  
  
  

rs.configureLinesH = function (params) {
  let {index,center,lineLengthH:ln,lineSepH:sep,lineDistH:d} = params;
  //console.log('H index',index,'center',JSON.stringify(center));
   debugger;
  let {lines} = this;
  let hsep = 0.5*sep
  let bot = d;
  let top = -bot;
  let right = hsep+ln;
  let left = -right;
  let e0,e1;
  let ul = lines[index+0];
  e0 = Point.mk(left,top).plus(center);
  e1 = Point.mk(-hsep,top).plus(center);
  ul.setEnds(e0,e1);
  ul.update();
  
  let ur = lines[index+1];
  e0 = Point.mk(hsep,top).plus(center);
  e1 = Point.mk(right,top).plus(center);
  ur.setEnds(e0,e1);
  ur.update();
   
  let ml = lines[index+2];
  e0 = Point.mk(left,0).plus(center);
  e1 = Point.mk(-hsep,0).plus(center);
  ml.setEnds(e0,e1);
  ml.update();
  
  let mr = lines[index+3];
  e0 = Point.mk(hsep,0).plus(center);
  e1 = Point.mk(right,0).plus(center);
  mr.setEnds(e0,e1);
  mr.update(); 
  
  let ll = lines[index+4];
  e0 = Point.mk(left,bot).plus(center);
  e1 = Point.mk(-hsep,bot).plus(center);
  ll.setEnds(e0,e1);
  ll.update();
  
  let lr = lines[index+5];
  e0 = Point.mk(hsep,bot).plus(center);
  e1 = Point.mk(right,bot).plus(center);
  lr.setEnds(e0,e1);
  lr.update();
}

rs.configureLinesV = function(params) {
  let {index:idx,center,lineLengthV:ln,lineSepV:sep,lineDistV:d} = params;
  let {lines} = this;
  let index = idx+6;
  //console.log('V index',index,'center',JSON.stringify(center));
  debugger;
  let hsep = 0.5*sep  
  let bot = hsep+ln;
  let top = -bot;
  let left = -d;
  let right = d;
  let e0,e1;
  
  let ul = lines[index+0];
  if (!ul) {
    debugger;
  }
  e0 = Point.mk(left,top).plus(center);
  e1 = Point.mk(left,-hsep).plus(center);
  ul.setEnds(e0,e1);
  ul.update();
  
  let um = lines[index+1];
  e0 = Point.mk(0,top).plus(center);
  e1 = Point.mk(0,-hsep).plus(center);
  um.setEnds(e0,e1);
  um.update();
  
  let ur = lines[index+2];
  e0 = Point.mk(right,top).plus(center);
  e1 = Point.mk(right,-hsep).plus(center);
  ur.setEnds(e0,e1);
  ur.update();
  
  
  let ll = lines[index+3];
  e0 = Point.mk(left,hsep).plus(center);
  e1 = Point.mk(left,bot).plus(center);
  ll.setEnds(e0,e1);
  ll.update();
  
  let lm = lines[index+4];
  e0 = Point.mk(0,hsep).plus(center);
  e1 = Point.mk(0,bot).plus(center);
  lm.setEnds(e0,e1);
  lm.update();
  
  let lr = lines[index+5];
  e0 = Point.mk(right,hsep).plus(center);
  e1 = Point.mk(right,bot).plus(center);
  lr.setEnds(e0,e1);
  lr.update();
}

rs.configureLines= function(params) {
  this.configureLinesH(params);
  this.configureLinesV(params);
}

rs.clines =  function (paramsA,fromKey,fr) {
  let fromParams = paramsA[fromKey];
  let toParams = paramsA[fromKey+1];
  let index  =  fromParams.index;
  let params = this.interpolate(fromParams,toParams,fr);
  params.index=index;
  this.configureLines(params);
}
/*
rs.clinesForGrid = function (fromKey,toKey,fr) {
  let {numRows:nr,numCols:nc,gridParamsArrays:gps} = this;
  for (let i=0;i<nr;i++) {
    for (let j=0;j<nc;j++) {
      let idx = this.gridCellIndex(i,j);
      let paramsA = gps[idx];
      this.clines(paramsA,fromKey,toKey,fr);
    }
  }
 }
*/
rs.speedFun = function (i,j,issf) {
  let {numSteps,stepsSoFar:ssf} = this;
  let mssf = Math.floor(.5+(i+j)/nr)*ssf%numSteps;
  return mssf;
}
rs.speedFun = function (i,j,issf) {
  let {numSteps,stepsSoFar:ssf} = this;
  let mssf = (issf+i+j)%numSteps;
  return mssf;
}

rs.setCellState = function (i,j) {
  let {gridParamsArrays:gpa,numSteps,stepsSoFar:issf,pauseSteps:ps,numRows:nr} = this;
  debugger;
  let oi = (i)%2;
  oi = (i)>8;
 // let ssf = oi?issf:(issf+64)%numSteps;
  let cycleSteps = numSteps;
  //let ssf = (issf+i+j)%numSteps;
  //let ssf = (oi?Math.floor(issf*.5):issf)%numSteps;
 // let ssf = Math.floor(.5+(i+j)/nr)*issf%numSteps;
  let ssf = this.speedFun(i,j);
   if ((j===0)&&(i<2)) {
    console.log('oi',oi,'issf',issf,'ssf',ssf);
    debugger;
  }
   let idx = this.gridCellIndex(i,j);
  let paramsA = gpa[idx];
  let pln = paramsA.length;
  let stepLn = numSteps/(pln-1);
  const inInterval = (v,n) => {
    return (n*stepLn<=v) && (v <= (n+1)*stepLn);
  }
   const fractionThruInterval = (v,n) => {
    return (v-n*stepLn)/stepLn;
  }
  let cyssf = ssf%cycleSteps;
  if (ssf === 10) {
    //this.paused = 1;
  }
 for (let n=0;n<pln;n++) {
    if (inInterval(ssf,n)) {
      let fr = fractionThruInterval(ssf,n); 
      console.log('ssf',ssf,'n',n,'stepLn',stepLn,'lb',n*stepLn,'ub',(n+1)*stepLn,'fr',fr);
      debugger;
      this.clines(paramsA,n,fr);
    }
  }   
}

rs.setCellStates = function () {
  let {numRows:nr,numCols:nc} = this;
  for (let i=0;i<nr;i++) {
    for (let j=0;j<nr;j++) {
      this.setCellState(i,j);
    }
  }
}

rs.initialize = function () {
  debugger; 
  let numSteps = this.numSteps = 128;
  this.pauseSteps = 0;//numSteps/8;
  this.initProtos();
  this.addFrame();
  let lines = this.set('lines',arrayShape.mk());
  //this.addLines(12);
  this.addLinesForGrid(12);
  let paramsA =this.paramsA =[];
  paramsA.push({index:0,center:Point.mk(0,0),lineLengthH:10,lineSepH:0,lineDistH:12,lineLengthV:10,lineSepV:2,lineDistV:5});
 
  paramsA.push({index:0,center:Point.mk(0,0),lineLengthH:8,lineSepH:4,lineDistH:12,lineLengthV:10,lineSepV:0,lineDistV:12});
  
 
  paramsA.push({index:0,center:Point.mk(0,0),lineLengthH:10,lineSepH:2,lineDistH:5,lineLengthV:10,lineSepV:0,lineDistV:12});
  
    paramsA.push({index:0,center:Point.mk(0,0),lineLengthH:8,lineSepH:4,lineDistH:12,lineLengthV:10,lineSepV:0,lineDistV:12});
  
  paramsA.push({index:0,center:Point.mk(0,0),lineLengthH:10,lineSepH:0,lineDistH:12,lineLengthV:10,lineSepV:2,lineDistV:5});

  this.buildParamsAforGrid(paramsA);
  
  //this.clines(paramsA,'initial','middle',0);
  this.setCellStates();
 //this.clinesForGrid('initial','middle',0);

}

rs.updateState = function () {
  this.setCellStates();
}


 
export {rs};



