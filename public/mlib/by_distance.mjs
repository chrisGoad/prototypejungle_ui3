


let rs = function (item) {

item.addLinesBetweenPositions = function (positions,lineP) {
  let {lines,segs} = this;
  let np = positions.length;
  for (let i=0;i<np;i++) {
    let psi = positions[i]
    psi.firstLine = lines.length;
    let line;
    for (let j = i+1;j<np;j++) {
      if (segs) {
        let seg= LineSegment.mk(Point.mk(0,0),Point.mk(0,0));
        segs.push(seg);
      } 
      if (lines) {
        line = lineP.instantiate();
        line.show();
        lines.push(line);
      }

    }
  }
}

item.normalizePoints= function(pnts,radius) {
  let dfz = 0; //distance from origin
  pnts.forEach( (p) =>{
    let d = p.length();
    if (d>dfz) {
      dfz = d;
    }
  });
  let sc = radius/dfz;
  let npnts = pnts.map( (p) => p.times(sc));
  return npnts;
}

item.updateLines = function (positions,fn) {
  let {lines,segs} = this;
  let nl = lines.length;
  let np = positions.length;
  let maxd = -Infinity;
  let mind = Infinity;
  for (let i=0;i<np;i++) {
    let psi = positions[i];
    //let nxtps = i<np-1?positions[i+1]
    let fl = psi.firstLine;
    let cnt = 0;
    for (let j = i+1;j<np;j++) {
      let line = lines?lines[fl+cnt]:undefined;
      let seg = segs?segs[fl+cnt]:undefined;
      cnt++;
      let psj = positions[j];
      if (line) {
        line.setEnds(psi,psj);
      }
      if (seg) {
        seg.setEnds(psi,psj);
      }
      let dist = psi.distance(psj);
      if (dist > maxd) {
        maxd = dist;
      }
      if (dist < mind) {
        mind = dist;
        mind = dist;
      }
      
     // console.log('dist',dist);
      if (line) {
        if (fn) {
          fn(line,dist);
        }
        line.update();
      }
    }
  } 
  return {mind,maxd}
}    
    
}

export {rs};