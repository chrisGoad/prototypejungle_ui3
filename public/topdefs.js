
let graph = {};
graph.installCirclePeripheryOps = () => {};
let ui = {};
ui.hide = () => {};
let svg;
let {core,geom,dom,draw}=Window;
if (dom) {
	svg = dom.svg;
}
let codeRoot=core.codeRoot,root=core.root,Point=geom.Point,LineSegment=geom.LineSegment,Arc=geom.Arc,Circle=geom.Circle,Point3d=geom.Point3d,Affine3d=geom.Affine3d,Line=geom.Line,
Segment3d=geom.Segment3d,Shape3d=geom.Shape3d;Line3d=geom.Line3d;Plane=geom.Plane;Cube=geom.Cube;Rectangle=geom.Rectangle,Polygon=geom.Polygon,oneDf=geom.oneDf,
geometriesIntersect=geom.geometriesIntersect,allSegmentIntersections=geom.allSegmentIntersections,Transform=geom.Transform,Polyhedron=geom.Polyhedron,
ObjectNode=core.ObjectNode,ArrayNode = core.ArrayNode,
mkRotation=geom.mkRotation,mkContainerShape = () => svg.Element.mk('<g/>');mkArrayShape = () => core.ArrayNode.mk(),
arrayShape = core.ArrayNode,containerShape=svg.Element,setBackgroundColor = (clr) => core.root.backgroundColor = clr;


core.afterLoadTop();
