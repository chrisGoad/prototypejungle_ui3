import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';


let rs = basicP.instantiate();

rs.setName('grid_drop_0');

let topParams = {numRows:5,numCols:4,width:100,height:100,framePadding:.1*ht,frameStroke:'white'};

Object.assign(rs,topParams);

rs.initialize = function () {

}

rs.cell2pos = function (c) {
  let {cellW,cellH} = this;
  let {x,y} = c;
  return Point.mk(x*cellW,y*cellH);
}

rs.cellName = fun
ction (c) {
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
  rect.x=p.x;
  rect.y=p.y;
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
}
  
rs.initialize = function () {
  let {width,height,numRows,numCols} = this;
  this.cellW = width/numCols;
  this.cellH = height/numRows;
  this.initProtos();
  this.addFrame();
  this.fillCell(Point.mk(x:-2,y:-2));
  this.fillCell(Point.mk(x:2,y:-2));
  this.fillCell(Point.mk(x:2,y:2));
}
 
  
  
