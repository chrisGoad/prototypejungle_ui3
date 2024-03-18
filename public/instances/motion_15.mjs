import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDistanceMethods} from '/mlib/by_distance.mjs';
import {rs as generatorP} from '/generators/motion_3.mjs'

let rs = generatorP.instantiate();
addDistanceMethods(rs);

rs.setName('motion_15');
let ht=50;


let topParams = {width:ht,height:ht,framePadding:0.3*ht,frameStrokee:'white',frameStrokeWidth:.2,timePerStep:1/80,stopTime:6,recordingMotion:1,saveAnimation:1,
  //  circleRadius:.1,ringRadii:[],nearestCount:6,nearestFadeFactor:20,toAngle:2*Math.PI,particleColor:'blue',shapesPerPath:4,speed:1}
    circleRadius:.1,ringRadii:[],nearestCount:6,nearestFadeFactor:0,toAngle:2*Math.PI,particleColor:'blue',shapesPerPath:4,speed:1,whereToPause:422}

Object.assign(rs,topParams);
let subParams ={speed:10,shapesPerRing:2};

debugger;


  
rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'orange';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .0; 
}

rs.buildGrid = function (params) {
  let {width:wd,height:ht,numrows:nr,numcols:nc} = params;
  let grid = [];
  let bx = -wd/2;
  let by = -ht/2;
  let deltax = wd/nr;
  let deltay = ht/nc;
  for (let i=0;i<=nr;i++) {
    let cx = bx+deltax*i;
    for (let j=0;j<=nr;j++) {
      let cy = by+deltay*j;
      let p = Point.mk(cx,cy);
      grid.push(p);
    }
  }
  params.grid = grid;
}

rs.accessGrid = function (params,x,y) {
  let {numrows:nr,numcols:nc,grid} = params;
  let index = x*(nc+1)+y;
  return grid[index];
}

rs.pointsAroundCell = function (params,x,y) {
   let UL = this.accessGrid(params,x,y);
   let UR = this.accessGrid(params,x+1,y);
   let LR = this.accessGrid(params,x+1,y+1);
   let LL = this.accessGrid(params,x,y+1);
   return [UL,UR,LR,LL,UL];
}

rs.pathAroundCell = function (params,x,y,offset) {
  let pnts = this.pointsAroundCell(params,x,y);
  let path = [];
  let ln = pnts.length;
  for (let i=0;i<ln;i++) {
    let pel = {pathTime:i,value:offset.plus(pnts[i])};
    path.push(pel);
  }
  return this.normalizePath(path);
}

  
      
    
rs.buildIpaths = function (numrows,numcols) {
  let {width} = this;
  let params = {width,height:width,numrows,numcols};
  this.buildGrid(params);
  let {grid} = params;
 /* let [p00,p01,p02,p10,p11,p12,p20,p21,p22] = grid;
  let ipath0 = [{pathTime:0,value:p00},{pathTime:1,value:p10},{pathTime:2,value:p11},{pathTime:3,value:p01},{pathTime:4,value:p00}];
  let ipath1 = [{pathTime:0,value:p10},{pathTime:1,value:p20},{pathTime:2,value:p21},{pathTime:3,value:p11},{pathTime:4,value:p10}];
  let ipath2 = [{pathTime:0,value:p01},{pathTime:1,value:p11},{pathTime:2,value:p12},{pathTime:3,value:p02},{pathTime:4,value:p01}];
  let ipath3 = [{pathTime:0,value:p11},{pathTime:1,value:p21},{pathTime:2,value:p22},{pathTime:3,value:p12},{pathTime:4,value:p11}];*/
  let ipaths = [];
  
  let ov0=0;//40;
  let ov1=0;/////
  for (let i=0;i<numcols;i++) {
    for (let j=0;j<numrows;j++) {
      if (((i===1)||(j===1))&&!((i==1) && (j===1))) {
       
        let offset;
        if (i===0) {
          offset = Point.mk(-ov0,0);
        } 
        if (i===2) {
          offset = Point.mk(ov0,0);
        } 
         if (j===0) {
          offset = Point.mk(0,-ov1);
        } 
         if (j===2) {
          offset = Point.mk(0,ov1);
        } 
        let path = this.pathAroundCell(params,i,j,offset);
        ipaths.push(path);
      }
    }
  }
 
  this.ipaths = ipaths;
}
  

rs.buildParameterArrays  = function () {
  let {nearestCount:nc,ipaths,speed,shapesPerPath:spp} = this;
  let np = ipaths.length;
  this.shapesPerPath = this.uniformArray(spp,np);
  let divisors = [2,3];
  let mdivs = this.repeatArray(divisors,6);
  let speedsEachPath = mdivs.map((v) => speed/v);
  //let speedsEachPath = this.uniformArray(speed,spp);
  this.speedsPerPath = rs.uniformArray(speedsEachPath,np);
  let soffEachPath =  this.steppedArray(0,1,spp+1,1);//start offset each path
  this.soffsPerPath = this.uniformArray(soffEachPath,np);
}


rs.initialize = function () {
   debugger;
   this.initProtos();
   let {stopTime:stp,timePerStep:tps,lineP,circleP} = this;
  this.addFrame();
  this.numSteps =stp/tps;
 // this.numSteps =80;
 // this.stepArrayy = [0].concat(this.sequentialArray(102,120));
  this.set('shapes',arrayShape.mk());
  let lines = this.set('lines',arrayShape.mk());
  let segs = this.segs = [];
  let ints = this.set('ints',arrayShape.mk());
  this.buildIpaths(3,3);
  this.buildParameterArrays();
  this.setPathParams();
  let av = this.allValues();
  this.addLinesBetweenPositions(av,lineP);
  //return;
  let nln = lines.length;
  let nints = nln*nln;
  for (let i =0;i<nints;i++) {
    let crc = circleP.instantiate();
    crc.hide();
    ints.push(crc);
  }
  this.mind = Infinity;
  this.maxd = -Infinity;
}

rs.updateState = function () {
  let {currentTime:ct,activePaths,circ,lineP,segs,ints} = this;
  //let ap = this.activePaths[0]
  debugger;
  this.runActivePaths();
  //return;
   let av = this.allValues();
  this.updateLines(av);
 //return;
  let intps = allSegmentIntersections(segs);
  let nints = ints.length;
  for (let i=0;i<nints;i++) {
    let crc = ints[i];
    crc.hide();
    crc.update();
  }
  let nintps = intps.length;
  for (let i=0;i<nintps;i++) {
    let crc = ints[i];
    let p = intps[i];
    crc.show();
    crc.moveto(p);
    //crc.update();
  }
  
}



    
 
export {rs};



