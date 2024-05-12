
import {rs as generatorP} from '/instances/part2_0_I.mjs';

let rs = generatorP.instantiate();


rs.setName('part2_0_I_8');


let wd =100;
let nc=200;
let myParams = {width:wd,height:wd,numCols:nc,numRows:nc};
Object.assign(rs,myParams);

rs.partParams.rectangular = 1;
let ssp = rs.partParams.splitParams = {Case:9,direction:-0.25*Math.PI,radius:0.2,pcs:[.4,1.4,2.4,3.4]};
let sp = rs.partParams.splitParams = {Case:9,direction:Math.random()*Math.PI,radius:Math.random()*0.4,pcs:[.4,1.4,2.4,3.4]};


rs.shapeGenerator = function (rvs,cell) {
  let {rectP,lineP,numCols,width} = this;
  let cwd = width/numCols;
  let frw =1;
  let scwd = frw*cwd;
  let {x,y} = cell;
 
  let shape = rectP.instantiate().show();
  shape.width = scwd;
  shape.height = scwd;
  shape.fill = 'blue';
  return shape;
}

rs.afterInitialize =function ()  {
  debugger;
  let {width:wd,height:ht,numCols} = this;
  let hwd = wd/2;
  let hht = ht/2;
  let tp =this.topPart;
  let gons = [tp.P0.polygon,tp.P1.polygon,tp.P2.polygon,tp.P3.polygon];
  this.computeSides(gons);
  let red = {r:255,g:0,b:0};
  let  green= {r:0,g:255,b:0};
  let  blue= {r:0,g:0,b:255};
  let  black= {r:0,g:0,b:0};
  let  white= {r:255,g:255,b:255};
  let  cyan = {r:0,g:255,b:255};
  //let values = [red,green,blue,green];
  const mkValues = ()=>[this.randomColorOb(),this.randomColorOb(),this.randomColorOb(),this.randomColorOb()];
  //const mkValues = ()=>[black,white,black,white];
  let valueSrc = [this.randomColorOb()/*UR*/,this.randomColorOb()/*TOP*/,this.randomColorOb()/*UL*/,this.randomColorOb()/*RS*/,
                 this.randomColorOb()/*LR*/,this.randomColorOb()/*BOT*/,this.randomColorOb()/*LL*/,this.randomColorOb()/*LS*/,
                 this.randomColorOb()/*CENTER*/];
  let  valueSrcc = [white/*UR*/,black/*TOP*/,white/*UL*/,black/*RS*/,
                 white/*LR*/,black/*BOT*/,white/*LL*/,black/*LS*/,
                 red/*CENTER*/];
  const ae = (x,y) => (Math.abs(x-y) < .1)?'1':'0';
  //const posMap={'1010':0,'1000':1,'1001':2,'0001':3,'0101':4,'0100':5,'0110':6,'0010':7,'0000':8};
  const posMap={'1010':0,'1000':5,'1001':2,'0001':6,'0101':3,'0100':5,'0110':7,'0010':4,'0000':8};
  const valueOfCorner = (p) => {
    let {x,y} = p;
    let onTop = ae(y,-hht);
    let onBot = ae(y,hht);
    let onLeft = ae(x,-hwd);
    let onRight = ae(x,hwd);
    let sig = onTop+onBot+onLeft+onRight;
    let vli = posMap[sig];
    let vlc = valueSrc[vli];
    return vlc;
  }
  const setValuesForGon = (gon) => {
    gon.values = mkValues();
    return;
    let {corners} = gon;
    let values = corners.map((p)=>valueOfCorner(p));
    gon.values = values;
  }
  
  const op = (shp,iv) => {
    let rgb = this.colorObToRgb(iv);
    shp.fill = rgb;
    shp.update();
  }   



  gons.forEach(setValuesForGon)  

    debugger;

  this.generateGrid();
  this.setCells(gons,op);
  return;
  this.displayTitle('Partition 8');
  this.displayPc(0);
  this.displayPc(1);
  this.displayPc(2);
  this.displayPc(3);
 

}

export {rs};

