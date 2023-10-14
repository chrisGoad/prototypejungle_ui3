import {rs as circlePP} from '/shape/circle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
let rs = basicP.instantiate();

addAnimationMethods(rs);

rs.setName('color_blend_0');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:0.05,stopTime:100,}

Object.assign(rs,topParams);
rs.numGons = 0;
rs.bottomTriangle = function (n,i,sh) {
  let {width:wd,numGons} = this;
  let inc = wd/n;
  let hinc = inc/2;
  let hwd = wd/2;
  let p0,p1,p2,p3,pnts;
  debugger;
  if (i===0) {
    p0 = Point.mk(-hwd,hwd); // bottom left
    p1 = Point.mk(-hwd,sh*wd - hwd); //intersection with x = -hwd line
    p2 = Point.mk(sh*inc-hwd,-hwd); //top
    p3 = Point.mk(hinc+sh*inc-hwd,hwd);
    pnts = [p0,p1,p2,p3];
  } else if (i === n) {
    //p0 = Point.mk((i+sh)*inc-hwd,hwd);// bottom left
    p0 = Point.mk((i+sh-.5)*inc-hwd,hwd); //bottom left

    p1= Point.mk(hwd,(sh*wd)-hwd); //intersection with x = hwd line
    p2 = Point.mk(hwd,hwd);
    pnts = [p0,p1,p2];
  } else {	
    p0 = Point.mk((i+sh-.5)*inc-hwd,hwd); //bottom left
    p1  = Point.mk(-hwd+(i+sh)*inc,-hwd); //top
    p2  = Point.mk(-hwd+(i+sh+.5)*inc,hwd); //bottom right
    pnts = [p0,p1,p2];
  }
  let gon = this.polygonP.instantiate();
  gon.corners = pnts;
  let nm = 'gon_'+numGons;
  this.numGons = numGons+1;
  this.set(nm,gon);
  gon.update();
}
rs.bottomTriangles = function (n,sh) {
  for (let i = 0;i<=n;i++) {
    this.bottomTriangle(n,i,sh);
  }
}
  


rs.initProtos = function () {
  this.polygonP = polygonPP.instantiate();
  this.polygonP.stroke = 'rgb(255,255,255)';
  this.polygonP['stroke-width'] = 0.5;
  this.polygonP.fill = 'red';
}    


   
rs.initialize = function () {
   debugger;
  this.setNumSteps();
  this.initProtos();
  this.addFrame();
  //this.bottomTriangle(2,1,0);
  /*this.bottomTriangle(4,0,0);
  this.bottomTriangle(4,1,0);
  this.bottomTriangle(4,2,0);
  this.bottomTriangle(4,3,0);
  this.bottomTriangle(4,4,0);*/
  this.bottomTriangles(5,.2);
}


export {rs}
  

  