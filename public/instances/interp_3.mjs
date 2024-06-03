
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';

let rs = basicP.instantiate();
addGridMethods(rs);

rs.setName('interp_3');


let wd =100;
let nc=100;
let myParams = {width:wd,height:wd,numCols:nc,numRows:nc};
Object.assign(rs,myParams);



rs.initProtos = function () {
  this.rectP  = rectPP.instantiate();
  this.rectP.fill = 'white';
  this.rectP['stroke-width'] = 0;
}

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
  let fc = .8;
  let cwd = width/numCols;
  let awd = fc*cwd;
  let shp = rectP.instantiate();
  shp.width = awd;
  shp.height = awd;
  return shp;
}


rs.initialize =function ()  {
  this.initProtos();
  this.addFrame();
  let {width:wd,height:ht,numCols:nc} = this;
  let hwd = wd/2;
  let hht = ht/2;
  let ahwd = (nc-1)/2
  let cnt  = Point.mk(ahwd,ahwd);
  

  
  const op = (shp,p) => {
    //debugger;
    let d = (p.distance(cnt))/ahwd;
    let bw = .4;// boundary width
    let ad = d+(bw*Math.random() - .5*bw);
    console.log('x',p.x,'y',p.y,'cx',cnt.x,'cy',cnt.y,'d',d,'ad',ad);
    shp.fill = (ad>0.5)?'red':'black';
    shp.update();
  }   

  this.generateGrid();
  for (let x=0;x<nc;x++) {
    for (let y=0;y<nc;y++) {
      let p = Point.mk(x,y);
      let shp = this.shapeAt(x,y);
      op(shp,p);
    }
  }
  
      
  return;
 

}

export {rs};

