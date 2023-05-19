

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

item.usq2qpoint = function (pos,corners) { // unit square to quad coords
  //let {width:wd,height:ht} = this;
  let {x,y} = pos;
 // let minX = -0.5*wd;
 // let minY = -0.5*ht;
  let [LL,UL,UR,LR] = corners;
 // let [LL,LR,UR,UL] = corners;
 // let frx = (x-minX)/wd;
 // let fry = (y-minY)/ht;
  //let bp = this.alongSeg(LL,LR,frx);
  let bp = this.alongSeg(LL,LR,x);
  //let tp = this.alongSeg(UL,UR,frx);
  let tp = this.alongSeg(UL,UR,x);
  //let p = this.alongSeg(bp,tp,fry);
 // let p = this.alongSeg(bp,tp,y);
  let p = this.alongSeg(bp,tp,1-y);
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

item.addDot = function () {
  let {circleP,dotShapes} = this;
  let crc = circleP.instantiate();
  dotShapes.push(crc);
  return crc;
}


   /*
 A circular motion is an object {startTime,startPhase,duration,cycles:integer,center:point,radius,shape:shape}
  
  duration is the duration of the whole motion, which includes the given number of cycles
 */
 /* 
 a script is an array of motions. The updateState method runs rs.theScript.*/
 /*
item.execMotion=  function (m,t,i) {
  let {startPhase:sph,startTime:st,duration:dur,cycles,center,radius,map,shape} = m;
  let {lineP,lines,mpositions} = this;
  
  let et = st+dur;
  let rt = t-st;
  if ((t<st)||(t>=et)) {
    return;
  }
  let cycleDur = dur/cycles;
  let ic = (rt%cycleDur)/cycleDur;
  let a = 2*Math.PI*ic+sph;

  if ((rt === 0) || (rt == 191)) {
    console.log('rt',rt,'ic',ic,'t',t);
  }
  let vec = Point.mk(Math.cos(a),Math.sin(a)).times(radius);
  let cp = center.plus(vec);
  let rp = map?map.call(this,cp):cp;
  mpositions[i] = rp;
  shape.hide();
  shape.moveto(rp);
}

item.execMotions = function (t) {
  let {motions,mpositions,mlines,innerPgon:ip} = this;
  let ln = motions.length;
  for (let i=0;i<ln;i++) {
    let m = motions[i];
    this.execMotion(m,t,i);
  }
  ip.corners = mpositions;
  for (let i=0;i<-1;i++) {
    let mline = mlines[i];
    let e0 = mpositions[i];
    let e1 = mpositions[(i+1)%ln];
    mline.setEnds(e0,e1);
  }
 
}

item.mkMotions = function (n,mkMotion) {
  let {motions,mlines,lineP} = this;
  debugger;
  let step = (2*Math.PI)/n;
  for (let i=0;i<n;i++) {
    let phase = i*step;
    let m=mkMotion.call(this,phase);
    motions.push(m);
    //let mline = lineP.instantiate();
   // mline.hide();
    //mlines.push(mline);
  }
}
 
*/
item.toQuad = function(p) {
  let {corners} = this;
  let qp = this.usq2qpoint(p,corners);
  return qp;
}
 

    
}
  
export {rs};


