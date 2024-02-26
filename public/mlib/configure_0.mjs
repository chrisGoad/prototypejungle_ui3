const rs = function (item) {

  

item.configureLinesH = function (params) {
  let {index,center,lineLengthH:ln,lineSepH:sep,lineDistH:d} = params;
  //console.log('H index',index,'center',JSON.stringify(center));
 //  debugger;
  let {lines} = this;
  let hsep = 0.5*sep
  let bot = d;
  let top = -bot;
  let right = hsep+ln;
  let left = -right;
  let e0,e1;
  let ul = lines[index+0];
  e0 = Point.mk(left,top).plus(center);
  e1 = Point.mk(-hsep,top).plus(center);
  ul.setEnds(e0,e1);
  ul.update();
  
  let ur = lines[index+1];
  e0 = Point.mk(hsep,top).plus(center);
  e1 = Point.mk(right,top).plus(center);
  ur.setEnds(e0,e1);
  ur.update();
   
  let ml = lines[index+2];
  e0 = Point.mk(left,0).plus(center);
  e1 = Point.mk(-hsep,0).plus(center);
  ml.setEnds(e0,e1);
  ml.update();
  
  let mr = lines[index+3];
  e0 = Point.mk(hsep,0).plus(center);
  e1 = Point.mk(right,0).plus(center);
  mr.setEnds(e0,e1);
  mr.update(); 
  
  let ll = lines[index+4];
  e0 = Point.mk(left,bot).plus(center);
  e1 = Point.mk(-hsep,bot).plus(center);
  ll.setEnds(e0,e1);
  ll.update();
  
  let lr = lines[index+5];
  e0 = Point.mk(hsep,bot).plus(center);
  e1 = Point.mk(right,bot).plus(center);
  lr.setEnds(e0,e1);
  lr.update();
}

item.configureLinesV = function(params) {
  let {index:idx,center,lineLengthV:ln,lineSepV:sep,lineDistV:d} = params;
  let {lines} = this;
  let index = idx+6;
  //console.log('V index',index,'center',JSON.stringify(center));
  //debugger;
  let hsep = 0.5*sep  
  let bot = hsep+ln;
  let top = -bot;
  let left = -d;
  let right = d;
  let e0,e1;
  
  let ul = lines[index+0];
  if (!ul) {
    debugger;
  }
  e0 = Point.mk(left,top).plus(center);
  e1 = Point.mk(left,-hsep).plus(center);
  ul.setEnds(e0,e1);
  ul.update();
  
  let um = lines[index+1];
  e0 = Point.mk(0,top).plus(center);
  e1 = Point.mk(0,-hsep).plus(center);
  um.setEnds(e0,e1);
  um.update();
  
  let ur = lines[index+2];
  e0 = Point.mk(right,top).plus(center);
  e1 = Point.mk(right,-hsep).plus(center);
  ur.setEnds(e0,e1);
  ur.update();
  
  
  let ll = lines[index+3];
  e0 = Point.mk(left,hsep).plus(center);
  e1 = Point.mk(left,bot).plus(center);
  ll.setEnds(e0,e1);
  ll.update();
  
  let lm = lines[index+4];
  e0 = Point.mk(0,hsep).plus(center);
  e1 = Point.mk(0,bot).plus(center);
  lm.setEnds(e0,e1);
  lm.update();
  
  let lr = lines[index+5];
  e0 = Point.mk(right,hsep).plus(center);
  e1 = Point.mk(right,bot).plus(center);
  lr.setEnds(e0,e1);
  lr.update();
}

item.configureLines= function(params) {
  this.configureLinesH(params);
  this.configureLinesV(params);
}

item.clines =  function (paramsA,fromKey,fr) {
  let fromParams = paramsA[fromKey];
  let toParams = paramsA[fromKey+1];
  let index  =  fromParams.index;
  let params = this.interpolate(fromParams,toParams,fr);
  params.index=index;
  this.configureLines(params);
}


item.linesPerCell=12;
}
export {rs};
 




