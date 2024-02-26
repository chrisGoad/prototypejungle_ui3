const rs = function (item) {

  

item.configureLines = function (params) {
  let {index,center,lineLength:ln,linePos:pos} = params;
  //console.log('H index',index,'center',JSON.stringify(center));
  debugger;
  let {lines} = this;
  let hln = ln/2;
  let e0,e1;
  let d = 0;
  let left = lines[index+0];
  if (!left) {
    debugger;
  }
  
  e0 = Point.mk(-pos,hln).plus(center);
  e1 = Point.mk(d-pos,-hln).plus(center);
  left.setEnds(e0,e1);
  left.update();
  
  let right = lines[index+1];
  e0 = Point.mk(pos,hln).plus(center);
  e1 = Point.mk(pos+d,-hln).plus(center);
  right.setEnds(e0,e1);
  right.update();
  
  
  
  let top = lines[index+2];
  e0 = Point.mk(-hln,pos).plus(center);
  e1 = Point.mk(hln,pos).plus(center);
  top.setEnds(e0,e1);
  top.update();
  
  let bot = lines[index+3];
  e0 = Point.mk(d-hln,-pos).plus(center);
  e1 = Point.mk(d+hln,-pos).plus(center);
  bot.setEnds(e0,e1);
  bot.update();
}


item.clines =  function (paramsA,fromKey,fr) {
  let fromParams = paramsA[fromKey];
  let toParams = paramsA[fromKey+1];
  let index  =  fromParams.index;
  let params = this.interpolate(fromParams,toParams,fr);
  params.index=index;
  this.configureLines(params);
}

item.linesPerCell = 4;
  
}
export {rs};
 




