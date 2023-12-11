import {rs as gonPP} from '/shape/polygon.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addGonMethods} from '/mlib/gons_0.mjs';
debugger;

let rs = basicP.instantiate();
addGonMethods(rs);
rs.setName('rectangle_gon_grid_0');


let ht= 100;
let nr = 200;
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

rs.mkVertices = function (params) {
  let {width:wd,height:ht,n} = params;
  let hwd = wd/2;
  let hht = ht/2;
  const randomPoint = () => {
    let rx = Math.random()*wd - hwd;
    let ry = Math.random()*ht-hht;
    return Point.mk(rx,ry);
  }
  let vs=[];
  let inc = wd/n;
  let cx = inc/2-hwd;
  for (let i=0;i<n;i++) {
    let cy =inc/2-hwd;
    for (let j=0;j<n;j++) {
      vs.push(Point.mk(cx,cy));//randomPoint());
     // vs.push(randomPoint());
      cy = cy+inc;
    }
    cx=cx+inc;
  }
  return vs;
}

rs.mkColors = function (n) {
  let vs=[];
  for (let i=0;i<n;i++) {
    vs.push(Math.random()<0.5?[250,250,250]:[0,0,0]);
  }
  return vs;
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
  //let vValues =  [c0,c1,c2,c3];
  let n=8;
  let vValues =  this.mkColors(n*n);
  let vertices = this.mkVertices({width,height,n});
 // let {vertices,gons} = gg;
 //const tfn = (v) => v[0]<125?[0,0,0]:[250,250,250];
 const tfn = (v) => v[0]<125?[0,0,0]:(v[0]>150?[150,150,150]:v);
 const dfn = (v) => v<0?25:v*v;
  let {gons} = gg;
  this.interpolateColors(gons,vertices,vValues,tfn,dfn);
}
    


 


export {rs};



