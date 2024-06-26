
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as shadedRectPP} from '/shape/shadedRectangle.mjs';
import {rs as textPP} from '/shape/textOneLine.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';

const rs = function (item) {
window.root = core.root;
item.stateOpsDisabled = 1; // for exported version
let colorParams = {redOb:{r:255,g:0,b:0},greenOb:{r:0,g:255,b:0},blueOb:{r:0,g:0,b:255},blackOb:{r:0,g:0,b:0},whiteOb:{r:255,g:255,b:255},
                   yellowOb:{r:255,g:255,b:0},cyanOb:{r:0,g:255,b:255}};
Object.assign(item,colorParams);
item.setName = function (name,variant,jsonName) {
  let nameWithV = name+(variant?'_v_'+variant:'');
  let nameWithoutV= name;
	let theName = this.name = nameWithV+(this.signIt?'_s':'');
  this.variant = variant;
	core.vars.whereToSave = theName;
  this.whereToSave = theName;
	let pathPart = jsonName?jsonName:nameWithV;
	this.path = `json/${pathPart}.json`;
}

 		
item.onCompleteAnimation = function (cb) {
  let {motionHistory:mh,whereToSave:wts} = this;
  console.log('Animation complete');
  if (mh) {
    let  destPath = `/motionHistories/${wts}.mjs`;
    let str = 'let rs = '+JSON.stringify(mh)+'; export {rs};';
   // let str =JSON.stringify(mh);
     core.httpPost(destPath,str,function (rs) { 
			 if (cb) {
				 cb();
			 }
		});
  }
}


item.processHistoryElement = function (elt) {
  let pnms = Object.getOwnPropertyNames(elt);
  let ln = pnms.length;
  let par=[];
  let t;
  for (let i=0;i<ln;i++) {
    let p = pnms[i];
    let v = elt[p];
    if (p==='time') {
      t = v;
      continue;
    }
    let {x,y} = v;
    let pnt = Point.mk(x,y);
    par.push(pnt);
  }
  return {time:t,points:par};
}

item.processHistory = function (h) {
  let ph = h.map((v) => this.processHistoryElement(v));
    
  return ph;
}


item.getMotionHistory = function (nm,cb) {
  let url = '/motionHistories/'+nm+'.mjs';
  core.httpGet(url,(err,mh) => {
    let prs = JSON.parse(mh);
    let pmh = this.processHistory(prs);
    cb(pmh);
  });
}
 

item.historyRadius = function (mh) {
  let maxr= -Infinity;
  mh.forEach((m)=>{
    let {points} =m;
    points.forEach( (p) => {
     let {x,y} = p;
     let ax = Math.abs(x);
     let ay = Math.abs(y);
     maxr = Math.max(ax,ay);
    });
  });
  return maxr;
}
item.numFrames = 0;
item.numRects =0;
item.addRectangle  = function (iparams) {
  if (!iparams) {
    return;
  }
  let params = (typeof iparams === 'string')?{fill:iparams}:iparams;
  let {width,height,fill='transparent',leftFill,rightFill,stroke,stroke_width,position} = params;
  if (!width) {
    width = this.width;
   }
   if (!height) {
    height = this.height;
   }
   if (!width || ((!fill)  && (!leftFill))) {
    return;
   }
  let rect  = this.set('brect'+this.numRects,leftFill?shadedRectPP.instantiate():rectPP.instantiate());
  this.numRects = this.numRects + 1;
  if (fill) {
    rect.fill = fill;
  }
   if (leftFill) {
    rect.leftFill = leftFill;
    rect.rightFill = rightFill;
  } else {
    rect.fill = fill;
  }
  if (stroke) {
    rect.stroke = stroke;
  }
  if (typeof stroke_width === 'number') {
    rect['stroke-width'] = stroke_width;
  } 
  rect.width = width;
  rect.height = height;
	if (position) {
    rect.moveto(position);
  }
  rect.update();
	rect.show();
  return rect;
}
item.numCircs = 0;
item.addCircle  = function (params) {
  if (!params) {
    return;
  }
  let p0 = Point.mk(0,0);
  let {fill='transparent',stroke,stroke_width=0,position=p0,radius} = params;
  let crc  = this.set('crc'+this.numCircs,circlePP.instantiate());
  this.numCircs = this.numCircs + 1;
  crc.fill = fill;
  if (stroke) {
    circ.stroke = stroke;
  }
  if (typeof stroke_width === 'number') {
    crc['stroke-width'] = stroke_width;
  } 
  crc.dimension  = 2*radius;
 
 // rect.update();
	//rect.show();
  return crc;
}
// add a stripe around the image, to control the size of the jpg when saved
item.addFrame = function (params) {
  let {width,height} = this;
  let fparams = params?params:this;
  let {frameStroke:frs,frameFill:frf,framePadding:frp,
  frameWidth,frameHeight,frameStrokeWidth:fswd,framePos:pos,signIt} =  fparams;
  let frpd = frp!==undefined;
  if (!(frpd || frameWidth)) {
    return;
  }
  if (!frs) {
    frs = 'rgb(2,2,2)';
  }
  fswd = fswd?fswd:2;
  frf = frf?frf:'transparent';
  if (frameWidth) {
    width = frameWidth;
    height = frameHeight;
  } else {
    width = width + frp;
    height = height + frp;
  }
  let rect =  this.addRectangle({width,height,fill:frf,stroke:frs,stroke_width:fswd,position:pos});
  let rectangle = Rectangle.mk(Point.mk(-0.5*width,-0.5*height),Point.mk(width,height));
  this.frameRectangle = rectangle;
  return rect;
}


item.drawGrid = function (lineP) {
  let {numRows,numCols,width:wd,height:ht} = this;
  let deltaX = wd/numCols;
  let deltaY = ht/numRows;
  let hwd = 0.5*wd;
  let hht = 0.5*ht;
  let cx = -hwd;
  let cy = -hht;
  let lines = this.set("lines",arrayShape.mk());
  for (let i=0;i<=numRows;i++) {
    let top = Point.mk(cx,-hht);
    let bot = Point.mk(cx,hht);
    let sg = LineSegment.mk(bot,top)
    let ln = sg.toShape(lineP);
    lines.push(ln);
    cx += deltaX;
  }
  for (let i=0;i<=numCols;i++) {
    let left = Point.mk(-hwd,cy);
    let right = Point.mk(hwd,cy);
    let sg = LineSegment.mk(left,right)
    let ln = sg.toShape(lineP);
    lines.push(ln);
    cy += deltaY;
  }
}

item.cellOf  = function (p) {
  let {x,y} = p;
  let {width,height,numRows,numCols} = this;
  let hw = width/2;
  let hh = height/2;
  let ix = Math.floor(((x+hw)/width) * numCols);
  let iy = Math.floor(((y+hh)/height) * numRows);
  return {x:ix,y:iy};
}

Circle.toShape = function (circleP,scale=1) {
   let {center,radius} = this;
   let rs = circleP.instantiate();
   rs.radius = scale*radius;
   rs.moveto(center);
   return rs;
 }

 
Rectangle.toShape = function (rectP,scale=1) {
   let {corner,extent} = this;
   let hext = extent.times(0.5);
   let center = corner.plus(hext);
   let rs = rectP.instantiate();
   rs.width = scale*extent.x;
   rs.height = scale*extent.y;
   rs.moveto(center);
   return rs;
 }
 
 // recycling shapes will only work if the shape tree is identical each time

Polygon.toShape = function (polygonP,scale=1,recycledPolygon) {
   let {corners} = this;
   let rs = recycledPolygon?recycledPolygon:polygonP.instantiate();
   rs.fromGeom = this;
   let pcorners = arrayShape.mk();
   if (scale) {
     let cnt = this.center();
     corners.forEach((c) => {
        let vec = c.difference(cnt);
        pcorners.push(cnt.plus(vec.times(scale)));
      })
   } else {
     corners.forEach((c) => {pcorners.push(c.copy())});
   }
   rs.corners = pcorners;
   return rs;
}

Rectangle.toCircleShape = function (circleP,scale=1) {
   let {corner,extent} = this;
   let hext = extent.times(0.5);
   let center = corner.plus(hext);
   let {x:wd,y:ht} = extent;
   let d = scale*Math.min(wd,ht);
   let rs = circleP.instantiate();
   rs.dimension = d;
   rs.moveto(center);
   return rs;
 }

Polygon.toCircleShape = function (circleP,scale=1) {
   let dim = this.minDimension();
   let center = this.center();
   let d = scale*dim;
   let rs = circleP.instantiate();
   rs.dimension = d;
   rs.moveto(center);
   return rs;
 }


LineSegment.toShape = function (lineP,scale=1) {
  let {end0,end1} = this;
  if (!lineP) {
    debugger;//keep
  }
  if (scale!==1) {
    let vec = end1.difference(end0);
    let ln = vec.length();
    let nvec = vec.normalize();
    let center = end0.plus(end1).times(0.5);
    end1 = center.plus(nvec.times(0.5*scale*ln));
    end0 = center.plus(nvec.times(-0.5*scale*ln));
  }
  let line = lineP.instantiate();
  if (!line.setEnds) {
    debugger;//keep
  }
  if (this.genPoint3d) {
    let e03d = this.via3d(end0);
    let e13d = this.via3d(end1);
    line.setEnds(e03d,e13d);
  } else {
    line.setEnds(end0,end1);
  }
  return line;
}
item.toShape = function (g,shapeDict,scale=1) {
  if (Circle.isPrototypeOf(g)) {
    return g.toShape(shapeDict.circleP,scale);
  }
   if (LineSegment.isPrototypeOf(g)) {	
    return g.toShape(shapeDict.lineP,scale);
  }
  if (Rectangle.isPrototypeOf(g)) {
    return g.toShape(shapeDict.rectP,scale);
  }
}

item.geoms2shapes = function (gs,shapeDict,scale=1) {
  return gs.map((g) => this.geom2shape(g,shapeDict,scale));
}
   
item.addLine = function (params)  {
  let {lines,line,lineP,end0,end1,segment} =params;
	if (!lines) {
		lines = this.lines =this.set('lines',core.ArrayNode.mk());
	}
  let oline=line?line:(end0?LineSegment.mk(end0,end1).toShape(lineP):segment.toShape(lineP));
  oline.show();
  lines.push(oline);
  oline.update();
  return oline;
}

const numPowers = function(n,p) {
  if (n === 0) {
    return 0;
  }
  if (n === p) { 
    return 1;
  }
  if (n%p === 0) {
    return 1 + numPowers(n/p,p);
  }
  return 0;
}
item.numPowers = function (n,p) {
  return numPowers(n,p);
}

// for the facility for saving state as json
item.assignValueToPath = function (path,value) {
  let spath = path.split('/');
  let ln = spath.length;
  let cvl = this;
  for (let i=0;i<ln-1;i++) {
    let pel = spath[i];
    let nvl = cvl[pel];
    if (!nvl) {
      nvl = {};
      cvl[pel] = nvl;
    }
    cvl = nvl;
  }
  let lst = spath[ln-1];
  cvl[lst] = value;
}
  
item.assignValues = function (vls) {
  vls.forEach( (vl) => {
    let [path,value] = vl;
    this.assignValueToPath(path,value);
  });
}
    
item.getTheState = function (cb) {
  let {path:ipath} = this;
  let idx = ipath.indexOf('_i_');
  let path = (idx>0)? ipath.substring(0,idx)+'.json':ipath;
  core.httpGet(path, (error,json) => {
    let state = JSON.parse(json);
    this.assignValues(state);
    if (cb) {
      cb();
    }
  });
}

item.saveTheState = function (cb) {
  let {path,stateOpsDisabled} = this;
  const next =
    () => {
      if (cb) {
        cb();
      } 
   };
    
  if (stateOpsDisabled) {
    next();
    return;
  }
  let state = this.computeState?this.computeState():null;
  if (state) {
    let jsn = JSON.stringify(state);
    core.saveJson(path,jsn,
      function (err,rs) {
        next();
      })
  }
}

item.horizontalize = function (p,noFrame) {
  if (p.width) {
    this.height = p.width;
    this.width = p.height;
  }
  this.frameWidth = p.frameHeight;
  this.frameHeight = p.frameWidth;
}


item.pointsTo3dAndBack = function (pnts) {
  let rs = [];
  pnts.forEach((p) => {
    let p3d = this.genPoint3d(p);
    if (p3d && (p3d.category !== 'notOnSurface')) {
      let ppnt = this.camera.project(p3d);
      rs.push(ppnt);
    } 
  });
  return rs;
}
item.toRGB = (r,g,b) => `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;

item.toGray = (v) => {
  let vi = Math.floor(v);
  return `rgb(${vi},${v},${vi})`;
}
item.canvasToRectangle = function () {
 let {width:wd,height:ht} = this;
 let corner = Point.mk(-0.5*wd,-0.5*ht);
 let extent = Point.mk(wd,ht);
 return Rectangle.mk(corner,extent);
}

item.rectSides = function (rect) {
  let hw,hh;
  let {corner,extent} = rect;
  hw = (extent.x)/2;
  hh = (extent.y)/2;
  let {x:cx,y:cy} = corner;
  let {x:ex,y:ey} = extent;
  let UL = Point.mk(cx,cy)
  let UR = Point.mk(cx+ex,cy)
  let LL = Point.mk(cx,cy+ey)
  let LR  = Point.mk(cx+ex,cy+ey)
  return [LineSegment.mk(UL,UR),LineSegment.mk(UR,LR),LineSegment.mk(LR,LL),LineSegment.mk(LL,UL)];
}

item.circleToCircleShape = function (nm,c,circleP) {
  let {center,radius} = c;
  let crc = circleP.instantiate().show();
  crc.dimension = 2*radius;
  this.set(nm,crc);
  crc.moveto(center);
  return crc;
}

item.addToArray = function (a,v,n) {
  for (let i=0;i<n;i++) {
    a.push(v);
  }
}


//item.computeExponentials = function (a,n,fc,root) {
item.computeExponentials = function (args) {
  let {dest:a,n,factor:fc,root} = args;
  a.push(root);
  let cv = root;
  for (let i=0;i<n;i++) {
    cv = fc*cv;
    a.push(cv);
  }
}

item.randomIntLessThan = function (n) {
  return Math.floor(Math.random()*n);
}

item.randomBetween = function (lh) {
  let {low,high} = lh;
  let d = high-low;
  let rs = low + Math.random() * d;
  rs = 0.01 * Math.floor(100*rs);
  return rs;
}

item.randomAmong = function (a) {
  let ln = a.length;
  let ri = Math.floor(ln * Math.random());
  let rs = a[ri];
  return rs;
}

item.randomizeFrom = function (o) {
  let ks = Object.keys(o);
  let rs = {};
  ks.forEach((k)=>{
    let v = o[k];
    let rv;
    if (Array.isArray(v)) {
      if (v.length === 1) {
        rv = v[0];
      } else {
        rv = this.randomAmong(v);
      }
    } else if (typeof v === 'object') {
      rv = this.randomBetween(v);
    } else {
      rv = v;
    }
    rs[k] = rv;
  });
  return rs;
}


item.randomizeArrayFrom = function (a) {
  let rs = a.map((v) => {
    if (Array.isArray(v)) {
       if (v.length === 1) {
        return v[0];
      } else {
        return this.randomAmong(v);
      }
    } else if (typeof v === 'object') {
      return this.randomBetween(v);
    } else {
      return v;
    }
  });
  return rs;
}
   
item.anyUndefined = function (a) {
  return a.includes(undefined);
}

item.firstNvaluesEqual = function (a,n,v) {
  let ln = a.length;
  if (ln < n) {
    return false;
  }

  for (let i=0;i<n;i++) {
    let cv = a[i][0];
    if (cv !== v) {
      return false;
    }
  }
  return true;
}
item.allValuesEqual = function (a,v) {

  return this.firstNvaluesEqual(a,a.length,v);
}
  
// Stepper 

item.Stepper = {};

item.mkStepper = function () {
  return Object.create(this.Stepper);
}

item.Stepper.min = 10;
item.Stepper.max = 90;
item.Stepper.stepSize  = 10;

item.Stepper.init = function (n) {
  let ar = this.ar = [];
  let loopIndices = this.loopIndices = [];

  for (let i=0;i<n;i++) {
    ar[i] = this.min;
    loopIndices[i] = 0;  
   }
  this.maxIndex = n-1;
}
  

item.Stepper.step = function (index) {
  let {ar,min,max,stepSize,maxIndex,loopIndices} = this;
  let loopOdd=0;
  let loopIndex;
  loopIndex = loopIndices[index];
  loopOdd = loopIndex%2;
  if (index>maxIndex) {
    return 1;
  }
  if (this.step(index+1)) {
    let v = ar[index];
    let nv = v + (loopOdd?-stepSize:stepSize);
    if ((nv > max) || (nv< min)) {
      this.loopIndices[index] =  loopIndex+1;
      return 1;
    } else {
      ar[index] =nv;
      return;
     }
   }
 }
 
 
item.deepCopy = function (o) { //only own props, and fails on circular structures
  let props = Object.getOwnPropertyNames(o);
  let cp = {};
  props.forEach((pr) => {
    let v = o[pr];
    let rv = (v && (typeof v === 'object'))?this.deepCopy(v):v;
    cp[pr] = rv;
  });
  return cp; 
}

item.firstInitialize = 1;
item.resetShapes = function () {
  if (this.recycle && !this.firstInitialize) {
    this.shapesRecycleIndex = 0;
  } else {
    if (this.shapes) {
      this.shapes.remove();
    }
    this.set('shapes',arrayShape.mk());
  }
  this.initialize();
  this.firstInitialize = 0;
  draw.refresh();
}


item.collides0 = function (point1,radius1,point2,radius2) {
  let p1x = point1.x;
  let p1y = point1.y;
  let z = point1.z;
  let p1z = z?z:0;
  let p2x = point2.x;
  let p2y = point2.y;
  z = point1.z;
  let p2z = z?z:0;

  let minDist =  radius1 + radius2 ;
  //console.log('minDist',minDist,'xd',p2x-p1x,'yd',p2y-p1y,'d',d);
  if (Math.abs(p2x - p1x) >=  minDist) {return false;}
  if (Math.abs(p2y - p1y) >= minDist) {return false;}
  let d= point1.distance(point2);
  return minDist >= d;
}
item.collides = function (npoint,nradius,circleDs) {
  let n = circleDs.length;
  for (let i=0;i<n;i++) {
    let {point,collideRadius} = circleDs[i];
    if (this.collides0(npoint,nradius,point,collideRadius)) {
      return true;
    }
  }
  return false
}


item.genRandomValue = function (lb,ub) {
  let delta = ub-lb;
  return lb + Math.random()*delta;
}

item.genRandomPoint = function (onw) {
  if (onw) {
    if (Rectangle.isPrototypeOf(onw)) {
      let {corner,extent} = onw;
      let lx = corner.x;	
      let ly = corner.y;
      let x = Math.random() * extent.x + lx;
      let y = Math.random() * extent.y + ly;
      return Point.mk(x,y);
    }
    if (oneDf.isPrototypeOf(onw)) {
      let rpnt = onw.randomPoint();
      return rpnt;
    }

  }
  let {width,height} = this;
  let rx = (Math.random()-0.5) * width;
   let ry= (Math.random()-0.5) * height;
  return Point.mk(rx,ry);
}

item.callIfDefined = function (nm,a0) {
  let fn = this[nm];
  if (fn) {
    return fn.call(this,a0);
  }
}

item.pushValNtimes = function (a,v,n) {
  for (let i=0;i<n;i++) {
    a.push(v);
  }
}

item.addText = function (textP,rt,n,p,color) {
  let isTitle = n==='';
  let nm = isTitle?'txtTitle':'txt'+rt+n;
  let theText = rt+n;
  let txt = textP.instantiate();
  txt.text = theText;
  if (color) {
   txt.stroke = color;
  }
  this.set(nm,txt);
  txt.moveto(p);
  return txt;
}
core.root.backgroundColor = 'black';
item.setBackgroundColor = function (clr) {
  core.root.backgroundColor = clr; 
  //this.update();
}


item.initProtos = function () {
  this.polygonP =  polygonPP.instantiate();
  this.polygonP.stroke = 'white';
  this.polygonP.fill = 'transparent';
  this.polygonP['stroke-width'] =1;
  this.lineP =  linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] =.5 ;
    this.circleP =  circlePP.instantiate();
  this.circleP.stroke = 'white';
  this.circleP.fill = 'blue';
  this.circleP['stroke-width'] =.05;
   let textP = this.textP =  textPP.instantiate();
  textP["font-size"] = "12";
  textP["font-style"] = "normal";
  textP["font-family"] = "arial";
  textP["font-weight"] = "normal";
  textP.stroke = 'white';
}
item.genRan = function (lb,ub) {
  let d = ub-lb;
  let r = Math.floor(lb + Math.random()*d);
  return r;
}
item.genRans = function (lb,ub,n) {
  let rans =[];
  for (let i=0;i<n;i++) {
    rans.push(this.genRan(lb,ub));
  }
  return rans;
}

item.randomArray = function (lb,ub,a) {
  let aISnum = typeof(a) === 'number';
  let ln = aISnum?a:a.length;
  let ra = [];
  for (let i=0;i<ln;i++) {
    let av = aISnum?'ran':a[i];
    let v = av==='ran'?this.genRan(lb,ub):av;
    ra.push(v);
  }
  return ra;
  
}



item.arrayToRGB = function (a) {
  let r = Math.floor(a[0]);
  let g = Math.floor(a[1]);
  let b = Math.floor(a[2]);
  let rgb = `rgb(${r},${g},${b})`;
  return rgb;
}



item.arrayToGray = function (a) {
  let r = a[0];
  let g = a[0];
  let b = a[0];
  let rgb = `rgb(${r},${g},${b})`;
  return rgb;
}

item.sumArray = function (a) { 
  let sum = 0;
  a.forEach ( (v) => {sum = sum+v});
  return sum;
}  
item.sumArrays = function (aa) { 
  let a0 = aa[0];
  let iln = a0.length;
  let ivl = a0.map( ()=>0);
  aa.forEach ( (iv) => {
    for (let i=0;i<iln;i++) {
      ivl[i] = ivl[i]+iv[i];
    }
  }); 
  return ivl;
}  
  

item.arrayTimes = function (a,x) {
  let ra = a.map((v) = x*v);
  return ra;
}
 
    
// interpolate and copyTo assume that their arguments have matching "shapes"
item.interpolate = function (a0,a1,fr) {
  let isa = Array.isArray(a0);
  let isn = typeof a0 === 'number';
  let iv;
  if (isa) {
    let ln = a0.length; //a1 must have the same length
    iv = [];
    for (let i=0;i<ln;i++) {
      let a0e = a0[i];
      let a1e = a1[i];
      let v = this.interpolate(a0e,a1e,fr);
      iv.push(v);
    }
  } else if (isn) {
    let delta = a1-a0;
    iv = a0+fr*delta;
  } else {
    let props = Object.getOwnPropertyNames(a0);
    let proto = Object.getPrototypeOf(a0);
    iv = Object.create(proto);
    props.forEach( (p) => {
      let v0 = a0[p];
      let v1 = a1[p];
      let v = this.interpolate(v0,v1,fr);
      iv[p] = v;
    });
  }   
  return iv;
}	

    

item.copyTo = function (dest,src) {
  let kind;
  if (!src || (typeof src === 'number')) {
    kind = 'primitive';
  }  else if (Array.isArray(dest)) {
    kind = 'array';
  } else {
    kind = 'object';
  }
  
  if (kind == 'array') {
    let ln = dest.length; //src must have the same length
    for (let i=0;i<ln;i++) {
      let deste = dest[i];
      let srce = src[i];
      let ekind = this.copyTo(deste,srce);
      if (ekind === 'primitive') {
        dest[i] = src[i];
      }
    }
    return kind;
  } else if (kind === 'primitive') {
    return kind;
  } else {
    let props = Object.getOwnPropertyNames(src);
    props.forEach( (p) => {
      let deste = dest[p];
      let srce = src[p];
      let kind = this.copyTo(deste,srce);
      if (kind === 'primitive') {
        dest[p] = src[p];
      }
      return kind;
    });
  }    
}	


item.deepCopy = function (src) {
  let kind;
  if (!src || (typeof src === 'number')) {
    kind = 'primitive';
  }  else if (Array.isArray(src)) {
    kind = 'array';
  } else {
    kind = 'object';
  }
  let copy;
  if (kind == 'array') {
    copy = src.map((v) => this.deepCopy(v));
  } else if (kind === 'primitive') {
    copy = src;
  } else {
    copy = {};
    let props = Object.getOwnPropertyNames(src);
    props.forEach( (p) => {
      let npv = this.deepCopy(src[p]);
      copy[p] = npv;
    });
  }
  return copy;  
}	

item.deepSum = function (x,y,weight,zero) {
  let kind;
  if (typeof x === 'number') {
    kind = 'primitive';
  }  else if (Array.isArray(x)) {
    kind = 'array';
  } else {
    kind = 'object';
  }
  let sum;
  if (kind == 'array') {
    let ln = x.length;
    sum = [];
    for (let i=0;i<ln;i++) {
       let vx = x[i];
       let vy = y[i];
       let vs = this.deepSum(vx,vy,weight,zero);
       sum.push(vs);
    }
  } else if (kind === 'primitive') {
    sum = zero?0:(x+(weight?weight*y:y));
  } else {
    sum = {};
    let props = Object.getOwnPropertyNames(x);
    props.forEach( (p) => {
      //debugger
      let vx = x[p];
      let vy = y[p];
      let v = this.deepSum(vx,vy,weight,zero);
      sum[p] = v;
    });
  }
  return sum;  
}	

item.deepZero = function (x) {
  //debugger;
  let dz=this.deepSum(x,x,null,1);
  return dz;
}

// weights should sum to 1
item.weightedAverage = function (values, weights) {
  let ln=values.length;
  let v0 =values[0];
  let sum = this.deepZero(v0);
  for (let i=0;i<ln;i++) {
    let v = values[i];
    let w = weights[i];
    sum = this.deepSum(sum,v,w);
  }
  return sum;
}
/*
item.interpolateArrayss	 = function(a0,a1,fr) {
  let ln = a0.length; //a1 must have the same length
  let ar = [];
  for (let i=0;i<ln;i++) {
    let a0e = a0[i];
    let a1e = a1[i];
    let v = this.interpolate(a0e,a1e,fr);
    ar.push(v);
  }
  return ar;
}
*/
item.pointReducedPrecision = function (p,pow) {
  let {x,y} = p;
  let rx = Math.floor(x*pow)/pow;
  let ry = Math.floor(y*pow)/pow;
  let rp = {x:rx,y:ry};
  return JSON.stringify(rp);
}
item.arrayReducedPrecision = function (a,pow) {
  let ra = a.map((v) => Math.floor(v*pow)/pow);
  return JSON.stringify(ra);
}

item.arrayOfArrayReducedPrecision = function (a,pow) {
  let ra = a.map((v) => this.arrayReducedPrecision(v,pow));
  return JSON.stringify(ra);
}


  // vValues specifies a vector (as array) of values at each vertex
// given a point pt, this interpolates by inverse of distance  among those vectors


item.interpolateVectors = function (params) {
  let getVerbose = this.getVerbose;
  let {vertices,p,dfn,verbose:poww} = params;
  let pow;
  let {x,y}=p;
  if (0) {
    console.log('p',this.pointReducedPrecision(p,poww));
  }
  let vallen = vValues.length;
  let vertlen = vertices.length;
  let ds = vertices.map((v) => {
    let d = p.distance(v);
    let dt = dfn?dfn(d):d;
    //return d<0.001?.001:d;
    return d<10?10:d;
  });
  if (pow) {
    console.log('ds',this.arrayReducedPrecision(ds,pow));
  }
  let fcs = ds.map((v)=>1/v);//factors
  let sum =0;
  fcs.forEach((v) => {
    sum=sum+v;
  });
  let nfcs = fcs.map( (v) => v/sum);//normalized factors
  if (pow) {
    console.log('nfcs',this.arrayReducedPrecision(nfcs,pow));
  }
  if (pow) {
    console.log('vValues',this.arrayOfArrayReducedPrecision(vValues,pow));
  }
  let wvps = [];// weighted parameters
  for (let j=0;j<vertlen;j++) {
    let vp = vValues[j%vallen];
    let nfc = nfcs[j];
    let wvp = vp.map((v)=>nfc*v);
    wvps.push(wvp);
  }
  if (pow) {
    console.log('wvps',this.arrayOfArrayReducedPrecision(wvps,pow));
  }
  let suma= this.sumArrays(wvps);  //sum the weights
  if (pow) {
    console.log('sumi',this.arrayReducedPrecision(suma,pow));
  }
  let sumi = suma.map((v)=>Math.floor(v));
  let summ = this.sumArray(sumi);
  if (0 && getVerbose &&  (x<0) && (y>0)) {
    console.log('p',this.pointReducedPrecision(p,poww));
        console.log('sumi',this.arrayReducedPrecision(sumi,poww));
  }
   if (0) {
    console.log('sumi',JSON.stringify(sumi));
  }
  let sumd = suma[0]<100?[0,0,0]:[250,250,250];
  return sumi;
}  

item.interpolateInPolygon = function (gon,p) {
   debugger;
  //let {gon,values,p} = iparams;
  let {theSides:sides,values} = gon;
  if (!gon.contains(p)) {
    debugger;
  }
  let ids = [];
  let sideValues = [];
  let distances = [];
  let sumid =0;
  let ns = sides.length;
  for (let i=0;i<ns;i++) {
    let side = sides[i];
    let v0 = values[i];
    let v1 = values[(i+1)%ns];
    let line = side.lineOf();
    //debugger;
    let np = p.nearestPointOnLine(line);
    if (i===1) {
      //debugger;
    }
    let fr = side.fractionAlong(np);
    let sv = this.interpolate(v0,v1,fr); 
    if (i===1) {
    //  console.log('px',p.x,'py',p.y,'npx',np.x,'npy',np.y,'fr',fr,'v0',v0,'v1',v1,'sv',sv);
      //debugger;
    }
    sideValues.push(sv);
    let d = p.distance(np);
    //console.log('d',d);
   if (d<0.1) {
     //debugger;
   }
    d = Math.max(d,.001);
    let id = 1/d;
    sumid += id;
    ids.push(id);
  };
  let weights = ids.map((v) => v/sumid);
  //let wv = this.weightedAverage(values,weights);
  let wv = this.weightedAverage(sideValues,weights);
  return wv;
}
  
item.computeSides = function (ap) {
 let ln = ap.length;
 for (let i=0;i<ln;i++) {
   let gon = ap[i]
   gon.theSides = gon.sides();
  }
}

item.colorObToRgb = function (c) {
  let {r,g,b} = c;
  let rgb = `rgb(${r},${g},${b})`;
  return rgb;
}


item.randomColorOb = function () {
  const RIR = (lb,ub) => {
    let delta= ub-lb;
    let rv = Math.floor(lb+Math.random()*delta);
    return rv;
  }
  let rc = {r:RIR(0,255),g:RIR(0,255),b:RIR(0,255)};
  return rc;
}



item.setCells = function (gons,op) {
  //debugger;
  let {numRows:nr,numCols:nc,width} = this;
   let cwd = width/nc;
   let p = Point.mk(0,0);
  for (let x=0;x<nc;x++) {
    for (let y=0;y<nr;y++) {
      let cnt = this.centerPnt(x,y);
      p.x=x;
      p.y=y;
      let lng =gons.length;
      for (let i=0;i<lng;i++) {
        let gon = gons[i];
        if (0 || gon.contains(cnt)) {
          let iv=this.interpolateInPolygon(gon,cnt);
          let shp = this.shapeAt(x,y);
          op(shp,iv,p);
          break;
        }
      }
    }
  }
}
item.randomColorArray = function (lb,ub,ia) {
   let a =ia?ia:3;
   let ra = this.randomArray(lb,ub,a);
   let cra = ra.map(Math.floor);
   return cra;
}
item.randomGrayArray = function (lb,ub) {
   let rv = Math.floor(lb+Math.random()*(ub-lb));
   let ga = this.uniformArray(rv,3);
   return ga;
}
item.randomYellowArray = function (lb,ub,b) {
   let r = Math.floor(lb+Math.random()*(ub-lb));
   let g = Math.floor(lb+Math.random()*(ub-lb));
   let ga = [r,g,b];
   return ga;
}
item.randomRGB = function (lb,ub,ia) {
  let a =ia?ia:3;
  return this.arrayToRGB(this.randomColorArray(lb,ub,a));
}


item.sequentialArray = function (lb,ub) {
  let a =[];
  for (let i=lb;i<=ub;i++) {
    a.push(i);
  }
  return a;
}


item.arrayFromFunction = function (f,n) {
  let a =  [];
  for (let i=0;i<n;i++) {
    a.push(f(i));
  }
  return a;
}
item.uniformArray = function (v,n) {
  let a = this.arrayFromFunction (()=>v,n);
  return a;
}
item.cyclingArray = function (vs,n) {
  let period = vs.length;
  
  let a = this.arrayFromFunction ((i)=>vs[i%period],n);
  return a;
}

item.repeatArray = function (vs,n) {
  let ln = vs.length;
  return this.cyclingArray(vs,n*ln);
}

item.toMpiPiRange = function (a) {
  if (a > Math.PI) {
    return a-2*Math.PI;
  }
  if (a<-Math.PI) {
    return a+2*Math.PI;
  }
  return a;
}
// proceed in n steps from lb to ub; lb is step 1; omit last step means that ub is not included
item.steppedArray = function (lb,ub,n,omitLastStep) {
  let delta = ub-lb;
  let im = omitLastStep?n-1:n;
  let inc = delta/(n-1);
//  let a = this.arrayFromFunction ((i) => angles?this.toMpiPiRange(lb+inc*i):lb+inc*i,im);
  let a = this.arrayFromFunction ((i) => lb+inc*i,im);
  return a;
}



/* 

ATTACK/DECAY

state = {shape,startAttack,attackDuration,value,zeroValue,applicator} or {shape,startDecay,decayDuration,value,zeroValue,applicator} 
fn is the application function: fn(shape,interpolatedVal) 
*/
item.execAD = function (state) {
  let {lines,ADpool,currentTime:t} = this;
  let {shape,startAttack:sta,startDecay:std,attackDuration:iad,decayDuration:idd,value,zeroValue,applicator}  = state;
  debugger;
  let ad = iad?iad:0;
  let dd = idd?idd:0;
  let fr;
  let iv; //interpolated value
  if ((sta< t)&&(t<=(sta+ad))) {
    fr = ad?(t-sta)/ad:1;
    iv = this.interpolate(zeroValue,value,fr);
  } else if ((std<=t)&&(t<(std+dd))) {
    fr = dd?(t-std)/dd:1;
    iv = this.interpolate(value,zeroValue,fr);
  } else if (t>=(std + dd)) {
    shape.hide();
    ADpool.push(shape);
    return;
  }
  if (iv) {
    let iiv = iv.map((v)=>Math.floor(v));
    applicator(shape,iiv);
  }
}

item.execADs = function () {
  let {ADstates} = this
  ADstates.forEach((st) => this.execAD(st));
}


item.startAttack = function (params)  {
  let {shape,attackDuration,applicator,value,zeroValue} = params;
  let {ADstates,currentTime} = this;
  if (attackDuration) {
    let state = {shape,startAttack:currentTime,attackDuration,value,zeroValue,applicator};
    ADstates.push(state);
  }
  applicator(shape,zeroValue);
}
 

item.startDecay = function (params)  {
  let {shape,decayDuration,applicator,value,zeroValue,startDecay:sdc} = params;
  let {ADstates,currentTime} = this;
  let startDecay = sdc?sdc:currentTime;
  if (decayDuration) {
    let state = {shape,startDecay,decayDuration,value,zeroValue,applicator};
    ADstates.push(state);
  }
  applicator(shape,value);
}   

/* interpolation path 
First, interpolation  point
{time,value}

Interpolateion path :array of interpolation points

interpolation state:
{time,index,value} // index is the array index of the path point immediately preceding


active interpolation path {state,path}
*/
item.initializeAIP = function (path) {
  let p0 = path[0];
  let {time,value} = p0;
  let state = {time,index:0,value}
}

item.advanceAIP = function (aip,t) {
  let {state,path} = aip;
  let {index,time} = state;
  let pln = path.length;
  if (index === (pln-1)) { // end of path reached
    return;
  }
  let cindex = index;
  let cps = path[index];
  let cpe = path[index+1];
  let endTime = cpe.time;;
  while (t > endTime) {
    cindex++;
    if (cindex === (pln-1)) { //end of path
      return;
    }
    cps = cpe;
    cpe = path[cindex];
    endTime = cpe.time;
  }
  let startTime = cps.time;
  let startValue = cps.value;
  let endValue = cpe.value;
  let dTime = endTime-startTime;
  let fr = (t-startTime)/dTime;
  let v = this.interpolate(startValue,endValue,fr);
  state.time = t;
  state.value = v;
  return v;
}

   
  
item.buildGrid = function (params) {
  let {width:wd,height:ht,numrows:nr,numcols:nc} = params;
  let grid = [];
  let bx = -wd/2;
  let by = -ht/2;
  let deltax = wd/nr;
  let deltay = ht/nc;
  for (let i=0;i<=nr;i++) {
    let cx = bx+deltax*i;
    for (let j=0;j<=nr;j++) {
      let cy = by+deltay*j;
      let p = Point.mk(cx,cy);
      grid.push(p);
    }
  }
  params.grid = grid;
}

item.accessGrid = function (params,x,y) {
  let {numrows:nr,numcols:nc,grid} = params;
  let index = x*(nc+1)+y;
  return grid[index];
}  


item.pointsAroundCell = function (params,x,y) {
   let UL = this.accessGrid(params,x,y);
   let UR = this.accessGrid(params,x+1,y);
   let LR = this.accessGrid(params,x+1,y+1);
   let LL = this.accessGrid(params,x,y+1);
   return [UL,UR,LR,LL,UL];
}

item.padIntTo = function (v,n) {
  let vs = v+'';
  let ln = vs.length;
  let np = n-ln;
  if (np <=0) {
    return vs;
  }
  let zs ='';
  for (let i=0;i<np;i++) {
    zs = zs+'0';
  }
  return zs+vs;
}
  
    
  

  
  
  
}
export {rs};
 
