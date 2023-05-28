

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


 
    
item.execPathMotion=  function (mg,m,t,i) {
  let {scaling} = this;
  let {startTime:st,duration:dur,cycles,paths,backwards} = mg;
  let {phase,shape,oPoly,lastCycle,pathNum} = m;
 //debugger;
  let path = paths[pathNum];
  if (path.numPhases) {
  //  debugger;
  }
  let inC = this.inCycle(mg,t);
  let {cycleNum,howFar:hf} = inC;
  if (cycleNum !== lastCycle) {
  //  debugger;
  }
  if (hf === null) {
    return;
  }
  let ef = hf+phase;
  //console.log('phase',phase,'ef',ef);

  if (ef > 1) {
   // debugger;
  }
  //debugger;
  let fr = backwards?1-ef%1:ef%1;
  let cp = this.alongPath(path,fr);
  let tr =path.transform;
  let tp = tr?tr.apply(cp):cp;
  let rp = scaling?tp.times(scaling):this.usq2qpoint(tp,oPoly.corners);
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
  let {shapeP:shP} = mg;
  let {paths} = mg;
  let {mshapes} = this;
  let {phase,oPoly,motions,shapes,pathNum} = params;
  if (pathNum === 4) {
  //  debugger;
  }
  //debugger;
  let path=paths[pathNum];
  let pshapeP = path.shapeP;
  let shapeP = pshapeP?pshapeP:shP;
  //debugger;
  //let {motions,mshapes,stepsSoFar:ssf} = this;
  let shape = shapeP?shapeP.instantiate():null;
  shape.pathNum = pathNum;
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
  //let {cell,duration,cycles,paths,phases,shapeP,oPoly,shapeConnector} = params;
  let {cell,duration,cycles,paths,numPhases,shapeP,oPoly,shapeConnector,backwards} = params;
  debugger;
  let mg = {kind:'Path',duration,cycles,numPhases,startTime:ssf,shapeP,paths,shapesPerPath:[],motionsPerPath:[],backwards};
  let pathsln = paths.length;
  let shapesPerPath = mg.shapesPerPath;
  let motionsPerPath = mg.motionsPerPath;
  debugger;
  for (let i = 0;i<pathsln;i++) {
    let path = paths[i];
    let pnp= path.numPhases;
    let ln = pnp?pnp:numPhases;
    let ip = 1/ln;
    let phases =[];
    for (let i=0;i<ln;i++) {
      phases.push(i*ip);
    }
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
     line.index  = i;
     connectors.push(line);
     let seg = LineSegment.mk(Point.mk(0,0),Point.mk(0,1));
     connectorSegs.push(seg)
  }
}

item.paintConnector = function (params) { //might be overriden
  let {shape0:c0,shape1:c1,connector,lowFade} = params;
  //debugger;
  let rgbc;
  if (this.computeRgb) {
    rgbc =this.computeRgb(params);
  } else {
    rgbc = {r:255,g:255,b:255};
  }
  let rgbd = {r:255,g:255,b:255};
  let {r:rd,g:gd,b:bd} = rgbd;
  let {r:rc,g:gc,b:bc} = rgbc;
  let ap0 = c0.alongPath;
  let ap1 = c1.alongPath;
  let apMax = Math.max(ap0,ap1);
  let apMin = Math.min(ap0,ap1);
 // let lowFade = .03;
 // let lowFade = .06;
  //let lowFade = 0;
  let highFade = 1-lowFade;
  let fadeLow=1;
  let fadeHigh=1;
 // debugger;
  if (apMin < lowFade)  {
    fadeLow = apMin/lowFade;
  } 
  if (apMax>highFade) {
    fadeHigh = (1-apMax)/lowFade;
  }
  let minFade = Math.min(fadeLow,fadeHigh);
 // console.log('apMax',apMax,'apMin',apMin,'fadeLow',fadeLow,'fadeHigh',fadeHigh);
  let clrdot = `rgba(${rd},${gd},${bd},${minFade})`;
  let clrcon = `rgba(${rc},${gc},${bc},${minFade})`;
  connector.stroke = clrcon;
  c0.fill = clrdot;
  c0.update();
  c1.fill = clrdot;
  c1.update();
}
  
  
  
item.updateConnectors = function () {
  let {connectors,connectorSegs:cnsegs,connectedShapes:cns,connectorIntersections:cints,icircleP,showIntersections,rgbdot,rgbcon,stepsSoFar:ssf,numSteps} = this;
  if (!cns) {
    return;
  }
//  debugger;
  let ln = cns.length;
  for (let i=0;i<ln;i++) {
    let connector = connectors[i];
    let connSeg = cnsegs[i];
    let connection = cns[i];
    let {shape0:c0,shape1:c1,path,randomOffset0:roff0,randomOffset1:roff1,lowFade} = connection;
    let params ={shape0:c0,shape1:c1,connector,lowFade};
    this.paintConnector(params);
    //let [c0,c1,path,roff0,roff1] = connection;
    //let c1 = connection[1]
    //let path = connection[2];
    connSeg.doNotIntersect = path.doNotIntersect;
    connSeg.ishapeP = path.ishapeP;
    let positions;
    if (this.placeConnector) {
      positions = this.placeConnector(connection);
    } else {
       let tr0 = c0.getTranslation();
       let tr1 = c1.getTranslation();
       positions = [tr0,tr1];
    }
    let [pos0,pos1] = positions;
    connector.setEnds(pos0,pos1);
    connector.update();
    connSeg.setEnds(pos0,pos1);
  }
  if (!showIntersections) {
    return;
  }
  debugger;
  
  let filteredSegs = cnsegs.filter((seg) => !(seg.doNotIntersect));

  let intscts = allSegmentIntersections(filteredSegs);
 /* intscts = intscts.filter((p) => {
    let hideIt = this.callIfDefined("hideIntersection",p);
    return !hideIt;
  });*/
  let lnscts = intscts.length 
  let lncints = cints.length;
 

  if (lnscts >= lncints) {
    debugger;
    for (let i=lncints;i<lnscts;i++) {
      
      let sct = intscts[i];
      let seg0 = sct.seg0;
      let pishP = seg0.ishapeP;	
      let ishapeP = pishP?pishP:icircleP;
      let crc = ishapeP.instantiate();
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


