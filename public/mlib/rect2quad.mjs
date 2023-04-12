

let rs = function (item) {

/*
let wd = 200;
let nr = 20;
nr =200;
rs.setName('rotate_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,stepsPerMove:10,numSteps:100,
                 smooth:1,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1}
Object.assign(rs,topParams);
*/

 
 item.alongSeg = function (p0,p1,fr) {
   let vec = p1.difference(p0);
   let svec  = vec.times(fr);
   let p = p0.plus(svec);
   return p;
}

item.rc2qpoint = function (pos,corners) {
  let {width:wd,height:ht} = this;
  let {x,y} = pos;
  let [LL,UL,UR,LR] = corners;
  let frx = x/wd;
  let fry = y/ht;
  let bp = this.alongSeg(LL,LR,frx);
  let tp = this.alongSeg(UL,UR,frx);
  let p = this.alongSeg(bp,tp,fry);
  return p;
}
  

item.initLines = function () {
  let {numRows:nr,numCols:nc,lineP} = this;
   let lines = this.set('lines',arrayShape.mk());
   for (let j=0;j<=nr;j++) {
     let line = lineP.instantiate();
     lines.push(line);
  }
  for (let i=0;i<=nc;i++) {
    let line = lineP.instantiate();
     lines.push(line);
  }
} 


   /*
 A circular motion is an object {startTime,startPhase,duration,cycles:integer,center:point,radius,shape:shape}
  
  duration is the duration of the whole motion, which includes the given number of cycles
 */
 /* 
 a script is an array of motions. The updateState method runs rs.theScript.*/
 
item.execMotion=  function (m,t) {
  let {startPhase:sph,startTime:st,duration:dur,cycles,center,radius,map} = m;
 
  let et = st+dur;
  if ((t<st)||(t>et)) {
    return;
  }
  let cycleDur = dur/cycles;
  let rt = t-st;
  let ic = (rt%cycleDur)/cycleDur;
  let a = 2*Math.PI*ic;
  let vec = Point.mk(Math.cos(a),Math.sin(a)).times(radius);
  let cp = center.plus(vec);
  let rp = map?map.call(this,cp):cp;
  shape.moveto(rp);
}

item.execMotions = function (t) {
  let {motions} = this;
  motions.forEach((m)=>{
    this.execMotion(m,t);
  });
}

item.addAdot = function (center,radius,t) {
  let {dotShapes,duration,ccircleP,motions} = this;
  let crc = circleP.instantiate();
  dotShapes.push(crc);
  crc.show();
  let m =  {startTime:t,duration,startPoint:sp,endPoint:ep,shape:crc};
  motions.push(m);
}

item.addVdot = function (i,t) {
  let {numRows:nr,numCols:nc} = this;
  let epos = {row:0,col:i};
  let spos = {row:nr,col:i};
  this.addAdot(spos,epos,t);
  
}
 
 
item.addHdot = function (i,t) {
  let {numRows:nr,numCols:nc} = this;
  let spos = {row:i,col:0};
  let epos = {row:i,col:nc};
  this.addAdot(spos,epos,t);
  
}
 

rs.configs =  [];

item.initializee = function() { 
  debugger;
  this.initProtos();
  this.addFrame();
  this.initGrid();
  this.set('lines',arrayShape.mk());
  this.set('dotShapes',arrayShape.mk());
  this.dots = [];
  this.addLines();
//  this.addDots();
} 
  //this.updateState();

  

item.updateStatee = function () {
  let {stepsSoFar:ssf,numSteps,stepsPerMove} =this;
  let stinm = ssf%stepsPerMove;
  let fr = stinm/stepsPerMove;
  if ((ssf%(stepsPerMove*2)) === 0) {
    debugger;
    this.addDots();
  }
//  debugger;
  if (stinm === 0) {
    //debugger;
    if (ssf>0) {
      this.moveDots();
    }
    this.clearOccupants();
    this.resetDots();
    this.placeDotsInNextGrid();
    for (let i=0;i<4;i++) {
      let stopped =this.stopDots(0);
      console.log('stopped',stopped);
    }
    
  }
  this.performMove(fr);    
} 

}
    

  
export {rs};


