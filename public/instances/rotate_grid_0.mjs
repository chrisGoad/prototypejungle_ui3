import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/rotate_grid.mjs';

let rs = generatorP.instantiate();

rs.setName('rotate_grid_0');

let wd = 200;
let nr = 10;
rs.setName('rotate_grid');
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,saveAnimation:1,numSteps:51}
Object.assign(rs,topParams);
debugger;


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
  
  let boxC =this.rectFromRowsCols({lowRow:3,highRow:6,lowCol:3,highCol:6,shrinkBy:0.98});
  addAstep(boxC,start,dur,count);
  
  start = 12;
  let boxUL =this.rectFromRowsCols({lowRow:0,highRow:3,lowCol:0,highCol:3,shrinkBy:0.98});
  let boxUR =this.rectFromRowsCols({lowRow:0,highRow:3,lowCol:6,highCol:9,shrinkBy:0.98});
  let boxLL =this.rectFromRowsCols({lowRow:6,highRow:9,lowCol:0,highCol:3,shrinkBy:0.98});
  let boxLR =this.rectFromRowsCols({lowRow:6,highRow:9,lowCol:6,highCol:9,shrinkBy:0.98});
  boxes = [boxUL,boxLL,[boxUR],[boxLR]];
  boxes.forEach((box) => {
    addAstep(box,start,dur,count);
   });
  
  start = 24;
  let boxLM =this.rectFromRowsCols({lowRow:3,highRow:6,lowCol:0,highCol:3,shrinkBy:0.98});
  let boxRM =this.rectFromRowsCols({lowRow:3,highRow:6,lowCol:6,highCol:9,shrinkBy:0.98});
  let boxTM =this.rectFromRowsCols({lowRow:0,highRow:3,lowCol:3,highCol:6,shrinkBy:0.98});
  let boxBM =this.rectFromRowsCols({lowRow:6,highRow:9,lowCol:3,highCol:6,shrinkBy:0.98});
  boxes = [boxLM,boxRM,boxTM,boxBM];
  boxes.forEach((box) => {
    addAstep(box,start,dur,count);
   });
     boxes = [boxLM,boxRM,boxTM,boxBM];

  start = 36;
 
  start = 36;
  let bboxUL =this.rectFromRowsCols({lowRow:0,highRow:4,lowCol:0,highCol:4,shrinkBy:0.98});
  let bboxUR =this.rectFromRowsCols({lowRow:0,highRow:4,lowCol:5,highCol:9,shrinkBy:0.98});
  let bboxLL =this.rectFromRowsCols({lowRow:5,highRow:9,lowCol:0,highCol:4,shrinkBy:0.98});
  let bboxLR =this.rectFromRowsCols({lowRow:5,highRow:9,lowCol:5,highCol:9,shrinkBy:0.98});
  boxes = [bboxUL,[bboxUR],bboxLL,[bboxLR]];
  boxes.forEach((box) => {
    addAstep(box,start,dur,count);
   });
   
  start = 48;
  //let bboxC = this.rectFromRowsCols({lowRow:1,highRow:8,lowCol:1,highCol:8,shrinkBy:0.98});
  let bboxC = this.rectFromRowsCols({lowRow:0,highRow:9,lowCol:0,highCol:9,shrinkBy:0.98});
  addAstep([bboxC],start,dur,count);
  
  this.setNumSteps(4);
  //this.configSetFraction(config,0);
  this.updateState();
  //this.displayOutSegs(activeConfigs);

  
}



export {rs};


