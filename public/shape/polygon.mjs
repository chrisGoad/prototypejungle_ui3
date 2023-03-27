//polygon


let rs =  svg.Element.mk('<polygon/>');
rs.shape_name = 'polygon';

/* adjustable parameters */
rs.fill = "transparent";
rs.stroke = "black";
rs['stroke-width'] = 1;

rs.role = 'spot';
rs.corners = [];


rs.setDomAtts = function () {
  this.setDomAttribute('visibility',this.visibility);
  this.setDomAttribute('fill',this.fill);
  this.setDomAttribute('stroke-width',this['stroke-width']);
  this.setDomAttribute('stroke',this.stroke);

}

rs.update = function () {
  this.setDomAtts(this.__element);
	let {corners} = this;
	let ln = corners.length;
	if (!ln) {
		return;
	}
  let p2str = function (point,after) {
    return point.x+' '+point.y+after;
  };
	let path = '';
	for (let i=0;i<=ln;i++) {
		let corner = (i===ln)?corners[0]:corners[i];
		let pstr = p2str(corner,' ');
		path += pstr;
	}
  this.points = path;
}

export {rs};

