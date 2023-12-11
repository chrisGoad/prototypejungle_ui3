
import {rs as linePP} from '/shape/line.mjs';
import {rs as gonPP} from '/shape/polygon.mjs';
import {rs as generatorP} from '/generators/rectangle_gon_grid_0.mjs';
debugger;
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
   let gonP = this.gonP = gonPP.instantiate();
  gonP.stroke = 'white';
  gonP['stroke-width'] = .0;
  gonP.fill = 'blue';
}

   

rs.initialize = function () {
  debugger;
  let {period,oneShot,randomColors,cornerColors,subParamsA,center,width,height,numRows,numCols} = this;
  this.initProtos();
  this.addFrame();
  let lines = this.set('lines',arrayShape.mk());
  this.set('gons',arrayShape.mk());
  let ULC,URC,LLC,LRC,CNC,subULC,subURC,subLLC,subLRC;
  let vValues;
  let ln = subParamsA.length;
  if (randomColors) {
    let ULC =this.ULC=this.randomArray(10,250,['ran','ran','ran']);
    let URC = this.URC=this.randomArray(10,250,['ran','ran','ran']);
    let LLC =this.LLC=this.randomArray(10,250,['ran','ran','ran']);
    let LRC =this.LRC=this.randomArray(10,250,['ran','ran','ran']);
    let CNC =this.CNC=this.randomArray(10,250,['ran','ran','ran']);
    vValues = [ULC,URC,LLC,LRC];

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
  } else {
    //let {ULC,URC,LRC,LLC} = cornerColors;
    //vValues = [ULC,URC,LLC,LRC];
  }
  let gg = this.addGonGrid({numRows,numCols,width,height});
  let {vertices,gons} = gg;

 // let vertices = this.mkRectangleVertices({width,height,center});
  this.interpolateColors(gons,vertices,cornerColors);
  

  for (let i=0;i<ln;i++) {
    let subi = subParamsA[i];
    Object.assign(subi,{width,height,numRows,numCols});
    let gg = this.addGonsForSubgrid (subi);
    let {vertices,gons} = gg;
  this.interpolateColors(gons,vertices,subi.cornerColors);
  
  }

}


  
 


export {rs};



