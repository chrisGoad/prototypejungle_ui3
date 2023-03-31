

import {rs as linePP} from '/shape/line.mjs';

import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPathMethods} from '/mlib/animate0.mjs';	
let rs = basicP.instantiate();
addPathMethods(rs);

let wd = 200;
let nr = 8;
rs.setName('rotate_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.0*wd,frameStroke:'rgb(2,2,2)',frameStrokeWidth:1,saveAnimation:0,numSteps:1000}
Object.assign(rs,topParams);
/*
rs.addPath = function (nm,speed) {
  let {pstate,speeds} = this;
  let {pspace,cstate} = pstate;
  pspace[nm] = {kind:'sweepFixedDur',dur:100,min:0,max:10,start:0};
  cstate[nm] = {value:0};
};

rs.pstate = {pspace:{},cstate:{});
*/
rs.grid = [];

rs.rect2lineSegs = function (rect) {
  let {corner,extent} = rect;
  let {x:cx,y:cy} = corner;
  let {x:ex,y:ey} = extent;
  let c0 = Point.mk(cx,cy);
  let c1 = Point.mk(cx+ex,cy);
  let c2 = Point.mk(cx+ex,cy+ey);
  let c3 = Point.mk(cx,cy+ey);
  let ls0 = LineSegment.mk(c0,c1);
  let ls1 = LineSegment.mk(c1,c2);
  let ls2 = LineSegment.mk(c2,c3);
  let ls3 = LineSegment.mk(c3,c0);
  return [ls0,ls1,ls2,ls3];
}


rs.shrinkBy = function (rect,shr) {
 let {corner,extent} = rect;
 let {x:cx,y:cy} = corner;
 let {x:ex,y:ey} = extent;
 let cnx = cx + 0.5*ex;
 let cny = cy + 0.5*ey;
 let nex =ex*shr;
 let ney =ey*shr;
 let ncx = cnx - 0.5*nex;
 let ncy = cny - 0.5*ney;
 let nc = Point.mk(ncx,ncy);
 let ne = Point.mk(nex,ney);
 let nr = Rectangle.mk(nc,ne);
 return nr;
}
 
rs.rectFromRowsCols = function (params) {
  let {lowRow,highRow,lowCol,highCol,shrinkBy} = params;
  let {width,numRows:nr,deltaX} = this;
  let minx = -0.5*width;
  let bminx = minx+deltaX*lowRow;
  let bmaxx = minx+deltaX*highRow;
  let extx = bmaxx-bminx;
  let ext = Point.mk(extx,extx);
  let corner = Point.mk(bminx,bminx);
  
  let rect = Rectangle.mk(corner,ext);
  let srect = this.shrinkBy(rect,shrinkBy);
  return srect;
 }

rs.intersectLineSegsLineSeg = function (rect,segs,seg) {
  let {end0:e0,end1:e1} = seg;
  let c0 = rect.contains(e0);
  let c1 = rect.contains(e1);
  
  if (c0 && c1) {
    return seg;
  }
  let cOne = c0||c1;
  let inside = c0?e0:e1;
  const buildSeg = function (ints) {
    if (ints.length > 1) {
      return LineSegment.mk(ints[0],ints[1]);
    }
    if (cOne && (ints.length)) {
      return LineSegment.mk(inside,ints[0]);
    }
  }
  let ints = [];
  let [sg0,sg1,sg2,sg3] = segs;
  let i0 = seg.intersect(sg0);
  if (i0 && (typeof i0 === 'object')) {
    ints.push(i0);
  }
  let bs = buildSeg(ints);
  if (bs) {
    return bs;
  }
  let i1 = seg.intersect(sg1);
  if (i1 && (typeof i1 === 'object')) {
    ints.push(i1);
  }
  bs = buildSeg(ints);
  if (bs) {
    return bs;
  }
  let i2 = seg.intersect(sg2);
  if (i2 && (typeof i2 === 'object')) {
    ints.push(i2);
  }
  bs = buildSeg(ints);
  if (bs) {
    return bs;
  }
  let i3 = seg.intersect(sg3);
  if (i3 && (typeof i3 === 'object')) {
    ints.push(i3);
  }
  bs = buildSeg(ints);
  if (bs) {
    return bs;
  }
}
  
    
  


rs.buildGrid = function () {
  let gr = this.grid = [];
  let {numRows:nr,numCols:nc,height:ht,width:wd} = this;
  let deltaX = this.deltaX =wd/nc;
  let deltaY = this.deltaY = ht/nr;
  let minX = -0.5*wd;
  let minY = -0.5*ht;
  for (let i=0;i<nc;i++) {
    let x = minX+i*deltaX;
    for (let j=0;j<nr;j++) {
      let y = minY + j*deltaY;
      let p = Point.mk(x,y);
      let idx =i*nr+j;
      let fc = .3;
      let name = 'g_'+i+'_'+j;
      let minSpeed = -30;
      let maxSpeed = 30;
      let dSpeed = maxSpeed - minSpeed;
     // let speed = (minSpeed+dSpeed*Math.random())*2*Math.PI;
      let speed = (Math.random()>0.5?30:-30)*2*Math.PI;
    //  this.addPath(name,speed);
      let g = {name,row:i,col:i,index:idx,basePos:p,below:idx+1,toRight:idx+nr,offset:Point.mk(0,0),speed};
     //let g = {name,row:i,col:i,index:idx,basePos:p,below:idx+1,toRight:idx+nr,offset:Point.mk(fc*Math.random()*deltaX,fc*Math.random()*deltaY)};
      gr.push(g);
    }
  }
}


rs.addSegs = function() {
  let {numRows:nr,numCols:nc,grid,lineP} = this;
  //let segs = this.set('segs',arrayShape.mk());
  for (let i=0;i<nc;i++) {
    for (let j=0;j<nr;j++) {
      //let hline = (i === nc-1)?null:lineP.instantiate();
      //let vline = (j === nr-1)?null:lineP.instantiate();
      let hseg = (i === nc-1)?null:LineSegment.mk(Point.mk(0,0),Point.mk(0,0));
      let vseg = (j === nr-1)?null:LineSegment.mk(Point.mk(0,0),Point.mk(0,0));
      //lines.push(hline);
      //lines.push(vline);
      //segs.push(hseg);
      //segs.push(vseg);
      let idx =i*nr+j;
      let g = grid[idx];
     // g.hline = hline;
     // g.vline = vline;
      g.hseg = hseg;
      g.vseg = vseg;
    }
  }
}

rs.rotatePoint = function(p,angle,center) {
  let v = p.difference(center);
  let m00 = Math.cos(angle);
  let m10 = -Math.sin(angle);
  let m01  = -m10;
  let m11 = m00;
  let {x,y} = v;
  let rx =  m00*x + m10*y;
  let ry = m01*x + m11*y;
  return center.plus(Point.mk(rx,ry));
}

rs.rotateSeg = function (seg,angle,center,box) {
  if (!seg) {
    return;
  }
  let {end0:e0,end1:e1} = seg;
  let re0  = this.rotatePoint(e0,angle,center);
  let re1  = this.rotatePoint(e1,angle,center);
  seg.setEnds(re0,re1);
}

rs.rotateSegs = function (segs,angle,center,box) {
  segs.forEach ((seg) => {
    this.rotateSeg(seg,angle,center,box);
  });
}

rs.boxFilter= function(box) {
  let {grid} = this;
  let ln = grid.length;
  let inSegs = [];
  let outSegs = [];
  for (let i=0;i<ln;i++) {
    let g=grid[i]
    let {basePos:bp,offset,hseg,vseg,below,toRight} = g;
    let e0 = bp.plus(offset);
    if (hseg) {
      let tor = grid[toRight];
      let e1=(tor.basePos).plus(tor.offset);
      hseg.setEnds(e0,e1);
      let inBox = box.contains(e0) || box.contains(e1);
      if (inBox) {
        inSegs.push(hseg);
      } else {
        outSegs.push(hseg);
      }
      
    }
    if (vseg) {
      let bl = grid[below];
      let e1=(bl.basePos).plus(bl.offset);
      vseg.setEnds(e0,e1);
      let inBox = box.contains(e0) || box.contains(e1);
      if (inBox) {
        inSegs.push(vseg);
      } else {
        outSegs.push(vseg);
      }
    }
  }
  return {inBox:inSegs,outBox:outSegs};
}

rs.segs2lines = function (lines,segs) {
  let {lineP} = this;
  let ln = segs.length;
  for (let i=0;i<ln;i++) {
    let sg = segs[i];
    let ln = lineP.instantiate();
    let {end0,end1} = sg;
    ln.setEnds(end0,end1);
    lines.push(ln);
    ln.show();
    ln.update();
  }
}
rs.theBoxR = Rectangle.mk(Point.mk(-50,-50),Point.mk(100,100));
//rs.theBoxR = Rectangle.mk(Point.mk(-25,-25),Point.mk(50,50));


rs.intersectSegs = function () {
  let {segs,theBoxR,theBox} = this;
  let nsegs = [];
  segs.forEach((seg) =>{
    if (seg) {
      let nseg = this.intersectLineSegsLineSeg(theBoxR,theBox,seg);
      nsegs.push(nseg);
      if (nseg) {
       // debugger;
        let abc = this.intersectLineSegsLineSeg(theBoxR,theBox,seg);
       // debugger;
      }
       
    } else {
      nsegs.push(null);
    }
  });
  this.segs = nsegs;
}
     
  
rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .2;
  lineP.stroke = 'white';
  
}  
rs.initialize =  function () {
  debugger;
  this.initProtos();
  this.buildGrid();
  this.addSegs();
    let hb = this.rectFromRowsCols({lowRow:2,highRow:4,shrinkBy:0.98});
  let lines =  this.set('lines',arrayShape.mk());
  let fs = this.boxFilter(hb);
  //this.adjustSegs(hb);
 this.segs2lines(lines,fs.outBox);
 this.segs2lines(lines,fs.inBox);

  return;
  let {segs} =this;
  this.rotateSegs(segs,0.04*Math.PI*2,Point.mk(0,0));
  this.segs2lines();
  this.theBox = this.rect2lineSegs(this.theBoxR);
  this.intersectSegs();
  this.segs2lines();

  
}

rs.updateState = function () {
  let {grid,stepsSoFar:ssf,numSteps,deltaX} =this;
  let ln = grid.length;
  for (let i=0;i<ln;i++) {
    let g = grid[i];
    let {speed} = g;
    let fr = ssf/numSteps;
    let a = fr*speed;
    let fc = .2;
    let vec = Point.mk(Math.cos(a),Math.sin(a)).times(fc*deltaX);
    g.offset = vec;
  }
  this.adjustLines();
}  


    

  
export {rs};


