
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
let rs = basicP.instantiate();

addAnimationMethods(rs);

rs.setName('stripes_0');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:0.05,stopTime:100,collideWithParticle:1}

rs.displayRectangle = function (r) {
  let {rectP,rectShapes} = this;
  let {corner,extent} = r;
  let {x:cx,y:cy} = corner;
  let {x:ex,y:ey} = extent;;
  let rect =rectP.instantiate();
  rect . width = ex;
  rect . height = ey;
  let p = Point.mk(cx+0.5*ex,cy+0.5*ey);
  rectShapes.push(rect);
  rect.show();
  rect.update();
  rect.moveto(p);
  return rect;
}

rs.displayRectangles = function (ra) {
  let rshapes = [];
  ra.forEach((r) => 
    rshapes.push(this.displayRectangle(r))
  );
  return rshapes;
}

 
rs.addStripeRects = function (rects,params) {
  let {stripeWidth:sw,stripeInterval:si,numStripes:ns,stripePos:sp,vertical:v} = params;
  //let rects = [];
  let tsr = []; // this stripe rects
  let stripeLength = (ns+1)*si+ns*sw;
  let hsl = 0.5*stripeLength;
  let hsw = 0.5*sw;
  let hsi = 0.5*si;
  const genIrect = (xORy) => {
    let crn = v?Point.mk(sp-hsw,xORy):Point.mk(xORy,sp-hsw);
    let ext = v?Point.mk(sw,si):Point.mk(si,sw);
    return Rectangle.mk(crn,ext);
  }
   const genSrect = (x) => {
    let crn = v?Point.mk(sp-hsw,xORy):Point.mk(xORy,sp-hsw);
    let ext = Point.mk(sw,sw);
    return Rectangle.mk(crn,ext);
  }
  let xORy = -hsl;
  for (let i=0;i<ns;i++) {
     let irect = genIrect(xORy);
     xORy = xORy+si;
     let srect = genSrect(xORy);
     xORy = xORy+sw;
     rects.push(irect);
     tsr.push(irect);
     rects.push(srect);
     tsr.push(srect);
  }
  let irect = genIrect(xORy);
  rects.push(irect);
  tsr.push(irect);
  return tsr;
}

rs.genStripesRects = function (params) {
  let {stripeWidth:sw,stripeInterval:si,numStripes:ns,stripePos:sp} = params;
  let rects = [];
  let isp = -0.5*((ns-1)*si+ns*sw-sw);
  const genStripes = (vertical) => {
    params.vertical = vertical;
    let csp = isp;
    for (let i=0;i<ns;i++) {
      params.stripePos = csp;
      this.addStripeRects(rects,params);
      csp = csp+sw+si;
    }
  }
  genStripes(0);
  genStripes(1);
  return rects;
}
     
    



    
  
  
  

  


export {rs}
  

  