

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
 a motion group is an array of motions that share a common  startTime duration,cycles, and positions
 a script is an array of motion groups. The updateState method runs rs.theScript.*/
 
item.execMotionGroup = function (mg,t,i) {
  let {startTime,duration,cycles,map,motions} = mg;
  motions.forEach( (m) => {
     this.execMotion(mg,m,t,i);
  });
}

item.execMotion=  function (mg,m,t,i) {
  let {startTime:st,duration:dur,cycles,map,positions,radius,center} = mg;
  let {startPhase:sph,shape} = m;
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
  positions[i] = rp;
  //shape.hide();
  shape.moveto(rp);
}

item.execMotionGroup = function (mg,t) {
  let {motions,polygon} = mg;
  let positions = mg.positions = [];
  let ln = motions.length;
  for (let i=0;i<ln;i++) {
    let m = motions[i];
    this.execMotion(mg,m,t,i);
  }
  debugger;
  polygon.corners = positions;
  polygon.show();
  polygon.update();
 
}

item.execMotionGroups = function (t) {
  let {motionGroups} = this;
  motionGroups.forEach((mg) => {
    this.execMotionGroup(mg,t);
  });
}

item.mkCircularMotion = function (mg,startPhase) {
  let {motions,shapeP} = mg;
  let {mshapes} = this;
  debugger;
  //let {motions,mshapes,stepsSoFar:ssf} = this;
  let shape = shapeP.instantiate();
  mshapes.push(shape);
  let m= {shape,startPhase};
  motions.push(m);
  
}
 

item.mkCircularMotionGroup = function (n,params) {
  let {stepsSoFar:ssf,motionGroups,mshapes} = this;
  let {duration,cycles,map,radius,center,shapeP,polyP} = params;
  let polygon = polyP.instantiate();
   mshapes.push(polygon);
  let mg = {kind:'circular',duration,cycles,center,radius,map,positions:[],startTime:ssf,shapeP,polygon,motions:[]};
  let step = (2*Math.PI)/n;
  for (let i=0;i<n;i++) {
    let phase = i*step;
    this.mkCircularMotion(mg,phase);
  }
  motionGroups.push(mg);

}
 

 

    
}
  
export {rs};


