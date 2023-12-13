import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/circleDropsS.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);
addDropMethods(rs);

rs.setName('interpolate_colors_1');
let ht= 100;
let nr = 101;
//nr = 5	;

let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,framePadding:0.01*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,oneShot:1,
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

rs.interpolate = function(a0,a1,fr) {
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
 debugger;
  let {sizeFs,numRows:nr,numCols:nc,ULC,URC,LLC,LRC,CNC} = this;
  let cx = (nc-1)/2;
  let cy = (nr-1)/2
  let UL = this.gridMember(0,0);
  let UR = this.gridMember(nc-1,0);
  let CN = this.gridMember(cx,cy);
  let LL = this.gridMember(0,nr-1);
  let LR = this.gridMember(nc-1,nr-1);
  let ULArrays= [];
  let UCNArrays= [];
  let URArrays= [];
  
  let LLArrays= [];
  let LCNArrays= [];
  let LRArrays= [];
  
  let TOPC = this.interpolate(ULC,URC,0.5);
  let BOTC = this.interpolate(LLC,LRC,0.5);
  
  for (let j=0;j<=cx;j++){
    let uj = j+cx;
    let fr = j/(nc-1);
    let frm = j/cx;
    let lfr=uj/(nc-1)
    
    let auleft = this.interpolate(ULC,LLC,fr);
    ULArrays.push(auleft);
    let alleft = this.interpolate(ULC,LLC,lfr);
    LLArrays.push(alleft);
    
    let aucenter = this.interpolate(TOPC,CNC,frm);
    UCNArrays.push(aucenter);
    let alcenter = this.interpolate(CNC,BOTC,frm);
    LCNArrays.push(alcenter);
    
    let auright = this.interpolate(URC,LRC,fr);
    URArrays.push(auright);
    let alright = this.interpolate(URC,LRC,lfr);
    LRArrays.push(alright);
  }
  let cnt=0;
  for (let j=0;j<=cx;j++) {
    let auleft = ULArrays[j];
    let aucenter = UCNArrays[j];
    let auright = URArrays[j];
    let alleft = LLArrays[j];
    let alcenter = LCNArrays[j];
    let alright = LRArrays[j];

    for (let i=0;i<=cx;i++) {
      let fr = i/cx;
      let aul = this.interpolate(auleft,aucenter,fr);
      let aur = this.interpolate(aucenter,auright,fr);
      let all = this.interpolate(alleft,alcenter,fr);
      let alr = this.interpolate(alcenter,alright,fr);
      let mins =.03
    //  sizeFs[cnt] =1- (mins + (1-mins)*(a[3]/260));
      cnt++;
      let ULline = this.gridMember(i,j);
      let URline = this.gridMember(i+cx,j);
      let LLline = this.gridMember(i,j+cx);
      let LRline = this.gridMember(i+cx,j+cx);
      ULline.stroke = this.arrayToRGB(aul);
      URline.stroke = this.arrayToRGB(aur);
      LLline.stroke = this.arrayToRGB(all);
      LRline.stroke = this.arrayToRGB(alr);
      //line.stroke = 'white';
      ULline.update();
      URline.update();
      LLline.update();
      LRline.update();
    }
  }
}

rs.initialize = function () {
  debugger;
  let {period,oneShot,randomColors} = this;
  this.initProtos();
  this.addFrame();
  this.generateLines();
  if (oneShot) {
    this.adjustLines();
    let ULC,URC,LLC,LRC,CNC;
    if (randomColors) {
      ULC =this.ULC=this.randomArray(['ran','ran','ran'],10,250);
      URC = this.URC=this.randomArray(['ran','ran','ran'],10,250);
      LLC =this.LLC=this.randomArray(['ran','ran','ran'],10,250);
      LRC =this.LRC=this.randomArray(['ran','ran','ran'],10,250);
      CNC =this.CNC=this.randomArray(['ran','ran','ran'],10,250);
    } else {
      let color0 = [250,250,10];
      let color1 = [238,105,65];
      let color2 = [10,10,250];
      let color3 = [10,10,10];
      ULC =this.ULC=color0;
      URC = this.URC=color1;
      LLC =this.LLC=URC;
      LRC =this.LRC =ULC;
      CNC =this.CNC =color3;
    }
    this.paintGrid();
  } else {
    let ULCA,URCA,LLCA,LRCA;
    this.ULp = period;
    this.URp = period;
    this.LLp = period;
    this.LRp = period;
    if (randomColors) {
      this.ULCA = this.randomArrayOfArrays(4,4,0,250);
      this.URCA = this.randomArrayOfArrays(5,4,0,250);
      this.LLCA = this.randomArrayOfArrays(6,4,0,250);
      this.LRCA = this.randomArrayOfArrays(4,4,0,250);
    } else {
      let color1 = [238,105,65];
      let color2 = [10,10,10];
      let color3 = [10,10,250];
      this.ULCA = [color1,color2,color3,color3]
      this.URCA = [color2,color1,color2];  
      this.LLCA = [color2,color1,color2];
      this.LRCA = [color1,color2,color3,color3];
    }
    this.updateState();
  }
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
  let c = this.interpolate(c0,c1,fr);
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



