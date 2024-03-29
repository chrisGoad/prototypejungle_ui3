

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


item.inCycle = function (mg,t) {
  let {startTime:st,duration:dur,cycles} = mg;
  let et = st+dur;
  let rt = t-st;
  if ((t<st)||(t>=et)) {
    return null;
  }
  let cycleDur = dur/cycles;
  let cycleNum = Math.floor(rt/cycleDur);
  let hf = (rt%cycleDur)/cycleDur;
  return {cycleNum,howFar:hf};
}

item.execCircularMotion=  function (mg,m,t,i) {
  let {startTime:st,duration:dur,cycles,oPoly,positions,radius} = mg;
  let {startPhase:sph,shape} = m;
  let inC = this.inCycle(mg,t);
  let hf = inC.howFar;
  if (hf === null) {
    return;
  }
  let a = 2*Math.PI*hf+sph;
  debugger;
  let cp = Point.mk(Math.cos(a),Math.sin(a)).times(radius);
  let acp = cp.plus(Point.mk(.5,.5));
  let rp = this.usq2qpoint(acp,oPoly.corners);
  positions[i] = rp;
  //shape.hide();
  if (shape) {
    shape.moveto(rp);
  }
}

item.segLengths = function (path) {
  let ln = path.length;
  let slns = [];
  for (let i=0;i<ln-1;i++) {
    let p0 = path[i]
    let p1 = path[i+1]
    let d = p0.distance(p1);
    slns.push(d);
  }
  return slns;
}

item.pathLength = function (path) {
  let slns = this.segLengths(path);
  let ln = slns.reduce((a,b) => a+b,0);
  return ln;
}


item.alongPath = function (path,fr) {
  //debugger;
  let ds2p0 = 0; // distance to begining of current segment (segment i);
  let slns = this.segLengths(path);
  let pln = slns.reduce((a,b) => a+b,0);
  let ln = path.length;
  let targetln = pln*fr;
  for (let i=0;i<ln-1;i++) {
    let sln = slns[i];
    let ds2p1 = ds2p0+ sln;
    if (ds2p1 >= targetln) { // our target point is in this segment
       let p0 = path[i];
       let p1 = path[i+1];
       let lnis = targetln - ds2p0; // length in this segment
       let csln = slns[i];
       let sfr = lnis/csln;
       let vec = p1.difference(p0);
       let target = p0.plus(vec.times(sfr));
       return target;
    } 
    ds2p0 = ds2p1;
  }
}
       
item.showPathh = function (path,fc,lineP) {
  let {pathLines,conne} = this;
  if (!pathLines) {
    pathLines = this.set('pathLines',arrayShape.mk());
  }
  let ln = path.length;
  for (let i=0;i<(ln-1);i++) {
    let e0 = path[i].times(fc);
    let e1 = path[i+1].times(fc);
    let line = connectorP.instantiate();
    line.show();
    line.setEnds(e0,e1);
    pathLines.push(line);
  }
}

   
    
  item.execPathMotion=  function (mg,m,t,i) {
  let {startTime:st,duration:dur,cycles,paths} = mg;
  let {phase,shape,oPoly,lastCycle,pathNum} = m;
  let path = paths[pathNum];
  let inC = this.inCycle(mg,t);
  let {cycleNum,howFar:hf} = inC;
  if (cycleNum !== lastCycle) {
  //  debugger;
  }
  if (hf === null) {
    return;
  }
  let ef = hf+phase;
 // console.log('phase',phase,'ef',ef);

  if (ef > 1) {
   // debugger;
  }
  let fr = ef%1;
  debugger;
  let cp = this.alongPath(path,fr);
  let rp = this.usq2qpoint(cp,oPoly.corners);
  m.lastCycle = cycleNum;
  if (shape) {
    shape.alongPath = fr;
    shape.moveto(rp);
  }
}

  
// point to point
item.execP2Pmotion=  function (mg,m,t,i) {
  let {startTime:st,duration:dur,cycles} = mg;
  let {p0,p1,phase,shape,oPoly} = m;
  debugger;
  let inC = this.inCycle(mg,t);
  let hf = inC.howFar;
  if (hf === null) {
    return;
  }
  let vec = p1.difference(p0);
  let  hvec = vec.times(0.5);
  let mp = p0.plus(hvec);
  let hcp = hf<=0.5?hf*2:1-(hf-.5)*2; // half cycle parameter
  let a = 2*Math.PI*hf;
  let cs =  Math.cos(a);
  let cp = mp.plus(hvec.times(cs));
  let rp = this.usq2qpoint(cp,oPoly.corners);
  if (shape) {
    shape.moveto(rp);
  }
}

item.execMotion = function (mg,m,t,i) {
  let {kind} = mg;
 // debugger;
  if (kind === 'circular') {
    this.execCircularMotion(mg,m,t,i);
  } else  if (kind === 'P2P') {
    this.execP2Pmotion(mg,m,t,i);
  } else if (kind === 'Path') {
    this.execPathMotion(mg,m,t,i);
  }
}

item.execMotionGroup = function (mg,t) {
  let {motionsPerPath,polygon,paths} = mg;
  let positions = mg.positions = [];
  let pathsln = paths.length;
  for (let i=0;i<pathsln;i++) {
    let motions = motionsPerPath[i];
    let ln = motions.length;
    for (let i=0;i<ln;i++) {
      let m = motions[i];
      this.execMotion(mg,m,t,i);
    }
  }
  //debugger;
  if (polygon) {
    polygon.corners = positions;
    polygon.show();
    polygon.update();
  }
 
}

item.execMotionGroups = function (t) {
  let {motionGroups} = this;
  motionGroups.forEach((mg) => {
    this.execMotionGroup(mg,t);
  });
  this.updateConnectors();
}


item.mkP2Pmotion = function (mg,params) { //point to point
  let {motions,shapeP} = mg;
  let {mshapes} = this;
  let {p0,p1,phase,oPoly} = params;
  debugger;
  //let {motions,mshapes,stepsSoFar:ssf} = this;
  let shape = shapeP?shapeP.instantiate():null;
  if (shape) {
    mshapes.push(shape);
  }
  let m= {shape,p0,p1,phase,oPoly};
  motions.push(m);
  
}

item.mkPathMotion = function (mg,params) { //point to point
  let {shapeP} = mg;
  let {mshapes} = this;
  let {phase,oPoly,motions,shapes,pathNum} = params;
  //debugger;
  //let {motions,mshapes,stepsSoFar:ssf} = this;
  let shape = shapeP?shapeP.instantiate():null;
  if (shape) {
    mshapes.push(shape);
  }
  let m= {shape,phase,oPoly,pathNum};
  motions.push(m);
  shapes.push(shape);
  
}
item.mkCircularMotion = function (mg,startPhase) {
  let {motions,shapeP} = mg;
  let {mshapes} = this;
  debugger;
  //let {motions,mshapes,stepsSoFar:ssf} = this;
  let shape = shapeP?shapeP.instantiate():null;
  if (shape) {
    mshapes.push(shape);
  }
  let m= {shape,startPhase};
  motions.push(m);
  
}
 

item.mkCircularMotionGroup = function (n,params) {
  let {stepsSoFar:ssf,motionGroups,mshapes} = this;
  let {duration,cycles,map,radius,center,shapeP,polyP,oPoly} = params;
  let polygon = polyP?polyP.instantiate():null;
  if (polygon) {
    mshapes.push(polygon);
  }
  let mg = {kind:'circular',duration,cycles,center,radius,map,positions:[],startTime:ssf,shapeP,polygon,motions:[],oPoly};
  let step = (2*Math.PI)/n;
  for (let i=0;i<n;i++) {
    let phase = i*step;
    this.mkCircularMotion(mg,phase);
  }
  motionGroups.push(mg);

}
/*
item.mkCircularMotionGroup = function (n,params) {
  let {stepsSoFar:ssf,motionGroups,mshapes} = this;
  let {duration,cycles,map,radius,center,shapeP,polyP,oPoly} = params;
  let polygon = polyP?polyP.instantiate():null;
  if (polygon) {
    mshapes.push(polygon);
  }
  let mg = {kind:'circular',duration,cycles,center,radius,map,positions:[],startTime:ssf,shapeP,polygon,motions:[],oPoly};
  let step = (2*Math.PI)/n;
  for (let i=0;i<n;i++) {
    let phase = i*step;
    this.mkCircularMotion(mg,phase);
  }
  motionGroups.push(mg);

}*/


item.mkP2PmotionGroup = function (params) {
  let {stepsSoFar:ssf,motionGroups,mshapes} = this;
  let {duration,cycles,p0s,p1s,shapeP,oPolys} = params;
  debugger;
  let mg = {kind:'P2P',duration,cycles,startTime:ssf,shapeP,motions:[]};
  let ln = p0s.length;
  for (let i=0;i<ln;i++) {
    this.mkP2Pmotion(mg,{p0:p0s[i],p1:p1s[i],oPoly:oPolys[i]});
  }
  motionGroups.push(mg);

}


item.mkPathMotionGroup = function (params) {
  let {stepsSoFar:ssf,motionGroups,mshapes} = this;
  let {cell,duration,cycles,paths,phases,shapeP,oPoly,shapeConnector} = params;
  debugger;
  let mg = {kind:'Path',duration,cycles,phases,startTime:ssf,shapeP,paths,shapesPerPath:[],motionsPerPath:[]};
  let pathsln = paths.length;
  let shapesPerPath = mg.shapesPerPath;
  let motionsPerPath = mg.motionsPerPath;
  for (let i = 0;i<pathsln;i++) {
    let ln = phases.length;
    let shapes = [];
    let motions = [];
    for (let j=0;j<ln;j++) {
      let params = {phase:phases[j],oPoly:oPoly,motions,shapes,pathNum:i}
      this.mkPathMotion(mg,params);
    }
    shapesPerPath.push(shapes);
    motionsPerPath.push(motions);
  }
  if (shapeConnector) {
    shapeConnector.call(this,mg,cell);
  }
  motionGroups.push(mg);

}

item.connectShapes = function () {
  let {connectorP,connectedShapes:cns} = this;
  let connectors = this.set('connectors',arrayShape.mk());
  let connectorSegs = this.set('connectorSegs',arrayShape.mk());
  let connectorIntersections = this.set('connectorIntersections',arrayShape.mk());
  let ln = cns.length;
  for (let i=0;i<ln;i++) {
     let line = connectorP.instantiate();
     connectors.push(line);
     let seg = LineSegment.mk(Point.mk(0,0),Point.mk(0,1));
     connectorSegs.push(seg)
  }
}

  
  
  
item.updateConnectors = function () {
  let {connectors,connectorSegs:cnsegs,connectedShapes:cns,connectorIntersections:cints,icircleP} = this;
  if (!cns) {
    return;
  }
  debugger;
 
  let ln = cns.length;
  for (let i=0;i<ln;i++) {
    let connector = connectors[i];
    let connSeg = cnsegs[i];
    let connection = cns[i];
    let c0 = connection[0];
    let c1 = connection[1]
    let tr0 = c0.getTranslation();
    let ap0 = c0.alongPath;
    let tr1 = c1.getTranslation();
    let ap1 = c1.alongPath;
    let apMax = Math.max(ap0,ap1);
    let apMin = Math.min(ap0,ap1);
    let lowFade = .03;
    let highFade = 1-lowFade;
    let fadeLow=1;
    let fadeHigh=1;
    if (apMin < lowFade)  {
      fadeLow = apMin/lowFade;
    } 
    if (apMax>highFade) {
      fadeHigh = (1-apMax)/lowFade;
    }
    let minFade = Math.min(fadeLow,fadeHigh);
   // console.log('apMax',apMax,'apMin',apMin,'fadeLow',fadeLow,'fadeHigh',fadeHigh);
    let clr = `rgba(255,255,255,${minFade})`;
    connector.stroke = clr;
    c0.fill = clr;
    c0.update();
    c1.fill = clr;
    c1.update();
    connector.setEnds(tr0,tr1);
    connector.update();
    connSeg.setEnds(tr0,tr1);
  }
  let intscts = allSegmentIntersections(cnsegs);
  let lnscts = intscts.length;
  let lncints = cints.length;
  if (lnscts >= lncints) {
    for (let i=lncints;i<lnscts;i++) {
      let crc = icircleP.instantiate();
      cints.push(crc);
    }
  }
  for (let i=0;i<lnscts;i++) {
    let sct = intscts[i];
    let crc = cints[i];
    crc.show();
    crc.moveto(sct);
  }
  for (let i=lnscts;i<lncints;i++) {
    let crc = cints[i]
    crc.hide();
  }
      
}
    
item.hideUnconnectedShapes = function () {
  let {mshapes,connectedShapes} = this;
  let allCns = [];
  connectedShapes.forEach( (cs) => {
    let c0 = cs[0];
    let c1 = cs[1];
    if (allCns.indexOf(c0) === -1) {
      allCns.push(c0);
    }
     if (allCns.indexOf(c1) === -1) {
      allCns.push(c1);
    }
  });
  mshapes.forEach( (s) => {
    if (allCns.indexOf(s)  === -1) {
      s.hide();
    }
  });
}

    
}
  
export {rs};

