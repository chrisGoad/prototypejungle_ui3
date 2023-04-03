

import {rs as linePP} from '/shape/line.mjs';

import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPathMethods} from '/mlib/animate0.mjs';	
let rs = basicP.instantiate();
addPathMethods(rs);

let wd = 200;
let nr = 10;
rs.setName('rotate_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,numSteps:51}
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
  let lowx = -0.5*width;
  let miny = lowx+deltaX*lowRow;
  let maxy = lowx+deltaX*highRow;
  let exty = maxy-miny;
  let minx = lowx+deltaX*lowCol;
  let maxx = lowx+deltaX*highCol;
  let extx = maxx-minx;
  let ext = Point.mk(extx,exty);
  let corner = Point.mk(minx,miny);
  
  let rect = Rectangle.mk(corner,ext);
  let srect = this.shrinkBy(rect,shrinkBy);
  return srect;
 }
 /*
 A configuration is a triple {box:Rectangle,osegs:array_of(LineSegment),rsegs:array_of(LineSegment),lines:array_of(LineShape)}
 
 osegs (original segments) are the segments clipped out of the grid by box, rsegs are osegs rotated,and lines are the lines corresponding to rsegs,
 */
 /* a step is a period when a given configuration is in force. {startTime:integer,dur,config,*/


rs.intersectRays = function (p0,v0,p1,v1) {
  let {x:a,y:b} = p0;
  let {x:c,y:d} = v0;
  let {x:A,y:B} = p1;
  let {x:C,y:D} = v1;
  let t2 = B-b- ((A-a)*d)/c;//((A - a)*d/c) - B;
  let t1 =(C*d)/c - D;
  let T = t2/t1;
  let x = A + T*C;
  let y = B+ T*D;
  let p = Point.mk(x,y);
  return p;
}

rs.onSeg = function(p,seg0) {
  let {end0:e0,end1:e1} = seg0;
  let v0 = p.difference(e0);
  let v1 = e1.difference(p);
  let v = e1.difference(e0);
  let d0 = v0.dotp(v);
  let d1 = v1.dotp(v);
  let s0 = d0>=0?1:0;
  let s1 = d1>=0?1:0;
  return s0 === s1;
}
rs.intersectLineSegs = function (seg0,seg1) {
  let {end0:p00,end1:p01} = seg0;
  let {end0:p10,end1:p11} = seg1;
  let v0 = p01.difference(p00);
  let v1 = p11.difference(p10);
  let p = this.intersectRays(p00,v0,p10,v1);
  let onsegs = this.onSeg(p,seg0) && this.onSeg(p,seg1);
  return onsegs?p:null;
}

rs.intersectLineSegLineSegs = function (seg,segs) {
  let ln = segs.length;
  for (let i=0;i<ln;i++) {
    let sseg = segs[i];
    let isct = this.intersectLineSegs(seg,sseg);
    if (isct) {
      return isct;
    }
  }
  return null;
}
    

  
    
  


rs.buildGrid = function () {
  let gr = this.grid = [];
  let {numRows:nr,numCols:nc,height:ht,width:wd} = this;
  let deltaX = this.deltaX =wd/(nc-1);
  let deltaY = this.deltaY = ht/(nr-1);
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
      let g = {name,row:j,col:i,index:idx,basePos:p,below:idx+1,toRight:idx+nr,offset:Point.mk(0,0),speed};
     //let g = {name,row:i,col:i,index:idx,basePos:p,below:idx+1,toRight:idx+nr,offset:Point.mk(fc*Math.random()*deltaX,fc*Math.random()*deltaY)};
      gr.push(g);
    }
  }
}


rs.addSegs = function() {
  let {numRows:nr,numCols:nc,grid,lineP} = this;
  let allSegs = this.allSegs = [];
  grid.forEach((g) => {
    let {basePos:bp,offset,hseg,vseg,below,toRight,row:j,col:i} = g;
    let e0 = bp.plus(offset);
    if (i < (nc - 1)) {
      let tor = grid[toRight];
      let e1=(tor.basePos).plus(tor.offset);
      let hseg = LineSegment.mk(e0,e1);
      g.hseg = hseg;
      allSegs.push(hseg);
    }
    if (j < (nr - 1)) {
      let b = grid[below];
      let e1=(b.basePos).plus(b.offset);
      let vseg = LineSegment.mk(e0,e1);
      g.vseg = vseg;
      allSegs.push(vseg);
    }
  });
}


rs.addCenters = function() {
  let {numRows:nr,numCols:nc,grid,circleP,centerShapes} = this;
  let allCenters = this.allCenters = [];
  grid.forEach((g) => {
    let {basePos:bp,offset,hseg,vseg,below,toRight,row:j,col:i} = g;
    let base = bp.plus(offset);
    if ((i < (nc - 1))&&(j < (nr - 1))) {
      let tor = grid[toRight];
      let b = grid[below];

      let cph=(tor.basePos).plus(tor.offset);
      let cphv = cph.difference(base).times(0.5);
      
      
      let cpv=(b.basePos).plus(b.offset);
      let cpvv = cpv.difference(base).times(0.5);
      let cp = base.plus(cphv).plus(cpvv);
      allCenters.push(cp);
      /*let crc = circleP.instantiate();
      crc.moveto(cp);
      centerShapes.push(crc);*/
      
    }
  });
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

rs.rotatePointInto = function(rp,op,angle,center) {
  let p = this.rotatePoint(op,angle,center);
  rp.copyTo(p);
}
rs.rotateSeg = function (oseg,iseg,angle,center,box) {
  if (!iseg) {
    return;
  }
  let {end0:e0,end1:e1} = iseg;
  let re0  = this.rotatePoint(e0,angle,center);
  let re1  = this.rotatePoint(e1,angle,center);
  oseg.setEnds(re0,re1);
}

rs.rotateSegs = function (rsegs,osegs,angle,center,box) {
  let ln = osegs.length;
  for (let i=0;i<ln;i++) {
    let oseg = osegs[i];    
    let rseg = rsegs[i];

    
    this.rotateSeg(rseg,oseg,angle,center,box);
  };
}


rs.rotateCenters = function (ocenters,angle,center,box) {
  let ln = ocenters.length;
  let rcenters = [];
  for (let i=0;i<ln;i++) {
    let p = ocenters[i];    
    let rp = this.rotatePoint(p,angle,center,box);
    rcenters.push(rp);
  };
  return rcenters;
}

rs.copySegs = function (isegs) {
  let osegs = [];
  isegs.forEach((iseg) => {
    let {end0:e0,end1:e1} = iseg;
    let oseg = LineSegment.mk(e0,e1);
    osegs.push(oseg);
  });
  return osegs;
}
    


rs.boxFilter= function(box) {
  let {allSegs} = this;
  let segs = [];
  allSegs.forEach((seg) => {
    let {end0:e0,end1:e1} = seg;
    let inBox = box.contains(e0) || box.contains(e1);
    if (inBox) {
      segs.push(seg);
    }
  });
  return segs;
}  


rs.boxFilterCenters= function(box) {
  let {allCenters} = this;
  let centers = [];
  allCenters.forEach((p) => {
    let inBox = box.contains(p);
    if (inBox) {
      centers.push(p);
    }
  });
  return centers;
}  



rs.segs2lines = function (lines,segs,update) {
  let {lineP} = this;
  let ln = segs.length;
  for (let i=0;i<ln;i++) {
    let sg = segs[i];
    let ln = update?lines[i]:lineP.instantiate();
    if ((!sg)||(sg.hidden)) {
      ln.hide();
    } else {
      let {end0,end1} = sg;
      ln.setEnds(end0,end1);
      ln.show();
    }
    if (!update) {
      lines.push(ln);
    }
    ln.update();
  }
}
rs.theBoxR = Rectangle.mk(Point.mk(-50,-50),Point.mk(100,100));
//rs.theBoxR = Rectangle.mk(Point.mk(-25,-25),Point.mk(50,50));


   /*
 A configuration is an object {index:integer,box:Rectangle,boxCenter:Point,osegs:array_of(LineSegment),
   ocenters:array_of(Point),rsegs:array_of(LineSegment),lines:array_of(LineShape),
   reverse:boolean}
 
 osegs (original segments) are the segments clipped out of the grid by box, rsegs are osegs rotated,and lines are the lines corresponding to rsegs,
 */
 /* a step is a configuration together with the period when the configuration is in force. {startTime:integer,duration,config}
 a script is a time-ordered array of steps. The updateState method runs rs.theScript.*/

rs.configs =  [];

rs.mkConfig = function (box,reverse) {
  let {lineP,circleP,configs} = this;
  let index = configs.length;
  let boxSegs = this.rect2lineSegs(box);
  let osegs = this.boxFilter(box);
  let ocenters = this.boxFilterCenters(box);
  let rsegs =[];
  let lines = this.set('lines_'+index,arrayShape.mk());
  let circles = this.set('circles_'+index,arrayShape.mk());
  osegs.forEach((seg) => {
    rsegs.push(LineSegment.mk(Point.mk(0,0),Point.mk(0,0)));
    lines.push(lineP.instantiate());
  });
  ocenters.forEach((p) => {
    //rsegs.push(LineSegment.mk(Point.mk(0,0),Point.mk(0,0)));
    circles.push(circleP.instantiate());
  });
  let config = {index,box,center:box.center(),boxSegs,osegs,ocenters,rsegs,lines,circles,reverse};
  configs.push(config);
  return config;
}

rs.initOutSegs = function () {
  this.outSegs = [];
  this.set('outLines',arrayShape.mk());
  this.set('outCircles',arrayShape.mk());
}

rs.displayOutSegs = function (configs) {
  let {outLines,outCircles,allSegs,centerShapes,allCenters,lineP,circleP} = this; 
  outLines.forEach((line) => {
    line.hide();
    line.update();
  });
  outCircles.forEach((crc) => {
    crc.hide();
    crc.update();
  });
  let outSegs = [];
  let outCenters = [];
  let numLines = outLines.length;
  let numConfigs = configs.length;
  allSegs.forEach((seg) => {
    let inConfig = 0;
    for (let i=0;i<numConfigs;i++) {
      if (inConfig) {
        break;
      }
      let config = configs[i];
      let {osegs} = config;
      let numOsegs = osegs.length;
      for (let j=0;j<numOsegs;j++) {
        let oseg = osegs[j];
        if (oseg === seg) {
          inConfig = 1;
          break;
        }
      }
    }
    if (!inConfig) {
      outSegs.push(seg);
    }
  });
  allCenters.forEach((c) => {
    let inConfig = 0;
    for (let i=0;i<numConfigs;i++) {
      if (inConfig) {
        break;
      }
      let config = configs[i];
      let box = config.box;
      if (box.contains(c)) {
        inConfig = 1;
        break;
      }
    }
    if (!inConfig) {
      outCenters.push(c);
    }
  });
  let numOutSegs = outSegs.length;
  for (let i=0;i<numOutSegs;i++) {
    let seg = outSegs[i];
    let {end0:e0,end1:e1} = seg;
    let line;
    if (i<numLines) {
      line = outLines[i];
    } else {
      line = lineP.instantiate();
      outLines.push(line);
    }
    line.show();
    line.setEnds(e0,e1);
    line.update();
  } 
   let numOutCenters = outCenters.length;
   let numOutCircles = outCircles.length;
  for (let i=0;i<numOutCenters;i++) {
    let p = outCenters[i];
    let crc;
    if (i<numOutCircles) {
      crc = outCircles[i];
    } else {
      crc = circleP.instantiate();
      crc.fill ='blue';
      outCircles.push(crc);
    }
    crc.show();
    crc.moveto(p);
    crc.update();
  } 
}  
    
        
      
    
rs.configSetFraction = function (c,fr) {
  let {rsegs,osegs,ocenters,lines,circles,center,boxSegs,box,reverse} = c;
  let a = (reverse?fr:fr) * 0.5 * Math.PI;
  console.log('angle',a*(180/Math.PI));
  this.rotateSegs(rsegs,osegs,a,center);
  let rcenters = this.rotateCenters(ocenters,a,center);
  let ln=rsegs.length;
  let lnc = rcenters.length;
  for (let i=0;i<ln;i++) {
    let rseg = rsegs[i];
    if ((fr  % 1)===0) {
      //debugger;
    } else {
      let {end0:e0,end1:e1} = rseg;
      if ((!box.contains(e0)) && (!box.contains(e1))) {
        rseg.hidden = 1;
      } else {
        rseg.hidden = 0;
        let p = this.intersectLineSegLineSegs(rseg,boxSegs);
        if (p) {
          let {end0:e0,end1:e1} = rseg;
          if (box.contains(e0)) {
            rseg.setEnds(e0,p);
          } else if (box.contains(e1)) {
            rseg.setEnds(p,e1);
          }
        }
      }
    }
  }
  for (let i=0;i<lnc;i++) {
    let rp = rcenters[i];
    let crc = circles[i];

    if (box.contains(rp)) {
      crc.show();
      crc.moveto(rp);
    } else {
      crc.hide();
    }
  }

  //let nsegs = this.intersectSegs(boxR,box,segsIbuf);
  //this.segs2lines(linesI,nsegs,1);
  this.segs2lines(lines,rsegs,1);
}

rs.theScript = [];

rs.baseDur = 4;
rs.addStep = function (config,startTime,duration,count) {
  let {theScript,baseDur} = this;
  let step = {config,startTime:baseDur*startTime,duration:baseDur*duration,count};
  theScript.push(step);
}
   


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke = 'white';
}
   
  
  
rs.setNumSteps = function (n) {
  let {theScript} = this;
  let mx = 0;
  theScript.forEach((step) => {
    let {startTime,duration} = step;
    let endTime = startTime+duration;
    mx = Math.max(mx,endTime);    
  });
  this.numSteps = mx+1+n;
}

rs.addAstep = function (ibox,start,duration,count) {
    let isa = Array.isArray(ibox);
    let reverse = isa;
    let box = isa?ibox[0]:ibox;
    let config = this.mkConfig(box,reverse);
    this.addStep(config,start,duration,count);
  }
rs.initialize =  function () {
  debugger;
  this.initProtos();
  this.addFrame();
  this.buildGrid();
  this.addSegs();
  this.initOutSegs();
 this.set('centerShapes',arrayShape.mk());
  this.addCenters();
  this.addSteps();
  
  this.setNumSteps(4);
  this.updateState();

  
}


rs.executeStep = function (step) {
  let {startTime,duration,config,count} = step;
  let {box} = config;
  let {stepsSoFar:ssf} = this;

  let relTime = ssf - startTime;
  if ((relTime <0)||(relTime > duration)) {
    debugger;
    let {lines} = config;
    lines.forEach((line) => {
      line.hide();
      line.update();
    });
    let {circles} = config;
    circles.forEach((crc) => {
      crc.hide();
      crc.update();
    });
    return null;
  }
  let fr = count*(relTime/duration);
  this.configSetFraction(config,fr);
  return config;
}
  
rs.updateState = function () {
  let {stepsSoFar:ssf,numSteps,theScript} =this;
  let activeConfigs = [];
  theScript.forEach((step) => {
    let config = this.executeStep(step);
    if (config) {
      activeConfigs.push(config);
    }
  });
  this.displayOutSegs(activeConfigs);
} 


    

  
export {rs};


