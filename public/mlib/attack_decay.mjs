


let rs = function (item) {

/* 
state = {shape,startAttack,attackDuration,value,zeroValue,applicator} or {startDecay,decayDuration,value,zeroValue,applicator} 
fn is the application function: fn(shape,interpolatedVal) 
*/
item.execAD = function (state) {
  let {lines,ADpool,currentTime:t,attackDuration:dad,decayDuration:ddd} = this;
  let {startAttack:sta,startDecay:std,attackDuration:sad,decayDuration:sdd,value,zeroValue,applicator}  = state;
  let ad = sad===undefined?dad?sad;
  let dd = sdd===undefined?ddd?sdd;
  let fr;
  let iv; //interpolated value
  if ((sta< t)&&(t<=(sta+ad))) {
    fr = (t-sta)/ad;
    iv = this.interpolate(zeroValue,value,fr);
  } else if ((std<t)&&(t<(std+dd))) {
    fr = (t-std)/dd;
    iv = this.interpolate(value,zeroValue,fr);
  } else if (t>=(std + dt)) {
    shape.hide();
    pool.push(shape);
    return;
  }
  if (iv) {
    applicator(shape,iv);
  }
}

item.execADs = function () {
  let {ADstates} = this
  ADstates.forEach((st) => this.execAD(st));
}


item.startAttack = function (params,value,zeroValue)  {
  let {shape,attackDuration,applicator,value,zeroValue} = params
  let {ADstates,currentTime} = this;
  if (attackDuration) {
    let state = {shape,startAttack:currentTime,attackDuration,value,zeroValue,applicator};
    ADstates.push(state);
  }
  applicator(shape,value);
}
 

item.startDecay = function (params,value,zeroValue)  {
  let {shape,attackDuration,applicator,value,zeroValue} = params;
  let {ADstates,currentTime} = this;
  if (decayDuration) {
    let state = {shape,startDecay:currentTime,decayDuration,value,zeroValue,applicator};
    ADstates.push(state);
  }
  applicator(shape,zeroValue);
}   
  
  

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
  
    
 

item.displayNearestPositions = function (positions,n,nff) {
 let {lines,lineP,debug2} = this;
   if (debug2) {
    debugger;
  }
  let nrps = this.nearestPositions(positions,n)
  let lnp = nrps.length;
 // let colors = ['red','green','blue','yellow','cyan','magenta','white','gray'];
//  let colors = [[250,0,0],[250,0],[0,0,250],[250,250,0],[0,250,250],[250,0,250],[250,250,250],[150,150,150]];// ','green','blue','yellow','cyan','magenta','white','gray'];
  let lineColors = this.cyclingArray([[255,95,0],[255,0,0]],n);// ','green','blue','yellow','cyan','magenta','white','gray'];
  debugger;
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
        lines.push(ln);
      }
      ln.stroke = stroke;
      ln.show();
      ln.setEnds(e0,e1);
      ln.update();
    }
  }
}
}

export {rs};