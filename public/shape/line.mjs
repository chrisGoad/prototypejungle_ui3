import {rs as utils} from '/shape/utils.mjs';

let item = svg.Element.mk('<line/>');
item.shape_name = 'line';

utils.setup(item);

item.setDomAtts = function () {
  let e0 = this.end0;
  let e1 = this.end1;
  this.setDomAttribute('x1',e0.x);
  this.setDomAttribute('y1',e0.y);
  this.setDomAttribute('x2',e1.x);
  this.setDomAttribute('y2',e1.y);
  this.setDomAttribute('visibility',this.visibility);
  this.setDomAttribute('stroke',this.stroke);
  this.setDomAttribute('stroke-width',this['stroke-width']);

}

item.setEnds = function (e0,e1) {
  utils.setEnds(this,e0,e1);
}

item.length = function () {
  let {end0,end1} = this;
  return end1.distance(end0);
}

item.update = function () {
  this.setDomAtts(this.__element);
  if (this.text  && this.__parent.updateText) {
    this.__parent.updateText(this.text);
   }
}

item.controlPoints = function () {
  return utils.controlPoints(this);
}

item.updateControlPoint = function (idx,rpos) {
   utils.updateControlPoint(this,idx,rpos);
}

ui.hide(item,['end0','end1','x1','x2','y1','y2']);

export {item as rs};

