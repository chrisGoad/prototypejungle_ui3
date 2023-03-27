import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/dropCircles.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_sky');
let ht= 1000;
let topParams = {width:1.5*ht,height:ht}
Object.assign(rs,topParams);

let dropParams = {dropTries:150,radius:60}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'black';
  circleP['stroke-width'] = 0;
}  



rs.radiusGenerator= function (p) {
 
  let ht = this.height;
  let cfr = 0.05;
  let seaht = cfr*ht;
  let ay = Math.abs(p.y);
  if (ay < seaht) {
    return -1;
  }
  if (0 && (p.y < 0)) {
    return (Math.random>0.5)?30:60;
  }
  let theta = (Math.PI/4)*(ay - seaht)/(ht - seaht);
  let sint = Math.sin(theta);
  let dist = 1/sint;
  let rd = 100/dist;
  return rd;
 }
 
 

rs.radiusGeneratorr= function (p) {
  let lnc = Math.abs(p.y);
  return 0.02*lnc -1;
 }

 

 
rs.fillGenerator= function (p) {
  debugger;
  return (p.y<0)?'white':'black';
  let {height} = this;
  let fr = (p.y + height/2)/height;
  let v = Math.floor(fr*255);
  let fill = `rgb(${v},${v},${v})`;
  return fill;
 }


rs.initialize = function () {
  this.initProtos();
  let wd = 1.5*ht;
  let hwd = 0.5*wd;
  let hht = 0.5*ht;
  let qwd = 0.5*hwd;
  let qht = 0.5*hht;
 // this.addRectangle({width:hwd,height:ht,position:Point.mk(-qwd,0),stroke_width:0,fill:'black'});
  this.addRectangle({width:wd,height:hht,position:Point.mk(0,-qht),stroke_width:0,fill:'black'});
 // this.addRectangle({width:hwd,height:ht,position:Point.mk(qwd,0),stroke_width:0,fill:'white'});
  this.addRectangle({width:wd,height:hht,position:Point.mk(0,qht),stroke_width:0,fill:'white'});
  let cfr =0.09;
  this.addRectangle({width:wd,height:cfr*ht,stroke_width:0,fill:'rgb(10,10,80)'});
//  return;
  let shapes = this.set('shapes',arrayShape.mk());
  let drop =  this.generateCircleDrop(dropParams);
  let {points,radii} = drop;
  let ln  = points.length;
  
  for (let i=0;i<ln;i++) {
    let p = points[i];
    let fill = this.fillGenerator(p);
    let crc = this.circleP.instantiate();
    let dim = 1.0*radii[i];
    if (p.y<0) {
       crc.dimension = Math.min(4,dim);
    } else {
       crc.dimension = dim;
    }
    crc.fill = fill;
    shapes.push(crc);
    crc.moveto(p);
   }
}

export {rs};


