import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as generatorP} from '/generators/curves_0.mjs'
let rs = generatorP.instantiate();

rs.setName('curves_10')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.07*ht,frameStroke:'white',frameStrokeWidth:.2,numSteps:3*4*32,// 2 particle164	,		
                 saveAnimation:1,numLobes:2,maxifc:0.65,numCycles:6,persistence:1,maxifc:0.65,lastCycle:0,
                 yc:1,ifc:0,numRings:10} //420 790
	
Object.assign(rs,topParams);

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .1;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .06;
}

rs.updatePolylines = function () {
  let {numRings:n,yc,ifc,numLobes:nl,maxifc,scaleDown} = this;
  this.polylineCnt = 0;
  let hnl = nl/2;
  let off = 1;
  let pnts = this.approximateCurve(Math.sin,off-hnl*Math.PI,off+hnl*Math.PI,400);
  let rd = 20;
  let iv = rd/n;
  let theta=  (Math.PI/nl);
 // let scaleDown = 3*(maxifc/(yc+ifc));
  for (let i=1;i<n;i++) {
    let spnts = this.scale(pnts,1/hnl,iv*ifc*i,0,1+yc*1.3*i);
    let ppnts = this.fromPolar(spnts);
    let sppnts = this.scale(ppnts,scaleDown,scaleDown);
    let rpnts = this.rotate(sppnts,theta);
    this.displayPolyline(rpnts);
  }

}

rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP,yc,maxifc} = this;
  let hht = 0.5*ht;
  this.initProtos();
  this.addFrame();
  this.ifc = maxifc;
  this.updatePolylines();
}


const between = function (x,lb,ub) {
  return (lb<=x)&&(x<ub);
}

const betweenI = function (x,lb,ub) {
  return (lb<=x)&&(x<=ub);
}
// ifc is the waviness
rs.numLobesPerCycle = [2,4,8,16,64];
rs.numLobesPerCycle = [4,8,16,64];
rs.execCycle = function (n) {
  let {numSteps,stepsSoFar:ssf,maxifc,numLobesPerCycle:nlpc} = this;
  let numCycles = nlpc.length;
  let numLobes = nlpc[n];
  this.numLobes = numLobes;
  let spc = numSteps/numCycles;
  let sic = ssf%spc;
  let fr = sic/spc;
  let hspc =spc/2;
  let ifh = sic<=hspc;
  let frh = ifh?sic/hspc:(sic-hspc)/hspc; // (fraction in  half)
  let spsc = spc/2;
  let sc  = n*spc;
  let sc0 = sc;
  let sc1 = sc+spsc;
 // let sc2=sc +2*spsc;
  let ec = sc+spc;
  //let fr;
  let delta = 1/(maxifc-.0193)-1;

  if (betweenI(ssf,sc0,sc1)) {
    //fr = (ssf-sc0)/spsc;
    this.ifc = maxifc*frh;
    this.scaleDown = 1;
  } else if (betweenI(ssf,sc1,ec)) {
   // fr = (ssf-sc1)/spsc;
    this.yc = 1+maxifc*frh;
    this.ifc = maxifc*(1-frh);

    this.scaleDown = (1-frh)+frh*delta

  }
 // this.scaleDown = 1;
  if (ssf>=286) {
    //console.log('fr',fr,'yc',this.yc,'ifc',this.ifc);
  }
 /* let delta = (1/1+maxifc)-1;
  //let ifh = sic<=hspc;
  let sd =this.scaleDown = 1;//ifh?1:(1-frsh)+frsh*delta;*/
  if (!(ssf%1)) {
     console.log('ssf',ssf,'fr',fr,'delta',delta,'scaleDown',this.scaleDown);
   }     
  //this.scaleDown = 1;//3*(maxifc/(this.yc+this.ifc));

  this.updatePolylines()  
}  
/*
  if (betweenI(ssf,sc0,sc1)) {
    this.ifc = maxifc*((ssf-sc0)/spsc);
  } else if (betweenI(ssf,sc1,sc2)) {
    let fr = (ssf-sc1)/spsc;
    this.yc = 1+maxifc*fr;
    this.ifc = maxifc*(1-fr);
  } else if (betweenI(ssf,sc2,ec)) {
    let fr = (ssf-sc2)/spsc;
    this.yc = 1+maxifc*(1-fr);
  }
*/
rs.whichCycle = function () {
  let {stepsSoFar:ssf,numSteps,numLobesPerCycle:nlpc}  = this;
  let numCycles = nlpc.length;
  let spc = numSteps/numCycles;
  let wc = Math.floor(ssf/spc);
  return wc;
}


rs.updateState= function () {
  let {lastCycle:lc,stepsSoFar:ssf} = this;
  let wc = this.whichCycle();
  //console.log('wc',wc,'ssf',ssf);
  if ((ssf === 287) || (ssf === 291)){
    debugger;
  }
  if (wc > lc) {
   // debugger;
     this.yc = 1;
    this.lastCycle = wc;
  }
  this.execCycle(wc);
}
/*
  let {stepsSoFar:ssf,yc,ifc,numSteps} = this;
  debugger;
  let hns = numSteps/2
  let maxifc = 0.65;
  if (ssf <= hns) {
    this.ifc = maxifc*(ssf/hns);
  } else {
    let fr = (ssf-hns)/hns;
    this.yc = 0.9*(1+fr);
    this.ifc = maxifc*(1-fr);
  }
  this.updatePolylines();
}
  
  */


export {rs}
  

  