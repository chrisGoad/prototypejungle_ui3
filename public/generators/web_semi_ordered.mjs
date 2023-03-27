import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addWebMethods} from '/mlib/web.mjs';	

let rs = basicP.instantiate();
addDropMethods(rs);
addWebMethods(rs);

rs.setName('drop_semi_ordered');
let ht= 1000;
let nr = 40;
let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,frameStroke:'white',framePadding:0.1*ht,gap:10}

Object.assign(rs,topParams);

let dropParams = {dropTries:150,maxDrops:10000}
//let  webParams = {webTries:1000,minConnectorLength:0,maxConnectorLength:40};
let  webParams = {webTries:1000,minConnectorLength:40,maxConnectorLength:80};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'black';
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 1;
}  


rs.genRandomPoint = function (rect) {
  let {width,height,numCols,numRows,gap} = this;
  
  let  hwd = width/2;
  let hht = height/2;
  let frx = Math.random();
  let xp = frx>0;
  let rx = frx * width;
   let fry= Math.random();
   let ry= fry* height;
   let dx = width/numCols;
   let dy = height/numRows;
   let col = Math.floor(rx/dx);
   let row= Math.floor(ry/dy);
   let x = col*dx;
   let y = row*dy;
   let p = Point.mk(x-hwd,y-hht);
   let d = p.length();
   let frr = d/hht;
   let pf = 60;
   let afrx =0.5-Math.abs(frx - 0.5);
   let afrr =1 -frr;
   let rrx = Math.random();
   let rry = Math.random();
   let px = rrx* rrx * pf*afrr;
   let py = rry * rry*  pf*afrr;
   console.log('x',x,'y',y,'frx',frx,'afrx',afrx,'px',px);
     //return Point.mk(px + x-hwd,py +y-hht);

    let xx = px + x -hwd;
    let yy = py + y -hht;
    let xa = xx+ (xx > 0?gap:-gap);
  return Point.mk(xa,yy);
}


rs.generateDrop = function (p) {
  let {height} = this;
  let hht = height/2;
  let d = p.length();
  let df = d/hht;
  let red = Math.floor(df*255);
 // let blue = Math.floor((1-df)*255);
  let blue = 100+Math.floor((1-df)*155);
 // let clr = `rgb(${red},${red},${blue})`
 // let clr = `rgb(${red},${red},255)`
 // let clr = `rgb(${blue},${blue},255)`
  //let clr = `rgb(${blue},${blue},${blue})`
  let clr = 'white';
 // if ((d > (hht +10)) || (d <0.05*hht)) {
  if (d > 0.95*hht)  {
    return;
  }
  let rd = 4 + df*6;;
  let crc = Circle.mk(rd);
 // let crcs = crc.toShape(this.circleP,0.8);
  let crcs = crc.toShape(this.circleP,0.8);
  crcs.fill = clr;
  crcs.fill = 'transparent';
  return {geometries:[crc],shapes:[crcs]};
}
 
rs.initialize = function () {
  //this.setBackgroundColor('white');
  this.initProtos();
  //this.addFrame();
  this.generateDrops(dropParams);
  let points = this.dropCenters();
  this.generateWeb(Object.assign(webParams,{points}));

}

export {rs};


