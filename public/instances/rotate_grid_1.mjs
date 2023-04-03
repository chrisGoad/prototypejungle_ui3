import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/rotate_grid.mjs';

let rs = generatorP.instantiate();

rs.setName('rotate_grid_1');

let wd = 200;
let nr = 10;
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,numSteps:51}
Object.assign(rs,topParams);
debugger;


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  lineP.stroke = 'white';
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 5;
  circleP.fill = 'red';
}
   
rs.initialize =  function () {
  debugger;
  //let seg0 = LineSegment.mk(Point.mk(-10,-10),Point.mk(10,12));
  let seg0 = LineSegment.mk(Point.mk(1,1),Point.mk(10,10));
  let seg1 = LineSegment.mk(Point.mk(-10,10),Point.mk(10,-10));
  let p = this.intersectLineSegs(seg0,seg1);
  
  this.initProtos();
  this.addFrame();
  this.buildGrid();
  this.addSegs();
    this.set('centerShapes',arrayShape.mk());

  this.addCenters();
  this.initOutSegs();

  let count = 2;
  let dur = 10;
  let start = 0;
  let box,config,boxes;
  const addAstep = (ibox,start,duration,count) =>{
    let isa = Array.isArray(ibox);
    let reverse = isa;
    let box = isa?ibox[0]:ibox;
    let config = this.mkConfig(box,reverse);
    this.addStep(config,start,duration,count);
  }
  
  let boxC3 =this.rectFromRowsCols({lowRow:3,highRow:6,lowCol:3,highCol:6,shrinkBy:0.98});
  addAstep(boxC3,start,dur,count);
  
  start = 12;
  
  let boxC4 =this.rectFromRowsCols({lowRow:2,highRow:7,lowCol:2,highCol:7,shrinkBy:0.98});
  addAstep([boxC4],start,dur,count);
  
  
  start = 24;
  
  let boxC5 =this.rectFromRowsCols({lowRow:1,highRow:8,lowCol:1,highCol:8,shrinkBy:0.98});
  addAstep(boxC5,start,dur,count);
  
  
  start = 36;
  
  let boxC6 =this.rectFromRowsCols({lowRow:0,highRow:9,lowCol:0,highCol:9,shrinkBy:0.98});
  addAstep([boxC6],start,dur,count);
  
  
  this.setNumSteps(4);
  //this.configSetFraction(config,0);
  this.updateState();
  //this.displayOutSegs(activeConfigs);

  
}



export {rs};


