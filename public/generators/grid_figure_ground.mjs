
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

//import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);
addAnimationMethods(rs);
//addRandomMethods(rs);	
rs.setName('grid_figure_ground');

rs.colorObToRgb = function (c) {
  let {r,g,b} = c;
  let rgb = `rgb(${r},${g},${b})`;
  return rgb;
}

rs.initialFinalColorsAtCell = function (c,initially) {
  let {numRows:nr,numCols:nc} = this;
  let {x,y} = c;
  let left = x<(nc/2);
  let top = y<(nr/2);
  if (!top) {
    debugger;
  }
  let clr = initially?(left?{r:255,g:0,b:0}:{r:0,g:0,b:255}):(top?{r:255,g:0,b:0}:{r:0,g:0,b:255});
  return clr;
}

rs.colorAtCell = function (c,fr) {
  let {numRows:nr,numCols:nc} = this;
  let {x,y} = c;
  let iclr = this.initialFinalColorsAtCell(c,1);
  let fclr = this.initialFinalColorsAtCell(c,0);
  let clr = this.interpolate(iclr,fclr,fr);
  return clr;
}

rs.paintCells = function (fr) {
  debugger;
  let {numRows:nr,numCols:nc} = this;
  for (let i=0;i<nc;i++) {
    for (let j=0;j<nr;j++) {
      let c = {x:i,y:j}
      let clr = this.colorAtCell(c,fr);
      let rgb = this.colorObToRgb(clr);
      let shp = this.shapeAt(i,j);
      shp.fill = rgb;
      shp.update();
    }
  }
}

      
    

rs.interpolateSides = function (fr) {
  let ls = this.interpolate(0,1,fr);
  let cntr = this.interpolate(1,0,fr);
  let rs = ls;
  return {leftOrTop:ls,center:cntr,rightOrTop:rs};
}

rs.interpolateAtCell = function (c,fr,v) {
  let {x,y} = c;
  let {numCols,numRows} = this;
  let ncor2 = v?numRows/2:numCols/2;
  let sdi = this.interpolateSides(fr,v);
   let {leftOrTop,center,rightOrTop} = sdi;
  let onLeftOrTop = v?y<ncor2:x<ncor2;
  let iv;
  if (v) {
    iv= onLeftOrTop?this.interpolate(leftOrTop,center,y/ncor2):this.interpolate(center,rightOrTop,(y-ncor2)/ncor2);
  } else {
    iv= onLeftOrTop?this.interpolate(leftOrTop,center,x/ncor2):this.interpolate(center,rightOrTop,(x-ncor2)/ncor2);
  }
  return iv;
}

rs.updateCell = function (c,fr,v) {
  let {x,y} = c;
  let {numCols:nc,numRows:nr,width:wd,height:ht} = this;
  let cw = wd/nc;
  let shp = this.shapeAt(x,y);
  if (!shp) {
    debugger;
  }
  let iv = this.interpolateAtCell(c,fr,v);
  let w = iv*cw;
  shp.width = w;
  shp.height = w;
  shp.update();
}
rs.updateCells = function (fr,v) {
  let {numRows:nr,numCols:nc} = this;
  let iub = v?nr:nc;
  let jub = v?nc:nr;
  for (let i=0;i<nc;i++) {
    for (let j=0;j<nr;j++) {
      let c = {x:i,y:j};
      this.updateCell(c,fr,v);
    }
  }
}
       
	
rs.initProtos = function () {
  rs.rectP  = rectPP.instantiate();
  rs.rectP.fill = 'white';
  rs.rectP['stroke-width'] = 0;
  rs.rectP.width = 5;
  rs.rectP.height = 5;
    rs.circleP  = circlePP.instantiate();
  rs.circleP.fill = 'white';
  rs.circleP['stroke-width'] = 0;
  


}  

let nc = 32;
//nc = 8;
let wd = 200;
let topParams = {numRows:nc/2,numCols:nc,width:wd,height:wd/2,pointJigglee:4,framePadding:0.25*wd,frameVisible:1,
   saveAnimation:1,numSteps:256};
Object.assign(rs,topParams);

rs.shapeGenerator = function (rvs,cell) {
  let {rectP,numCols,width} = this;
  let cwd = width/numCols;
  let {x,y} = cell;
  let nco2 = numCols/2;
  //console.log('x',x,'y',y);
  //let fwd = x<nro2?x/nro2:(x-nro2)/nro2;// fraction of the way across (i.e. to max x)
  let fwd = x<nco2?x/nco2:(numCols-x)/nco2;// fraction of the way across (i.e. to max x)
  if (y===0) {
    console.log('x',x,'fwd',fwd);
  }
  let wd = fwd*cwd;
  
  let shape = rectP.instantiate().show();
  shape.width = wd;
  shape.height = wd;
  shape.fill = x>=nco2?'rgb(255,255,0)':'rgb(0,255,255)';
  return shape;
}

rs.initialize = function () {
 // this.setupRandomGridForBoundaries('v',{step:30,min:100,max:250}); 
  this.initProtos();
  this.addFrame();
  let {numRows,width,height,rectP,circleP}=  this;
  let wr = rectP.instantiate().show();
  let crc = circleP.instantiate().show();
  crc.fill = 'yellow';
  crc.fill = 'magenta';
  crc.fill = 'rgb(40,0,40)';
  crc.fill = 'rgb(0,0,0)';
  //crc.fill = 'gray';
  //this.set('wr',wr);
  wr . width = width/2;
  wr . height = height;
  wr.fill = 'blue';
  wr.moveto(Point.mk(width/4,0));
  crc.dimension = height+40;
  this.generateGrid();
  debugger;
  this.paintCells(.5);
 // this.updateCells(0.95);
 //  this.set('crc',crc);

}

rs.updateState = function () {
  let {numSteps,stepsSoFar:ssf} = this;
  let hns = numSteps/2;
  let fh = ssf<hns;
  let fr = fh?ssf/hns:(numSteps-ssf)/hns;
  //let fr = ssf/(numSteps-1);
  this.updateCells(fr,1);
}

rs.updateAtPhase= function(ph,dfofr,pn) { //dfofr = direction free outer fraction
  let {orientation,which,direction} = ph;
  let v = orientation==='vertical';
  let ofr = direction==='forward'?dfofr:1-dfofr;
  let fr = (which==='first')?ofr:(1-ofr);
 // console.log('orientation',orientation,'which',which,'direction',direction,'ofr',ofr,'fr',fr);
  console.log(pn,orientation,which,direction,'dfofr',dfofr,'ofr',ofr,'fr',fr);
  this.updateCells(fr/2,v);
}

rs.phaseArray = [
{orientation:'horizontal',which:'first',direction:'forward'},
{orientation:'horizontal',which:'second',direction:'forward'},
{orientation:'horizontal',which:'second',direction:'backward'},
{orientation:'vertical',which:'second',direction:'forward'},
{orientation:'vertical',which:'second',direction:'backward'},
{orientation:'vertical',which:'first',direction:'backward'},
{orientation:'vertical',which:'first',direction:'forward'},
{orientation:'horizontal',which:'first',direction:'backward'}];

rs.updateState = function () {
  let {numSteps,stepsSoFar:ssf} = this;
  let ens = numSteps/8;
  let hns = numSteps/2;
  let cfr = ssf<hns?ssf/hns:(numSteps-ssf)/hns;
  let phaseNum = Math.floor((8*ssf)/numSteps);
  let dfofr = (ssf-ens*phaseNum)/ens;
  let phase = this.phaseArray[phaseNum];
  this.updateAtPhase(phase,dfofr,phaseNum);
  this.paintCells(cfr);
}


export {rs};


