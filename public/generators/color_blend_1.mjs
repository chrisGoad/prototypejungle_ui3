import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
let rs = basicP.instantiate();

addAnimationMethods(rs);

rs.setName('color_blend_0');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.0*ht,frameStroke:'white',frameStrokeWidth:.2,stepStop:40,frameFr:0.98}

Object.assign(rs,topParams);
rs.gonCount = 1;
rs.gonsSoFar = 0;
rs.iwdf = 1;

rs.resetGons= function () {
  let {gons} = this;
  let ln = gons.length;
  for (let i =0;i<ln;i++) {
    let gon = gons[i];
    gon.hide();
  }
  this.gonsSoFar = 0;
}

rs.newGon = function (corners) {
  let {gons,gonsSoFar:gsf} = this;
  let ln = gons.length;
  let gon;
  if (gsf == ln) {
    gon =this.polygonP.instantiate();
    gons.push(gon);  
  } else {
    gon = gons[gsf];
  }
  gon.corners = corners;
  gon.show();
  gon.update();
  this.gonsSoFar = gsf+1;
}
rs.bottomTriangle = function (iwd,n,i) {
  let {width:wd,numGons} = this;
  let inc = iwd/n;
  let hinc = inc/2;
  let hwd = wd/2;
  let hiwd = iwd/2;
  let p0,p1,p2,p3,pnts;
  //debugger;
  p0 = Point.mk(i*inc-hiwd,hwd); //bottom left
  p1  = Point.mk((i+.5)*inc-hiwd,-hwd); //top
  p2  = Point.mk((i+1)*inc-hiwd,hwd); //bottom right
  pnts = [p0,p1,p2];
  this.newGon(pnts);
  return;
  let gon = this.polygonP.instantiate();
  gon.corners = pnts;
  let nm = 'gon_'+numGons;
  this.numGons = numGons+1;
  this.set(nm,gon);
  gon.update();
}

rs.leftWing = function(iwd,n) {
  let {width:wd,numGons} = this;
 // debugger;
  let inc = iwd/n;
  let hinc = inc/2;
  let hwd = wd/2;
  let hiwd = iwd/2;
  let p0 =  Point.mk(-hiwd,hwd); //bottom left
  let ww = (wd - iwd)/2;
  let pnts;
  if (ww <= hinc) {
    let p1 = Point.mk(-hwd,hwd-(ww/hinc)*wd);
    let p2 = Point.mk(-hwd,hwd);;
    pnts = [p2,p1,p0];
  } else {
    let p1=Point.mk(-(hiwd+hinc),-hwd);
    let aa = hiwd+hinc;
    let bb = (ww-hinc)/hinc;
    let cc = bb*wd;
    if (aa>hwd) {
      debugger;
    }
    let p2 = Point.mk(-hwd,((ww-hinc)/hinc)*wd-hwd);
    let p3 = Point.mk(-hwd, hwd);
    //pnts = [p3,p2,p1,p0];
    pnts = [p3,p2,p1,p0];
  }
  this.newGon(pnts);
}

rs.rightWing = function(iwd,n) {
  let {width:wd} = this;
 // debugger;
  let inc = iwd/n;
  let hinc = inc/2;
  let hwd = wd/2;
  let hiwd = iwd/2;
  let p0 =  Point.mk(hiwd,hwd); //bottom left
  let ww = (wd - iwd)/2;
  let pnts;
  if (ww <= hinc) {
    let p1 = Point.mk(hwd,hwd-(ww/hinc)*wd);
    let p2 = Point.mk(hwd,hwd);;
    pnts = [p2,p1,p0];
  } else {
    let p1=Point.mk(hiwd+hinc,-hwd);
    let aa = hiwd+hinc;
    let bb = (ww-hinc)/hinc;
    let cc = bb*wd;
    if (aa>hwd) {
      debugger;
    }
    let p2 = Point.mk(hwd,((ww-hinc)/hinc)*wd-hwd);
    let p3 = Point.mk(hwd, hwd);
    //pnts = [p3,p2,p1,p0];
    pnts = [p3,p2,p1,p0];
  }
  this.newGon(pnts);
}
    
    

rs.bottomTriangles = function (iwd,n) {
  for (let i = 0;i<n;i++) {
    this.bottomTriangle(iwd,n,i);
  }
}
  


rs.initProtos = function () {
  this.polygonP = polygonPP.instantiate();
  this.polygonP.stroke = 'rgb(255,255,255)';
  this.polygonP['stroke-width'] = 0;
  this.polygonP.fill = 'red';
}    


   
rs.initialize = function () {
   debugger;
   let {width:wd,gonCount:n,iwdf} = this;
  this.setNumSteps();
  this.initProtos();
  this.addFrame();
  this.setBackgroundColor('blue');
  this.set('gons',arrayShape.mk());
  //this.bottomTriangle(2,1,0);
  /*this.bottomTriangle(4,0,0);
  this.bottomTriangle(4,1,0);
  this.bottomTriangle(4,2,0);
  this.bottomTriangle(4,3,0);
  this.bottomTriangle(4,4,0);*/
  let iwd = wd;
  this.bottomTriangles(iwd,n);
  this.leftWing(iwd,n);
  this.rightWing(iwd,n);
}

rs.updateState = function () {
  let {iwdf,frameFr,gonCount:ni,width:wd} = this;
  
  this.resetGons();
  let iwd = iwdf*wd;
  let inc = iwd/ni;
  let cext =inc*ni;
    let ww = 0.5*(wd-iwd);

  let n=ni;
  if (ww>=inc) {
    debugger;
    n = n+2;
    this.gonCount=n;
    iwdf = this.iwdf = 1;
    iwd = wd;
  }
  this.bottomTriangles(iwd,n);
  this.leftWing(iwd,n);
  this.rightWing(iwd,n);
  this.iwdf = frameFr*iwdf;
}

export {rs}
  

  