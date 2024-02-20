import {rs as linePP} from '/shape/line.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';

import {rs as basicP} from '/generators/basics.mjs';
import {rs as addWordleMethods} from '/mlib/wordle.mjs';

let rs = basicP.instantiate();


addWordleMethods(rs);

rs.setName('mutate');
let ht=50;


let topParams = {width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:-0.1*ht,frameStroke:'white',frameStrokeWidth:.2,
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
    
    let ul = lines[0];
    e0 = Point.mk(left,top);
    e1 = Point.mk(-hsep,top);
    ul.setEnds(e0,e1);
    ul.update();
    
    let ur = lines[1];
    e0 = Point.mk(hsep,top);
    e1 = Point.mk(right,top);
    ur.setEnds(e0,e1);
    ur.update();
     
    let ml = lines[2];
    e0 = Point.mk(left,0);
    e1 = Point.mk(-hsep,0);
    ml.setEnds(e0,e1);
    ml.update();
    
    let mr = lines[3];
    e0 = Point.mk(hsep,0);
    e1 = Point.mk(right,0);
    mr.setEnds(e0,e1);
    mr.update(); 
    
    let ll = lines[4];
    e0 = Point.mk(left,bot);
    e1 = Point.mk(-hsep,bot);
    ll.setEnds(e0,e1);
    ll.update();
    
    let lr = lines[5];
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
    let ul = lines[0];
    let ule0 = Point.mk(left,top);
    let ule1 = Point.mk(left,-hsep);
    ul.setEnds(ule0,ule1);
    ul.update();
    let um = lines[1];
    let ume0 = Point.mk(0,top);
    let ume1 = Point.mk(0,-hsep);
    um.setEnds(ume0,ume1);
    um.update();
    let ur = lines[2];
    let ure0 = Point.mk(right,top);
    let ure1 = Point.mk(right,-hsep);
    ur.setEnds(ure0,ure1);
    ur.update();
    
    
    let ll = lines[3];
    let lle0 = Point.mk(left,hsep);
    let lle1 = Point.mk(left,bot);
    ll.setEnds(lle0,lle1);
    ul.update();
    let lm = lines[4];
    let lme0 = Point.mk(0,hsep);
    let lme1 = Point.mk(0,bot);
    lm.setEnds(lme0,lme1);
    lm.update();
    let lr = lines[5];
    let lre0 = Point.mk(right,hsep);
    let lre1 = Point.mk(right,bot);
    lr.setEnds(lre0,lre1);
    lr.update();
  }
}
  
  
rs.initialize = function () {
  debugger;   
  this.initProtos();
  let lines = this.set('lines',arrayShape.mk());
  this.addLines(12);
  let params0= {index:0,center:Point.mk(0,0),horizontal:0,lineLength:10,lineSep:2,lineDist:5};
  this.configureLines(params0);
  let params1= {index:6,center:Point.mk(0,0),horizontal:1,lineLength:10,lineSep:2,lineDist:5};
  this.configureLines(params0);
 
}


 
export {rs};



