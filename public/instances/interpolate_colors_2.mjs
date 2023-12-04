
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/interpolate_colors_2.mjs'
let rs = generatorP.instantiate();


rs.setName('interpolate_colors_2');
let ht= 100;
let nr = 201;
let lowX = 75;
let highX = 125;
let lowY = 75;
let highY = 125;

let subParams = {lowX,lowY,highX,highY};
let colors=[[0,250,10],[238,105,65],[10,10,250],[10,10,10]];
let topParams = {subParams,width:ht,height:ht,numRows:nr,numCols:nr,randomColors:1,
                  framePadding:0.01*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,oneShot:1,
numSteps:2000,chopOffBeginningg:218,stepInterval:50,ULC:colors[0],URC:colors[1],LLC:colors[1],LRC:colors[0],CNC:colors[3],period:20,xgapf:.1,ygapf:.1};//50
//numSteps:295,chopOffBeginning:218,stepInterval:50,ULC:rs.randomFill('ran','ran','ran',100,250),URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0]};//50

Object.assign(rs,topParams);

rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .5;
}

   

rs.initialize = function () {
  debugger;
  let {period,oneShot,randomColors,colors,subParams} = this;
  this.initProtos();
  this.addFrame();
  this.generateLines();
  if (oneShot) {
    this.adjustLines();
    let ULC,URC,LLC,LRC,subULC,subURC,subLLC,subLRC;
    if (randomColors) {
      ULC =this.ULC=this.randomArray(10,250,['ran','ran','ran']);
      URC = this.URC=this.randomArray(10,250,['ran','ran','ran']);
      LLC =this.LLC=this.randomArray(10,250,['ran','ran','ran']);
      LRC =this.LRC=this.randomArray(10,250,['ran','ran','ran']);
      subULC =subParams.ULC=this.randomArray(10,250,['ran','ran','ran']);
      subURC =subParams.URC=this.randomArray(10,250,['ran','ran','ran']);
      subLLC =subParams.LLC=this.randomArray(10,250,['ran','ran','ran']);
      subULC =subParams.LRC=this.randomArray(10,250,['ran','ran','ran']);

    } 
   this.paintGrid();
   //this.paintCenteredGrid();
    this.paintSubgrid(subParams);
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



