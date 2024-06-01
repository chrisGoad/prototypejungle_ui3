
import {rs as generatorP} from '/generators/interp_0.mjs';

let rs = generatorP.instantiate();


rs.setName('interp_0');


let wd =100;
let nc=100;
let myParams = {width:wd,height:wd,numCols:nc,numRows:nc};
Object.assign(rs,myParams);


rs.shapeGenerator = function (ivs,cell) {
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

rs.shapeGenerator = function (ivs,cell) {
  let {rectP,lineP,numCols,numRows,width,height} = this;
  debugger;
  let cwd = width/numCols;
  let cht = height/numRows;
  let fr =0.25;
  let scwd = fr*cwd;
  let scht = fr*cht;
  let {x,y} = cell;
  let cshp = containerShape.mk();
  let l0 = lineP.instantiate();
  cshp.set('l0',l0);
  l0.setEnds(Point.mk(-scwd,0),Point.mk(scwd,0));
 
  return cshp;
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
 //let values = [this.randomColorOb(),this.randomColorOb(),this.randomColorOb(),this.randomColorOb()];
 let values = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
 // let values = [this.redOb,this.yellowOb,this.bDlueOb,this.cyanOb];
  console.log('color 0',JSON.stringify(values[0]),'color 1',JSON.stringify(values[1]),'color 2',JSON.stringify(values[2]));
  gon.values = values;

  
  const op = (shp,iv,p) => {
    debugger;
    let {x,y} = p;
   let rvs=iv.map((v)=>v*Math.random());
    let max = 0;
    rvs.forEach((v) => {max=Math.max(max,v);})
    let idx=rvs.indexOf(max);
      console.log('x',x,'y',y,'idx',idx);

      return;
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

