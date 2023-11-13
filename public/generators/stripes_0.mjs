
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
  let stripe = [];
  ra.forEach((r) => {
    let rsh  = this.displayRectangle(r);
    rshapes.push(rsh);
    stripe.push({rectangle:r,shape:rsh});
    
  });
  return stripe;
}

 
rs.addStripeRects = function (rects,params) {
  let {stripeWidth:sw,stripeInterval:si,numStripes:ns,stripePos:sp,vertical:v} = params;
  //let rects = [];
  let tsr = []; // this stripe rects
  let stripeLength = (ns+1)*si+ns*sw;
  let hsl = 0.5*stripeLength;
  let hsw = 0.5*sw;
  let hsi = 0.5*si;
  const genIVrect = (xORy) => { // interval
    let crn = v?Point.mk(sp-hsw,xORy):Point.mk(xORy,sp-hsw);
    let ext = v?Point.mk(sw,si):Point.mk(si,sw);
    let r = Rectangle.mk(crn,ext);
    r.isI =0;
    r.isV = v;
    return r;
  }
   const genIRrect = (x) => { // intersection
    let crn = v?Point.mk(sp-hsw,xORy):Point.mk(xORy,sp-hsw);
    let ext = Point.mk(sw,sw);
    let r = Rectangle.mk(crn,ext);
    r.isI = 1;
    r.isV = v;
    return r;
  }
  let xORy = -hsl;
  for (let i=0;i<ns;i++) {
     let irect = genIVrect(xORy);
     xORy = xORy+si;
     let srect = genIRrect(xORy);
     xORy = xORy+sw;
     if (i) {
       rects.push(irect);
       tsr.push(irect);
     }
       
     rects.push(srect);
     tsr.push(srect);
  }
  let irect = genIVrect(xORy);
  rects.push(irect);
  tsr.push(irect);
  return tsr;
}

rs.genStripesRects = function (params) {
  let {stripeWidth:sw,stripeInterval:si,numStripes:ns,stripePos:sp} = params;
  let rects = [];
  let hstripes = [];
  let vstripes = [];
  let isp = -0.5*((ns-1)*si+ns*sw-sw);
  const genStripes = (vertical) => {
    params.vertical = vertical;
    let csp = isp;
    for (let i=0;i<ns;i++) {
      params.stripePos = csp;
      let sr = this.addStripeRects(rects,params);
      if (vertical) {
        vstripes.push(sr);
      } else {
        hstripes.push(sr);
      }
      csp = csp+sw+si;
    }
  }
  genStripes(0);
  genStripes(1);
  return {vstripes,hstripes}
}


rs.genStripesRectsV = function (params) {
  let {initialStripeWidth:isw,finalStripeWidth:fsw,initialStripeInterval:isi,numStripes:ns} = params;
  let fsi = isi*(fsw/isw);
  let rects = [];
  let hstripes = [];
  let vstripes = [];
 // let isp = -0.5*((ns-1)*si+ns*sw-sw);
  let isp = 0;
  let sdelta = fsw-isw;
  let idelta = fsi-isi;

  const genStripes = (vertical) => {
    debugger;
    params.vertical = vertical;
    let csp = isp;
    for (let i=0;i<ns;i++) {
      let fr = i/(ns-1);
      let hfr = 1-fr;
      let hfrs = hfr*hfr;
      let frs = fr*fr;
      let  sw = isw + fr * sdelta;
      let  si = isi + fr * idelta;
      let  hsw = isw + hfr * sdelta;
      let  hsi = isi + hfr * idelta;
      let hns = Math.floor(ns*(hsw/isw));
      console.log('hns',hns,'hfr',hfr);
      let iparams = vertical?{stripeWidth:sw,stripeInterval:si,stripePos:csp,numStripes:ns}:
                             {stripeWidth:isw,stripeInterval:isi,stripePos:csp,numStripes:hns}
      let sr = this.addStripeRects(rects,iparams);
      if (vertical) {
        vstripes.push(sr);
      } else {
        hstripes.push(sr);
      }
      csp = csp+sw+si;
    }
  }
  genStripes(0);
  genStripes(1);
  return {vstripes,hstripes}
}
     
     
    
rs.paintStripe = function (s,index,hcolor,vcolor,vertical) {
  let {version} = this;
  let ln = s.length;
  let numints = 0;
  for (let i=0;i<ln;i++) {
    let r = s[i];
    let {rectangle:rect,shape} = r;
    if (rect.isI) {
      if (rect.isV) {
        shape.hide();
      } else {
      
        //if (!((index+numints)%3)) {
        let cnd = (version===0)?(!((index+numints)%3)):0;
        if (cnd) {
          shape.fill = hcolor;
        } else { 
          shape.fill = vcolor;
        }
      }
      numints++;
    } else {
      shape.fill = (rect.isV)?vcolor:hcolor;
    }
    shape.update();
  }
}



rs.paintStripes = function (s,hcolor,vcolor,vertical) {
  let ln = s.length;
  for (let i=0;i<ln;i++) {
    this.paintStripe(s[i],i,hcolor,vcolor,vertical);
  }
}
        
    


    
  
  
  

  


export {rs}
  

  