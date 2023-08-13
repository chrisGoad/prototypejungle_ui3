import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';


let rs = basicP.instantiate();

rs.setName('grid_drop_0');
let ht = 100;
let topParams = {numRows:91,numCols:91,width:ht,height:ht,framePadding:.0*ht,frameStroke:'white'};

Object.assign(rs,topParams);


rs.cellPos = function (c) {
  let {cellW,cellH} = this;
  let {x,y} = c;
  return Point.mk(x*cellW,y*cellH);
}

rs.cellName = function (c) {
  let {x,y} = c;
  let xn = x<0?'_m'+(-x):'_'+x;;
  let yn = y<0?'_m'+(-y):'_'+y;;
  return 'c'+xn+yn;
}
rs.fillCell = function (c) {
  let p = this.cellPos(c);
  let rect = this.rectP.instantiate();
  let cnm = this.cellName(c);
  this.set(cnm,rect);
  rect.moveto(p);
  //rect.x=p.x;
  //rect.y=p.y;
  rect.update();
  rect.show();
  rect.cell = c;
}

rs.initProtos = function () {
  let {cellW,cellH} = this;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'white';
  rectP.width = cellW;
  rectP.height = cellH;
  rectP['stroke-width'] = 0;
}
  
rs.initialize = function () {
  let {width,height,numRows,numCols} = this;
  debugger;
  this.cellW = width/numCols;
  this.cellH = height/numRows;
  this.initProtos();
  this.addFrame();
  let hnr = (numRows-1)/2;
  for (let i=-hnr;i<=hnr;i++) {
    this.fillCell(Point.mk(i,i));
  }
  return;
  this.fillCell(Point.mk(2,-2));
  this.fillCell(Point.mk(2,2));
  this.fillCell(Point.mk(0,0));
}
 
export {rs}
  
