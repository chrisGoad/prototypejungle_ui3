
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
let rs = basicsP.instantiate();
addDropMethods(rs);

rs.setName('drops_2');
let ht = 100;
let wd = ht;

let topParams = {width:wd,height:ht,framePadding:0.17*ht,segLength:15,numHlines:5,isep:2,frameStroke:'white'};

let dropParams = {dropTries:1000,maxLoops:100000,maxDrops:10000};
//let dropParams = {dropTries:100,maxLoops:100000,maxDrops:100};

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .15;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'blue';
  circleP.stroke = 'white';
  circleP['stroke-width'] = 0;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'blue';
  rectP.stroke = 'white';
  rectP['stroke-width'] = 0;
}  

let whichDrops = 0;



rs.generateDrop = function (p) {
  let {drops,segLength,numHlines,width,height,lineP,rectP,isep,cpos} = this;
  let seg,rect,shp,drp;
  let dln = drops.length;
  let hht = height/2;
  let hwd = width/2;
  let vpos = -hht;
  let csep = isep*Math.pow(1.5,dln);
  debugger;
  drp = {pos:Point.mk(0,0)};
  let ish = dln<numHlines;
  if (ish) {
    rect  = Rectangle.mk(Point.mk(-hwd,cpos),Point.mk(width,8));
    this.cpos = cpos+csep;
    shp = rect.toShape(rectP);

   // drp.pos = Point.mk(0,0);
  } else {
    let angle = Math.random()*Math.PI;
    seg = LineSegment.mkAngled(p,angle,segLength);
    shp = seg.toShape(lineP);
  }
  drp.geometries=[ish?rect:seg];
  drp.shapes=[shp];
  return drp;
}

rs.initialize = function () {
  let {height:ht} = this;
  this.cpos = -(ht/2);
  this.addFrame();
  this.initProtos();
  this.generateDrops(dropParams);
  let drops = this.drops;
   let dln = drops.length;
  console.log('dln',dln);
  /* drops.forEach((sg)=> {
      if (LineSegment.isPrototypeOf(sg)) {
        let nsg = sg.lengthen(-11);
        sg.end0 = nsg.end0;
        sg.end1 = nsg.end1;
      }
     });*/
    this.generateDrops(dropParams);

}

export {rs};


