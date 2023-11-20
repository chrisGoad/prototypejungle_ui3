import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/circleDropsS.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);
addDropMethods(rs);

rs.setName('drop_circles_26');
let ht= 100;
let hht = 0.5*ht;
let xt = Point.mk(ht,ht);
let zone = rs.mkRectFromCenterExtent(Point.mk(0,0),xt);
let rd = 1;
let topParams = {width:ht,height:ht,framePadding:0.0*ht,frameStroke:'white',expandFactor:1.03,refDim:1,numSteps:1000};

Object.assign(rs,topParams);

//rs.dropParams = {dropTries:150,scale:0.5,radius:50}
rs.dropParams = {zone,dropTries:100000,maxLoops:100000,maxDrops:60};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
}

rs.generateCircleDrop= function (p) { 
  let {refDim:dim}  = this;
  let d = Math.random()*dim;
  let cf = 3;
  let drop = {collideRadius:d*0.5*cf,dimension:d,fill:'white'};
  return drop;
}

rs.detectCollisions = function () {
  let {drops} = this;
  let ln = drops.length;
  for (let i=0;i<ln;i++) {
    let d0 = drops[i];
    if (d0) {
      let {point:p0,dimension:dim0,index:i0,shape:s0} = d0;
      let r0 = dim0/2;
      for (let j=i+1;j<ln;j++) {
        let d1=drops[j];
        if (d1) { 
          let {point:p1,dimension:dim1,index:i1,shape:s1} = d1;
          let r1 = dim1/2;
          let collision = this.collides0(p0,r0,p1,r1);
          if (collision) {
            if (r1>r0) {
              drops[i1] = null;
              s1.hide();
            } else {
              drops[i0] = null;
              s0.hide();
              continue;
            }
          }
        }
      }
    }
  }
}
              
 
rs.detectSideCollisions = function () {
  let {drops} = this;              
  let ln = drops.length;
  for (let i=0;i<ln;i++) {
    let d = drops[i];
    if (d) {
      let {point:p,dimension:dim,shape:s} = d;
      let c=this.collidesWithSides(p,dim/2);
      if (c) {
        debugger;
        this.collidesWithSides(p,dim/2);
        drops[i]=null;
        s.hide();
      }
    }
  }
}


    
rs.expandCircles = function () {
  let {drops,expandFactor:ef} = this;
  let ln = drops.length;
  for (let i=0;i<ln;i++) {
    let d = drops[i];
    if (d) {
      let {dimension:dim,shape} = d;
      let nd = dim*ef;
      d.dimension = nd;
      shape.dimension = nd;
      shape.update();
    }
  }

      
}

rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams,width} = this;
  let qwd = 1.005*0.25*width;
  this.addFrame();
  debugger;
  let shapes = this.set('dropShapes',arrayShape.mk());
  let drops =  this.drops = this.generateCircleDrops(dropParams);
  
  this.installCircleDrops(shapes,circleP,drops);

}

rs.updateState = function () {
  this.expandCircles();
  this.detectSideCollisions();
  this.detectCollisions();
}

export {rs};



