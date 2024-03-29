import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as generatorP} from '/generators/curves_0.mjs'
let rs = generatorP.instantiate();

rs.setName('curves_4')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',frameStrokeWidth:.2,numSteps:3*4*32,// 2 particle164	,		
                 saveAnimation:1,numWaveLines:3,numWaves:2,maxifc:0.65,numCycles:6,
                 yc:1,ifc:0,numRings:15} //420 790
	
Object.assign(rs,topParams);

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.dimension = 1;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'red';
  lineP['stroke-width'] = .15;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .05;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.stroke = 'red';
  rectP['stroke-width'] = .15;
}

rs.updateCenters = function () {
  let {isects,centers,ULs,URs,LLs,LRs,numWaveLines:nwl} = this;
  debugger;
  for (let i = 0;i<nwl-1;i++) {
    for (let j=0;j<nwl-1;j++)  {
      let uli = i*nwl+j
      let lli = (i+1)*nwl+j;
      let UL = isects[uli];
      let UR = isects[uli+1];
      let LL = isects[lli];
      let LR = isects[lli+1];
      let cx =(UL.x+UR.x+LL.x+LR.x)/4;
      let cy =(UL.y+UR.y+LL.y+LR.y)/4;
      let C = Point.mk(cx,cy);
      let ULvec = UL.difference(C);
      let URvec = UR.difference(C);
      let LLvec = LL.difference(C);
      let LRvec = LR.difference(C);
      let fr=0.33;
      let ULp = C.plus(ULvec.times(fr));
      let URp = C.plus(URvec.times(fr));
      let LLp = C.plus(LLvec.times(fr));
      let LRp = C.plus(LRvec.times(fr));
      let idx = i*(nwl-1)+j; 
      centers[idx] = C;
      ULs[idx] = ULp;
      URs[idx] = URp;
      LLs[idx] = LLp;
      LRs[idx] = LRp;
    }
  }
}

rs.initCenters = function () {
  let {numWaveLines:nwl} = this;
  let centers=this.centers=[];
  let ULs=this.ULs=[];
  let URs=this.URs=[];
  let LLs=this.LLs=[];
  let LRs=this.LRs=[];
  let nwlm1 = nwl-1;
  for (let i=0;i<nwlm1;i++) {
    for (let j=0;j<nwlm1;j++) {
      centers.push(0);
      ULs.push(0);
      URs.push(0);
      LLs.push(0);
      LRs.push(0);
    }
  }
}
 

rs.populateCenterShapes = function () {
  let {numWaveLines:nwl,circleP} = this;
  let centers=this.centers=[];
  let centerShapes=this.set('centerShapes',arrayShape.mk());
  let nwlm1 = nwl-1;
  for (let i=0;i<nwlm1;i++) {
    for (let j=0;j<nwlm1;j++) {
      let shp = containerShape.mk()	
      let crc = circleP.instantiate();   
      centerShapes.push(shp);
      shp.set('c',crc);
      shp.index = i;
      shp.period = 35+Math.floor(20*Math.random());
      crc.dimension=1;
      shp.fill = 'red'
      shp.show();
      crc.update();
    }
  }
}
 
rs.computeEfr = function (period) {
  let {stepsSoFar:ssf} = this;
  let fr = (ssf%period)/period;
  let cycle = Math.floor(ssf/period);
  let efr = (cycle%2)?1-fr:fr;
  return efr;
}

rs.updateCenterShapes = function () {
  let {centers,ULs,URs,LLs,LRs,centerShapes,numWaveLines:nwl,stepsSoFar:ssf} = this;
  debugger;
  let nwlm1 = nwl-1;
  for (let i=0;i<nwlm1;i++) {
    for (let j=0;j<nwlm1;j++) {
      let idx = i*nwlm1+j;
   //   let cp = centers[idx];
      let cp = ULs[idx];
      let shp = centerShapes[idx];
      let fc = 1;
      let period = shp.period;
      let fr = (ssf%period)/period;
      let cycle = Math.floor(ssf/period);
     // let efr = (cycle%2)?1-fr:fr;
      let efr = this.computeEfr(period);
      let div = fc*efr-0.5;
      let fillv = Math.floor(155*efr)+100;
      let dimfc = 2;
      let dim = efr*dimfc;
      //shp.dimension = 1+dim;
      let fill = `rgb(${fillv},0,0)`;
     // shp.fill = fill;
      console.log('fr',fr,'cycle',cycle,'efr',efr,'div',div,'fill',fill);

      //shp.update();
     shp.moveto(cp);//.plus(Point.mk(div,0)));
    }
  }
}

    
    
rs.updatePolylines = function (phase,amplitude) {
  let {stepsSoFar:ssf,numWaveLines:nln,numWaves:nw,yc,ifc,numLobes:nl,height:ht,oofx} = this;
  this.polylineCnt = 0;
  this.pointCount = 0;
  this.resetDisplayedLines();
  //let hnl = nl/2;
  let off = 1;
  let xsc  = 7/nw;
  let horizontals = this.horizontals = [];
  let verticals = this.verticals = [];
  
  let rd = 20;
  //let iv = rd/n;
  let theta=  (Math.PI/nl);
  
  for (let i=0;i<nln;i++) {
    let phmsf = i?0:ssf*.02*Math.PI;
    let phmi = i*.0521*Math.PI;
    let mphase = phase+phmsf+phmi;
    let pnts = this.approximateCurve(Math.sin,phase-nw*Math.PI,phase+nw*Math.PI,100);

    if (i===5) {
      debugger;
    }
    let spnts = this.scale(pnts,xsc,amplitude);
    if (ssf ===0) {
      oofx = this.oofx =spnts[0].x;
    }
    let cofx = spnts[0].x;
    let ofx = ssf?oofx-cofx:0;
   // let tpnts = this.translate(spnts,Point.mk(ofx,3*(i-0.5*nln)));
    let tpnts = this.translate(spnts,Point.mk(ofx,6*(i-0.5*nln)));
    
   // let ppnts = this.fromPolar(spnts);
   let rpnts = this.rotate(tpnts,0.5*Math.PI);
   
   let rtpnts = this.translate(rpnts,Point.mk(2,0));
   horizontals.push(tpnts);
   verticals.push(rtpnts);
    this.displayPolyline(tpnts);
    this.displayPolyline(rtpnts);
  /*  
   horizontals.push(tpnts);
   verticals.push(rpnts);
    this.displayPolyline(tpnts);
    this.displayPolyline(rpnts);*/
  }
  
  let h = horizontals[0]
  let v = verticals[3];
  let hln = horizontals.length;
  let vln = verticals.length;
  let isects = this.isects = [];
  let cnt=0;
  for (let j=0;j<nln;j++) {
      for (let i=0;i<nln;i++) {
        let h=horizontals[i]
        let v = verticals[j];
        let ipnt = this.intersectPointSets(h,v);
        if (ipnt) {
          this.displayPoint(ipnt,'green');
          isects.push(ipnt);
        } else {
          debugger;
        }
      }
  }
  debugger;
  this.updateCenters();
  this.updateCenterShapes();
  //let ipnt = this.intersectPointSets(h,v);
  //return ipnt;
}

rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP,yc,maxifc} = this;
  this.numSteps =40;
  let hht = 0.5*ht;
  this.initProtos();
  this.addFrame();
  this.ifc = maxifc;
  this.initCenters();
  this.populateCenterShapes();
  this.updatePolylines(0,1);
  this.phase = 0;
}


rs.updateState= function () {
  let {phase,stepsSoFar:ssf} = this;
  debugger;
  console.log('phase',phase/(2*Math.PI),'ssf',ssf);
  debugger;
  let ph = this.phase =  phase + .05*Math.PI;
  this.updatePolylines(ph,.5);
}

export {rs}
  

  