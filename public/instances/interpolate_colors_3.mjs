
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/interpolate_colors_2.mjs'
let rs = generatorP.instantiate();


rs.setName('interpolate_colors_3');
let ht= 100;
let nr = 201;

let colors=[[250,0,10],[238,105,65],[10,10,250],[10,10,10]];
let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,randomColors:0,
                  framePadding:0.01*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,oneShot:1,
numSteps:2000,chopOffBeginningg:218,stepInterval:50,ULC:colors[3],URC:colors[1],LLC:colors[1],LRC:colors[3],CNC:colors[3],period:20,xgapf:-.1,ygapf:-.1};//50
//numSteps:295,chopOffBeginning:218,stepInterval:50,ULC:rs.randomFill('ran','ran','ran',100,250),URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0]};//50

Object.assign(rs,topParams);

rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .5;
}

   

rs.initialize = function () {
  debugger;
  let {period,oneShot,randomColors,colors} = this;
  this.initProtos();
  this.addFrame();
  this.generateLines();
  this.adjustLines();
  let ULC,URC,LLC,LRC;
  if (randomColors) {
    ULC =this.ULC=this.randomArray(10,250,['ran','ran','ran']);
    URC = this.URC=this.randomArray(10,250,['ran','ran','ran']);
    LLC =this.LLC=this.randomArray(10,250,['ran','ran','ran']);
    LRC =this.LRC=this.randomArray(10,250,['ran','ran','ran']);

  } 
  this.paintGrid();
}


  
 


export {rs};



