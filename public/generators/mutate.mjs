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
  let x = minX+i*deltaX;
  let y = minY+j*deltaY;
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
    let h =pa.horizontal;
    pa.center = c;
    pa.index = idx+(h?0:6);
  });
  return paramsA;
}

// each
rs.buildParamsAforGrid = function (paramsAtemplate) {
  let {numRows:nr,numCols:nc} = this;
  let gpa = this.gridParamsArrays = [];
  for (let i=0;i<nc;i++) {
    for (let j=0;j<nr;j++) {
      let paramsA = [];
      for (let k=0;k<6;k++) {
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

  
  
  

rs.configureLines = function (params) {
  let {index,center,horizontal:h,lineLength:ln,lineSep:sep,lineDist:d} = params;
  let {lines} = this;
  let line;
  let hsep = 0.5*sep
  if (h) {
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
    
    
  } else {
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
}

rs.clines =  function (n0,n1,fr) {
  let {paramsv,paramsh} = this;
  let paramshi = this.interpolate(paramsA[n0],paramsA[n1],fr);
  let paramsvi = this.interpolate(paramsv[n0],paramsv[n1],fr);

  paramsvi.index=0;
  paramshi.index=6;
  this.configureLines(paramsvi);
  this.configureLines(paramshi);
  }


rs.clines =  function (paramsA,fromKey,toKey,fr) {
  let fromParams = this.paramsAselect(paramsA,fromKey);
  let toParams = this.paramsAselect(paramsA,toKey);
  let indh  =  fromParams[0].index;
  let indv  =  fromParams[1].index;
  let paramshi = this.interpolate(fromParams[0],toParams[0],fr);
  let paramsvi = this.interpolate(fromParams[1],toParams[1],fr);

  paramshi.index=indh;
  paramsvi.index=indv;
  this.configureLines(paramsvi);
  this.configureLines(paramshi);
}

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

rs.setCellState = function (i,j) {
  let {gridParamsArrays:gpa,numSteps,stepsSoFar:issf,pauseSteps:ps} = this;
  let oi = (i)%2;
 // let ssf = oi?issf:(issf+64)%numSteps;
  let cycleSteps = numSteps;
  let ssf = (issf+i+j)%numSteps;
  let idx = this.gridCellIndex(i,j);
  let paramsA = gpa[idx];
  let cyssf = ssf%cycleSteps;
  if (ssf === 10) {
    //this.paused = 1;
  }
 // let ups = numSteps-ps;
  let ups = cycleSteps;
  let hups = ups/2;
  let hps = ps/2;
  let iv0 = [0,hps];//pause
  let iv1 = [hps,hps+hups]; 
  let iv2 = [hps+hups,ps+hups];//pause
  let iv3 = [ps+hups,ps+ups];
  const inInterval = (v,iv) => {
    return (iv[0]<=v) && (v <= iv[1]);
  }
   const fractionThruInterval = (v,iv) => {
    return (v-iv[0])/(iv[1]-iv[0]);
  }
 /* if (inInterval(ssf,iv0) || inInterval(ssf,iv2)) {
    return;
  }*/
  if (inInterval(cyssf,iv1)) {
    let fr = fractionThruInterval(cyssf,iv1);
    console.log('iv1','fr',fr);
    if (fr <0.5) {
      this.clines(paramsA,'initial','middle',2*fr);
    } else {
      this.clines(paramsA,'middle','final',2*(fr-0.5));
    }    
  }
  if (inInterval(ssf,iv3)) {
    let fr = fractionThruInterval(cyssf,iv3);
    if (fr <0.5) {
      this.clines(paramsA,'final','middle',2*fr);
    } else {
      this.clines(paramsA,'middle','initial',2*(fr-0.5));
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
   paramsA.push({index:6,center:Point.mk(0,0),horizontal:1,lineLength:10,lineSep:0,lineDist:12});
   paramsA.push({index:0,center:Point.mk(0,0),horizontal:0,lineLength:10,lineSep:2,lineDist:5});;
 
  paramsA.push({index:6,center:Point.mk(0,0),horizontal:1,lineLength:8,lineSep:4,lineDist:12});
  paramsA.push({index:0,center:Point.mk(0,0),horizontal:0,lineLength:10,lineSep:0,lineDist:12});
  
 
  paramsA.push({index:6,center:Point.mk(0,0),horizontal:1,lineLength:10,lineSep:2,lineDist:5}); 
  paramsA.push({index:0,center:Point.mk(0,0),horizontal:0,lineLength:10,lineSep:0,lineDist:12});
  this.buildParamsAforGrid(paramsA);
  /*
  let paramsv = this.paramsv=[];
  let paramsh = this.paramsh=[];
 
  paramsv.push({index:0,center:Point.mk(0,0),horizontal:0,lineLength:10,lineSep:2,lineDist:5});;
  paramsh.push({index:6,center:Point.mk(0,0),horizontal:1,lineLength:10,lineSep:0,lineDist:12});
  
  paramsv.push({index:0,center:Point.mk(0,0),horizontal:0,lineLength:10,lineSep:0,lineDist:12});
  paramsh.push({index:6,center:Point.mk(0,0),horizontal:1,lineLength:8,lineSep:4,lineDist:12});
  
  paramsv.push({index:0,center:Point.mk(0,0),horizontal:0,lineLength:10,lineSep:0,lineDist:12});
 // paramsh.push({index:6,center:Point.mk(0,0),horizontal:1,lineLength:8,lineSep:4,lineDist:6});
  paramsh.push({index:6,center:Point.mk(0,0),horizontal:1,lineLength:10,lineSep:2,lineDist:5});
  this.clines(0,1,0);*/
  //this.clines(paramsA,'initial','middle',0);
  this.setCellStates();
 //this.clinesForGrid('initial','middle',0);

}

rs.updateState = function () {
  this.setCellStates();
}

rs.updateStatee = function () {
  let {numSteps,stepsSoFar:ssf,pauseSteps:ps,paramsA} = this;
//  debugger;
  console.log('ssf',ssf);
  if (ssf === 10) {
    //this.paused = 1;
  }
  let ups = numSteps-ps;
  let hups = ups/2;
  let hps = ps/2;
  let iv0 = [0,hps];//pause
  let iv1 = [hps,hps+hups]; 
  let iv2 = [hps+hups,ps+hups];//pause
  let iv3 = [ps+hups,ps+ups];
  const inInterval = (v,iv) => {
    return (iv[0]<=v) && (v <= iv[1]);
  }
   const fractionThruInterval = (v,iv) => {
    return (v-iv[0])/(iv[1]-iv[0]);
  }
  if (inInterval(ssf,iv0) || inInterval(ssf,iv2)) {
    return;
  }
  if (inInterval(ssf,iv1)) {
    let fr = fractionThruInterval(ssf,iv1);
    console.log('iv1','fr',fr);
    if (fr <0.5) {
      //this.clines(0,1,2*fr);
      this.clines(paramsA,'initial','middle',2*fr);
      this.clinesForGrid('initial','middle',2*fr);
    } else {
     // this.clines(1,2,2*(fr-0.5));
      //this.clines(paramsA,'middle','final',2*(fr-0.5));
      this.clinesForGrid('middle','final',2*(fr-0.5));
    }    
  }
  if (inInterval(ssf,iv3)) {
    let fr = fractionThruInterval(ssf,iv3);
    if (fr <0.5) {
      //this.clines(2,1,2*fr);
     // this.clines(paramsA,'final','middle',2*fr);
      this.clinesForGrid('final','middle',2*fr);
    } else {
     // this.clines(1,0,2*(fr-0.5));
      //this.clines(paramsA,'middle','initial',2*(fr-0.5));
      this.clinesForGrid('middle','initial',2*(fr-0.5));
    }    
   
  }
}


 
export {rs};



