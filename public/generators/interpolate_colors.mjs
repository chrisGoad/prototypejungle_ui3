import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/circleDropsS.mjs';
import {rs as addAnimationMethods} from '/mlib/animate0.mjs';

let rs = basicP.instantiate();

addAnimationMethods(rs);
addDropMethods(rs);

rs.setName('interpolate_colors_0');
let ht= 100;
let nr = 3;

let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,framePadding:0.0*ht,frameStroke:'white',frameStrokeWidth:.1,saveAnimation:1,
numSteps:295,chopOffBeginning:218,stepInterval:50};//50

Object.assign(rs,topParams);

//rs.dropParams = {dropTries:150,scale:0.5,radius:50}
rs.dropParams = {zone,dropTries:1000,maxLoops:100000,maxDrops:6};
//rs.dropParams = {zone,dropTries:100000,maxLoops:100000,maxDrops:2};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .5;
}


rs.generateLines = function () {
  debugger;
  this.set('lines',arrayShape.mk());
  let {numRows:nr,numCols:nc,width:wd,height:ht,lineP} = this;
  let lln = wd/nc;
  let yspacing = ht/nr
  let cy= -ht/2;
  let hgap = 0.05*wd;
  for (let j=0;j<nr;j++) {
    let centerY = cy+0.5*yspacing;
    let cx = -wd/2;
    for (let i=0;i<nc;i++) {
      let line = lineP.instantiate();
      lines.push(line);
      line.setEnds(Point.mk(cx+hgap,centerY),Point.mk(cx+lln-hgap,centerY));
      line.show();
      line.update();
      cx = cx+lln;
    }
    let cy = cy +yspacing;
  }
  


rs.initialize = function () {
  this.initProtos();
  this.addFrame();
  this.generateLines();
}

}

rs.updateState = function () {
  let {stepsSoFar:ssf} = this;
 
}

export {rs};



