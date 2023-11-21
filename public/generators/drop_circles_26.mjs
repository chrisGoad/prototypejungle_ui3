import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
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
let topParams = {width:ht,height:ht,framePadding:0.0*ht,frameStroke:'white',expandFactor:1.03,refDim:10,minDim:5,numSteps:1000};

Object.assign(rs,topParams);

//rs.dropParams = {dropTries:150,scale:0.5,radius:50}
rs.dropParams = {zone,dropTries:100000,maxLoops:100000,maxDrops:60};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .5;
}

rs.generateCircleDrop= function (p) { 
  let {refDim:dim,minDim}  = this;
  let delta = dim-minDim;
  let d = minDim+Math.random()*delta;
  let cf = 3;
  let rv = 100;
  let gv = 100;
  //let fill = this.randomFill(null,'ran','ran','ran',100,250);
  let fill = this.randomFill(rv,gv,'ran',100,250);
  let drop = {collideRadius:d*0.5*cf,dimension:d,fill};
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

rs.dropDist = function (drop0,drop1) {
  let {point:p0,dimension:dim0} = drop0;
  let {point:p1,dimension:dim1} = drop1;
  let pdist = p0.distance(p1);
  let dist = pdist-dim0-dim1;
  return dist;
}

rs.closestDrop = function (drop) {
  let {drops} = this;
  let ln = drops.length;
  let mind = Infinity;
  let cdrop = null;
  for (let i=0;i<ln;i++) {
    let drop1 = drops[i];
    if (drop1 && (drop !== drop1)) {
      let dist = this.dropDist(drop,drop1);
      if (dist<mind) {
        mind = dist;
        cdrop = drop1;
      }
    }
  }
  return cdrop;
}

rs.addDrop = function (drop) {
  debugger;
  let cdrop = this.closestDrop(drop);
  let p = drop.point;
  let cp = cdrop.point;
  let dist = cp.distance(p);
  let cvec = cp.difference(p);
  let ncvec = cvec.times(1/dist);
  drop.cdrop = cdrop;
  drop.cvec = ncvec;
  drop.cdist = dist;
}
  
rs.addDrops = function (n) {
  let {dropParams,circleP,dropShapes} = this;
  dropParams.maxDrops = n;
  let newDrops = this.generateCircleDrops(dropParams);
  newDrops.forEach((drop) => {
    this.addDrop(drop);
  });
  this.installCircleDrops(dropShapes,circleP,this.drops);

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
  let {stepsSoFar:ssf} = this;
  if (!(ssf%1)) {
    this.addDrops(1);
  }
  this.expandCircles();
  this.detectSideCollisions();
  this.detectCollisions();
}

export {rs};



