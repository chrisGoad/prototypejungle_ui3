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
let topParams = {width:ht,height:ht,framePadding:0.0*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,
expandFactor:1.03,refDim:12,minDim:2,numSteps:295,chopOffBeginning:218,stepInterval:50};//50

Object.assign(rs,topParams);

//rs.dropParams = {dropTries:150,scale:0.5,radius:50}
rs.dropParams = {zone,dropTries:1000,maxLoops:100000,maxDrops:6};
//rs.dropParams = {zone,dropTries:100000,maxLoops:100000,maxDrops:2};

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
  let {refDim:dim,minDim,drops}  = this;
  let ln = drops.length;
  let delta = dim-minDim;
  let d=minDim;
  //let d=ln?minDim:2*minDim;
 // let d = minDim+Math.random()*delta;
  let cf = 3;
  let rv = 100;
  let gv = 100;
  //let fill = this.randomFill(null,'ran','ran','ran',100,250);
 // let fill = this.randomFill(rv,gv,'ran',100,250);
 //item.randomRGB = function (lb,ub,ia) {

  let fill = this.randomRGB(100,250,[rv,gv,'ran']);
 // let fill = this.randomRGB(100,250,3);
 // let fill = 'transparent';
  //let drop = {collideRadius:d*0.5*cf,dimension:d,fill};
  let drop = {collideRadius:1*d,dimension:d,fill};
  return drop;
}

rs.detectCollisions = function () {
  let {drops,edges,lines} = this;
  let ln = drops.length;
  for (let i=0;i<ln;i++) {
    let d0 = drops[i];
    if (d0) {
      let {point:p0,dimension:dim0,index:i0,shape:s0,edge0} = d0;
      let r0 = dim0/2;
      for (let j=i+1;j<ln;j++) {
        let d1=drops[j];
        if (d1) { 
          let {point:p1,dimension:dim1,index:i1,shape:s1,edge:edge1} = d1;
          let r1 = dim1/2;
          let collision = this.collides0(p0,r0,p1,r1);
          if (collision) {
        //    debugger;
       /*     if (edge0) {
              let {e0i:e0i0,e1i:e1i0,index:index0} = edge0;
              if (((e0i0 === i) && (e0i1 === j))||((e0i0 === i) && (e0i1 === i))) {
                let line = lines[index0]
                line.hide();
                edges[index0] = null;
              }
            }*/
           // let {e0i:e0i1,e1i:e1i1,index:index1} = edge1;
            if (r1>r0) {
              drops[i1] = null;
              this.addEdge(d0);
              s1.hide();
            } else {
              drops[i0] = null;
              this.addEdge(d1);
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
        //debugger;
        let cd = d.cdrop;
        if (cd) {
          cd.cvec = null;
          cd.cdrop = null;
        }
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
    if (drop && drop1 && (drop !== drop1)) {
      let dist = this.dropDist(drop,drop1);
      if ((dist>.01) && (dist<mind)) {
        mind = dist;
        cdrop = drop1;
      }
    }
  }
  if (!cdrop) {
    debugger;
  }
  return cdrop;
}

rs.addEdge =function (d) {
  let {edges,dropLines:lines,lineP} = this;
  if (!d) {
    return;
  }
  let line=lineP.instantiate();
  lines.push(line);
 // debugger;
  let i = edges.length;
  let cd = this.closestDrop(d);
  //let cdcd = cd.cdrop;
 // if (cdcd) {
 //  continue;
 // }
  d.cdrop = cd;
  let cdi = cd.index;
  let e0 = d.point;
  let e1 = cd.point;
  let vec = e1.difference(e0);
  let dist = vec.length();
  let nvec = vec.times(1/dist);
  let edge = {nvec,dist,e0i:d.index,e1i:cd.index,index:i};
  d.edge = edge;
  edges.push(edge);
  return edge;
}

rs.computeEdges = function () {
  let {edges,drops} = this;
  let dln = drops.length;
  for (let i=0;i<dln;i++) {
    let d = drops[i]
    if (d) {
     let edge = this.addEdge(d);
     continue;
     // debugger;
     let cd = this.closestDrop(d);
     let cdcd = cd.cdrop;
     if (cdcd) {
       continue;
     }
     d.cdrop = cd;
     let cdi = cd.index;
     let e0 = d.point;
     let e1 = cd.point;
     let vec = e1.difference(e0);
     let dist = vec.length();
     let nvec = vec.times(1/dist);
    // let edge = {nvec,dist,e0i:d.index,e1i:cd.index,index:i};
     d.edge = edge;
     edges.push(edge);
     }
  }
}  

rs.allocLines = function () {
  let {edges,lineP,dropLines:lines} = this;
  let ln=edges.length;
  for (let i=0;i<ln;i++) {
    let line = lineP.instantiate();
    lines.push(line);
  }
}

rs.showEdges = function () {
  let {edges,dropLines:lines,drops} = this;
  let eln = edges.length;
  for (let i=0;i<eln;i++) {
    let edge = edges[i];
    if (edge) {
   //   debugger;
      let line =lines[i];
      let {e0i,e1i,nvec,dist} = edge;
      let d0 = drops[e0i];
      let d1 = drops[e1i];
      if (d0 && d1) {
        let p0 = d0.point;
        let dim0 = d0.dimension;
        let dim1 = d1.dimension;
        let e0 = p0.plus(nvec.times(dim0/2));
        let e1 = p0.plus(nvec.times(dist-(dim1/2)));
        line.setEnds(e0,e1);
        line.show();
        line.update();
      } else {
        line.hide();
      }
    }
  }
}
     
     
/*     
rs.addDrop = function (drop) {
  //debugger;
  if (!drop) {
   // debugger;
    return;
  }
  let cdrop = this.closestDrop(drop);
  if (!cdrop) {
    return;
  }
  
  let p = drop.point;
  let cp = cdrop.point;
  let dist = cp.distance(p);
  let cvec = cp.difference(p);
  let ncvec = cvec.times(1/dist);
  drop.cdrop = cdrop;
  cdrop.cdrop = drop;
  drop.cvec = ncvec;
  drop.cdist = dist;
}
  */
rs.addDrops = function (n) {
  let {dropParams,circleP,dropShapes} = this;
  //debugger;
  dropParams.maxDrops = n;
  let newDrops = this.generateCircleDrops(dropParams);
  let ln = newDrops.length;
  for (let i=0;i<ln;i++) {
    let d = newDrops[i];
   // debugger;
    this.addEdge(d);
  }
  this.installCircleDrops(dropShapes,circleP,this.drops);

}


rs.adjustLine = function (drop) {
  let line = drop.line;
  if (line) {
   // debugger;
    let sgf  = this.segFrom(drop);
    if (sgf) {
      line.setEnds(sgf.end0,sgf.end1);
      line.show();
      line.update(); 
    } else {
      line.hide();
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
      //this.adjustLine(d);
    }
  }
  for (let i=0;i<ln;i++) {
    let d = drops[i];
    if (d) {
      //this.adjustLine(d);
    }
  }    
}


rs.initialize = function () {
  this.initProtos();
  this.pointTable = this.buildPointTable(7);//[];//[Point.mk(0,0),Point.mk(-40,0),Point.mk(40,0)];
  debugger;
  let {circleP,dropParams,width} = this;
  let qwd = 1.005*0.25*width;
  this.addFrame();
  //debugger;
  let shapes = this.set('dropShapes',arrayShape.mk());
  let lines = this.set('dropLines',arrayShape.mk());
  this.edges = [];
  let drops =  this.drops = this.generateCircleDrops(dropParams);
  this.computeEdges();
  this.allocLines();
  this.installCircleDrops(shapes,circleP,drops);
  this.showEdges();

}

rs.updateState = function () {
  let {stepsSoFar:ssf} = this;
  this.updatingState = 1;
  console.log('ssf',ssf);
  if (!(ssf%1)) {
    this.addDrops(1);
  }
  this.expandCircles();
  this.showEdges();
  this.detectSideCollisions();
  this.detectCollisions();
}

export {rs};



