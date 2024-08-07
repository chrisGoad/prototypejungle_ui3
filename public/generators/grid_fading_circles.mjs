
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
let rs = basicP.instantiate();

addGridMethods(rs);

rs.setName('grid_kelli');
let mul = 1;
//let ht  = 100;
let wd  = 100;
//* let nr = 257;
let nc = 128;
//*let nc = ((nr*mul).toString(2)).length-1;
let nr = nc;
//*let wd = ht/2;//Math.floor((nc/nr) * ht)-1;
let ht = wd;//Math.floor((nc/nr) * ht)-1;
let colorParams = {redOb:{r:255,g:0,b:0},greenOb:{r:0,g:255,b:0},blueOb:{r:0,g:0,b:255},blackOb:{r:0,g:0,b:0},whiteOb:{r:255,g:255,b:255},
                  cyanOb:{r:0,g:255,b:255}};
let topParams = {width:wd,height:ht,numRows:nr,numCols:nc,framePadding:0.2*wd,frameStroke:undefined,doNotDisplayParts:1,numSteps:30,numCircles:16}
Object.assign(rs,topParams);
Object.assign(rs,colorParams);


rs.initProtos = function () {
  this.lineP  = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .5;
  this.rectP  = rectPP.instantiate();
  this.rectP.fill = 'white';
  this.rectP['stroke-width'] = 0;
   this.circleP  = circlePP.instantiate();
  this.circleP.fill = 'white';
  this.circleP['stroke-width'] = 0;
}



rs.addCircle = function (x,y,fill) {
  let {numCols,numRows,width,circleDiam,circles,circleP} = this;
  let c = this.centerPnt(x,y);
  let circ = circleP.instantiate().show();
  circ.dimension = circleDiam;
  circ.fill = fill;
  circles.push(circ);
  circ.moveto(c)
}

rs.addFadedCircle = function (x,y) {
  let {numCols,numRows,width,circleDiam,circles,circleP} = this;
 
  let gv = Math.floor(255*((numCols-x)/numCols));
   let fill = this.toRGB(gv,gv,gv);
   this.addCircle(x,y,fill);
 }

rs.addFadingCircles = function (y) {
  let {numCircles,numCols,numRows,width} = this;
  let intx = numCols/numCircles;
  let circWd = width/numCircles;
  this.circleDiam= 0.2*circWd;
 // let y = numRows/2;
  for  (let i=1;i<numCircles;i++) {
     let x = intx * i;
     this.addFadedCircle (x,y);
  }
}
 
rs.addCircles = function (y,fill) {
 let {numCircles,numCols,numRows,width} = this;
  let intx = numCols/numCircles;
  let circWd = width/numCircles;
  this.circleDiam= 0.2*circWd;
 // let y = numRows/2;
  for  (let i=1;i<numCircles;i++) {
     let x = intx * i;
     this.addCircle (x,y,fill);
  } 
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
   let shape = rectP.instantiate().show();
  shape.width = scwd;
  shape.height = scht;
  let gv = Math.floor(255*(x/numCols));
   fill = this.toRGB(gv,gv,gv);
  shape.fill = fill;
  return shape;
}

rs.initialize =function ()  {
  debugger;
  this.initProtos();
  this.addFrame();
  let {width:wd,height:ht,numRows,numCols} = this;
  let hwd = wd/2;
  let hht = ht/2;
  this.generateGrid();
  this.set('circles',core.ArrayNode.mk());
  this.circleDiam = wd/20;
  let x = Math.floor(.6*numCols);
  let y = Math.floor(numRows/2);
  this.addFadingCircles(y);
  y = Math.floor(.4*numRows); 
  this.addCircles(y,'white')
   y = Math.floor(.6*numRows); 
  this.addCircles(y,'black')
    y = Math.floor(.8*numRows); 
  this.addCircles(y,'gray')
    y = Math.floor(.2*numRows); 
  this.addCircles(y,'gray')

}


export {rs};

      

