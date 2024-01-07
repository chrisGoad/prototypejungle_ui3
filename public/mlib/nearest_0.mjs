


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
  
item.sameLine = function (line0,line1) {
  let l0e0 = line0.e0index;
  let l0e1 = line0.e1index; 
  let l1e0 = line1.e0index;
  let l1e1 = line1.e1index;
  let same = ((l0e0 === l1e0) && (l0e1 === l1e1))||((l0e0 === l1e1) && (l0e1 === l1e0));
  return same;
}
  

item.displayNearestPositions = function (positions,n,nff,ad) {// ad = attack decay parameters
  let {lines,lineP,debug2,lineColors} = this;
 
   if (debug2) {
    debugger;
  }
  let aparams;
  if (ad) {
    let {attackDuration} = ad;
    let applicator = (shape,value) => {
      let stroke = this.arrayToRGB(value);
      shape.stroke = stroke;
      shape.show();
      shape.update();
    }
    let zeroValue = [0,0,0];
    aparams = {attackDuration,zeroValue,applicator};
  }
  let nrps = this.nearestPositions(positions,n)
  let lnp = nrps.length;
 // let colors = ['red','green','blue','yellow','cyan','magenta','white','gray'];
//  let colors = [[250,0,0],[250,0],[0,0,250],[250,250,0],[0,250,250],[250,0,250],[250,250,250],[150,150,150]];
// ','green','blue','yellow','cyan','magenta','white','gray'];
 //let lineColors = this.cyclingArray([[255,95,0],[255,0,0]],n);// ','green','blue','yellow','cyan','magenta','white','gray'];
 // lines.forEach((ln) => ln.hide());
  for (let i=0;i<lnp;i++) {
    let nrpa = nrps[i];
    let nrln = nrpa.length;
    for (let j=0;j<nrln;j++) {
      let strokev = Math.max((250 - nff*j)/250,0);
      let color = lineColors[j];
      let stroker = color[0]*strokev;
      let strokeg = color[1]*strokev;
      let strokeb = color[2]*strokev;
      let stroke = `rgb(${stroker},${strokeg},${strokeb})`;
      let nrp = nrpa[j];
      let {index,distance}  = nrp;
      let e0 = positions[i];
      let e1 = positions[index];
      let ln = lines[nrln*i+j];
      if (!ln) {
        ln = lineP.instantiate();
        let lln = lines.length;
        ln.index = lln;
        lines.push(ln);
      }
      ln.show();
      ln.setEnds(e0,e1);
      ln.e0index = i;
      ln.e1index = i;
      if (aparams) {
        aparams.value = [stroker,strokeg,strokeb];
        aparams.shape = ln;
        this.startAttack(aparams);
      } else {
        ln.stroke = stroke;
        ln.update();
      }
    }
  }
}
}

export {rs};