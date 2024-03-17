import {rs as gonPP} from '/shape/polygon.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addGonMethods} from '/mlib/gons_0_12_19_23.mjs';
import {rs as addAnimation} from '/mlib/animate0.mjs';
debugger;

let rs = basicP.instantiate();
addGonMethods(rs);
addAnimation(rs);
rs.setName('rectangle_gon_grid_0');


let ht= 100;
let nr = 200;
//nr = 5	;

let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,framePadding:0.01*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,oneShot:1,
stepsPerStage:50,xgapf:.1,ygapf:.1};//50
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

rs.colorss=[[250,250,250],[250,250,250],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[0,0,0],[250,250,250],[0,0,0],[250,250,250],[250,250,250]];

rs.colorss =[[250,250,250],[250,250,250],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[250,250,250],[250,250,250],[0,0,0],[0,0,0],[250,250,250],[0,0,0],[250,250,250],[250,250,250]];

rs.mkColors = function (n) {
  let colors =this.colors;
  let vs=[];
  let nmc = 5;
  let ca =[[0,0,0],[250,250,250],[250,0,0],[0,250,0],[0,0,250]];
  for (let i=0;i<n;i++) {
    let wc = Math.floor(Math.random()*nmc);
    vs.push(colors?colors[i]:ca[wc]);
  //  vs.push(Math.random()<0.5?[250,250,250]:[0,0,0]);
  }	
  console.log('rs.colors ='+JSON.stringify(vs)+';');
  return vs;
}
rs.colors =[[0,0,0],[0,0,250],[0,0,0],[0,250,0],[0,250,0],[0,250,0],[0,250,0],[250,0,0],[0,0,0],[0,0,0],[250,0,0],[250,0,0],[0,0,250],[250,250,250],[250,250,250],[0,0,250]];
 rs.tfn = (v) => {
  let v0 =v[0];
  let v1 =v[1];
  let v2 =v[2];
  let vmod0 = Math.floor(v0%25);
  let vmod1 = Math.floor(v1%25);
  let vmod2 = Math.floor(v2%25);
  let tbv0 = vmod0*25;
  let tbv1 = vmod1*25;
  let tbv2 = vmod2*25;
  //return [tbv0,tbv1,tbv2];
  return [tbv0,tbv0,tbv0];
}


 rs.dfn = (v) => v<0?25:v*v;

 
/*
[ 0, 1, 2, 3,
  4, 5, 6, 7,
  8, 9,10,11,
 12,13,14,15]
*/

rs.rotator =[12, 8, 4, 0,
 13, 9, 5, 1,
 14,10, 6, 2,
 15,11, 7, 3 ];

rs.rotate = function (a) {
  let {rotator} = this;
  let rv = [];
  for (let i =0;i<16;i++) {
    rv.push(a[rotator[i]]);
  }
  return rv;
}
rs.buildColorsA = function () {
  this.colorsA = [this.icolors];
  for (let i=1;i<4;i++) {
    this.colorsA.push(this.rotate(this.colorsA[i-1]));
  }
}


rs.setColors= function (stage,fr) {
  let colors0 = this.colorsA[stage];
  let colors1 = this.colorsA[(stage+1)%4];
  this.colors = this.interpolate(colors0,colors1,fr);
}



rs.initialize = function () {
  debugger;
  this.initProtos();
   let {width:wd,circleP,numRows,numCols,width,height,stepsPerStage:sps} = this;
   this.numSteps=4*sps;
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
  let n=4;
  //let vValues =  this.vValues = this.mkColors(n*n);
  let vertices = this.vertices = this.mkVertices({width,height,n});
 // let {vertices,gons} = gg;
 //const tfn = (v) => v[0]<125?[0,0,0]:[250,250,250];
 //const tfn = (v) => v[0]<125?[0,0,0]:(v[0]>150?[150,150,150]:v);
  // return;
   let {gons} = gg;
  // this.gons  = gons;
   this.buildColorsA();
   this.setColors(0,0);
  //this.interpolateColors(gons,vertices,vValues,this.tfn,this.dfn);
  this.interpolateColors(gons,vertices,this.colors,this.tfn,this.dfn);
}
   
rs.updateState = function () {
  let {stepsPerStage:sps,stepsSoFar:ssf,gons,vertices,vValues,colors} = this;
  console.log('UPDATE');
  debugger;	
  let stage = Math.floor(ssf/sps);
  let fr = (ssf%sps)/sps;
  this.setColors(stage,fr);
   this.interpolateColors(gons,vertices,this.colors,this.tfn,this.dfn);
}
  
 


export {rs};


