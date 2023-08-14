import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';


let rs = basicP.instantiate();

rs.setName('grid_drop_0');
let ht = 100;
let topParams = {numRows:201,numCols:201,width:ht,height:ht,framePadding:.0*ht,frameStrokee:'white'};

Object.assign(rs,topParams);

rs.randomCell = function () {
  //debugger;
  let {ufc,cells} = this;
  let ln = ufc.length;
  let ri = Math.floor(ln*Math.random());
  let cnm = ufc[ri];
  let rect = this[cnm];
  if (rect) {
    return 0;
  }
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
rs.fillCell = function (c,fill) {
  let p = this.cellPos(c);
  let rect = this.rectP.instantiate();
  let cnm = this.cellName(c);
  let crect = this[cnm];
  if (crect) {
    return 0;
  }
  this.set(cnm,rect);
  rect.moveto(p);
  if (fill) {
    rect.fill = fill;
  }
  //rect.x=p.x;
  //rect.y=p.y;
  rect.update();
  rect.show();
  rect.cell = c;
  return rect;
}

rs.fillWithNearestColor = function (c) {
  let rect = this.nearestFilledCell(c);
  if (rect) {
    let fill = rect.fill;
    this.fillCell(c,fill);
  }
  return rect
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
     
rs.inRing =  function (c,d) {
 let {numRows:nr,numCols:nc}  = this;
 // first the top
 let {x,y} = c;
 let hnc = (nc-1)/2;
 let hnr = (nr-1)/2;
 let xtop = y-d;  
 if (xtop>=-hnr) {
    let left = Math.max(x+1-d,-hnc);
    let right = Math.min(x+d-1,hnc);
    for (let i=left;i<=right;i++) {
      let p = Point.mk(i,xtop);
      let cnm = this.cellName(p);
      let rect = this[cnm];
      if (rect) {
        return rect;
      }
     // this.fillCell(p);
    }
  }
  let xbot = y+d;  
  if (xbot<=hnr) {
    let left = Math.max(x+1-d,-hnc);
    let right = Math.min(x+d-1,hnc);
    for (let i=left;i<=right;i++) {
      let p = Point.mk(i,xbot);
      let cnm = this.cellName(p);
      let rect = this[cnm];
      if (rect) {
        return rect;
      }
   //   this.fillCell(p);
    }
  }
  return;
  let left = x-d;  
  if (left>=-hnc) {
    let top = Math.max(y-d,-hnr);
    let bot = Math.min(y+d,hnr);
    for (let j=top;j<=bot;j++) {
      let p = Point.mk(left,j);
      let cnm = this.cellName(p);
      let rect = this[cnm];
      if (rect) {
        return rect;
      }
     // this.fillCell(p);
    }
  }
  let right = x+d;  
  if (right<=hnc) {
    let top = Math.max(y-d,-hnr);
    let bot = Math.min(y+d,hnr);
    for (let j=top;j<=bot;j++) {
      let p = Point.mk(right,j);
      let cnm = this.cellName(p);
      let rect = this[cnm];
      if (rect) {
        return rect;
      }
     // this.fillCell(p);
    }
  }
}

rs.nearestFilledCell = function (c) {
  let {numRows:nr,numCols:nc} = this;
  let hnr = (nr-1)/2;
  let cr = 1;
  let fnd = 0;
  while (cr <= hnr) {
    let fnd = this.inRing(c,cr);
    if (fnd) {
      return fnd;
    }
    cr++;
  }
}
  
   
   
rs.randomFill = function () {
  const randomV = function (lb,ub) {
    let d = ub-lb;
    return Math.floor(lb+d*Math.random());
  }    
  let r = randomV(50,200);
  let g = randomV(50,200);
  let b = randomV(50,200);
  return `rgb(${r},40,${b})`;
  return `rgb(${r},${r},${b})`;
}

rs.fillRandomCells = function (n) {
  let ncf = 0;
  let cnt = 0;
  while (ncf < n) {
    if (cnt%100 === 0) {
      this.ufc = this.unfilledCells();
    }
    cnt++;
    let c = this.randomCell();
    if (c) {
      let fill = this.randomFill();
      let r = this.fillCell(c,fill);
      if (r) {
       ncf++;
      }
    }
  }
}
rs.paint = function (n) {
 let ncf = 0;
  let cnt = 0;
  while (ncf < n) {
    if (cnt%100 === 0) {
      this.ufc = this.unfilledCells();
    }
    cnt++;
    let c = this.randomCell();
    if (c) {
      let r;
      while (!r) {
        r = this.fillWithNearestColor(c);
      }
      ncf++;

    }
  }
}
 

rs.initProtos = function () {
  let {cellW,cellH} = this;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'rgba(255,255,0,0.5)';
  rectP.width = 1.1*cellW;
  rectP.height = 1.1*cellH;
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
  let noc = 80;
  let ntf = 0.8*Math.floor(numRows*numCols);
  ntf = numRows*numCols-noc;
  let pf = Point.mk(0,-3,'blue');
  let p = Point.mk(0,0);
  //this.fillCell(p);
  //this.fillCell(pf,'blue');
 // let rect = this.inRing(p,3);
  //let rect = this.inRing(p,3);
    this.fillRandomCells(noc);

  this.paint(ntf);
  return;
  this.fillWithNearestColor(p);
//  let rect = this.nearestFilledCell(p);

  debugger;
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
  
