const rs = function (item) {

item.addLines = function (n) {
  let {lines,lineP} = this;
  let ln = lines.length;
  for (let i=0;i<n;i++) {
    let line =lineP.instantiate();
    lines.push(line);
    line.stroke =(i%2)?'yellow':'cyan';
  }
  return ln;
}

item.addLinesForGrid = function (n) {
  let {numRows:nr,numCols:nc} = this;
  for (let i=0;i<nr;i++) {
    for (let j=0;j<nc;j++){
      this.addLines(n);
    }
  }
}

item.gridCellCenter = function (i,j) {
  let {width:wd,height:ht,numRows:nr,numCols:nc} = this;
  let deltaX = wd/nr;
  let deltaY = ht/nc;
  let minX = deltaX/2-wd/2;
  let minY = deltaY/2-ht/2;
  let y = minX+i*deltaX;
  let x = minY+j*deltaY;
  let c = Point.mk(x,y);
  return c;
}

item.gridCellIndex = function (i,j) {
  let {numRows:nr,numCols:nc} = this;
  let idx = i*nc+j;
  return idx;
}

item.adjustParamsAforGridCell = function (i,j,paramsA) {
  let {linesPerCell:lpc} = this;
  let c = this.gridCellCenter(i,j);
  let idx = this.gridCellIndex(i,j)*lpc;
  paramsA.forEach((pa) => {
    pa.center = c;
    pa.index = idx;
  });
  return paramsA;
}

// each
item.buildParamsAforGrid = function (paramsAtemplate) {
  let {numRows:nr,numCols:nc} = this;
  let pln = paramsAtemplate.length;
  let gpa = this.gridParamsArrays = [];
  for (let i=0;i<nc;i++) {
    for (let j=0;j<nr;j++) {
      let paramsA = [];
      for (let k=0;k<pln;k++) {
        let params = paramsAtemplate[k];
        let nparams = {};
        Object.assign(nparams,params);
        paramsA.push(nparams);
      }
      this.adjustParamsAforGridCell(i,j,paramsA)
      gpa.push(paramsA);
    }
  }
  return gpa;
}


  

/*
item.speedFun = function (i,j,issf) {
  let {numSteps,stepsSoFar:ssf} = this;
  let mssf = Math.floor(.5+(i+j)/nr)*ssf%numSteps;
  return mssf;
}
item.speedFun = function (i,j,issf) {
  let {numSteps,stepsSoFar:ssf} = this;
  let mssf = (issf+i+j)%numSteps;
  return mssf;
}
*/
item.setCellState = function (i,j) {
  let {gridParamsArrays:gpa,numSteps,stepsSoFar:issf,pauseSteps:ps,numRows:nr,twice} = this;
 // let numSteps = twice?2*inumSteps:inumSteps;
  let oi = (i)%2;
  oi = (i)>8;
  let cycleSteps = numSteps;
  let ssf = this.speedFun(i,j);
   if ((j===0)&&(i<2)) {
   // console.log('oi',oi,'issf',issf,'ssf',ssf);
    //debugger;
  }
   let idx = this.gridCellIndex(i,j);
  let paramsA = gpa[idx];
  let pln = paramsA.length;
  let stepLn = numSteps/(pln-1);
  const inInterval = (v,n) => {
    return (n*stepLn<=v) && (v < (n+1)*stepLn);
  }
   const fractionThruInterval = (v,n) => {
    return (v-n*stepLn)/stepLn;
  }
  let cyssf = ssf%cycleSteps;
 for (let n=0;n<pln-1;n++) {
    if (inInterval(ssf,n)) {
      let fr = fractionThruInterval(ssf,n); 
     // console.log('ssf',ssf,'n',n,'stepLn',stepLn,'lb',n*stepLn,'ub',(n+1)*stepLn,'fr',fr);
      this.clines(paramsA,n,fr);
    }
  }   
}

item.setCellStates = function () {
  let {numRows:nr,numCols:nc} = this;
  for (let i=0;i<nr;i++) {
    for (let j=0;j<nr;j++) {
      this.setCellState(i,j);
    }
  }
}

item.initialize = function () {
  debugger; 
  //let numSteps = this.numSteps = 128;
  let {linesPerCell:lpc} = this;
  this.pauseSteps = 0;//numSteps/8;
  this.initProtos();
  this.addFrame();
  let lines = this.set('lines',arrayShape.mk());
  this.addLinesForGrid(lpc);
  this.buildParamsArray();
  this.setCellStates();

}

item.updateState = function () {
  let {stepsSoFar:ssf} = this;
  console.log('ssf',ssf);
  this.setCellStates();
  this.pauseAnimationMaybe();
}
}

 
export {rs};



