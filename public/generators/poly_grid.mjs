

import {rs as polygonPP} from '/shape/polygon.mjs';

import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPathMethods} from '/mlib/animate0.mjs';	
let rs = basicP.instantiate();
addPathMethods(rs);

let wd = 200;
let nr = 5;
rs.setName('poly_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.0*wd,frameStroke:'rgb(2,2,2)',frameStrokeWidth:1,saveAnimation:1,numSteps:240}
//let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.0*wd,frameStroke:'rgb(2,2,2)',frameStrokeWidth:1,saveAnimation:1,numSteps:48}
Object.assign(rs,topParams);
/*
rs.addPath = function (nm,speed) {
  let {pstate,speeds} = this;
  let {pspace,cstate} = pstate;
  pspace[nm] = {kind:'sweepFixedDur',dur:100,min:0,max:10,start:0};
  cstate[nm] = {value:0};
};

rs.pstate = {pspace:{},cstate:{});
*/
rs.grid = [];



rs.buildGrid = function () {
  let gr = this.grid = [];
 
  let caa = this.caa = [[],[]]
  let {numRows:nr,numCols:nc,height:ht,width:wd} = this;
  let deltaX = this.deltaX =wd/nc;
  let deltaY = this.deltaY = ht/nr;
  let minX = -0.5*wd;
  let minY = -0.5*ht;
  for (let i=0;i<nc;i++) {
    let x = minX+i*deltaX;
    for (let j=0;j<nr;j++) {
      let y = minY + j*deltaY;
      let p = Point.mk(x,y);
      gr.push(p);
      if ((i<nc-1)&&(j<nr-1)) {
        caa.forEach((a) => {
          a.push(0);
        });
      }
    }
  }
}
// i,j are row and col in polys
rs.ulIndex = function (i,j) {
  let {numRows:nr,numCols:nc} = this;
  return nc*i+j;
}


rs.urIndex = function (i,j) {
  let {numRows:nr,numCols:nc} = this;
  return nc*(i+1)+j;
}


rs.llIndex = function (i,j) {
  let {numRows:nr,numCols:nc} = this;
  return nc*i+j+1;
}



rs.lrIndex = function (i,j) {
  let {numRows:nr,numCols:nc} = this;
  return nc*(i+1)+j+1;
}

rs.randomColorArray = function () {
  let  r = Math.floor(Math.random()*255);
  let  g = Math.floor(Math.random()*255);
  let  b = Math.floor(Math.random()*255);
  return [r,g,b];
}

rs.addPolys = function() {
  let {numRows:nr,numCols:nc,grid,polygonP} = this;
  
  let polys =  this.set('polys',arrayShape.mk());
  for (let i=0;i<nc-1;i++) {
    for (let j=0;j<nr-1;j++) {
      let ulp  = grid[this.ulIndex(i,j)];
      let urp  = grid[this.urIndex(i,j)];
      let llp  = grid[this.llIndex(i,j)];
      let lrp  = grid[this.lrIndex(i,j)];
      let corners = [ulp,urp,lrp,llp];
      let poly = polygonP.instantiate();
      poly.corners = corners;
      polys.push(poly);
      let  r = Math.floor(Math.random()*255);
      let  g = Math.floor(Math.random()*255);
      let  b = Math.floor(Math.random()*255);
      poly.fill = `rgb(${r},${g},${b})`;
      poly.update();
    }
  }
}

rs.polyIndex = function (i,j) {
  let {numRows:nr,numCols:nc} = this;
  let idx = i*(nc-1)+j;
  return idx;
}

rs.cchoicea2ca = function (cc) {
 let {colors} = this;
 let ln = cc.length;
 let rs = [];
 for (let i=0;i<ln;i++) {
   rs.push(colors[cc[i]]);
  }
  return rs;
}

rs.buildColorArrays = function () {
  const setCa = (ca,i,j,v) => {
    let idx = this.polyIndex(i,j);
    ca[idx] = v;
  };
  let ca0 = [];
  let ca1 = [];
  let ca2 = [];

  setCa(ca0,0,0,0);
  setCa(ca0,0,1,0);
  setCa(ca0,0,2,0);
  setCa(ca0,0,3,0);
  
  setCa(ca0,1,0,0);
  setCa(ca0,1,1,1);
  setCa(ca0,1,2,1);
  setCa(ca0,1,3,0);
  
  setCa(ca0,2,0,0);
  setCa(ca0,2,1,1);
  setCa(ca0,2,2,1);
  setCa(ca0,2,3,0);
  
  setCa(ca0,3,0,0);
  setCa(ca0,3,1,0);
  setCa(ca0,3,2,0);
  setCa(ca0,3,3,0);
  
  setCa(ca1,0,0,0);
  setCa(ca1,0,1,0);
  setCa(ca1,0,2,1);
  setCa(ca1,0,3,1);
  setCa(ca1,1,0,0);
  setCa(ca1,1,1,0);
  setCa(ca1,1,2,1);
  setCa(ca1,1,3,1);
  setCa(ca1,2,0,1);
  setCa(ca1,2,1,1);
  setCa(ca1,2,2,0);
  setCa(ca1,2,3,0);
  setCa(ca1,3,0,1);
  setCa(ca1,3,1,1);
  setCa(ca1,3,2,0);
  setCa(ca1,3,3,0);
  
  
  setCa(ca2,0,0,0);
  setCa(ca2,0,1,2);
  setCa(ca2,0,2,0);
  setCa(ca2,0,3,2);
  
  setCa(ca2,1,0,2);
  setCa(ca2,1,1,0);
  setCa(ca2,1,2,2);
  setCa(ca2,1,3,0);
  
  setCa(ca2,2,0,0);
  setCa(ca2,2,1,2);
  setCa(ca2,2,2,0);
  setCa(ca2,2,3,2);
  
  setCa(ca2,3,0,2);
  setCa(ca2,3,1,0);
  setCa(ca2,3,2,2);
  setCa(ca2,3,3,0);
  
  let caa = [ca0,ca1,ca2]
  this.colors=[[255,0,0],[0,0,255]];
  let clr1 = this.randomColorArray();
  //let clr1 = [0,0,0];
  //this.colors=[this.randomColorArray(),this.randomColorArray(),this.randomColorArray()];
  this.colors=[this.randomColorArray(),clr1,clr1];
  //this.colors=[[255,255,255],clr1,clr1];
  let colorArrays = this.colorArrays = [];
  let lna = caa.length;
  for (let i = 0;i<lna;i++) {
    colorArrays[i] = this.cchoicea2ca(caa[i]);
  }
  let sd = this.slowDown = 8;
  let dur =4;
  let pause = 2;
  let script = this.script = [{state:0,dur,pause} ,{state:2,dur,pause},{state:1,dur,pause},{state:2,dur,pause}];
  let time = 0;
  let step0 = script[0];
  let step0copy = {};
  Object.assign(step0copy,step0);
  debugger;
  script.push(step0copy);
  const processStep = (step) => {
    let {pause,dur} = step;
    debugger;
    step.beginPause = time*sd;
    time = time + pause;
    step.beginInterpolation = time*sd;
    time = time + dur;
  }
  script.forEach(processStep);
  debugger;
  this.numSteps = time*sd;
}
  
  


rs.ca2fill = function (ca) {
  let r = ca[0];
  let g = ca[1];
  let b = ca[2];
  return `rgb(${r},${g},${b})`;
}
  
  
rs.setColors = function (ca) {
  let {polys,colors} = this;
  let ln = polys.length;
  for (let i=0;i<ln;i++) {
    let clri = ca[i];
    let poly = polys[i];
    let clr = colors[clri];
    poly.fill = this.ca2fill(clr);
    poly.update();
  }
}

rs.setColors = function (ca) {
  let {polys,colors} = this;
  let ln = polys.length;
  for (let i=0;i<ln;i++) {
    let clr = ca[i];
    let poly = polys[i];
    poly.fill = this.ca2fill(clr);
    poly.update();
  }
}
  
  
  
  
rs.initProtos = function () {
  let polygonP = this.polygonP = polygonPP.instantiate();
  polygonP['stroke-width'] = 0;
  
}  
rs.initialize =  function () {
  debugger;
  this.initProtos();
  this.buildGrid();
  this.buildColorArrays();
  let {colorArrays} = this;
  this.addPolys();
   this.setColors(colorArrays[0]);
   this.stepNum = 0;
}

rs.interpolate = function (frmv,tov,fr) {
  return frmv +fr*(tov-frmv);
}

rs.interpolateArrays = function (frma,toa,fr) {
  let ln = frma.length;
  let rsa = [];
  for (let i=0;i<ln;i++) { 
    let frmv =frma[i];
    let tov = toa[i];
    rsa.push(this.interpolate(frmv,tov,fr));
  }
  return rsa;
}

rs.interpolateArrayOfArrays = function (frma,toa,fr) {
  let ln = frma.length;
  let rsa = [];
  for (let i=0;i<ln;i++) { 
    let frmv =frma[i];
    let tov = toa[i];
    rsa.push(this.interpolateArrays(frmv,tov,fr));
  }
  return rsa;
}

  
    
    
rs.updateState = function () {
  let {polys,stepsSoFar:ssf,numSteps,colorArrays,states,stepNum,script,slowDown} =this;
  let lns = script.length;
  let step = script[stepNum];
  let nextStep = script[(stepNum+1)%lns];
  let {dur,state,beginPause:bp,beginInterpolation:bi} =step;
  if (ssf < bi) {
    debugger;
    return;
  }
  let {beginPause:bns,state:ns} = nextStep;
  if (ssf <= bns) {
    let fr = (ssf - bi)/(dur*slowDown);
    let ca0 = colorArrays[state];
    let ca1 = colorArrays[ns];
    let ca = this.interpolateArrayOfArrays(ca0,ca1,fr);
    this.setColors(ca);
    debugger;

    return;
  }
  this.stepNum = stepNum+1;
  debugger;

}
  
    
  
    


    

  
export {rs};


