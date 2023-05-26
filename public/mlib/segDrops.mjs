// documented in https://prototypejungle.net/doc/circleDrops.html

const rs = function (rs) {


rs.genRandomPoint = function (rect) {
  if (rect) {
    let {corner,extent} = rect;
    let lx = corner.x;
    let ly = corner.y;
    let x = Math.random() * extent.x + lx;
    let y = Math.random() * extent.y + ly;
    return Point.mk(x,y);
  }
  let {width,height} = this;
  let rx = (Math.random()-0.5) * width;
   let ry= (Math.random()-0.5) * height;
  return Point.mk(rx,ry);
}

rs.via3d = function (p) {
  if (this.genPoint3d) {
    let p3d = this.genPoint3d(p);
    let rs = this.camera.project(p3d);
    return rs;
  }
  return p;
}

/* 
drops is the set of LineSegments dropped so far
targets is the set of pointstwo of which are joined by a new drop.
tried is an array where tried[e0i*maxTargets+e1i]===1 if the segment with ends targets[e0i], targets[iei] as been tried
*/

rs.shortenSeg = function (seg,by) {
  let {end0,end1} = seg;
  let cnt = (end0.plus(end1)).times(0.5);
  let vec = end1.difference(end0);
  let hvec = vec.times((1-by)*0.5);
  let ne0 = cnt.difference(hvec);
  let ne1 = cnt.plus(hvec);
  let nseg = LineSegment.mk(ne0,ne1);
  return nseg;
}

rs.dropCandidate = function (idx) {
  let {targets,maxTargets,tried} = this;
  if (tried[idx]) {
    return;
  }
  let e0i = Math.floor(idx/maxTargets);
  let e1i = idx - e0i * maxTargets;
  if (e0i >= e1i) {
    debugger;
  }
  let ln = targets.length;
  tried[idx] = 1; // this will be tried
  let e0 = targets[e0i];
  let e1 = targets[e1i];
  let seg = LineSegment.mk(e0,e1);
  if (this.segFilter) {
    if (!this.segFilter(seg)) {
      return;
    }
  }
  let sseg = this.shortenSeg(seg,0.01);
  return sseg;
}
 

rs.updateUntried = function () {
  let {targets,maxTargets,untried,tried} = this;
  let ln = tried.length;
  let nut = [];
  for (let i=0;i<ln;i++) {
    let tr = tried[i];
    if (tr===0) {
      nut.push(i);
    }
  }
  debugger;
  this.untried = nut;
}
        
        

rs.tryDrop = function () {
  let {drops,maxTargets,untried} = this;
  let uln = untried.length;
  if (uln === 0) {
    return 'nothingUntried';
  }
  let di = this.randomIntLessThan(uln);  
  let dc = this.dropCandidate(untried[di]);
  if (dc) {
    let dln = drops.length;
    for (let i=0;i<dln;i++) {
      let dseg = drops[i];
      let p = dc.intersect(dseg);
      if (p) {
       return 'intersected';
      }
    }
    drops.push(dc);
    return 'newDrop';
  }
  return 'noCandidate'
}

rs.dropLoop = function () {
  let {maxFindUntried,maxCheckIntersect} = this;
  let fut = 0;
  let fint = 0;
  while (1) {
    let drop = this.tryDrop();
    if (drop === 'newDrop') {
      fut=0;
      fint=0;
    } else if (drop === 'noCandidate') {
      fut++;
    } else if (drop === 'intersected') {
      fint++;
    }
    if (drop === 'nothingUntried') {
      return drop;
    }
    if (fut>=maxFindUntried) {
      this.updateUntried();
      fut = 0;
    } else if (fint >= maxCheckIntersect) {
      return 'tooManyIntersectChecks';
    }
  }
}

rs.initDrop = function () {
  let {maxTargets} = this;
  let tried = this.tried = [];
  let untried = this.untried = [];
  let tln = maxTargets*maxTargets;
  for (let i=0;i<tln;i++) {
    let e0i = Math.floor(i/maxTargets);
    let e1i = i - e0i * maxTargets;
    if (e0i < e1i) {
      tried.push(0);
      untried.push(i);
    } else {
      tried.push(1);
    }
  }
  //this.targets = [];
  this.drops = [];
}  


        
        
      
  
rs.installDrops = function (lineP) {
  let {drops} = this;
  let shapes = this.set('shapes',arrayShape.mk());
  let ln  = drops.length;
  for (let i=0;i<ln;i++) {
    let {end0,end1} = drops[i];
    let line = lineP.instantiate();
    line.setEnds(end0,end1);
    shapes.push(line);
   }
}
}


export {rs};      
    
    
      
