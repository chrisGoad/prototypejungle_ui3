// Copyright 2019 Chris Goad
// License: MIT


geomr.set("Point3d",core.ObjectNode.mk()).__namedType();
let Point3d = geomr.Point3d;


Point3d.mk = function (x,y,z) {
  let rs = Object.create(Point3d);
  if (typeof x==="number") {
    rs.x = x;
    rs.y = y;
		rs.z = z;
  } else {
    rs.x = 0;
    rs.y =0;
    rs.z =0;
  }
  return rs;
}
  


Point3d.copy = function () {
  return Point3d.mk(this.x,this.y,this.z);
};

/*
  
Point.copyto = function (src) {
  this.x = src.x;
  this.y = src.y;
  this.z = src.z;
  return this; 
}
*/
Point3d.difference = function (q) {
  let p = this;
  return Point3d.mk(p.x - q.x,p.y - q.y,p.z - q.z);
};


Point3d.times = function (s) {
  let p = this;
  return Point3d.mk(s*p.x,s*p.y,s*p.z);
};



Point3d.minus = function () {
  let p = this;
  return Point3d.mk(-p.x,-p.y,-p.z);
};




Point3d.plus = function (q) {
  let p = this;
  return Point3d.mk(p.x + q.x,p.y + q.y,p.z + q.z);
};


Point3d.length = function () {
  let {x,y,z} = this;
  return Math.sqrt(x*x + y*y + z*z);
}


Point3d.copy = function () {
  return Point3d.mk(this.x,this.y,this.z);
}
  
  
Point3d.copyto = function (src) {
  this.x = src.x;
  this.y = src.y;
  this.z = src.z;
  return this; 
}

Point3d.difference = function (q) {
  let p = this;
  return Point3d.mk(p.x - q.x,p.y - q.y,p.z - q.z);
}

Point3d.directionTo = function (pnt) {
    return pnt.difference(this).normalize();
}

Point3d.setCoords = function (x,y,z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

// if p is null, compute distance from origin
Point3d.distance = function (p) {
  let vx = this.x - p.x;
  let vy = this.y - p.y;
  let vz = this.z - p.z;
  return Math.sqrt(vx*vx + vy * vy + vz*vz);
  
}


Point3d.times = function (f) {
  let p = this;
  return Point3d.mk(f*p.x,f*p.y,f*p.z);
}


Point3d.normalize = function () {
  let ln = this.length();
  return Point3d.mk(this.x/ln,this.y/ln,this.z/ln);
}


Point3d.minus = function () {
  return Point3.mk(-this.x,-this.y,-this.z);
}

Point3d.dotp = function (p) {
  return this.x * p.x + this.y * p.y + this.z * p.z;
}



Point3d.interpolate = function (dst,fc) {
   let d = dst.difference(this);
   let vc  = d.times(fc);
   let rs = this.plus(vc);
   return  rs;
}



Point3d.toString = function () {
  let {x,y,z} = this;
  return "["+x+","+y+","+z+"]";
}

Point.to3d = function () {
	let rs = Point3d.mk(this.x,this.y,0);
	return rs;
}


geomr.set("Array3d",core.ObjectNode.mk()).__namedType();
let Array3d = geomr.Array3d;

geomr.set("Segment3d",core.ObjectNode.mk()).__namedType();


let Segment3d = geomr.Segment3d;

Segment3d.mk = function (end0,end1,dontCopy) {
  let rs = Object.create(Segment3d);
  if (!end0) {
    return rs;
  }
  if (dontCopy) {
    rs.set('end0',end0);
    rs.set('end1',end1);
  } else {
    rs.set('end0',end0.copy());
    rs.set('end1',end1.copy());
  }
  return rs;
}

LineSegment.to3d = function() {
	let {end0,end1} = this;
	return Segment3d.mk(end0.to3d(),end1.to3d())
}

Segment3d.split = function (fr) {
	let {end0,end1} = this;
	let vec = end1.difference(end0);
	let rs0e1 = end0.plus(vec.times(0.5*(1-fr)));
	let rs1e0 = end1.difference(vec.times(0.5*(1-fr)));
	let rs0 = Segment3d.mk(end0,rs0e1);
	let rs1 = Segment3d.mk(rs1e0,end1);
	return [rs0,rs1];
}

geomr.set("Shape3d",core.ObjectNode.mk()).__namedType();

let Shape3d = geomr.Shape3d;

Shape3d.mk = function (transform) {
	let rs = Object.create(Shape3d);
	rs.set('transform',transform);
	/*}
  rs.parts = rparts;
	//let rparts = core.ArrayNode.mk();
	parts.forEach((part) => rparts.push(part));
	rs.set('parts',rparts);*/
	return rs;
}

Shape3d.toGlobalCoords = function () {
  let tr = this.transform;
  let pr = this.__parent;
  let rtr;
  if (Shape3d.isPrototypeOf(pr)) {
    let prtr = pr.toGlobalCoords();
    rtr = prtr.times(tr);
  } else {
    rtr = tr;
  }
  return rtr;
}
    




geomr.set("Camera",core.ObjectNode.mk()).__namedType();
let Camera = geomr.Camera;


// simple: axis is "x" "y" or "z"
Camera.mk = function (focalPoint,focalLength,scaling,axis) {
  //debugger;
  let rs = Object.create(Camera);
	rs.focalPoint = focalPoint;
	rs.focalLength = focalLength;
	rs.scaling = scaling;
	rs.axis = axis;
  let av;
  if (axis === 'x') {
    av = Point3d.mk(-1,0,0);
  }
  if (axis === 'y') {
    av = Point3d.mk(0,-1,0);
  }
  if (axis === 'z') {
    av = Point3d.mk(0,0,-1);
  }
  rs.axisVector = av;
  return rs;
}

Point3d.project = function (camera,transform) {
 // return camera.projectPoint3d(this,transform) 
 let {focalPoint:fp,focalLength:fl,scaling:s,axis} = camera;
  let ip = this;
	let upsideDown = 0;
	if (ip === undefined) {
		debugger; //keep
	}
  let p = transform?ip.applyTransform(transform):ip;
	let v = fp.difference(p);
	let t,rs;
	if (axis === 'x') {
		t = fl/(v.x);
	  rs = Point.mk(s*t*v.y,s*t*v.z);
	} else if (axis === 'z') {
		t = (upsideDown?1:-1)*fl/(v.z);
		rs = Point.mk(s*t*v.x,s*t*v.y);
		}
	if (ip.hideMe) {
		rs.hideMe = 1;
	}
//	console.log('project ',ip.x,ip.y,ip.z,' rs ',rs.x,rs.y);
	rs.origin = p;
	return rs;
 
}  

Segment3d.project = function (camera,transform) {
  let {end0,end1} = this;
  if ((!end0)||(!end1)) {
    debugger;
  }
  let e0 = end0.project(camera,transform);
  let e1 = end1.project(camera,transform);
	let rs = LineSegment.mk(e0,e1);
	rs.origin = this;
	return rs;
}

/*
Camera.projectShape3d = function (shp,itrans) {
	let strans = shp.transform;
	let trans;
	if (itrans) {
		if (strans) {
			trans = itrans.times(strans);
		} else {
			trans = strans;
		}
	} else {
		trans = strans;
	}
	let hideIt = this.hideIt;
	if (0 && trans) {
	  let xfx = trans.apply(Point3d.mk(1,0,0));
	  let xfy = trans.apply(Point3d.mk(0,1,0));
	  let xfz = trans.apply(Point3d.mk(0,0,1));
	  hideIt = hideIt || (xfz.z <= 0);
	}
	if (hideIt) {
    return;
	}
	let parts = shp.parts;
	let rs = core.ArrayNode.mk();
 // parts.forEach( (part) => rs.push(this.project(part,trans)));
  parts.forEach( (part) => {
		let proto = Object.getPrototypeOf(part);
		part.hideIt = hideIt;
		if (proto === Shape3d) {
			let subparts = part.parts;
			let prj = this.project(part,trans);
			prj.forEach( (p) => rs.push(p));
		//	subparts.forEach( (subpart) => rs.push(this.project(subpart,trans)));
		} else {
      rs.push(this.project(part,trans));
		}
	});
	return rs;
}

*/
Camera.projectCollection = function (elements,transform) {
  if (Array.isArray(elements)) {
    let rs = [];
    rs = elements.map((e) => {
      this.project(e,transform);
    });
    return rs;
  } else {
    let rs = {};
    let props = Object.getOwnPropertyNames(pnts);
    props.forEach((prop) => {
      let e = pnts[prop];
      rs[prop] = this.project(e,transform);
    });
    return rs;
  }
}

Shape3d.project = function (camera,itrans) {
	let strans = shp.transform;
	let trans;
	if (itrans) {
		if (strans) {
			trans = itrans.times(strans);
		} else {
			trans = strans;
		}
	} else {
		trans = strans;
	}
	let hideIt = this.hideIt;
	if (0 && trans) {
	  let xfx = trans.apply(Point3d.mk(1,0,0));
	  let xfy = trans.apply(Point3d.mk(0,1,0));
	  let xfz = trans.apply(Point3d.mk(0,0,1));
	  hideIt = hideIt || (xfz.z <= 0);
	}
	if (hideIt) {
    return;
	}
	let parts = shp.parts;
  let rs = camera.projectCollection(parts,transform);
	return rs;
}

/*
Camera.project = function (shp,trans) {
	let proto = Object.getPrototypeOf(shp);
	if (proto === Point3d) {
		return this.projectPoint3d(shp,trans);
	}
	if (proto === Segment3d) {
		return this.projectSegment3d(shp,trans);
	}
	if (proto === Shape3d) {
		return this.projectShape3d(shp,trans);
	}
}
	*/
  
Camera.project = function (o3d,trans) {
  return o3d.project(this,trans);
}


geomr.set("Affine3d",core.ArrayNode.mk());
let Affine3d = geomr.Affine3d;

//  i = row, j = column ; column major
Affine3d.select = function (i,j) {
	return this[i*4+j];
}

Affine3d.mkFromCols = function (ic1,ic2,ic3,ic4) {
	let rs = Object.create(Affine3d);
	let c1,c2,c3,c4;
	if (ic2) {
		c1 = ic1;
		c2 = ic2;
		c3 = ic3;
		c4 = ic4;
	} else {
   // debugger;
		c1 = ic1[0];
		c2 = ic1[1];
		c3 = ic1[2];
		c4 = ic1[3];
	}
	c1.forEach((el) => rs.push(el));
	c2.forEach((el) => rs.push(el));
	c3.forEach((el) => rs.push(el));
	c4.forEach((el) => rs.push(el));
	return rs;
}

Affine3d.rotationOf = function () {
  let [a00,a01,a02,a03,a10,a11,a12,a13,a20,a21,a22,a23,a30,a31,a32,a33] = this;
  let c0 = [a00,a01,a02,0];
  let c1 = [a10,a11,a12,0];
  let c2 = [a20,a21,a22,0];
  let c3 = [0,0,0,1];
  let rt = Affine3d.mkFromCols(c0,c1,c2,c3);
  return rt;
}

Affine3d.applyToPoint = function (p) {
	//debugger;
	let {x,y,z} = p;
	let [a11,a21,a31,a41,a12,a22,a32,a42,a13,a23,a33,a43,a14,a24,a34,a44] = this;
	let rx = a11*x + a12*y + a13*z + a14;
	let ry = a21*x + a22*y + a23*z + a24;
	let rz = a31*x + a32*y + a33*z + a34;
	return Point3d.mk(rx,ry,rz);
}

Point3d.applyTransform = function (tr) {
  //debugger;
  return tr.applyToPoint(this);
}


Point3d.applyTransformInPlace = function (tr) {
  //debugger;
  let np = tr.applyToPoint(this);
  this.copyto(np);
  return np;
}


Affine3d.applyToCollection = function (pnts) {
 // debugger;
  if (Array.isArray(pnts)) {
    let rs = [];
    pnts.forEach((p) => {
      rs.push(p.applyTransForm(this));
    });
    return rs;
  } else {
    let rs = {};
    let props = Object.getOwnPropertyNames(pnts);
    props.forEach((prop) => {
      let p = pnts[prop];
      rs[prop] = p.applyTransform(this);
    });
    return rs;
  }
}


Affine3d.applyToCollectionInPlace = function (pnts) {
 // debugger;
  if (Array.isArray(pnts)) {
    pnts.forEach((p) => {
      p.applyTransformInPlace(this);
    });
    return pnts;
  } else {
    let props = Object.getOwnPropertyNames(pnts);
    props.forEach((prop) => {
      let p = pnts[prop];
       p.applyTransformInPlace(this);
    });
    return pnts;
  }
}

Affine3d.row = function (n) {
	let rs = [];
	let st = n;
	for (let i=0;i<4;i++) {
		rs.push(this[st+4*i]);
	}
	return rs;
}


Affine3d.col = function (n) {
	let rs = [];
	let st = n*4;
	for (let i=0;i<4;i++) {
		rs.push(this[st+i]);
	}
	return rs;
}

Affine3d.identity = function () {
	let c1 = [1,0,0,0];
	let c2= [0,1,0,0];
	let c3= [0,0,1,0];
	let c4= [0,0,0,1];
	let rs = Affine3d.mkFromCols(c1,c2,c3,c4);
	return rs;
}

Affine3d.test = function () {
	let c1 = [11,21,31,41];
	let c2= [12,22,32,42];
	let c3= [13,23,33,43];
	let c4= [14,24,34,44];
	let rs = Affine3d.mkFromCols(c1,c2,c3,c4);
	return rs;
}
Affine3d.testRow = function (n) {
	let tst = Affine3d.test();
	return tst.row(n);
}
Affine3d.testCol = function (n) {
	let tst = Affine3d.test();
	return tst.col(n);
}


Affine3d.times = function (b) {
	//debugger;
	let aRows = [];
	let bCols = [];
	let rCols = []
	for (let i=0;i<4;i++) {
		aRows.push(this.row(i));
	}
	for (let i=0;i<4;i++) {
		bCols.push(b.col(i));
	}
	const aDotp = function (a,b) {
		let ln = a.length;
		let rs = 0;
		for (let i=0;i<ln;i++) {
			rs += a[i]*b[i];
		}
		return rs;
	}
	for (let colN = 0;colN<4;colN++) {
		let col = [];
		for (let rowN=0;rowN<4;rowN++) {
			let aR = aRows[rowN];
			let bC = bCols[colN];
		//	aR.dotp(bC);
			col.push(aDotp(aR,bC));
		}
		rCols.push(col);
	}
	let rs = Affine3d.mkFromCols(rCols);
	return rs;
 
}

Affine3d.mkRotation = function (axis,angle,translation) {
	let cos = Math.cos(angle);
	let sin = Math.sin(angle);
	let c0,c1,c2;
	if (axis === 'x') {
		c0 = [1,0,0,0];
		c1 = [0,cos,sin,0];
		c2 = [0,-sin,cos,0];
	} else if (axis === 'y') {
		c0 = [cos,0,-sin,0];
		c1 = [0,1,0,0];
		c2 = [sin,0,cos,0];
	} else if (axis === 'z') {
		c0 = [cos,sin,0,0];
		c1 = [-sin,cos,0,0];
		c2 = [0,0,1,0];
	}
	let c3;
	let tr = translation;
	if (tr) {
		let {x,y,z} = tr;
		c3 = [x,y,z,1]
	} else {
	  c3 = [0,0,0,1];
	}
	let rs = Affine3d.mkFromCols(c0,c1,c2,c3);
	return rs;
}
Affine3d.mkTranslation = function (tr) {
	//debugger;
  let {x,y,z} = tr;
  let c0 = [1,0,0,0];
  let c1 = [0,1,0,0];
  let c2 = [0,0,1,0];
  let c3 = [x,y,z,1];
	let rs = Affine3d.mkFromCols(c0,c1,c2,c3);
	return rs;
}

Point3d.crossP  = function (v) {
	let u = this;
	let {x:ux,y:uy,z:uz} = u;
	let {x:vx,y:vy,z:vz} = v;
	let rx = uy*vz - vy*uz;
	let ry = uz*vx - vz*ux;
	let rz = ux*vy - vx*uy;
	return Point3d.mk(rx,ry,rz);
}
	
	
		


geomr.set("Plane",core.ObjectNode.mk()).__namedType();
let Plane = geomr.Plane;


Plane.mk = function (point,normal) {
  let rs = Object.create(Plane);
	rs.point = point;
	rs.normal = normal;
  return rs;
}

Plane.applyTransform = function (tr) {
 // debugger;
   let {point,normal} = this;
   let rt = tr.rotationOf();
   let npoint = point.applyTransform(tr);
   let nnormal = normal.applyTransform(rt);
   let npl = Plane.mk(npoint,nnormal);
   return npl;
}


Plane.toEquation = function () {
	let {point,normal} = this;
	let {x:a,y:b,z:c} = normal;
	let {x,y,z} = point;
	let d = -(a*x + b*y + c*z);
	return {a, b,c,d};
}
	


geomr.set("Line3d",core.ObjectNode.mk()).__namedType();
let Line3d = geomr.Line3d;


Line3d.mk = function (point,direction) {
  let rs = Object.create(Line3d);
	rs.point = point;
	rs.direction = direction;
  return rs;
}

Plane.intersect = function (line) {
	let {point:linePoint,direction} = line;
	let {x:px,y:py,z:pz} = linePoint
	let {x:dx,y:dy,z:dz} = direction;
	let equation = this.toEquation();
	let {a,b,c,d} = equation;
	let denominator = (a*dx+b*dy+c*dz);
	if (Math.abs(denominator) < 0.0002) {
		return null;
	}
	let t = -(a*px+ b*py + c*pz + d)/denominator;
	let rs = linePoint.plus(direction.times(t));
	return rs;
}

const toArray = function (ject) {
  let props = Object.getOwnPropertyNames(ject);
  let rs = props.map((p)=>{
    let v = ject[p];
    return v;
  });
  return rs;
}
//geomr.set("Cube",core.ObjectNode.mk()).__namedType();
geomr.set("Polyhedron",Object.create(Shape3d)).__namedType();
let Polyhedron = geomr.Polyhedron;

geomr.set("Cube",Object.create(Polyhedron)).__namedType();
let Cube = geomr.Cube;

const buildCubeRelations = function (wireframe) {
 // debugger;
  let faceVertices;
  let faceEdges;
  if (!wireframe) {
    {
      let mz= ['v000','v010','v110','v100'];
      let pz= ['v001','v011','v111','v101'];
      let my = ['v000','v001','v101','v100'];
      let py = ['v010','v011','v111','v110'];
      let mx = ['v000','v010','v011','v100'];
      let px = ['v100','v110','v111','v101'];
      faceVertices = {mz,pz,my,py,mx,px};
    }
    {
      let mz= ['e0v0','ev10','e1v0','ev00'];
      let pz= ['e0v1','ev11','e1v1','ev01'];

      let my= ['e00v','ev01','e10v','ev00'];
      let py= ['e01v','ev11','e11v','ev10'];

      let mx= ['e00v','e0v1','e01v','e0v0'];
      let px= ['e10v','e1v1','e11v','e1v0'];
      faceEdges = {mz,pz,my,py,mx,px};
    }
  }
  let ev00 =['v000','v100'];
  let e0v0 =['v000','v010'];
  let ev10 =['v010','v110'];
  let e1v0 =['v110','v100'];
 
  let ev01 =['v001','v101'];
  let e0v1 =['v001','v011'];
  let ev11 =['v011','v111'];
  let e1v1 =['v111','v101'];
  
  let e00v =['v000','v001'];
  let e01v =['v010','v011'];
  let e11v =['v110','v111'];
  let e10v =['v100','v101'];
  let edgeVertices = {ev00,e0v0,ev10,e1v0,ev01,e0v1,ev11,e1v1,e00v,e01v,e11v,e10v};
  if (wireframe) {
    return {edgeVertices};
  } else {
    return    {faceVertices,faceEdges,edgeVertices};
  }
}

Polyhedron.computeNumEdges = function () {
  let ev = this.relations.edgeVertices;
  let enms = Object.getOwnPropertyNames(ev);
  let ne = enms.length;
  return ne;
}

//Polyhedron.project = function (camera,transform) {
Polyhedron.project = function (camera) {
  //debugger;
  let transform = this.toGlobalCoords();
  let {wireframe:wf,relations:rel,lines,vertexShapes,lineP,vertexP} = this;
  let av = camera.axisVector;
  let feo = rel.faceEdges;
  let ev = rel.edgeVertices;
  let vs = this.vertices;
  let vps = Object.getOwnPropertyNames(vs);
  let npnts = vps.length;
  let tvs = transform.applyToCollection(vs);
  let planes  = this.planes;
  let sgs  =[];
  let faceNames = feo?Object.getOwnPropertyNames(feo):undefined;
  let edgeNames = Object.getOwnPropertyNames(ev);
  let ne = edgeNames.length;
  let edges = [];
  if (lines.length===0) {
    for (let i=0;i<ne;i++) {
      let line = lineP.instantiate();
      lines.push(line);
    }
  }
  if (vertexP && (vertexShapes.length ===0)) {
    for (let i=0;i<npnts;i++) {
      let vertexShape = vertexP.instantiate();
      vertexShapes.push(vertexShape);
    }
  }
  
  const addEdge = (en) => {
    if (edges.indexOf(en)===-1) {  
      let vnms = ev[en];
      let e0 = tvs[vnms[0]];
      let e1 = tvs[vnms[1]];
      let sg = Segment3d.mk(e0,e1);
      sgs.push(sg);
      edges.push(en);
    }
  };
  if (wf) {
    edgeNames.forEach((en) => {
      addEdge(en);
    });
  } else {
    
    faceNames.forEach( (fn) => {
      let es = feo[fn];
      let plane = planes[fn];
      let pn = plane.normal;
      if (pn.dotp(av)<0) {
        return;
      }
      es.forEach((e) => {
        addEdge(e);
      });
    });
  }
  for (let i=0;i<ne;i++) {
    let sg = sgs[i];
    let line = lines[i];
    let sg2d = sg.project(camera);
    //let sg2d = sg.project(camera,transform);
    line.setEnds(sg2d.end0,sg2d.end1);
    line.update();
  };
  if (vertexP) {
    for (let i=0;i<npnts;i++) {
      let vname = vps[i];
      let vrtx = tvs[vname];
      let vertexShape= vertexShapes[i];
      //let vrtx2d = vrtx.project(camera,transform);
      let vrtx2d = vrtx.project(camera);
      vertexShape.moveto(vrtx2d);
      vertexShape.update();
    }
  }
}

  

const cubeRelations = buildCubeRelations();
const wfCubeRelations = buildCubeRelations(1);

Cube.mk = function (dim,wireframe) {
  //debugger;
  let rs = Object.create(Cube);
	rs.dimension  = dim;
	let v = 0.5*dim;
  rs.wireframe = wireframe;
  if (!wireframe) {
	  let px = Plane.mk(Point3d.mk(v,0,0),Point3d.mk(1,0,0));
	  let mx = Plane.mk(Point3d.mk(-v,0,0),Point3d.mk(-1,0,0));
    let py = Plane.mk(Point3d.mk(0,v,0),Point3d.mk(0,1,0));
    let my = Plane.mk(Point3d.mk(0,-v,0),Point3d.mk(0,-1,0));
    let pz = Plane.mk(Point3d.mk(0,0,v),Point3d.mk(0,0,1));
    let mz = Plane.mk(Point3d.mk(0,0,-v),Point3d.mk(0,0,-1));
    rs.planes = {px,mx,py,my,pz,mz}
  }
  let v000 = Point3d.mk(-v,-v,-v);
  let v001 = Point3d.mk(-v,-v,v);
  let v010 = Point3d.mk(-v,v,-v);
  let v011 = Point3d.mk(-v,v,v);
  let v100 = Point3d.mk(v,-v,-v);
  let v101 = Point3d.mk(v,-v,v);
  let v110 = Point3d.mk(v,v,-v);
  let v111 = Point3d.mk(v,v,v);
  rs.vertices = {v000,v001,v010,v011,v100,v101,v110,v111};
  rs.relations = wireframe?wfCubeRelations:cubeRelations;
  rs.numEdges = rs.computeNumEdges();
  return rs;
}


Polyhedron.facePath = function (faceName) {
  let faceVs = this.relations.faceVertices;
  let faceV = faceVs[faceName]
  let vs = faceV.map((v) => {
    vertices[v];
  });
  return vs;
}
Polyhedron.faceEdges = function (faceName) {
  let faceEs = this.relations.faceEdges;
  let faceE = faceEs[faceName]
  return faceE;
}


   
      
Polyhedron.applyTransform = function (tr) {
  let rs = Object.create(Polyhedron);
  let {planes,vertices,relations} = this
  rs.vertices =tr.applyToCollection(vertices);
  if (planes) {
    rs.planes =tr.applyToCollection(planes);
  }
  rs.relations = relations;
  return rs;
}
   
Cube.within = function (p) {
	let dim = this.dimension;
	let v = 0.500001 * dim;
	let mv = -v;
	let {x,y,z} = p;
	let rs = (mv <= x) && (x <= v) && (mv <= y) && (y <= v) && (mv <= z) && (z <= v);
	return rs;
}

Cube.intersect = function (line) {
	let intersections = [];
  let sides = this.sides;
	sides.forEach((side) => {
	  let intr = side.intersect(line);
		if (intr && this.within(intr)) {
			intersections.push(intr);
		}
	});
	if (intersections.length !== 2) {
		debugger; //keep
	}
	let rs = Segment3d.mk(intersections[0],intersections[1]);
	return rs;
}
	
	
	

export {Point3d,Camera,Affine3d,Segment3d,Shape3d,Plane,Line3d,Cube,Polyhedron};

