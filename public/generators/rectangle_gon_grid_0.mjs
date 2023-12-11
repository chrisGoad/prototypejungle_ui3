import {rs as gonPP} from '/shape/polygon.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addGonMethods} from '/mlib/gons_0.mjs';


let rs = basicP.instantiate();
addGonMethods(rs);
rs.setName('rectangle_gon_grid_0');


let ht= 100;
let nr = 50;
//nr = 5	;

let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,framePadding:0.01*ht,frameStrokee:'white',frameStrokeWidth:.1,saveAnimation:1,oneShot:1,
numSteps:200,chopOffBeginningg:218,stepInterval:50,ULC:[250,0,0],URC:[0,0,250],LLC:[0,250,0],LRC:[0,250,0],period:20,xgapf:.1,ygapf:.1};//50
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
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .05;
  circleP.fill = 'blue';
}


rs.initialize = function () {
  debugger;
  this.initProtos();
   let {width:wd,circleP,numRows,numCols,width,height} = this;
   this.addFrame();
  let lines = this.set('lines',arrayShape.mk());
  this.set('gons',arrayShape.mk());
  let points = this.set('points',arrayShape.mk());
  let bbase = this.bbase = 0.9*wd;
  let gg = this.addGonGrid({numRows,numCols,width,height});
  let c0 = [250,250,250];
  let c1 = [0,0,0];
  let c2 = [250,0,0];
  let c3= [0,0,250];
  let vValues =  [c0,c1,c2,c3];
  let {vertices,gons} = gg;
  this.interpolateColors(gons,vertices,vValues);
}
    


 


export {rs};



