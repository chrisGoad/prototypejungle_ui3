
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';
let rs = basicP.instantiate();

addAnimationMethods(rs);

rs.setName('stripes_0');
let ht=50;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'white',frameStrokeWidth:.2,timePerStep:0.05,stopTime:100,collideWithParticle:1}

rs.allocStripe = function (vertical,fill) {
  let {rectP,rectShapes,stripes} = this;  
  let r = Rectangle.mk(Point.mk(0,0),Point.mk(0,0));
  let shape =rectP.instantiate();
  rectShapes.push(shape);
  shape.fill = fill;
  shape.show();
  let stripe = {rectangle:r,shape,vertical}
  stripes.push(stripe);
  return stripe;
}

rs.displayStripe = function (stripe) {
  let r = stripe.rectangle;
  let {corner,extent} = r;
  let {x:cx,y:cy} = corner;
  let {x:ex,y:ey} = extent;;
  let shape = stripe.shape;
  shape . width = ex;
  shape . height = ey;
  //rect . fill = fill;
  let p = Point.mk(cx+0.5*ex,cy+0.5*ey);
 // rectShapes.push(rect);
  shape.show();
  shape.update();
  shape.moveto(p);
}


rs.displayStripes = function () {
  let {stripes} = this;
  let ln = stripes.length;
  for (let i=0;i<ln;i++) {
    this.displayStripe(stripes[n]);
  };
}

rs.allocRectangles = function (n) {
  let {stripes} = this;
  let stripe = [];
  ra.forEach((r) => {
    let rsh  = this.allocRectangleShape();
    let stripe = {rectangle:r,shape:rsh}
    stripes.push(stripe);
    
  });
  return stripe;
}

rs.genStripe = function (params) {
  let {stripes} = this;
  let {stripeWidth:sw,stripeLength:sl,position:pos,vertical} = params;
  let hsw = 0.5*sw;
  let hsl = 0.5*sl;
  let corner = vertical?Point.mk(pos-hsw,-hsl):Point.mk(-hsl,pos-hsw);
  let ext = vertical?Point.mk(sw,sl):Point.mk(sl,sw);
  let rect = Rectangle.mk(corner,ext);
  rect.index = stripes.length;
  return rect;
}


rs.genStripes = function (params) {
  
  let {stripeWidth:sw,stripeLength:sl,numStripes:ns,vertical} = params;
  let hsl = 0.5*sl;
  let intv = sl/(ns-1);
  let rects = [];
  for (let i=0;i<ns;i++) {
    let ps = i*intv-hsl;
    params.position = ps;
    let rect = this.genStripe(params);
    rects.push(rect);
  }
  return rects;
}

//each stripe is placed in a band with the stripe in the middle and padding separating the stripe from the bands next to it.
// the fraction of the band occupied by the stripe is the stripeWidthFactor
//if bw0, bw1,... are the relative band widths
 // bw0+bw1*bw2+.. bwn = lengthFactor 
 // the actual value of band with i, is bwi* (stripeLength/lengthFactor)
 rs.allocStripesV = function (params) {
  let {stripeLength:sl,stripeWidthFactor:swf,bandWidths:bws,vertical,fill} = params;
  let ns = bws.length;
 /* let hsl = 0.5*sl;
   let ns = bws.length;
  let sum = 0;
  for (let i = 0;i<ns;i++) {
    sum=sum+bws[i]
  }
  let bwf = 0.5*sl/sum;*/
  const allocSide =  () => {
   // let left=which==='left';
   // let cp = left?-hsl:hsl;
    for (let i=0;i<ns;i++) {
     /* let abw = bwf*bws[i];
      let habw = 0.5*abw;
      cp = left?cp+habw:cp-habw;
      let sw = abw*swf;
      let hsw = 0.5*sw;
      let crn = vertical?Point.mk(cp-hsw,-hsl):Point.mk(-hsl,cp-hsw);
      let ext = vertical?Point.mk(sw,sl):Point.mk(sl,sw);*/
      this.allocStripe(vertical,fill)
    }
  }
  allocSide('left');
  allocSide('right');
}

rs.updateStripesV = function (params) {
  let {stripes} = this;
  let {stripeLength:sl,stripeWidthFactor:swf,bandWidths:bws,whereInBand:whib,numVertical} = params;
  let hsl = 0.5*sl;
  let ns = bws.length;
  let sum = 0;
  for (let i = 0;i<ns;i++) {
    sum=sum+bws[i]
  }
  let index = 0;
  let bwf = 0.5*sl/sum;
  let rects = [];
  let vertical = 1;
  const updateSide =  (which) => {
    let left=which==='left';
    let cp = left?-hsl:hsl;
    for (let i=0;i<ns;i++) {
      let abw = bwf*bws[i];
      let habw = 0.5*abw;
      cp = left?cp+habw:cp-habw;
      let sw = abw*swf;
      let hsw = 0.5*sw;
      let crn = vertical?Point.mk(cp-hsw,-hsl):Point.mk(-hsl,cp-hsw);
      let ext = vertical?Point.mk(sw,sl):Point.mk(sl,sw);
      let stripe = stripes[index];
      let rect = stripe.rectangle;
      rect.corner = crn;
      rect.extent  = ext;
      this.displayStripe(stripe);
      cp = left?cp + habw:cp-habw;
      index++;
    }
  }
  vertical = 1;
  updateSide('left');
  updateSide('right');
  vertical = 0;
  updateSide('left');
  updateSide('right');
  
}


rs.exponentialSeries = function (factor,length) {
  let cv = 1;
  let series = [];
  for (let i=0;i<length;i++) {
    series.push(cv);
    cv = factor*cv;
  }
  return series;
}
  
 


export {rs}
  

  