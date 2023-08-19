import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';


let rs = basicP.instantiate();

addAnimationMethods(rs);

rs.setName('grid_drop_0');
let ht = 100;
let topParams = {numRows:151,numCols:151,width:ht,height:ht,numSeeds:200/*80*/,framePadding:.0*ht,frameStrokee:'white',numSteps:20,
   //sides:['top','bot']};
   sides:['topp','bott','left','right'],nearest:1,saveAnimation:1};

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
  let rect = this.findFilledCell(c);
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
 let {numRows:nr,numCols:nc,sides}  = this;
 // first the top
 let dm = d;//Math.ceil(0.2*d)
 let {x,y} = c;
 let hnc = (nc-1)/2;
 let hnr = (nr-1)/2;
 let xtop = y-d;  
 if ((sides.indexOf('top')>-1)&&(xtop>=-hnr)) {
    let left = Math.max(x+1-dm,-hnc);
    let right = Math.min(x+dm-1,hnc);
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
  if ((sides.indexOf('bot')>-1)&&(xbot<=hnr)) {
    let left = Math.max(x+1-dm,-hnc);
    let right = Math.min(x+dm-1,hnc);
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
  let left = x-d;  
  if ((sides.indexOf('left')>-1)&&(left>=-hnc)) {
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
  if ((sides.indexOf('right')>-1)&&(right<=hnc)) {
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

rs.findFilledCell = function (c) {
  let {numRows:nr,numCols:nc,nearest} = this;
  let hnr = (nr-1)/2;
  let cr=nearest?1:Math.floor(1*hnr);
  //cr = hnr;
  //cr = 5;
  let fnd = 0;
  const condition = () => {
    return nearest?cr <= Math.floor(1*hnr):cr>0;
  }
  while (condition()) {
    let fnd = this.inRing(c,cr);
    if (fnd) {
      return fnd;
    }
    cr=nearest?cr+1:cr-1;
  }
}

rs.nearestFilledCell = function (c) {
  return this.findFilledCell(c,1);
}

rs.farthestFilledCell = function (c) {
  return this.findFilledCell(c,0);
}
/*
rs.nearestFilledCell = function (c) {
  let {numRows:nr,numCols:nc,near} = this;
  let hnr = (nr-1)/2;
  let cr = 1;
  cr = hnr;
  //cr = 5;
  let fnd = 0;
  //while (cr <= Math.floor(1*hnr)) {
  while (cr > 0) {
    let fnd = this.inRing(c,cr);
    if (fnd) {
      return fnd;
    }
    //cr=cr+1;
    cr=cr-1;
  }
}
 */ 
   
   
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



rs.fillCellsAtInterval = function (iv) {
  let {numRows:nr,numCols:nc} = this;
  let hnr = (nr-1)/2;
  let lwr = Math.floor(0.5*hnr);
  let hnc = (nc-1)/2;
  let cr = iv-hnr;
  cr = -lwr;
  let cnt = 0;
  //while (cr < lwr) {
  //while (cr < hnr) {
  while (cr < lwr) {
    let cc = iv-hnc;
    while (cc < hnc) {
      let c = Point.mk(cc,cr);
      let fill = this.randomFill();
      let r = this.fillCell(c,fill);
      cc = cc+iv;
      cnt++;
    }
    cr = cr + iv;
  } 
  return cnt;  

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
 
rs.copyFill = function () {
  let {numRows:nr,numCols:nc} = this;
  let cp = {};
  let hnr = (nr-1)/2;
  let hnc = (nc-1)/2;
  for (let i=-hnc;i<=hnc;i++) {
    for (let j=-hnr;j<=hnr;j++) {
      let p = Point.mk(i,j);
      let cnm = this.cellName(p);
      let rect = this[cnm];
      if (rect) {
        cp[cnm] = rect.fill;
      }
    }
  }
  this.copiedFill = cp;
}

rs.cellWithShift0 = function (c,shift) {
  let {numCols:nc} = this;
  let {x,y} = c;
  let hnc = (nc-1)/2;
  let shx = x+shift;
  if (shx <= hnc) {
    return Point.mk(shx,y);
  }
  debugger;
  let rx = (shx-hnc-hnc);
  return Point.mk(-rx,y);
}


rs.cellWithShift1 = function (c,shift) {
  let {numCols:nc} = this;
  let {x,y} = c;
  let hnc = (nc-1)/2;
  let shx = x+shift;
  if (shx <= hnc) {
    let rx = (shx-hnc-hnc);
    return Point.mk(-rx,y);
  }
  debugger;
 
  return Point.mk(shx,y);

}

rs.dpyShift = function (shift,stage) {
  let {numRows:nr,numCols:nc,copiedFill:cf} = this;
  let hnr = (nr-1)/2;
  let hnc = (nc-1)/2;
  for (let i=-hnc;i<=hnc;i++) {
    for (let j=-hnr;j<=hnr;j++) {
    //for (let j=0;j<=0;j++) {
      let p = Point.mk(i,j);
      let pnm = this.cellName(p);
      let c = stage?this.cellWithShift1(p,shift):this.cellWithShift0(p,shift);
      let cnm = this.cellName(c);
      console.log('shift',shift,'pnm',pnm,'cnm',cnm);
      let prect = this[pnm];
      let cfill = cf[cnm];
      if (prect&&cfill) { 
        prect.fill = cfill;
        prect.update();
      }
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
  let {width,height,numRows,numCols,numSeeds} = this;
  debugger;
  this.cellW = width/numCols;
  this.cellH = height/numRows;
  this.initProtos();
  this.addFrame();
  this.cells = {};
  let hnr = (numRows-1)/2;
  //let ntf = numRows*numCols-numSeeds;
  let pf = Point.mk(0,-3,'blue');
  let p = Point.mk(0,0);
  //this.fillCell(p);
  //this.fillCell(pf,'blue');
 // let rect = this.inRing(p,3);
  //let rect = this.inRing(p,3);
   this.fillRandomCells(numSeeds);
    //numSeeds = this.fillCellsAtInterval(20);
   //numSeeds = this.fillCellsAtInterval(3);
    let ntf = numRows*numCols-numSeeds-1;

  this.paint(ntf);
  this.copyFill();
  this.numSteps = 2*numCols-1;
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

rs.updateState = function () {
  let {numSteps:ns,stepsSoFar:ssf,numCols:nc} = this;
  debugger;
  if  (ssf<=nc) {
    this.dpyShift(ssf,0);
  } else {
    this.dpyShift(ssf-nc,1);
  }
}

export {rs}
  
