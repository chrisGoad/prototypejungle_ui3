
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);

rs.setName('geom_tests');
let wd = 100;
let nc =100;
//nc=10;
let topParams = {numRows:nc,numCols:nc,width:wd,height:wd,framePadding:0.25*wd,frameStroke:'yellow'};
Object.assign(rs,topParams);


rs.colorObToRgb = function (c) {
  let {r,g,b} = c;
  let rgb = `rgb(${r},${g},${b})`;
  return rgb;
}


rs.randomColorOb = function () {
  const RIR = (lb,ub) => {
    let delta= ub-lb;
    let rv = Math.floor(lb+Math.random()*delta);
    return rv;
  }
  let rc = {r:RIR(0,255),g:RIR(0,255),b:RIR(0,255)};
  return rc;
}

rs.paintCells = function (params) {
  debugger;
  let {numRows:nr,numCols:nc} = this;
  let {gons} = params;
  for (let x=0;x<nc;x++) {
    for (let y=0;y<nr;y++) {
      //let c = {x:i,y:j}
      //let clr = this.colorAtCell(c,fr);
      let cnt = this.centerPnt(x,y);
      params.p = cnt;
      let lng =gons.length;
      for (let i=0;i<lng;i++) {
        let gon = gons[i];
        if (gon.contains(cnt)) {
          params.gon = gon;
          let iv=this.interpolateInPolygon(params);
          let rgb = this.colorObToRgb(iv);
          let shp = this.shapeAt(x,y);
          shp.fill = rgb;
          shp.update();
          break;
        }
      }
    }
  }
}

rs.initProtos = function () {
  this.lineP  = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 1;
  rs.rectP  = rectPP.instantiate();
  rs.rectP.fill = 'white';
  rs.rectP['stroke-width'] = 0;
}  


rs.shapeGenerator = function (rvs,cell) {
  let {rectP,numCols,width} = this;
  let cwd = width/numCols;
  let frw =1;
  let scwd = frw*cwd;
  let {x,y} = cell;
  
  let shape = rectP.instantiate().show();
  shape.width = scwd;
  shape.height = scwd;
  shape.fill = 'blue';
  return shape;
}
rs.initialize = function () {
  this.initProtos();
  let {width,lineP,numCols:nc,numRows:nr} = this;
  this.addFrame();
  let cwd = width/nc;

  debugger;
  let v0 = {x:2,y:3};
  let v1 = {x:4,y:6};
  let sum = this.deepSum(v0,v1);
  let dim = width/2;
  let sdim = dim;
  let UL= Point.mk(-dim,-sdim);
  let UR =Point.mk(dim,-sdim);
  let LR =  Point.mk(dim,sdim);
  let LL =  Point.mk(-dim,sdim);
  let gon = Polygon.mk([UL,UR,LR,LL]);
  gon.theSides = gon.sides();
  let gons = [gon]
  let red = {r:255,g:0,b:0};
  let  green= {r:0,g:255,b:0};
  let  blue= {r:0,g:0,b:255};
  let  black= {r:0,g:0,b:0};
  let  cyan = {r:0,g:255,b:255};
  //let values = [red,green,blue,green];
  let values = [this.randomColorOb(),this.randomColorOb(),this.randomColorOb(),this.randomColorOb()];
  let p0 = Point.mk(0,0);
  let p1 = Point.mk(25,0);
  let params = {gons,values,p:p0};
  //let iv=this.interpolateInPolygon(params);
    debugger;

  this.generateGrid();
  this.paintCells(params);
  return;
  for (let x=0;x<nc;x++) {
    for (let y=0;y<nr;y++) {
      let cnt = this.centerPnt(x,y);
      params.p = cnt;
      let iv=this.interpolateInPolygon(params);
      let fill = this.colorObToRgb(iv);
      let shp = this.shapeAt(x,y);
      shp.fill = fill;
    }
  }

  return;

  let vline0 = lineP.instantiate();
  this.set('vline0',vline0);
  vline0.setEnds(UL,LR); 
  let vline1 = lineP.instantiate();
  this.set('vline1',vline1);
  vline1.setEnds(LL,UR);    
  let vec0= LR.normalize();
  let vec1= UR.normalize();
  let line0= Line.mk(UL,vec0);
  let line1= Line.mk(LL,vec1);
  //debugger
  //let p = line0.intersectLine(line1);
  
}

export {rs};


