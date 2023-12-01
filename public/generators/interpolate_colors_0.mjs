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
 //nr = 10	;

let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,framePadding:0.01*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,
numSteps:295,chopOffBeginning:218,stepInterval:50,ULC:[250,0,0],URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0]};//50
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
  let {numRows:nr,numCols:nc,width:wd,height:ht,lineP} = this;
  let lln = wd/nc;
  let yspacing = ht/nr;
  let cy= -ht/2;
  let xgap = 0;//0.001*wd;
  let hxgap = 0.5*xgap;
  let ygap = 0;//0.001*wd;
  let sw = yspacing-ygap;
  for (let j=0;j<nr;j++) {
    let centerY = cy+0.5*yspacing;
    let cx = -wd/2;
    for (let i=0;i<nc;i++) {
      let line = lineP.instantiate();
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
rs.paintGrid = function () {
  debugger;
  let {numRows:nr,numCols:nc,ULC,URC,LLC,LRC} = this;
  let UL = this.gridMember(0,0);
  let UR = this.gridMember(nc-1,0);
  let LL = this.gridMember(0,nr-1);
  let LR = this.gridMember(nc-1,nr-1);
  let leftArrays = [];
  let rightArrays = [];
  for (let j=0;j<nc;j++){
    let fr = j/(nc-1);
    let aleft = this.interpolateArrays(ULC,LLC,fr);
    leftArrays.push(aleft);
    let aright = this.interpolateArrays(URC,LRC,fr);
    rightArrays.push(aright);
    let rgbLeft = this.arrayToRGB(aleft);
    let rgbRight = this.arrayToRGB(aright);
    let lineLeft = this.gridMember(0,j);
    let lineRight = this.gridMember(nc-1,j);
    lineLeft.stroke =rgbLeft;
    lineLeft.update();
    lineRight.stroke =rgbRight;
    lineRight.update();
  }
  for (let j=0;j<nr;j++) {
    let aleft = leftArrays[j];
    let aright = rightArrays[j];
    for (let i=0;i<nc;i++) {
      let fr = i/(nc-1);
      let a = this.interpolateArrays(aleft,aright,fr);
      let line = this.gridMember(i,j);
      line.stroke = this.arrayToRGB(a);
      line.update();
    }
  }
}

rs.initialize = function () {
  debugger;
  this.initProtos();
  this.addFrame();
  this.generateLines();
  let ULC =this.ULC=this.randomArray(['ran','ran','ran'],10,250);
  let URC = this.URC=this.randomArray(['ran','ran','ran'],10,250);
  let LLC =this.LLC=this.randomArray(['ran','ran','ran'],10,250);
  let LRC =this.LRC=this.randomArray(['ran','ran','ran'],10,250);
  console.log('ULC',ULC,'URC',URC,'LLC',LLC,'LRC',LRC);
  this.paintGrid();
}



//rs.cycleDat = function (period,plen) {
//  let {stepsSoFar:
rs.updateState = function () {
  let {stepsSoFar:ssf,ULCA,URCA,LLCA,LRCA,period,ULp,URp,LLp,LRp} = this;
  let ULln = ULCA.length;
  let URln = ULCA.length;
  let LLln = ULCA.length;
  let LRln = ULCA.length;
  
 
}

export {rs};



