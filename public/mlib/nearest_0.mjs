


let rs = function (item) {

item.nearestPositionExcept = function (positions,i,xc) {
  let p = positions[i];
  let pln = positions.length;
  let mind = Infinity;
  let np;
  for (let j=0;j<pln;j++) {
    if ((j!==i)&&(j!==xc)) {
      let pj = positions[j];
      let d =p.distance(pj);
      if (d <mind) {
        np = j;
        mind =d;
      }
    }
  }
  return {index:np,distance:mind}
}

item.nearestPositionExcept = function (positions,i,xc) {
  let p = positions[i];
  let pln = positions.length;
  let xcln = xc.length;
  let mind = Infinity;
  let np;
  for (let j=0;j<pln;j++) {
    if (j!==i){
      let jisxc = 0;
      for (let k=0;k<xcln;k++){
        let xck = xc[k];
        if (xck === j) {
          jisxc = 1;
          break;
        }
      }
      if (!jisxc) {
        let pj = positions[j];
        let d =p.distance(pj);
        if (d <mind) {
          np = j;
          mind =d;
        }
      }
    }
  }
  return {index:np,distance:mind}
}

  
  
item.nearestPositions = function (positions,n) {
  let {debug2} = this;
  if (debug2) {
    debugger;
  }
  let pln = positions.length;
  let nrps =[];
  for (let i=0;i<pln;i++) {
    let nrp = [];
    let exceptions = [];  
    for (let j=0;j<n;j++) {
      let np = this.nearestPositionExcept(positions,i,exceptions);
      exceptions.push(np.index);
      nrp.push(np);
    }
    nrps.push(nrp);
  }
  return nrps;
}
  
    
 

item.displayNearestPositions = function (positions,n) {
 let {lines,lineP,debug2} = this;
   if (debug2) {
    debugger;
  }
  let nrps = this.nearestPositions(positions,n)
  let lnp = nrps.length;
  for (let i=0;i<lnp;i++) {
    let nrpa = nrps[i];
    let nrln = nrpa.length;
    for (let j=0;j<nrln;j++) {
      let nrp = nrpa[j];
      let {index,distance}  = nrp;
      let e0 = positions[i];
      let e1 = positions[index];
      let ln = lines[nrln*i+j];
      if (!ln) {
        ln = lineP.instantiate();
        lines.push(ln);
      }
      ln.show();
      ln.setEnds(e0,e1);
      ln.update();
    }
  }
}
}

export {rs};