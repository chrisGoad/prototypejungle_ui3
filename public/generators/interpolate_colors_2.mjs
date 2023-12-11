import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/circleDropsS.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);
addDropMethods(rs);

let ht= 100;
let nr = 101;
//nr = 5	;
 let color0 = [250,250,10];
      let color1 = [238,105,65];
      let color2 = [10,10,250];
      let color3 = [10,10,10];

let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,framePadding:0.01*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,oneShot:1,
numSteps:2000,chopOffBeginningg:218,stepInterval:50,ULC:[250,0,0],URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0],period:20,xgapf:.1,ygapf:.1};//50
//numSteps:295,chopOffBeginning:218,stepInterval:50,ULC:rs.randomFill('ran','ran','ran',100,250),URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0]};//50

Object.assign(rs,topParams);


rs.generateLines = function () {
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
      let xgap = xgapf*xspacing;//0.001*wd;
      let hxgap = 0.5*xgap;
      let ygap = ygapf*yspacing;//0.001*wd;
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
rs.colorEntry = function (nm,ca)  {
  let st = `${nm}:[${ca[0]},${ca[1]},${ca[2]}]`;
  return st;
}

rs.colorEntries = function(ULC,URC,LLC,LRC,CNC) {
  let st = '{';
  st+=this.colorEntry('ULC',ULC);
  st+=',';
  st+=this.colorEntry('URC',URC);
  st+=',';
  st+=this.colorEntry('LLC',LLC);
  st+=',';
  st+=this.colorEntry('LRC',LRC);
  if (CNC) {
    st+=','
    st+=this.colorEntry('CNC',CNC);
  }
  st+='}';

  return st;
}

rs.printColors = function (ULC,URC,LLC,LRC,CNC) {
  console.log(this.colorEntries(ULC,URC,LLC,LRC,CNC));
}

rs.paintCenteredGrid = function () {
 debugger;
  let {sizeFs,numRows:nr,numCols:nc,ULC,URC,LLC,LRC,CNC} = this;
  this.printColors(ULC,URC,LLC,LRC,CNC);
  
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
  
  let TOPC = this.interpolateArrays(ULC,URC,0.5);
  let BOTC = this.interpolateArrays(LLC,LRC,0.5);
  
  for (let j=0;j<=cx;j++){
    let uj = j+cx;
    let fr = j/(nc-1);
    let frm = j/cx;
    let lfr=uj/(nc-1)
    
    let auleft = this.interpolateArrays(ULC,LLC,fr);
    ULArrays.push(auleft);
    let alleft = this.interpolateArrays(ULC,LLC,lfr);
    LLArrays.push(alleft);
    
    let aucenter = this.interpolateArrays(TOPC,CNC,frm);
    UCNArrays.push(aucenter);
    let alcenter = this.interpolateArrays(CNC,BOTC,frm);
    LCNArrays.push(alcenter);
    
    let auright = this.interpolateArrays(URC,LRC,fr);
    URArrays.push(auright);
    let alright = this.interpolateArrays(URC,LRC,lfr);
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
      let aul = this.interpolateArrays(auleft,aucenter,fr);
      let aur = this.interpolateArrays(aucenter,auright,fr);
      let all = this.interpolateArrays(alleft,alcenter,fr);
      let alr = this.interpolateArrays(alcenter,alright,fr);
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



rs.paintSubgrid = function (params) {
  let {lowX,highX,lowY,highY,ULC,URC,LLC,LRC} = params;
  console.log('____________');
  this.printColors(ULC,URC,LLC,LRC);
  let UL = this.gridMember(lowX,lowY);
  let UR = this.gridMember(highX,lowY);
  let LL = this.gridMember(lowX,highY);
  let LR = this.gridMember(highY,highY);
  let LArrays= [];
  let RArrays= [];
  
  
  for (let j=lowY;j<=highY;j++){
    let fr = (j-lowY)/(1+highY-lowY);
   // console.log('fr',fr);
    
    let left = this.interpolateArrays(ULC,LLC,fr);
    LArrays.push(left);
    
    let right = this.interpolateArrays(URC,LRC,fr);
    RArrays.push(right);
  }
  let cnt=0;
  for (let j=lowY;j<=highY;j++) {
    let left = LArrays[j-lowY];
    let right = RArrays[j-lowY];
   
    for (let i=lowX;i<=highX;i++) {
      let fr = (i-lowX)/(1+highX-lowX);
      let c = this.interpolateArrays(left,right,fr);
    
      let line = this.gridMember(i,j);
      line.stroke = this.arrayToRGB(c);
      line.update();
    }
  }
}

rs.paintGrid = function () {
  let {numRows:nr,numCols:nc,ULC,URC,LLC,LRC} = this;
  let lowX = 0;
  let lowY = 0;
  let highX = nc-1;
  let highY = nr-1;
  let params = {lowX,lowY,highX,highY,ULC,URC,LLC,LRC};
  this.paintSubgrid(params);
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


  
 


export {rs};



