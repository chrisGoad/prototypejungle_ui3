
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
//import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);
//addRandomMethods(rs);	
rs.setName('grid_figure_ground');
	
rs.initProtos = function () {
  rs.rectP  = rectPP.instantiate();
  rs.rectP.fill = 'white';
  rs.rectP['stroke-width'] = 0;
  rs.rectP.width = 5;
  rs.rectP.height = 5;
    rs.circleP  = circlePP.instantiate();
  rs.circleP.fill = 'white';
  rs.circleP['stroke-width'] = 0;
  


}  

let nr = 128;
let wd = 200;
let topParams = {numRows:nr,numCols:nr,width:wd,height:wd/2,pointJigglee:4,framePadding:0.15*wd,frameVisible:1};
Object.assign(rs,topParams);

rs.shapeGenerator = function (rvs,cell) {
  let {rectP,numRows,width} = this;
  let cwd = width/numRows;
  let {x,y} = cell;
  let nro2 = numRows/2;
  //console.log('x',x,'y',y);
  //let fwd = x<nro2?x/nro2:(x-nro2)/nro2;// fraction of the way across (i.e. to max x)
  let fwd = x<nro2?x/nro2:(numRows-x)/nro2;// fraction of the way across (i.e. to max x)
  if (y===0) {
    console.log('x',x,'fwd',fwd);
  }
  let wd = fwd*cwd;
  
  let shape = rectP.instantiate().show();
  shape.width = wd;
  shape.height = wd;
  shape.fill = x>=nro2?'red':'blue';
  return shape;
}

rs.initialize = function () {
 // this.setupRandomGridForBoundaries('v',{step:30,min:100,max:250}); 
  this.initProtos();
  this.addFrame();
  let {numRows,width,height,rectP,circleP}=  this;
  let wr = rectP.instantiate().show();
  let crc = circleP.instantiate().show();
  crc.fill = 'yellow';
  crc.fill = 'magenta';
  crc.fill = 'black';
  //crc.fill = 'gray';
  //this.set('wr',wr);
  wr . width = width/2;
  wr . height = height;
  wr.fill = 'blue';
  wr.moveto(Point.mk(width/4,0));
  crc.dimension = height+40;
  this.generateGrid();
    this.set('crc',crc);

}

export {rs};


