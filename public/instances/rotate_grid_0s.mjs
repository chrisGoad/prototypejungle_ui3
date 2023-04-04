import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/rotate_grid.mjs';

let rs = generatorP.instantiate();

rs.setName('rotate_grid_0s');

let wd = 200;
let nr = 10;
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:.1*wd,frameStroke:'rgb(2,2,2)',frameStrokee:'white',frameStrokeWidth:1,
                  smooth:1,saveAnimation:1,numStepsss:51}
Object.assign(rs,topParams);
debugger;


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = .4;
  //lineP['stroke-width'] = .8;
  lineP.stroke = 'white';
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension= 3;
  circleP.fill = 'red';
}

  
rs.addSteps = function () {
 let count = 2;
  let dur = 10;
  let start = 0;
  let box,config,boxes;
  
  let boxC =this.rectFromRowsCols({lowRow:3,highRow:6,lowCol:3,highCol:6,shrinkBy:0.98});
  this.addAstep(boxC,start,dur,count);
  
  start = 12;
  let boxUL =this.rectFromRowsCols({lowRow:0,highRow:3,lowCol:0,highCol:3,shrinkBy:0.98});
  let boxUR =this.rectFromRowsCols({lowRow:0,highRow:3,lowCol:6,highCol:9,shrinkBy:0.98});
  let boxLL =this.rectFromRowsCols({lowRow:6,highRow:9,lowCol:0,highCol:3,shrinkBy:0.98});
  let boxLR =this.rectFromRowsCols({lowRow:6,highRow:9,lowCol:6,highCol:9,shrinkBy:0.98});
  boxes = [boxUL,boxLL,[boxUR],[boxLR]];
  boxes.forEach((box) => {
    this.addAstep(box,start,dur,count);
   });
  
  start = 24;
  let boxLM =this.rectFromRowsCols({lowRow:3,highRow:6,lowCol:0,highCol:3,shrinkBy:0.98});
  let boxRM =this.rectFromRowsCols({lowRow:3,highRow:6,lowCol:6,highCol:9,shrinkBy:0.98});
  let boxTM =this.rectFromRowsCols({lowRow:0,highRow:3,lowCol:3,highCol:6,shrinkBy:0.98});
  let boxBM =this.rectFromRowsCols({lowRow:6,highRow:9,lowCol:3,highCol:6,shrinkBy:0.98});
  boxes = [boxLM,boxRM,boxTM,boxBM];
  boxes.forEach((box) => {
    this.addAstep(box,start,dur,count);
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
    this.addAstep(box,start,dur,count);
   });
  
  start = 48;
  boxes = [boxC,boxUL,boxLL,[boxUR],[boxLR],boxLM,boxRM,boxTM,boxBM];
   boxes.forEach((box) => {
    this.addAstep(box,start,dur,count);
   });
    
  start = 60;
  //let bboxC = this.rectFromRowsCols({lowRow:1,highRow:8,lowCol:1,highCol:8,shrinkBy:0.98});
  let bboxC = this.rectFromRowsCols({lowRow:0,highRow:9,lowCol:0,highCol:9,shrinkBy:0.98});
  this.addAstep([bboxC],start,dur,count);
}


export {rs};


