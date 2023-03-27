
//let addPartMethods = core.vars.addPartMethods;
const rs = function (item,mods) {
let {circlePP,polgonPP,rectanglePP,linePP,polygonPP,textPP,addPartMethods,addBasis,addPathMethods} = mods;
addBasis(item,mods);
addPartMethods(item,mods);
addPathMethods(item,mods);
item.setName('part2_0');
debugger;
let wd = 100;
let topParams = {width:wd,height:wd,framePadding:0.1*wd,frameStrokee:'white'}
Object.assign(item,topParams);
item.partParams = {};
//let strokeWidths = item.quadParams.strokeWidths = [];
//item.computeExponentials(strokeWidths,levels,0.1,0.9);

item.initProtos = function () {
  this.polygonP =  polygonPP.instantiate();
  this.polygonP.stroke = 'white';
  this.polygonP.fill = 'black';
  this.polygonP['stroke-width'] =1;
  this.lineP =  linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] =.5 ;
    this.circleP =  circlePP.instantiate();
  this.circleP.stroke = 'white';
  this.circleP.fill = 'blue';
  this.circleP['stroke-width'] =.05;
   let textP = this.textP =  textPP.instantiate();
  textP["font-size"] = "12";
  textP["font-style"] = "normal";
  textP["font-family"] = "arial";
  textP["font-weight"] = "normal";
  textP.stroke = 'white';
}

}

export {rs};

      

