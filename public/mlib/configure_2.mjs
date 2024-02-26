const rs = function (item) {

  

item.configureLines = function (params) {
  let {index,center,points} = params;
  //console.log('H index',index,'center',JSON.stringify(center));
  //debugger;
  let {lines} = this;
  let line;
  let p0,p1;
  for (let i=0;i<4;i++) {
    line = lines[index+i];
    if (!line) {
      debugger;
    }
    p0 = points[i].plus(center);
    p1 = points[(i+1)%4].plus(center);
    line.setEnds(p0,p1);
    line.update();
  }
}


item.clines =  function (paramsA,fromKey,fr) {
  let fromParams = paramsA[fromKey];
  let toParams = paramsA[fromKey+1];
  let index  =  fromParams.index;
  debugger;
  let params = this.interpolate(fromParams,toParams,fr);
  params.index=index;
  this.configureLines(params);
}

item.linesPerCell = 4;
  
}
export {rs};
 




