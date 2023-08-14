import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';


let rs = basicP.instantiate();

rs.setName('grid_drop_0');
let ht = 100;
let topParams = {numRows:101,numCols:101,width:ht,height:ht,framePadding:.0*ht,frameStroke:'white'};

Object.assign(rs,topParams);

rs.randomCell = function () {
  debugger;
  let {ufc,cells} = this;
  let ln = ufc.length;
  let ri = Math.floor(ln*Math.random());
  let cnm = ufc[ri];
  let c = cells[cnm];
  return c;
 // let rc = this[cnm];
 // let c = rc.cell;
 // return c;
  /*
  let {numRows:nr,numCols:nc}=this;
  let hnr = (nr-1)/2;
  let hnc = (nc-1)/2;
  let rr = Math.floor(Math.random()*(nr))-hnr;
  let rc = Math.floor(Math.random()*(nc))-hnc;
  return Point.mk(rr,rc);*/
}

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
  let crect = this[cnm];
  if (crect) {
    return 0;
  }
  this.set(cnm,rect);
  rect.moveto(p);
  //rect.x=p.x;
  //rect.y=p.y;
  rect.update();
  rect.show();
  rect.cell = c;
  return rect;
}

rs.unfilledCells = function () {
  let {numRows,numCols,cells} = this;
  let ufc = [];
  let {numRows:nr,numCols:nc}=this;
  let hnr = (nr-1)/2;
  let hnc = (nc-1)/2;
 // debugger;
  for (let i=-hnr;i<=hnr;i++) {
    for (let j=-hnc;j<=hnc;j++) {
     // console.log('i',i,'j',j);
      let c = Point.mk(i,j);
      let cnm = this.cellName(c);
      let rc = this[cnm];
      if (!rc) {
        ufc.push(cnm);
        cells[cnm] = c;
      }
    }
  }
  return ufc;
}
     
  
  

rs.fillRandomCells = function (n) {
  let ncf = 0;
  
  while (ncf < n) {
    if (ncf%100 === 0) {
      this.ufc = this.unfilledCells();
    }
    let c = this.randomCell();
    let r = this.fillCell(c);
    if (r) {
      ncf++;
    }
  }
}

rs.initProtos = function () {
  let {cellW,cellH} = this;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'rgb(255,255,0)';
  rectP.width = .8*cellW;
  rectP.height = .8*cellH;
  rectP['stroke-width'] = 0;
}
  
rs.initialize = function () {
  let {width,height,numRows,numCols} = this;
  debugger;
  this.cellW = width/numCols;
  this.cellH = height/numRows;
  this.initProtos();
  this.addFrame();
  this.cells = {};
  let hnr = (numRows-1)/2;
  let ntf = 0.8*Math.floor(numRows*numCols);
   //this.unfilledCells();
  //console.log('ufc',ufc);
  this.fillRandomCells(ntf);
  //ufc = this.unfilledCells();
  //console.log('after ufc',ufc);

  return;
  for (let i=-hnr;i<=hnr;i++) {
    this.fillCell(Point.mk(i,i));
  }
  return;
  this.fillCell(Point.mk(2,-2));
  this.fillCell(Point.mk(2,2));
  this.fillCell(Point.mk(0,0));
}
 
export {rs}
  
