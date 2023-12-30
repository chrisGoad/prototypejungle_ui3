import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as generatorP} from '/generators/motion_0.mjs'
let rs = generatorP.instantiate();

rs.setName('motion_5');
let ht=50;
let stt=5023;
stt = 4096;
let ts = 12;
stt=2;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:1/1024,stopTime:stt,recordingMotion:1,saveAnimation:1,
    shapesPerRing:6,circleRadius:.2,ringRadii:[.5*ht,.45*ht,.4*ht,.35*ht,.3*ht,.25*ht,.2*ht,.15*ht],
                                       speeds:[ts/6, ts/6,  ts/4, ts/4,  ts/3, ts/3,ts/2,ts/2],toAngle:2*Math.PI};

Object.assign(rs,topParams);

//rs.speeds = [1,1.1,1.2,1.3,1.4,1.5,1.6,1.7];
rs.ringRadii =[.5*ht,.4*ht,.3*ht,.2*ht,.15*ht]
rs.ringRadii =[.5*ht,.45*ht,.4*ht,.35*ht,.2*ht,.15*ht,.1*ht];
rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2; 
}

   
rs.buildShapes = function (params) {
  let {ringRadii:rr,shapesPerRing:spr,circleP,shapes}= this;
  let nr = rr.length;
  for (let i = 0;i<nr;i++) {
    for (let j=0;j<spr;j++) {
      let crc = circleP.instantiate();
      crc.ring = i;
      crc.fractionAround = j/spr;
      crc.show();
      shapes.push(crc);
    }
  }
}

rs. computePosition = function (shape,t) {
 // debugger;
  let {ringRadii:rr,stopTime,toAngle,speeds} = this;
  let {ring,fractionAround:fa,numShapes:ns} = shape;
  let clockwise = (ring%3)?1:-1;
 // console.log('cw',clockwise);
  let rd = rr[ring];
  let speed = speeds[ring];
  let frt = t*speed/stopTime;
  let a = clockwise*((frt+fa) * toAngle);
  let p = Point.mk(Math.cos(a),Math.sin(a)).times(rd);
  return p;
}
   
rs.nearestPositionExcept = function (positions,i,xc) {
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

rs.nearestPositionExcept = function (positions,i,xc) {
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

  
  
rs.nearestPositions = function (positions,n) {
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
  
    
 

rs.displayNearestPositions = function (positions) {
 let {lines,lineP,debug2} = this;
   if (debug2) {
    debugger;
  }
  let nrps = this.nearestPositions(positions,3)
  let lnp = nrps.length;
  for (let i=0;i<lnp;i++) {
    let nrpa = nrps[i];
    let nrln = nrpa.length;
    for (let j=0;j<nrln;j++) {
      let nrp = nrpa[j];
      let {index,distance}  = nrp;
      let e0 = positions[i];
      let e1 = positions[index];
      let ln = lines[nrln*i+j];
      if (!ln) {
        ln = lineP.instantiate();
        lines.push(ln);
      }
      ln.show();
      ln.setEnds(e0,e1);
      ln.update();
    }
  }
}
    
rs.onUpdate = function () {
  let {stepsSoFar:ssf,currentTime:t,positions} = this;
  console.log('steps',ssf,'time',t);//'positions',JSON.stringify(positions));
 this.displayNearestPositions(positions);
}
   
rs.initialize = function () {
   debugger;
  let {timePerStep:tps,stopTime:st,ringRadii:rr,shapesPerRing:spr} = this;
  this.numSteps = Math.floor(st/tps);
  this.numSteps = 65;
  this.numSteps = 700;
 this.numSteps = 347;
 // this.stepArray = [7].concat(this.sequentialArray(351,370));
 this.startAtStep = 7;
  this.numShapes =spr*(rr.length);
  this.initProtos();
  this.addFrame();
  this.set('shapes',arrayShape.mk());
  this.set('lines',arrayShape.mk());
  this.buildShapes();
  //this.updatePositions(0);
}

export {rs};



