import {rs as linePP} from '/shape/line.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

import {rs as basicP} from '/generators/basics.mjs';

let rs = basicP.instantiate();
addAnimationMethods(rs);


rs.setName('mutate');
let ht=25;


let topParams = {width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:.1*ht,frameStroke:'white',frameStrokeWidth:.2,
timePerStep:1/(16*32),stopTime:1,recordingMotion:1,saveAnimation:1,distanceThreshold:3,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:200,speed:1,segsPerCircle:20,radius:.4*ht,numSlices:8,bendRadius:1.5};

Object.assign(rs,topParams);




  
rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .1;
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

rs.configureLines = function (params) {
  let {index,center,horizontal:h,lineLength:ln,lineSep:sep,lineDist:d} = params;
  let {lines} = this;
  let line;
  const ust = (line) => {
    line['stroke_width'] = .1;
    line.update();
  }
  let hsep = 0.5*sep
  if (h) {
   let bot = d;
    let top = -bot;
    let right = hsep+ln;
    let left = -right;
    let e0,e1;
    
    let ul = lines[index+0];
    e0 = Point.mk(left,top);
    e1 = Point.mk(-hsep,top);
    ul.setEnds(e0,e1);
    ul.update();
    
    let ur = lines[index+1];
    e0 = Point.mk(hsep,top);
    e1 = Point.mk(right,top);
    ur.setEnds(e0,e1);
    ur.update();
     
    let ml = lines[index+2];
    e0 = Point.mk(left,0);
    e1 = Point.mk(-hsep,0);
    ml.setEnds(e0,e1);
    ml.update();
    
    let mr = lines[index+3];
    e0 = Point.mk(hsep,0);
    e1 = Point.mk(right,0);
    mr.setEnds(e0,e1);
    mr.update(); 
    
    let ll = lines[index+4];
    e0 = Point.mk(left,bot);
    e1 = Point.mk(-hsep,bot);
    ll.setEnds(e0,e1);
    ll.update();
    
    let lr = lines[index+5];
    e0 = Point.mk(hsep,bot);
    e1 = Point.mk(right,bot);
    lr.setEnds(e0,e1);
    lr.update();
    
    
  } else {
    let bot = hsep+ln;
    let top = -bot;
    let left = -d;
    let right = d;
    let e0,e1;
    
    let ul = lines[index+0];
    e0 = Point.mk(left,top);
    e1 = Point.mk(left,-hsep);
    ul.setEnds(e0,e1);
    ul.update();
    
    let um = lines[index+1];
    e0 = Point.mk(0,top);
    e1 = Point.mk(0,-hsep);
    um.setEnds(e0,e1);
    um.update();
    
    let ur = lines[index+2];
    e0 = Point.mk(right,top);
    e1 = Point.mk(right,-hsep);
    ur.setEnds(e0,e1);
    ur.update();
    
    
    let ll = lines[index+3];
    e0 = Point.mk(left,hsep);
    e1 = Point.mk(left,bot);
    ll.setEnds(e0,e1);
    ll.update();
    
    let lm = lines[index+4];
    e0 = Point.mk(0,hsep);
    e1 = Point.mk(0,bot);
    lm.setEnds(e0,e1);
    lm.update();
    
    let lr = lines[index+5];
    e0 = Point.mk(right,hsep);
    e1 = Point.mk(right,bot);
    lr.setEnds(e0,e1);
    lr.update();
  }
}

rs.clines =  function (n0,n1,fr) {
  let {paramsv,paramsh} = this;
  let paramsvi = this.interpolate(paramsv[n0],paramsv[n1],fr);
  let paramshi = this.interpolate(paramsh[n0],paramsh[n1],fr);
  paramsvi.index=0;
  paramshi.index=6;
  this.configureLines(paramsvi);
  this.configureLines(paramshi);
  }

rs.initialize = function () {
  debugger; 
  let numSteps = this.numSteps = 128;
  this.pauseSteps = numSteps/2;
  this.initProtos();
  this.addFrame();
  let lines = this.set('lines',arrayShape.mk());
  this.addLines(12);
  let paramsv = this.paramsv=[];
  let paramsh = this.paramsh=[];
  //0
  paramsv.push({index:0,center:Point.mk(0,0),horizontal:0,lineLength:10,lineSep:2,lineDist:5});;
  paramsh.push({index:6,center:Point.mk(0,0),horizontal:1,lineLength:10,lineSep:0,lineDist:12});
  
  paramsv.push({index:0,center:Point.mk(0,0),horizontal:0,lineLength:10,lineSep:0,lineDist:12});
  paramsh.push({index:6,center:Point.mk(0,0),horizontal:1,lineLength:8,lineSep:4,lineDist:12});
  
  paramsv.push({index:0,center:Point.mk(0,0),horizontal:0,lineLength:10,lineSep:0,lineDist:12});
 // paramsh.push({index:6,center:Point.mk(0,0),horizontal:1,lineLength:8,lineSep:4,lineDist:6});
  paramsh.push({index:6,center:Point.mk(0,0),horizontal:1,lineLength:10,lineSep:2,lineDist:5});
  this.clines(0,1,0);

}

rs.updateState = function () {
  let {numSteps,stepsSoFar:ssf,pauseSteps:ps} = this;
  debugger;
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
    return (iv[0]<v) && (v <= iv[1]);
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
      this.clines(0,1,2*fr);
    } else {
      this.clines(1,2,2*(fr-0.5));
    }    
  }
  if (inInterval(ssf,iv3)) {
    let fr = fractionThruInterval(ssf,iv3);
    if (fr <0.5) {
      this.clines(2,1,2*fr);
    } else {
      this.clines(1,0,2*(fr-0.5));
    }    
   
  }
}
/*
  if  ((ssf>(hups+hps))&& (ssf < (ups + hps))) {
    return;
  }    
  if (fr<0.25) {
    
    this.clines(0,1,fr*4);
  } else if (fr<.5) {
    this.clines(1,2,(fr-0.25)*4);
  } else if (fr<0.75) {
    this.clines(2,1,(fr-0.5)*4);
  } else  {
    this.clines(1,0,(fr-0.75)*4);
  }
}
  
*/

 
export {rs};



