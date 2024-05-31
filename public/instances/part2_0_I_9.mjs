
import {rs as generatorP} from '/instances/part2_0_I.mjs';

let rs = generatorP.instantiate();


rs.setName('part2_0_I_8');


let wd =100;
let nc=200;
let myParams = {width:wd,height:wd,numCols:nc,numRows:nc};
Object.assign(rs,myParams);

rs.partParams.rectangular = 1;
let ssp = rs.partParams.splitParams = {Case:9,direction:-0.25*Math.PI,radius:0.2,pcs:[.4,1.4,2.4,3.4]};
//let sp = rs.partParams.splitParams = {Case:9,direction:Math.random()*Math.PI,radius:Math.random()*0.4,pcs:[.4,1.4,2.4,3.4]};


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
  
  let left = Point.mk(-hwd,0);
  let top= Point.mk(0,-hht);
  let right = Point.mk(hwd,0);
  let bot = Point.mk(0,hht);
  let gon=  Polygon.mk([left,top,right,bot]);
  this.computeSides([gon]);
  let red = {r:255,g:0,b:0};
  let  green= {r:0,g:255,b:0};
  let  blue= {r:0,g:0,b:255};
  let  black= {r:0,g:0,b:0};
  let  white= {r:255,g:255,b:255};
  let  cyan = {r:0,g:255,b:255};
 let values = [this.randomColorOb(),this.randomColorOb(),this.randomColorOb(),black];
  console.log('color 0',JSON.stringify(values[0]),'color 1',JSON.stringify(values[1]),'color 2',JSON.stringify(values[2]));
  gon.values = values;

  
  const op = (shp,iv) => {
    let rgb = this.colorObToRgb(iv);
    shp.fill = rgb;
    shp.update();
  }   
    debugger;

  this.generateGrid();
  this.setCells(gons,op);
  return;
 

}

export {rs};

