
import {rs as generatorP} from '/generators/interp_0.mjs';

let rs = generatorP.instantiate();


rs.setName('interp_0');


let wd =100;
let nc=12;
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
  //debugger;
  let cwd = width/numCols;
  let cht = height/numRows;
  let fr =0.5;
  let scwd = fr*cwd;
  let scht = fr*cht;
  let {x,y} = cell;
  let cshp = containerShape.mk();
  let l0 = lineP.instantiate();
  cshp.set('l0',l0);
  l0.setEnds(Point.mk(-scwd,0),Point.mk(scwd,0));
  let l1 = lineP.instantiate();
  cshp.set('l1',l1);
  l1.setEnds(Point.mk(-scwd,-scht),Point.mk(scwd,scht));
  let l2 = lineP.instantiate();
  cshp.set('l2',l2);
  l2.setEnds(Point.mk(0,-scht),Point.mk(0,scht));
 let l3 = lineP.instantiate();
  cshp.set('l3',l3);
  l3.setEnds(Point.mk(scwd,-scht),Point.mk(-scwd,scht));
  
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
  let UL = Point.mk(-hwd,-hwd);
  let UR = Point.mk(hwd,-hwd);
  let LR = Point.mk(hwd,hwd);
  let LL = Point.mk(-hwd,hwd);
  //let gon=  Polygon.mk([left,top,right,bot]);
  let gon=  Polygon.mk([UL,UR,LR,LL]);
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
    iv.forEach((v) => {max=Math.max(max,v);});
    let sc = 1/max;
    let idx=rvs.indexOf(max);
      console.log('x',x,'y',y,'idx',idx);
    let l0=shp.l0;
    let l1=shp.l1;
    let l2=shp.l2;
    let l3=shp.l3;
    let lines = [l0,l1,l2,l3];
    let stwd = .2;
    for (let i=0;i<4;i++) {
     let ln = lines[i]
     let v = iv[i];
     ln['stroke-width'] = sc*sc*stwd*v;
     ln.update();
    }
  
  }   

  this.generateGrid();
  this.setCells(gons,op);
  return;
 

}

export {rs};

