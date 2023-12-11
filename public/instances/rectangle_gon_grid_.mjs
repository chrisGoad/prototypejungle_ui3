
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/rectangle_gon_grid_0.mjs'
let rs = generatorP.instantiate();


rs.setName('interpolate_colors_2');
let ht= 100;
let nr = 201;
let lowX = 75;
let highX = 125;
let lowY = 75;
let highY = 125;

let xdisp = 0,ydisp = 0;
//rs.subParamsA= [{lowX:25+xdisp,highX:75+xdisp,lowY:25+ydisp,highY:75+ydisp}];

let colors=[[0,250,10],[238,105,65],[10,10,250],[10,10,10]];
let topParams = {subParamsA:[],width:ht,height:ht,numRows:nr,numCols:nr,randomColors:1,center:0,
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
  let {period,oneShot,randomColors,colors,subParamsA,center} = this;
  this.initProtos();
  this.addFrame();
  this.generateLines();
  if (oneShot) {
    this.adjustLines();
    let ULC,URC,LLC,LRC,CNC,subULC,subURC,subLLC,subLRC;
    let ln = subParamsA.length;
    if (randomColors) {
      ULC =this.ULC=this.randomArray(10,250,['ran','ran','ran']);
      URC = this.URC=this.randomArray(10,250,['ran','ran','ran']);
      LLC =this.LLC=this.randomArray(10,250,['ran','ran','ran']);
      LRC =this.LRC=this.randomArray(10,250,['ran','ran','ran']);
      CNC =this.CNC=this.randomArray(10,250,['ran','ran','ran']);
      subULC  =this.randomArray(10,250,['ran','ran','ran']);
      subURC  =this.randomArray(10,250,['ran','ran','ran']);
      subLLC =this.randomArray(10,250,['ran','ran','ran']);
      subLRC =this.randomArray(10,250,['ran','ran','ran']);
      for (let i=0;i<ln;i++) {
        subParamsA[i].ULC = subULC;
        subParamsA[i].URC = subURC;
        subParamsA[i].LLC = subLLC;
        subParamsA[i].LRC = subLRC;
      }
    } 
    if (center) {
      this.paintCenteredGrid();
    } else {
      this.paintGrid();
    }

    for (let i=0;i<ln;i++) {
      this.paintSubgrid(subParamsA[i]);
    }
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


  
 


export {rs};



