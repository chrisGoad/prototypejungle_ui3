
const rs = function (item) {


item.installCircleDrops = function (graph3d) {
  let {shapes,camera,lines,dropP,includeLines,lineP,frameRectangle:frrect,escapesFrame:efrm} = this;
  debugger;
  let {drops,segs} = graph3d;
  let inPlace = !!shapes;
  if (!inPlace) {
    shapes = this.set('shapes',arrayShape.mk());
    lines = this.set('lines',arrayShape.mk());
   }
  let ln  = drops.length;
  for (let i=0;i<ln;i++) {
  let drop = drops[i];
    let {point,radius,dimension} = drop;//,fill} = drop;
    let crc,fill;
    if (inPlace) {
      crc = shapes[i];
    } else {
      crc = dropP.instantiate();
     fill = i%2?'red':'blue'
    }
    let line;
    if (includeLines && !segs) {
      line=inPlace?lines[i]:lineP.instantiate();
    }
    crc.setDimension(dimension?dimension:2*scale*radius);
    if (fill) {
      crc.fill = fill;
    }
    if (!inPlace) {
      shapes.push(crc);
      if (includeLines && !segs) {
        lines.push(line);
      }
    }
  
    crc.update();
    if (crc.initialize) {
      crc.initialize();
    }
    let pnt2d = camera?point.project(camera):point;
    if (frrect) {
      if ((!efrm) && (!frrect.containsPoint(pnt2d))) {
         this.escapesFrame = true;
      }
    }
    drop.projection = pnt2d;
    drop.shape = crc;
    crc.moveto(pnt2d);
   }
  if (segs && (!inPlace)) {
    let sln = segs.length;
    for (let i=0;i<sln;i++) {
      lines.push(lineP.instantiate());
    }
  }
}

item.placeDrops = function (graph3d) {
  let {drops} = graph3d;
  drops.forEach( (drop) => {
    let {projection,shape} = drop;
    shape.moveto(projection);
  });
}


item.placeLines = function (graph3d) {
  let {lines} = this;
  let {drops,segs} = graph3d;
  let dln = drops.length;
  const updateLine =  (i) => {
    let line = lines[i];
    let e0i,e1i;
    if (1 || segs) {
      let seg = segs[i];
      e0i = seg[0];
      e1i = seg[1];
    } else {
      e0i = i;
      e1i = (i+1)%dln;
    }
    let e0 = drops[e0i].pnt2d;    
    let e1 = drops[e1i].pnt2d;
    line.setEnds(e0,e1);
    line.update();
  }
    
  if (1 || segs) {
    let ln = segs.length;
    for(let i=0;i<ln;i++) {
      updateLine(i);
    }
  } else {
    for(let i=0;i<dln;i++) {
      updateLine(i);
    }
  }
  
}
 


item.applyTransformInPlaceToDrops = function (tr,drops) {
  drops.forEach((drop) => {
    let p = drop.point;
    p.applyTransformInPlace(tr);
  });
}
    
}


export {rs};       