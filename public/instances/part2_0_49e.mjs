import {rs as addQuadMethods} from '/mlib/rect2quad.mjs';	

import {rs as generatorP} from '/instances/part2_0_49.mjs';

let rs = generatorP.instantiate();

addQuadMethods(rs);
rs.setName('part2_0_49e');
let wd = rs.width;
let nr =20;
let topParams = {cycles:10,center:Point.mk(0,0),radius:0.4*wd,saveAnimation:1};
Object.assign(rs,topParams);

let levels = 9;
levels = 2;
//levels = 3;
//topLevels = 6;

rs.partParams.levels = levels;
rs.computeFills = function () {
  const rshade =() => Math.floor(Math.random()*255);
  let aw = this.allWheres(this.partParams.levels,5);
  let af = {};
  
  aw.forEach((w) => {
    //debugger;
    let r = rshade();
    let g = rshade();
    let b = rshade();
    let wn = w[0];
    let rcolor = `rgba(${r},${r},${r},.5)`;
  af[wn] = rcolor;
    //af[wn] = 'transparent';
  });
  this.colors = af;
}

rs.spinReady = 0;

rs.addDot = function () {
  let {circleP,dotShapes} = this;
  let crc = circleP.instantiate();
  dotShapes.push(crc);
  return crc;
}

rs.mkMotion = function (phase) {
  let {numSteps,cycles,center,radius,toQuad} = this;
  let dot = this.addDot();
  let startPhase = phase?phase:0;
  let m = {startPhase,startTime:0,cycles,center,radius,shape:dot,duration:numSteps,map:toQuad}
  //let m = {startTime:0,cycles,center,radius,shape:dot,duration:numSteps}
  return m;
}
  
rs.partFill  = function (prt) {
  let {spinReady,stepsSoFar:ssf,circleP} = this;  
  
  let w = prt.where;
  let pgon = prt.polygon;
  if (pgon) {
    let corners = pgon.corners;
    if (corners) {
      let c = corners;
      let cln = corners.length;
      let wln = w.length;
      if ((cln === 4)&&(wln===2)) {
        if (!spinReady) {
          debugger;
          circleP.dimension = 4;
          this.set('dotShapes',arrayShape.mk());
          //let m = this.mkMotion();
          //this.motions = [m];
          this.motions =[];
          this.mkMotions(4,this.mkMotion);

          this.spinReady = 1;
        }
        this.corners = c;
    
        //debugger;
        let rc = [c[2],c[3],c[0],c[1]]
        rc = [c[1],c[0],c[3],c[2]]
        rc = [c[0],c[3],c[2],c[1]];
        this.execMotions(ssf);

      }
    }
  }
  let ln = w.length;
  if (ln < 1) {
    return 'black';
  }
  let ws = this.whereString(w);
  let clr = this.colors[ws];
  return clr;
}

rs.computeFills();




rs.saveAnimation = 1;
rs.numSteps = 500;
rs.numISteps = 60;


  
//rs.addToArray(strokeWidths,.1,levels);
export {rs};


