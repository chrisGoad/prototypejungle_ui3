import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as polylinePP} from '/shape/polygon.mjs';
import {rs as generatorP} from '/generators/curves_0.mjs'
let rs = generatorP.instantiate();

rs.setName('curves_0')
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:0.15,stopTime:200,stopStep:534,// 2 particle164	,		
                 collideWithParticle:1,numParticles:7,saveAnimation:1,boxD:0.9*ht,speedup:1,swp:1,numParticles:3,chopOffBeginningg:16,numLines:160} //420 790
	
Object.assign(rs,topParams);

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = .1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
  let polylineP = this.polylineP = polylinePP.instantiate();
  polyline.fill = 'none';
  polylineP.stroke = 'white';
  polylineP['stroke-width'] = .2;
}


rs.initialize = function () {
   debugger;
  let {timePerStep,stopTime,fills,height:ht,boxD,numParticles:numP} = this;
  let hht = 0.5*ht;
  this.setNumSteps();
  this.initProtos();
  this.addFrame();
  const f = (x) => {
    debugger;
    let y = Math.sin(x);
    let sy = hht*y
    return sy;
  }
  let pnts0 = this.approximateCurve(Math.sin,-4*Math.PI,4*Math.PI,100);//bottom
 // let pnts1 = this.approximateCurve(Math.sin,-3.25*Math.PI,3.75*Math.PI,100);//top
  let pnts1 = this.approximateCurve(Math.sin,-4*Math.PI,4*Math.PI,100);//top
  //let spnts =this.scale(pnts,ht/(2*Math.PI),hht);
  let lcnt = 20;
  for (let i=0;i<lcnt;i++) {
      let spnts0 =this.scale(pnts0,ht/(2*Math.PI),1*(lcnt-i)*(hht/lcnt));//bottom
      let spnts1 =this.scale(pnts1,ht/(2*Math.PI),-1*i*(hht/lcnt));//top
     this.displayPolyline(spnts0);
     this.displayPolyline(spnts1);
     continue;
    let tpnts0 = this.translate(spnts0,Point.mk(-24,-2*(lcnt-i)-30));
    //let tpnts0 = this.translate(spnts0,Point.mk(-24,-2*(lcnt-i)-30));
    let tpnts1 = this.translate(spnts1,Point.mk(0,2*i-30));
     //this.displayPolyline(tpnts0);
     this.displayPolyline(tpnts1);
  }
  return;
 
}
export {rs}
  

  