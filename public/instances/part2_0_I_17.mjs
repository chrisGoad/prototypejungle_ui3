
import {rs as generatorP} from '/instances/part2_0_I.mjs';

let rs = generatorP.instantiate();


rs.setName('part2_0_I_16');

rs.partParams.rectangular = 1;
let ssp = rs.partParams.splitParams = {Case:9,direction:-0.25*Math.PI,radius:0.2,pcs:[.4,1.4,2.4,3.4]};
let sp = rs.partParams.splitParams = {Case:9,direction:Math.random()*Math.PI,radius:Math.random()*0.4,pcs:[.4,1.4,2.4,3.4]};

let wd =200;
let ht = 100;
let nc=80;
let nr = 40;
let myParams = {width:wd,height:ht,numCols:nc,numRows:nr};
Object.assign(rs,myParams);

rs.afterInitialize =function ()  {
  debugger;
  let {width:wd,height:ht,numCols,blackOb,whiteOb} = this;
  let hwd = wd/2;
  let hht = ht/2;
  let tp =this.topPart;
  let gons = [tp.P0.polygon,tp.P1.polygon,tp.P2.polygon,tp.P3.polygon];
  this.computeSides(gons);
  
  //const mkValues = ()=>[this.randomColorOb(),this.randomColorOb(),this.randomColorOb(),this.randomColorOb()];
    const mkValues = ()=>[blackOb,whiteOb,blackOb,whiteOb];

  const setValuesForGon = (gon) => {
    gon.values = mkValues();
  }
  


  const op = (shp,iv) => {
    let cwd = wd/numCols;
    let frw =1;
    let scwd = frw*cwd;
    let hs = 0.5*scwd;
    let rgb = this.colorObToRgb(iv);
    shp.stroke = rgb;
    let a = 2*(iv.r/255)*Math.PI;
    let p0 = Point.mk(-hs*Math.cos(a),-hs*Math.sin(a));
    let p1 = Point.mk(hs*Math.cos(a),hs*Math.sin(a));
    shp.setEnds(p0,p1);
    shp.update();
  }      

  gons.forEach(setValuesForGon)  

}

export {rs};

