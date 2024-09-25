
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicsP.instantiate();
addAnimationMethods(rs);

rs.setName('spider_0');
//addGridMethods(rs);
let wd=100;

let topParams = {width:wd,height:wd,fr:.8,numSegs:10,framePadding:0.15*wd,numSteps:96,saveAnimation:1,lineLength:1.8,lowStroke:[255,255,255],
  hiStroke:[100,100,100],frvvvv:0,onDiagonals:1,colinear:1};
Object.assign(rs,topParams);


/*dist((0,ymid),(0,ymid-r)) = dist((wd,yside), (0,ymid-r))

r*r = wd*wd+ (yside-(ymid-r))**2 =wd*wd+ (r+yside-ymid)**2

let ydelta = yside-ymid;

r*r = wd*wd + (r+ydelta)*(r+ydelta)  = wd*wd + ydelta*ydelta + 2*ydelta*r + r*r;
wd*wd + ydelta*ydelta +2*ydelta*r = 0;
-2*ydelta*r = wd*wd + ydelta*ydelta;
r = -0.5*(wd*wd+ydelta*ydelta)/ydelta = -0.5*((wd*wd)/ydelta + ydelta);


r*r = wd*wd + (r-ydelta)*(r-ydelta)  = wd*wd + ydelta*ydelta -2*ydelta*r + r*r;
wd*wd + ydelta*ydelta -2*ydelta*r = 0;
2*ydelta*r = wd*wd + ydelta*ydelta;
r = 0.5*(wd*wd+ydelta*ydelta)/ydelta = 0.5*((wd*wd)/ydelta + ydelta);

r*r = wd*wd + (ydelta-r)*(ydelta-r)  = wd*wd + ydelta*ydelta -2*ydelta*r + r*r;


ydelta*ydelta -2*r*ydelta + wd*wd=0

a=1
b= -2*r
c = w*wd

ydelta = sqrt(b*b-4*a*c)/(2*a)
let wd = 8 w 
let ydelta = 50;

r = sqrt(0.5*((wd*wd)/ydelta + ydelta));

dist((0,ymid), (wd,yside)) = 
sqrt(wd*wd + ydelta*ydelta)

*/

rs.computeYdelta =  function (r) {
  let {fr,width} = this;
  let w = 0.5*width*fr;
  let a=1;
  let b= -2*r;
  let c = w*w;
  let ydelta = Math.sqrt(b*b-4*a*c)/(2*a);
  return ydelta;
  }

rs.computeRadius = function (yside,ymid) {
   let {fr,width} = this;
   let w= 0.5*fr*width;
   let ydelta = yside-ymid;
  // let r = Math.sqrt(0.5*((w*w)/ydelta + ydelta));
   let r = -0.5*((w*w)/ydelta + ydelta);
   return r;
}
rs.computeAngle = function (r,yside,ymid) {
   let {fr,width} = this;
   let w= 0.5*fr*width;
   let ydelta = ymid-yside;
   //let halfBaseL= Math.sqrt(w*w + ydelta*ydelta);
   let halfBaseL= Math.sqrt(w*w);
   let a = 2* Math.atan2(halfBaseL,r-ymid);
   return a;
}
   
rs.pointsOnCircle = function (params) {
  let {numPoints:np,lowA,highA,center,radius} = params;
  let intv = (highA-lowA)/(np-1);
  let a = [];
  for (let i=0;i<np;i++) {
    let ca = lowA+i*intv;
    let cp = center.plus(Point.mk(Math.cos(ca)*radius,Math.sin(ca)*radius));
    a.push(cp);
  }
  return a;
}


rs.pointsOnCircle = function (params) {
  let {numPoints:np,adelta,centerOff,dir,radius:r} = params;
  let {lineCount} = this;
  let lowA,highA,center,adir;
  if (dir === 'up') {
    adir = .5*Math.PI;
    lowA = adir-adelta;
    highA = adir+adelta;
    center = Point.mk(0,-centerOff);
  }  
  if (dir === 'right') {
    adir = Math.PI;
    lowA = adir-adelta;
    highA = adir+adelta;
    center = Point.mk(centerOff,0);
  }  
  let intv = (highA-lowA)/(np-1);

  let a = [];
  for (let i=0;i<np;i++) {
    let ca = lowA+i*intv;
    let cp = center.plus(Point.mk(Math.cos(ca)*r,Math.sin(ca)*r));
    a.push(cp);
  }
  let n = 0;
  a.forEach((p) => {
   let line = this.lineP.instantiate();
   line.setEnds(center,p);
   console.log('n',n,'p.x',p.x,'p.y',p.y);
   n++;
  this.set('line_'+lineCount,line);
   lineCount++;
  });
  this.lineCount = lineCount;
  return a;
}
     

rs.initProtos = function () {	
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP['stroke-width'] = .1;
  polylineP.stroke='white';
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .1;
  lineP.stroke='white';
}

rs.updateState  = function () {
  let {stepsSoFar:ssf,numSteps} = this;
  let fr = ssf/numSteps;
  this.updateCells(fr);
}

rs.arcCount =0;
rs.lineCount =0;
rs.drawArc = function (ymid,dir) {
  let {fr,width,numSegs,arcCount,lineCount} = this;
  console.log('');
  console.log('ymid',ymid);
   let w= 0.5*fr*width;
  let yside = 0;
  let r = this.computeRadius(yside,ymid);
  let a = this.computeAngle(r,yside,ymid);
  console.log('radius',r,'angle',(180/Math.PI)*a);
  let lowA = .5*Math.PI - .5*a;
  let highA = .5*Math.PI +.5*a;
  //let center = Point.mk(0,ymid - r);
  let center = Point.mk(0, ymid- r);
  let np = numSegs+1;
  //let params = {numPoints:np,radius:r,lowA,highA,center};
  let params = {numPoints:numSegs+1,radius:r,adelta:0.5*a,dir,centerOff:r-ymid};

  let pnts = this.pointsOnCircle(params);
 /* let n=0;
  pnts.forEach((p) => {
   let line = this.lineP.instantiate();
   line.setEnds(center,p);
   console.log('n',n,'p.x',p.x,'p.y',p.y);
   n++;
  this.set('line_'+lineCount,line);
   lineCount++;
  });
  this.lineCount  = lineCount;
  */
  let pline = this.polylineP.instantiate();
  pline.wayPoints = pnts;
  this.set('pline'+arcCount,pline);
  pline.update();
  let sp = Point.mk(w,yside);
  let mp = Point.mk(0,ymid);
  let spd = center.distance(sp);
  let msd = center.distance(mp);
  console.log('spd',spd,'msd',msd,'r',r);
  this.arcCount = arcCount+1;
}
rs.initialize = function () {
  let {fr,width,numSegs} = this;
  let w = 0.5*width*fr;
  this.addFrame();
  this.initProtos();
  let ymid = 30;
  //this.drawArc(10,');
  //this.drawArc(20);
  this.drawArc(30,'up');
  this.drawArc(30,'right');
  //this.drawArc(12);
  
  //console.log('ymid',ymid,'radius',r,'angle',a * (180/Math.PI),'d',d);
 
}

export {rs};


