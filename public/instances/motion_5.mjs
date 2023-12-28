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
  debugger;
  let {ringRadii:rr,stopTime,toAngle,speeds} = this;
  let {ring,fractionAround:fa,numShapes:ns} = shape;
  let clockwise = (ring%3)?1:-1;
  console.log('cw',clockwise);
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

rs.nearestPositions = function (positions) {
  debugger;
  let pln = positions.length;
  let nrp =[];
  for (let i=0;i<pln;i++) {
    let np = this.nearestPositionExcept(positions,i);
    let npx = this.nearestPositionExcept(positions,i,np.index)
    nrp . push([np,npx]);
    //nrp . push(np);
  }
  return nrp;
}
  
 

rs.displayNearestPositions = function (positions) {
  let {lines,lineP} = this;
  debugger;
  let nrps = this.nearestPositions(positions)
  let lnp = nrps.length;
  for (let i=0;i<lnp;i++) {
    let nrpt = nrps[i]
    let nrp = nrpt[0];
    let nrpx = nrpt[1];
    let {index,distance}  = nrp;
    let {index:indexx,distance:distancex}  = nrpx;
    let e0 = positions[i];
    let e1 = positions[index];
    let e0x = e0;
    let e1x = positions[indexx];
    let ln = lines[2*i];
    let lnx = lines[2*i+1];
    if (!ln) {
      ln = lineP.instantiate();
      lines.push(ln);
      lnx = lineP.instantiate();
      lines.push(lnx);
    }
    ln.show();
    lnx.show();
    ln.setEnds(e0,e1);
    lnx.setEnds(e0x,e1x);
    ln.update();
    lnx.update();
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
  this.numShapes =spr*(rr.length);
  this.initProtos();
  this.addFrame();
  this.set('shapes',arrayShape.mk());
  this.set('lines',arrayShape.mk());
  this.buildShapes();
  //this.updatePositions(0);
}

export {rs};



