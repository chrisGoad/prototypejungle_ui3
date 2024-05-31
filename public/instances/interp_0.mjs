
import {rs as generatorP} from '/generators/interp_0.mjs';

let rs = generatorP.instantiate();


rs.setName('interp_0');


let wd =100;
let nc=100;
let myParams = {width:wd,height:wd,numCols:nc,numRows:nc};
Object.assign(rs,myParams);


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

rs.initialize =function ()  {
  this.initProtos();
  this.addFrame();
  let {width:wd,height:ht,numCols} = this;
  let hwd = wd/2;
  let hht = ht/2;
  
  let left = Point.mk(-hwd,0);
  let top= Point.mk(0,-hht);
  let right = Point.mk(hwd,0);
  let bot = Point.mk(0,hht);
  let gon=  Polygon.mk([left,top,right,bot]);
  let gons = [gon];
  this.computeSides([gon]);
  let red = {r:255,g:0,b:0};
  let  green= {r:0,g:255,b:0};
  let  blue= {r:0,g:0,b:255};
  let  black= {r:0,g:0,b:0};
  let  white= {r:255,g:255,b:255};
  let  cyan = {r:0,g:255,b:255};
 //let values = [this.randomColorOb(),this.randomColorOb(),this.randomColorOb(),this.randomColorOb()];
  let values = [this.redOb,this.yellowOb,this.blueOb,this.cyanOb];
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

