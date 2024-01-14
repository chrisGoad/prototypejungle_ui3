import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as generatorP} from '/generators/motion_2.mjs'

let rs = generatorP.instantiate();
addDistanceMethods(rs);

rs.setName('motion_14');
let ht=50;


let topParams = {width:ht,height:ht,framePadding:0.3*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/80,stopTime:12,recordingMotion:1,saveAnimation:1,
    circleRadius:.2,ringRadii:[],nearestCount:6,nearestFadeFactor:20,toAngle:2*Math.PI,particleColor:'blue',segsPerCircle:6};

Object.assign(rs,topParams);
let subParams ={speed:10,shapesPerRing:2};



  
rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .05; 
}



rs.buildParameterArrays  = function () {
  let {nearestCount:nc} = this;
  this.ringRadii = [.6*ht];
  let nr = this.ringRadii.length;
  let spr = 12;// shapesPerRing
  let rspeed = 32;
  this.shapesPerRing = this.uniformArray(spr,nr);
  this.ringCenters = [Point.mk(0,0)];
  let divisors = [2,3,4];
  let mdivs = this.repeatArray(divisors,4);
  let fc = 1;//2*Math.PI;
  let ringSpeeds = mdivs.map((v) => fc/v)
  this.speeds = rs.uniformArray(ringSpeeds,nr);
  let iar =  this.steppedArray(0,2*Math.PI,spr+1,1);//initial angles per ring
  this.initialAngles = this.uniformArray(iar,nr);
  this.lineColors = this.cyclingArray([[255,95,0],[255,0,0]],nc);
  return;
  let colors = ['red','green','blue'];
  for (let i=0;i<9;i++) {
    colors.push('gray');
  }
  //this.particleColors = this.repeatArray(colors,4);
  this.particleColors = colors;
}


rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP,circleP} = this;
  this.addFrame();
  this.numSteps =stp/tps;
 // this.stepArrayy = [0].concat(this.sequentialArray(102,120));
  this.set('shapes',arrayShape.mk());
  let lines = this.set('lines',arrayShape.mk());
  let segs = this.segs = [];
  let ints = this.set('ints',arrayShape.mk());
  this.buildParameterArrays(subParams);
  this.buildPaths();
  let av = this.allValues();
  this.addLinesBetweenPositions(av,lineP);
  return;
  let nln = lines.length;
  let nints = nln*nln;
  for (let i =0;i<nints;i++) {
    let crc = circleP.instantiate();
    crc.hide();
    ints.push(crc);
  }
  this.mind = Infinity;
  this.maxd = -Infinity;
}

rs.updateState = function () {
  let {currentTime:ct,activePaths,circ,lineP} = this;
  //let ap = this.activePaths[0]
  debugger;
  this.runActivePaths();
   let av = this.allValues();
  this.updateLines(av);
}
rs.updateStatee = function () {
  debugger;
  let {stepsSoFar:ssf,currentTime:t,linesAdded:la,positions,mind,maxd,lines,ints,segs} = this;
  let color = [255,95,0];
  let black = [0,0,0];
  const fn = (line,dist) => {
    let fr = dist/60;
    let pow = 4;
    let pfr = Math.pow(1-fr,pow);
    console.log('fr',fr,'pfr',pfr);
    let icolor = this.interpolate(black,color,pfr);
    let bsw = .4;
    let stroke = this.arrayToRGB(color);
    if (line) {
      line.stroke = stroke;
      let swfc = Math.pow(pfr,.2);
      console.log('sw fc',swfc);
      if (swfc < .4) {
        line.hide();
      } else {
        line.show();
        line['stroke-width'] = bsw*swfc;
        line.update();
      }
    }
  }
  //return;
  console.log('steps',ssf,'time',t);
  this.updateAngles(t);
  this.displayPositions();
  this.updateLines(positions,fn); //update segments
  let intps = allSegmentIntersections(segs);
  let nints = ints.length;
  for (let i=0;i<nints;i++) {
    let crc = ints[i];
    crc.hide();
    crc.update();
  }
  let nintps = intps.length;
  for (let i=0;i<nintps;i++) {
    let crc = ints[i];
    let p = intps[i];
    crc.show();
    crc.moveto(p);
    //crc.update();
  }
  
  
  console.log('cmin',this.mind,'cmax',this.maxd);
 // this.displayNearestPositions(positions,nearestCount,nff,{attackDuration:0.05}); 
}




    
 
export {rs};



