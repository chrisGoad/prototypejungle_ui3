import {rs as generatorP} from '/generators/gons_0.mjs';
let rs = generatorP.instantiate();
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as gonPP} from '/shape/polygon.mjs';

rs.setName('gons_1');
let wd=100;
let topParams = {width:wd,height:wd,frameStrokee:'white',frameStrokeWidth:0.1,framePadding:.6*wd,stepsPerMove:10,numStepss:24,numSteps:300, numCubes:15,
  dim:40,disp:52,numSegs:15,gray:100,delta:20
 
  };
  


Object.assign(rs,topParams);


rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension = 2;
  circleP.fill = 'red';
  circleP['stroke-width'] = 0;
  this.dropP = circleP;
   let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2;
   let gonP = this.gonP = gonPP.instantiate();
  gonP.fill = 'white';
  gonP.stroke = 'white';
  gonP['stroke-width'] = 0;
}


rs.genDs = function () {
  const randD = ()=> {
    return 15+ Math.floor(Math.random()*60);
  }
  return [randD(),randD(),randD(),randD()];
}
rs.initialize = function () {
  debugger;
  //this.setBackgroundColor('rgb(10,10,100)');
  this.setBackgroundColor('rgb(0,0,0)');
  let {dim,disp,numSegs:nc,gray,delta} = this;
  this.initProtos();
  this.addFrame();
 
  let extent = Point.mk(dim,dim);
 
  const addGon = (nm,d,ps,clr) => {
    let gon = this.genGonGon(extent,d,nc);
    this.set(nm,gon);
    gon.moveto(ps);
    let fill = `rgb(${clr.r},${clr.g},${clr.b})`;
    gon.fill = fill;
  }

  
  let dC = 150;
  let dD = 50;
  addGon('gon00',this.genDs(),Point.mk(-disp,-disp),{r:gray,g:gray,b:gray});
  addGon('gon01',dC,Point.mk(-disp,0),{r:gray,g:gray+delta,b:gray});
  addGon('gon02',this.genDs(),Point.mk(-disp,disp),{r:gray,g:gray,b:gray});
  
  addGon('gon10',dC,Point.mk(0,-disp),{r:gray+delta,g:gray,b:gray});
  debugger;
  addGon('gon11',dC,Point.mk(0,0),{r:gray+delta,g:gray+delta,b:gray});
  //addGon('gon11',[40,60,40,150],Point.mk(0,0),{r:gray+delta,g:gray+delta,b:gray});
  addGon('gon12',dC,Point.mk(0,disp),{r:gray+delta,g:gray,b:gray});
  
  addGon('gon20',this.genDs(),Point.mk(disp,-disp),{r:gray,g:gray,b:gray});
  addGon('gon21',dC,Point.mk(disp,0),{r:gray,g:gray+delta,b:gray});
  addGon('gon22',this.genDs(),Point.mk(disp,disp),{r:gray,g:gray,b:gray});
}

export {rs};
