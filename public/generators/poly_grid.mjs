

import {rs as polygonPP} from '/shape/polygon.mjs';

import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPathMethods} from '/mlib/animate0.mjs';	
let rs = basicP.instantiate();
addPathMethods(rs);

let wd = 200;
let nr = 5;
rs.setName('poly_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.0*wd,frameStroke:'rgb(2,2,2)',frameStrokeWidth:1,saveAnimation:0,numSteps:1000}
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


rs.buildColorArrays = function () {
  const setCa = (ca,i,j,v) => {
    let idx = this.polyIndex(i,j);
    ca[idx] = v;
  };
  let {caa} = this;
  let ca0 = caa[0];
  let ca1 = caa[1];
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
  setCa(ca0,1,3,0);
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
  this.colors=['blue','red'];
}

rs.setColors = function (ca) {
  let {polys,colors} = this;
  let ln = polys.length;
  for (let i=0;i<ln;i++) {
    let clri = ca[i];
    let poly = polys[i];
    let clr = colors[clri];
    poly.fill = clr;
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
  this.addPolys();
  this.setColors(this.caa[1]);
}

rs.updateState = function () {
  let {grid,stepsSoFar:ssf,numSteps,deltaX} =this;
  let ln = grid.length;
  for (let i=0;i<ln;i++) {
    let g = grid[i];
    let {speed} = g;
    let fr = ssf/numSteps;
    let a = fr*speed;
    let fc = .2;
    let vec = Point.mk(Math.cos(a),Math.sin(a)).times(fc*deltaX);
    g.offset = vec;
  }
  this.adjustLines();
}  


    

  
export {rs};


