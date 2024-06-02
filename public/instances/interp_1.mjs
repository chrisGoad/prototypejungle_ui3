
import {rs as generatorP} from '/generators/interp_0.mjs';

let rs = generatorP.instantiate();


rs.setName('interp_1');


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
  let {rectP,lineP,circleP,numCols,numRows,width,height} = this;
  //debugger;
  let cwd = width/numCols;
  let cht = height/numRows;
  let fr =1;
  let fr2 =1;
  let scwd = fr*cwd;
  let scht = fr*cht;
  let {x,y} = cell;
  let cshp = containerShape.mk();
  let clr02 = 'red'
  let clr13 = 'black';
  //clr02 = 'magenta'
  //clr13 = 'yellow';
  let clr0 = clr02;
  let clr1 = clr13;
  let clr2 = clr02;
  let clr3 = clr13;
  
  let s0 = rectP.instantiate();
  cshp.set('s0',s0);
  s0.fill=clr0;
  s0.width = scwd;
  s0.height = scht;
  s0.update();
  let s1 = rectP.instantiate();
  cshp.set('s1',s1);
  s1.fill=clr1;
  s1.width = fr2*scwd;
  s1.height = fr2*scht;
  s1.update();
  let s2 = rectP.instantiate();
  cshp.set('s2',s2);
  s2.fill=clr2;
  s2.width = scwd;
  s2.height = scwd;
  s2.update();
  let s3 = rectP.instantiate();
  cshp.set('s3',s3);
  s3.fill=clr3;
  s3.width = fr2*scwd;
  s3.height = fr2*scwd;
  s3.update();
  
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
  // let rvs=iv.map((v)=>v*Math.random());
   let rvs=iv.map((v)=>v+.2*Math.random());
   //let rvs = iv;
    let max = 0;
    rvs.forEach((v) => {max=Math.max(max,v);});
    let sc = 1/max;
    //let idx=rvs.indexOf(max);
    let idx=rvs.indexOf(max);
      console.log('x',x,'y',y,'idx',idx);
    let s0=shp.s0;
    let s1=shp.s1;
    let s2=shp.s2;
    let s3=shp.s3;
    let shapes = [s0,s1,s2,s3];
    for (let i=0;i<4;i++) {
     let shp = shapes[i];
     if (i===idx) {
        shp.show();
     } else {
      shp.hide();
     }
   
     shp.update();
    }
  
  }   

  this.generateGrid();
  this.setCells(gons,op);
  return;
 

}

export {rs};

