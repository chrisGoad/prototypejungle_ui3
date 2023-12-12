import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
//import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addDropMethods} from '/mlib/circleDropsS.mjs';


let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_interpolate_0');
let ht= 100;
let topParams = {width:ht,height:ht};
let hht = ht/2;
let qht = ht/4;
rs.vertices = [Point.mk(-hht,-hht),Point.mk(hht,-hht),Point.mk(hht,hht),Point.mk(-hht,hht),Point.mk(0,0),
            Point.mk(qht,qht),Point.mk(-qht,-qht),Point.mk(-qht,qht),Point.mk(qht,-qht)]
rs.vertices = [Point.mk(-hht,-hht),Point.mk(hht,-hht),Point.mk(hht,hht),Point.mk(-hht,hht),Point.mk(0,0)];
rs.vValues = [[250,250,250,.1],[250,0,0,5],[250,250,250,.1],[0,0,250,1],[0,0,0,.1]];
rs.vValues = [[250,250,250,.1],[250,250,250,.1],[250,250,250,.1],[250,250,250,.1],[250,250,250,.1],[250,0,0,2],[0,0,250,2],[250,250,0,2],[0,250,250,2]];
rs.vValues = [[250,250,0,.1],[250,0,250,.1],[0,250,250,.1],[250,0,0,.1],[0,0,250,5]];

Object.assign(rs,topParams);

let dropParams = {dropTries:150,maxDrops:100000}
//rs.dropParams = dropParams;
rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}  


rs.generateCircleDrop= function (p) { 
  let {vertices,vValues} = this;
  const dfn = (d) => Math.sqrt(d);
  let iv = this.interpolateVectors({vertices,vValues,p});
  let fill = this.arrayToRGB(iv);
  let dim = iv[3];
  let drop = {collideRadius:.55*dim,dimension:dim,fill};
  return drop;
}

/*
rs.generateDrop= function (p) {
  let ln = p.length();
  if ((ln<=400) || (ln > ht/2)) {
    return;
  }
  
  let crc = Circle.mk(0.01*ln);
  let crcs = crc.toShape(this.circleP);
  return {geometries:[crc],shapes:[crcs]}; 
 }
 */

rs.initialize = function () {
  debugger;
  //this.addRectangle({width:ht,height:ht,stroke_width:0,fill:'white'});
  this.initProtos();
  this.addFrame();
  let shapes = this.set('dropShapes',arrayShape.mk());

  let drops =  this.drops = this.generateCircleDrops(dropParams);
  //let drops =  this.generateDrops(dropParams);
  this.installCircleDrops(shapes,this.circleP,drops);

}

export {rs};


