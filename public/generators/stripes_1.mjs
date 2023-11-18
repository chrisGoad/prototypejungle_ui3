
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

rs.displayStripe = function (stripe,fill) {
  let r = stripe.rectangle;
  let {corner,extent} = r;
  let {x:cx,y:cy} = corner;
  let {x:ex,y:ey} = extent;;
  let shape = stripe.shape;
  shape . width = ex;
  shape . height = ey;
  if (fill) {
    shape.fill = fill;
  }
  let p = Point.mk(cx+0.5*ex,cy+0.5*ey);
  shape.show();
  shape.update();
  shape.moveto(p);
}



//each stripe is placed in a band with the stripe in the middle and padding separating the stripe from the bands next to it.
// the fraction of the band occupied by the stripe is the stripeWidthFactor
//if bw0, bw1,... are the relative band widths
 // bw0+bw1*bw2+.. bwn = lengthFactor 
 // the actual value of band with i, is bwi* (stripeLength/lengthFactor)
 rs.allocStripesV = function (params) {
  let {stripeLength:sl,stripeWidthFactor:swf,bandWidths:bws,vertical,fill} = params;
  let ns = bws.length;
  const allocSide =  () => {
    for (let i=0;i<ns;i++) {
      this.allocStripe(vertical,fill)
    }
  }
  allocSide('left');
  allocSide('right');
}

rs.updateStripesV = function (params) {
  let {stripes,fills} = this;
  let {stripeLength:sl,stripeWidthFactor:swf,bandWidths:bws,whereInBand:whib,numVertical} = params;
  let hsl = 0.5*sl;
  let ns = bws.length;
  let sum = 0;
  for (let i = 0;i<ns;i++) {
    sum=sum+bws[i]
  }
  let index = 0;
  let bwf = 0.5*sl/sum; // band width factor
  let rects = [];
  let vertical = 1;
  const updateSide =  (which) => {
    let left=which==='left';
    let cp = left?-hsl:hsl;
    let ocp = cp;
    for (let i=0;i<ns;i++) {
      let fill = this.computeFill(i);
      let rightBw = i?bws[i-1]:bws[i];
      let leftBw = i<ns-1?bws[i+1]:bws[i];
      let CL = whib+0.5;
      let CR = -(whib-0.5);
      let ibw = bwf*(leftBw*CL+rightBw*CR)/1;// interpolated band width 
     
    //  console.log('whib',whib,'isw',isw,'bws[i]',bws[i],'i',i)
     let abw = bwf*bws[i];
     // let abw = bwf*isw;
      let habw = 0.5*abw;
      cp = left?cp+habw:cp-habw;
      let acp = cp+(left?whib*abw:-whib*abw);
      
      
      let sw = abw*swf;
      let isw = ibw*swf;
      
      
       if (vertical && left)  {
     //  console.log('i',i,'sw',sw,'isw',isw,'whib',whib,'CL',CL,'CR',CR,'leftBw',leftBw,'rightBw',rightBw,'ibw',ibw,'bws[i]',bws[i],'i',i);
        debugger;
      } else {
           //   stripes[index].shape.hide();

    //    return;
      }
      
      let hsw = 0.5*sw;
      let hisw = 0.5*isw;
      //let osw =left?Math.min(acp-ocp,hsw):Math.min(ocp-acp,hsw); // one side width
      let osw =left?Math.min(acp-ocp,hisw):Math.min(ocp-acp,hisw); // one side width
      
      let rsw = osw < hisw; // reduced side width
    // rsw = false;
      debugger;
     
      let lsp = acp - (rsw?osw:hisw); //left side position
      let rsp = acp+hisw; //right side position
      let cnp = rsw?(lsp+rsp)/2:acp; //center position  
      let asw = rsw?rsp-lsp:isw; // actual stripe width 
       if (rsw) {
     //   console.log('i',i,'whib',whib,'hisw',hisw,'osw',osw,'asw',asw);
      }      
      if (rsw) {           
      //  console.log('acp-hsw',acp-hsw,'lsp',lsp,'sw',sw,'asw',asw,'osw',osw,'hsw',hsw);
        debugger;
      }
      let crn = vertical?Point.mk(lsp,-hsl):Point.mk(-hsl,lsp);
     // let crn = vertical?Point.mk(acp-hsw,-hsl):Point.mk(-hsl,acp-hsw);
      //let ext = vertical?Point.mk(sw,sl):Point.mk(sl,sw);
      let ext = vertical?Point.mk(asw,sl):Point.mk(sl,asw);
      let stripe = stripes[index];
      let rect = stripe.rectangle;
      rect.corner = crn;
      rect.extent  = ext;
      this.displayStripe(stripe,fill);
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

rs.perspectiveSeries = function (op,v,d,length) {
  const nthv = (n) => {
    let p = op.difference(v.times(n));
    let x = (d*(p.x))/(p.y)
    return x;
  }
  let series = [];
  let maxv = nthv(length-1);
  for (let i=0;i<length;i++) {
    let n = length-i-1;
    series.push(nthv(n)/maxv);
  }
  return series;
}
    
  
     


export {rs}
  

  