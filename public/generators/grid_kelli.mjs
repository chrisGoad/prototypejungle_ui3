
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
let rs = basicP.instantiate();

addGridMethods(rs);

rs.setName('grid_kelli_3');
let mul = 1;
//let ht  = 100;
let wd  = 100;
//* let nr = 257;
let nc = 257;
//*let nc = ((nr*mul).toString(2)).length-1;
let nr = ((nc*mul).toString(2)).length-1;
//*let wd = ht/2;//Math.floor((nc/nr) * ht)-1;
let ht = wd/2;//Math.floor((nc/nr) * ht)-1;
let colorParams = {redOb:{r:255,g:0,b:0},greenOb:{r:0,g:255,b:0},blueOb:{r:0,g:0,b:255},blackOb:{r:0,g:0,b:0},whiteOb:{r:255,g:255,b:255},
                  cyanOb:{r:0,g:255,b:255}};
let topParams = {width:wd,height:ht,numRows:nr,numCols:nc,framePadding:0.2*wd,frameStroke:undefined,doNotDisplayParts:1,numSteps:30}
Object.assign(rs,topParams);
Object.assign(rs,colorParams);


rs.initProtos = function () {
  this.lineP  = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .5;
  this.rectP  = rectPP.instantiate();
  this.rectP.fill = 'white';
  this.rectP['stroke-width'] = 0;
}



rs.shapeGenerator = function (rvs,cell) {
  let {rectP,lineP,numCols,numRows,height,width,fill} = this;
  debugger;
  let cwd = width/numCols;
  let cht = height/numRows;
  let frw =1;
  let scwd = frw*cwd;
  let scht = frw*cht;
  let {x,y} = cell;
  if (y === (nr-1)) {
    debugger;
  }
  //*let my = mul*y;
  let my = mul*x;
  let ys = my.toString(2);
  //console.log('x',x,'y',y,'ys',ys);
  let shape = rectP.instantiate().show();
  shape.width = scwd;
  shape.height = scht;
  let ysln = ys.length;
 //* let sp =nc-ysln;
  let sp =nr-ysln;
  //*if (x>=ysln) {
  if (y<sp) {
    fill = 'gray'
  } else {
    //* let xd = ys[x];
    let xd = ys[y-sp];
    console.log('x',x,'y',y,'ys',ys,'xd',xd);
   fill = xd==='1'?'white':'black';
    //fill = xd==='1'?this.randomRGB(100,200):'black';
  }
  shape.fill = fill;
  return shape;
}

rs.initialize =function ()  {
  debugger;
  this.initProtos();
  this.addFrame();
  let {width:wd,height:ht,numCols} = this;
  let hwd = wd/2;
  let hht = ht/2;
  this.generateGrid();
}



export {rs};

      

