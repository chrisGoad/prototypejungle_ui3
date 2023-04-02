

import {rs as linePP} from '/shape/line.mjs';

import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPathMethods} from '/mlib/animate0.mjs';	
let rs = basicP.instantiate();
addPathMethods(rs);

let wd = 200;
let nr = 8;
rs.setName('rotate_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.0*wd,frameStroke:'rgb(2,2,2)',frameStrokeWidth:1,saveAnimation:0,numSteps:51}
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
 /*
 A configuration is a triple {box:Rectangle,osegs:array_of(LineSegment),rsegs:array_of(LineSegment),lines:array_of(LineShape)}
 
 osegs (original segments) are the segments clipped out of the grid by box, rsegs are osegs rotated,and lines are the lines corresponding to rsegs,
 */
 /* a step is a period when a given configuration is in force. {startTime:integer,dur,config,*/

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

rs.copySegs = function (isegs) {
  let osegs = [];
  isegs.forEach((iseg) => {
    let {end0:e0,end1:e1} = iseg;
    let oseg = LineSegment.mk(e0,e1);
    osegs.push(oseg);
  });
  return osegs;
}
    

rs.boxFilterrr= function(box) {
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


rs.segs2lines = function (lines,segs,update) {
  let {lineP} = this;
  let ln = segs.length;
  for (let i=0;i<ln;i++) {
    let sg = segs[i];
    let ln = update?lines[i]:lineP.instantiate();
    if (!sg) {
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


rs.intersectSegs = function (boxR,box,segs) {
  let nsegs = [];
  segs.forEach((seg) =>{
    if (seg) {
      let nseg = this.intersectLineSegsLineSeg(boxR,box,seg);
      nsegs.push(nseg);
     /* if (nseg) {
       // debugger;
        let abc = this.intersectLineSegsLineSeg(theBoxR,theBox,seg);
       // debugger;
      }*/
       
    } else {
      nsegs.push(null);
    }
  });
  return nsegs;
}
   /*
 A configuration is an object {index:integer,box:Rectangle,boxCenter:Point,osegs:array_of(LineSegment),rsegs:array_of(LineSegment),lines:array_of(LineShape)}
 
 osegs (original segments) are the segments clipped out of the grid by box, rsegs are osegs rotated,and lines are the lines corresponding to rsegs,
 */
 /* a step is a configuration together with the period when the configuration is in force. {startTime:integer,duration,config}
 a script is a time-ordered array of steps. The updateState method runs rs.theScript.*/

rs.configs =  [];

rs.mkConfig = function (box) {
  let {lineP,configs} = this;
  let index = configs.length;
  let boxSegs = this.rect2lineSegs(box);
  let osegs = this.boxFilter(box);
  let rsegs =[];
  let lines = this.set('lines_'+index,arrayShape.mk());
  osegs.forEach((seg) => {
    rsegs.push(LineSegment.mk(Point.mk(0,0),Point.mk(0,0)));
    lines.push(lineP.instantiate());
  });
  let config = {index,box,center:box.center(),boxSegs,osegs,rsegs,lines};
  configs.push(config);
  return config;
}

rs.initOutSegs = function () {
  this.outSegs = [];
  this.set('outLines',arrayShape.mk());
}

rs.displayOutSegs = function (configs) {
  let {outLines,allSegs,lineP} = this; 
  debugger;
  outLines.forEach((line) => {
    line.hide();
    line.update();
  });
  let outSegs = [];
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
}  
    
        
      
    
rs.configSetFraction = function (c,fr) {
  let {rsegs,osegs,lines,center} = c;
  let a = fr * 0.5 * Math.PI;
  console.log('angle',a*(180/Math.PI));
  this.rotateSegs(rsegs,osegs,a,center);

  //let nsegs = this.intersectSegs(boxR,box,segsIbuf);
  //this.segs2lines(linesI,nsegs,1);
  this.segs2lines(lines,rsegs,1);
}

rs.theScript = [];

  
rs.addStep = function (config,startTime,duration) {
  let {theScript} = this;
  let step = {config,startTime,duration};
  theScript.push(step);
}
   


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .2;
  lineP.stroke = 'white';
}
   
  
  
rs.setNumSteps = function () {
  let {theScript} = this;
  let mx = 0;
  theScript.forEach((step) => {
    let {startTime,duration} = step;
    let endTime = startTime+duration;
    mx = Math.max(mx,endTime);    
  });
  this.numSteps = mx+1;
}

rs.initialize =  function () {
  debugger;
  this.initProtos();
  this.buildGrid();
  this.addSegs();
  this.initOutSegs();
  let box =this.rectFromRowsCols({lowRow:2,highRow:5,shrinkBy:0.98});
  let config = this.mkConfig(box);
  this.addStep(config,0,10);
  this.setNumSteps();
  //this.configSetFraction(config,0);
  this.updateState();
  //this.displayOutSegs(activeConfigs);

  
}


rs.executeStep = function (step) {
  let {startTime,duration,config} = step;
  let {box} = config;
  let {stepsSoFar:ssf} = this;
    debugger;

  let relTime = ssf - startTime;
  if ((relTime <0)||(relTime > duration)) {
    return null;
  }
  let fr = relTime/duration;
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

/* 
rs.updateState = function () {
  let {stepsSoFar:ssf,numSteps,theScript} =this;
  debugger;
  let fr = ssf/(numSteps-1);
  this.configSetFraction(config,fr);
}  */


    

  
export {rs};


