


let rs = function (item) {

item.addLinesBetweenPositions = function (positions,lineP) {
  let {lines} = this;
  let np = positions.length;
  for (let i=0;i<np;i++) {
    let psi = positions[i]
    psi.firstLine = lines.length;
    for (let j = i+1;j<np;j++) {
      let line = lineP.instantiate();
      line.show();
      lines.push(line);
    }
  }
}

item.updateLines = function (positions,fn) {
  let {lines} = this;
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
      let line = lines[fl+cnt];
      cnt++;
      let psj = positions[j];
      line.setEnds(psi,psj);
      let dist = psi.distance(psj);
      if (dist > maxd) {
        maxd = dist;
      }
      if (dist < mind) {
        mind = dist;
        mind = dist;
      }
      
     // console.log('dist',dist);
      fn(line,dist);
      line.update();
    }
  } 
  return {mind,maxd}
}    
    
}

export {rs};