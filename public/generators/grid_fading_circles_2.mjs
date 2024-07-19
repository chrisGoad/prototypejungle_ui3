
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();

addGridMethods(rs);
addAnimationMethods(rs);

rs.setName('grid_fading_circles_2');
let mul = 1;
//let ht  = 100;
let wd  = 100;
//* let nr = 257;
let nc = 128;
//nc = 16;
//*let nc = ((nr*mul).toString(2)).length-1;
let nr = nc;
//*let wd = ht/2;//Math.floor((nc/nr) * ht)-1;
let ht = wd;//Math.floor((nc/nr) * ht)-1;
let colorParams = {redOb:{r:255,g:0,b:0},greenOb:{r:0,g:255,b:0},blueOb:{r:0,g:0,b:255},blackOb:{r:0,g:0,b:0},whiteOb:{r:255,g:255,b:255},
                  cyanOb:{r:0,g:255,b:255}};
let topParams = {width:wd,height:ht,numRows:nr,numCols:nc,framePadding:0.2*wd,frameStroke:undefined,doNotDisplayParts:1,numSteps:30,
                 numCircles:16,numSteps:20,saveAnimation:1}
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
  console.log('x',x,'y',y);
  //debugger;
  let fr = this.frToLL(x,y);
  let gv = Math.floor(255*(1-fr));
   let fill = this.toRGB(gv,gv,gv);
   this.addCircle(x,y,fill);
 }

rs.addFadingCircles = function (y) {
  let {numCircles,numCols,numRows,width} = this;
  let intx = numCols/numCircles;
  let circWd = width/numCircles;
  this.circleDiam= 0.4*circWd;
 // let y = numRows/2;
  for  (let i=0;i<numCircles;i++) {
     let x = intx * i;
     this.addFadedCircle (x,y);
  }
}

rs.placeFadingCircle  = function (cix,ciy,offset) {
   let {numCircles,numCols,numRows,width,height,circles} = this;
   //debugger;
   let idx =cix + ciy*numCircles;
   let crc = circles[idx];
   let cbcx  = numCols/numCircles; // x cells between circles 
   let cbcy  = numRows/numCircles; // y cells between circles 
   let gx = cbcx*cix;
   let gy = cbcy*ciy;
   let cwd = width/numCols;;
   let cnt = this.centerPnt(gx,gy);
   let aoff = offset*cbcx*cwd;
   let cnto = cnt.plus(Point.mk(aoff,0));
   crc.moveto(cnto);
}

rs.placeFadingCircles = function (offset) {
  let {numCircles} = this;
  for (let j = 0;j<numCircles;j++) {
    for (let i = 0;i<numCircles;i++) {
      this.placeFadingCircle(i,j,offset);
    }
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
  
rs.frToLL  = function (x,y) {
  let {numCols,numRows} = this;
  let LL= Point.mk(numCols,numRows);
  let UL=Point.mk(0,0)
  let diagLn = LL.boxcarDistance(UL);
  let cellPnt= Point.mk(x,y);
  let cLn = cellPnt.boxcarDistance(UL);
  let fr = cLn/diagLn;
  return fr;
}

rs.shapeGenerator = function (rvs,cell) {
  let {rectP,lineP,numCols,numRows,height,width,fill} = this;
 // debugger;
  let cwd = width/numCols;
  let cht = height/numRows;
  let frw =1;
  let scwd = frw*cwd;
  let scht = frw*cht;
  let {x,y} = cell;
   let shape = rectP.instantiate().show();
  shape.width = scwd;
  shape.height = scht;
  let fr = this.frToLL(x,y);
  let gv = Math.floor(255*fr);
  console.log('x',x,'y',y,'fr',fr);
  if (0) {
    fill = 'pink';
  } else {
    fill = this.toRGB(gv,gv,gv);
  }
  shape.fill = fill;
  return shape;
}

rs.setFills = function (fra) {
  let {numCircles,circles,numCols,numRows,gv} = this;
 // debugger;
 // let fra = numCircles*ifra;
  for (let j = 0;j<numCircles;j++) {
    for (let i = 0;i<numCircles;i++) {
      let idx = i+numCircles*j;
      let crc = circles[idx];
      let cbcx  = numCols/numCircles; // x cells between circles 
      let cbcy  = numRows/numCircles; // y cells between circles 
      let gx = cbcx*i;
      let gy = cbcy*j;
      let fr = this.frToLL(gx+fra*cbcx,gy);
      let ofr = this.frToLL(gx,gy);
     // let ogv = Math.floor(255*(1-fr))
      console.log('gx',gx,'gy',gy,'fr',fr);
      if (1&&(gx===0)) {
        let sfr = this.frToLL(gx,gy);
        let ofr2 = this.frToLL(gx+cbcx,gy);
        let efr =1-ofr2; 
        gv = 255*(sfr + fra * (efr-sfr));
        debugger;
      } else if (1&&(gx === (numCircles-1)*cbcx)) {
        let sfr = 1-this.frToLL(gx,gy);
        let ofr2 = this.frToLL(gx+cbcx,gy);
        let efr =ofr2; 
        gv = 255*(sfr + fra * (efr-sfr));
        debugger;
      } else {
        gv = Math.floor(255*(1-fr));
      }
      let fill = this.toRGB(gv,gv,gv);
      crc.fill=fill;
      crc.update();
    }
  }
}  

rs.initialize =function ()  {
  debugger;
  this.initProtos();
  this.addFrame();
  let {width:wd,height:ht,numRows,numCols,numCircles} = this;
  let hwd = wd/2;
  let hht = ht/2;
  let rectL = Rectangle.mk(Point.mk(-hwd-30,-hht),Point.mk(-hwd,hht));
  this.generateGrid();
  this.set('circles',core.ArrayNode.mk());
  for (let i=0;i<numCircles;i++) {
    let y = Math.floor((1/numCircles)*i*numRows);
    this.addFadingCircles(y);
  }
 // this.set('rectL',rectL);
 //this.placeFadingCircles(0.05);
}


rs.updateState = function  () {
  let {numSteps,stepsSoFar:ssf} = this;
  debugger;
  let fr = ssf/numSteps;
  this.placeFadingCircles(fr);
  this.setFills(fr);
}
 

export {rs};

      

