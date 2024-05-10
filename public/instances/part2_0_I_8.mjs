
import {rs as generatorP} from '/instances/part2_0_I.mjs';

let rs = generatorP.instantiate();


rs.setName('part2_0_I_8');

rs.partParams.rectangular = 1;
let sp = rs.partParams.splitParams = {Case:9,direction:-0.25*Math.PI,radius:0.2,pcs:[.4,1.4,2.4,3.4]};


rs.partSplitParamsss = function (qd) {
  let pgon = qd.polygon;
  let c = pgon.center();
  let d = pgon.minDimension();
  let rd = (c.x>0?-0.25:-0.25)*Math.PI;
  let center = c.plus(Point.mk(Math.cos(rd),Math.sin(rd)).times(d*0.2));
  let rs = {Case:9,direction,pc0:.4,pc1:1.4,pc2:2.4,pc3:3.4};  
   return rs;
}
rs.afterInitialize =function ()  {
  debugger;
  let tp =this.topPart;
  let gons = [tp.P0.polygon,tp.P1.polygon,tp.P2.polygon,tp.P3.polygon];
  this.computeSides(gons);
  let red = {r:255,g:0,b:0};
  let  green= {r:0,g:255,b:0};
  let  blue= {r:0,g:0,b:255};
  let  black= {r:0,g:0,b:0};
  let  cyan = {r:0,g:255,b:255};
  //let values = [red,green,blue,green];
  let values = [this.randomColorOb(),this.randomColorOb(),this.randomColorOb(),this.randomColorOb()];
   let params = {gons,values};
  //let iv=this.interpolateInPolygon(params);
    debugger;

  this.generateGrid();
  this.paintCells(params);
  return;
  this.displayTitle('Partition 8');
  this.displayPc(0);
  this.displayPc(1);
  this.displayPc(2);
  this.displayPc(3);
 

}

export {rs};

