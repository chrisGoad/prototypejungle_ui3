import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/circleDropsS.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);
addDropMethods(rs);

rs.setName('interpolate_colors_0');
let ht= 100;
let nr = 100;
 nr = 40	;

let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,framePadding:0.01*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,
numSteps:2000,chopOffBeginningg:218,stepInterval:50,ULC:[250,0,0],URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0],period:20,xgapf:.1,ygapf:.1};//50
//numSteps:295,chopOffBeginning:218,stepInterval:50,ULC:rs.randomFill('ran','ran','ran',100,250),URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0]};//50

Object.assign(rs,topParams);

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .5;
}


rs.generateLines = function () {
  debugger;
  let lines = this.set('lines',arrayShape.mk());
  let sizeFs = this.set('sizeFs',arrayShape.mk());
  let {numRows:nr,numCols:nc,lineP} = this;
  let nl = nr*nc
  for (let i=0;i<nl;i++) {
    let line = lineP.instantiate();
    line.setEnds(Point.mk(-10,0),Point.mk(10,0));
    lines.push(line);
    sizeFs.push(.1);
    line.show();
    line.update();
  }
}

rs.adjustLines = function () {
  debugger;
  let {lines,sizeFs,numRows:nr,numCols:nc,width:wd,height:ht,lineP,xgapf,ygapf} = this;
  let lln = wd/nc;
  let yspacing = ht/nr;
  let xspacing = wd/nc;
  let cy= -ht/2;
 
  let cnt = 0;
  for (let j=0;j<nr;j++) {
    let centerY = cy+0.5*yspacing;
    let cx = -wd/2;
    for (let i=0;i<nc;i++) {
      let line = lines[cnt];
      let sizeF = sizeFs[cnt];
      let xgap = sizeF*xspacing;//0.001*wd;
      let hxgap = 0.5*xgap;
      let ygap = sizeF*yspacing;//0.001*wd;
      let sw = yspacing-ygap;
      cnt++;
      line['stroke-width'] = sw;
      lines.push(line);
      line.setEnds(Point.mk(cx+hxgap,centerY),Point.mk(cx+lln-hxgap,centerY));
      line.show();
      line.update();
      cx = cx+lln;
    }
    cy = cy +yspacing;
  }
}


rs.interpolate = function (lb,ub,fr) {
  let delta = ub-lb;
  let v = lb+fr*delta;
  return v;
}

rs.interpolateArrays = function(a0,a1,fr) {
  let ln = a0.length; //a1 must have the same length
  let ar = [];
  for (let i=0;i<ln;i++) {
    let a0e = a0[i];
    let a1e = a1[i];
    let v = this.interpolate(a0e,a1e,fr);
    ar.push(v);
  }
  return ar;
}

rs.gridMember = function (i,j) {
  let {lines,numRows:nr,numCols:nc} = this;
  let index = i+j*nc;
  let line = lines[index]
  return line;
}
rs.randomArrayOfArrays = function (outerLength,innerLength,lb,ub) {
  let oa = []
  for (let i=0;i<outerLength;i++) {
    let ia = this.randomArray(lb,ub,innerLength);
    oa.push(ia);
  }
  return oa;
}
   
rs.paintGrid = function () {
 // debugger;
  let {sizeFs,numRows:nr,numCols:nc,ULC,URC,LLC,LRC} = this;
  let UL = this.gridMember(0,0);
  let UR = this.gridMember(nc-1,0);
  let LL = this.gridMember(0,nr-1);
  let LR = this.gridMember(nc-1,nr-1);
  let leftArrays = [];
  let rightArrays = [];
  for (let j=0;j<nc;j++){
    let fr = j/(nc-1);
    let aleft = this.interpolateArrays(ULC,LLC,fr);
    debugger;
    leftArrays.push(aleft);
    let aright = this.interpolateArrays(URC,LRC,fr);
    rightArrays.push(aright);
    /*let rgbLeft = this.arrayToRGB(aleft);
    let rgbRight = this.arrayToRGB(aright);
    let lineLeft = this.gridMember(0,j);
    let lineRight = this.gridMember(nc-1,j);
    lineLeft.stroke =rgbLeft;
    lineLeft.update();
    lineRight.stroke =rgbRight;
    lineRight.update();*/
  }
  let cnt=0;
  for (let j=0;j<nr;j++) {
    let aleft = leftArrays[j];
    let aright = rightArrays[j];
    for (let i=0;i<nc;i++) {
      let fr = i/(nc-1);
      let a = this.interpolateArrays(aleft,aright,fr);
      let mins =.03
    //  sizeFs[cnt] =1- (mins + (1-mins)*(a[3]/260));
      cnt++;
      let line = this.gridMember(i,j);
      line.stroke = this.arrayToRGB(a);
      //line.stroke = 'white';
      line.update();
    }
  }
}

rs.initialize = function () {
  debugger;
  let {period} = this;
  this.initProtos();
  this.addFrame();
  this.generateLines();
 // this.adjustLines();
  /*let ULC =this.ULC=this.randomArray(['ran','ran','ran'],10,250);
  let URC = this.URC=this.randomArray(['ran','ran','ran'],10,250);
  let LLC =this.LLC=this.randomArray(['ran','ran','ran'],10,250);
  let LRC =this.LRC=this.randomArray(['ran','ran','ran'],10,250);
 
   let ULC =this.ULC=this.randomArray(10,250,3);
  let URC = this.URC=this.randomArray(10,250,3);
  let LLC =this.LLC=this.randomArray(10,250,3);
  let LRC =this.LRC=this.randomArray(10,250,3);*/
  this.ULp = period;
  this.URp = period;
  this.LLp = period;
  this.LRp = period;
  let ULCA = this.ULCA = this.randomArrayOfArrays(4,4,0,250);
  this.URCA = this.randomArrayOfArrays(5,4,0,250);
  this.LLCA = this.randomArrayOfArrays(6,4,0,250);
  this.LRCA = this.randomArrayOfArrays(4,4,0,250);
 
  debugger;
  this.updateState();
 // this.paintGrid();
}



rs.colorNow = function (period,colorA) { // period = steps between colors; colorA = color array
  let {stepsSoFar:ssf} = this;
  let len = colorA.length;
  let cycleNum = Math.floor(ssf/period);
  let cnum0 = cycleNum%len;
  let fr = (ssf - cycleNum*period)/period;
  let cnum1 = (cnum0+1)% len;
  let c0 = colorA[cnum0];
  let c1 = colorA[cnum1];
  let c = this.interpolateArrays(c0,c1,fr);
  console.log('ssf',ssf,'cnum0',cnum0,'cnum1',cnum1,'fr',fr);
  if (fr > 1) {
    debugger;
  }
  return c;
}
rs.updateState = function () {
  let {stepsSoFar:ssf,ULCA,URCA,LLCA,LRCA,ULp,URp,LLp,LRp} = this;
  //debugger;
  let ULCN = this.colorNow(ULp,ULCA);
  let URCN = this.colorNow(URp,URCA);
  let LLCN = this.colorNow(LLp,LLCA);
  let LRCN = this.colorNow(LRp,LRCA);
  let ULC = this.ULC = ULCN;
  let URC = this.URC = URCN;
  let LLC = this.LLC = LLCN;
  let LRC = this.LRC = LRCN;
  console.log('ULC',ULC,'URC',URC,'LLC',LLC,'LRC',LRC);
  this.paintGrid();
  debugger;
  this.adjustLines();
}

  
 


export {rs};



