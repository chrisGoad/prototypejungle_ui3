import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as generatorP} from '/generators/motion_0.mjs'
let rs = generatorP.instantiate();

rs.setName('motion_4');
let ht=50;

let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStroke:'rgb(2,2,2)',frameStrokeWidth:.2,timePerStep:1,stopTime:5023,recordingMotion:1,
    shapesPerRing:[],circleRadius:.2,currentTime:0,
    ringRadii:[.5*ht,.45*ht,.4*ht,.35*ht,.3*ht,.25*ht,.2*ht,.15*ht],
    speeds:[[]],masses:[[]],initialAngles:[[]],toAngle:2*Math.PI};

Object.assign(rs,topParams);

/* particle
{ring,radius,indexInRing,currentAngle,speed,mass,index,initialAngle}

for each ring, a nextCollision is maintained of the form
{index0,index1,time}
it is updated at each step where the collision on that ring occurs before the next step
*/




rs.initProtos = function () {
  let {circleRadius:cr} =this;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.radius = cr;
  circleP['stroke-width'] = 0;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = .2; 
}

rs.buildParticles = function () {
  let {ringRadii,shapesPerRing:spr,speeds,masses,initialAngles:ias,particles,particlesByRing:pbr}= this;
  let nr = ringRadii.length;
  let cindex = 0;
  for (let i=0;i<nr;i++) {
    let ptr = []; // particles this ring
    pbr[i] = ptr;
    let rspeeds = speeds[i];
    let rmasses = masses[i];
    let rnumShapes = spr[i];
    let rias = ias[i];
    let radius = ringRadii[i];
    for (let j = 0;j<rnumShapes;j++) {
      let particle = {index:cindex++,ring:i,radius,indexInRing:j,speed:rspeeds[j],mass:rmasses[j],initialAngle:rias[j],initialTime:0}
      particles.push(particle);
      ptr.push(particle);
    }
  }
  //return particles;
}

rs.uniformArray = function (v,n) {
  let a =  [];
  for (let i=0;i<n;i++) {
    a.push(v);
  }
  return a;
}
rs.steppedArray = function (upTo,n) {
  let inc = upTo/n;
  let a = [];
  for (let i=0;i<n;i++) {
    a.push(inc*i);
  }
  return a;
}
rs.buildUniformArrays  = function (params) {
  let {ringRadii} = this;
  let {speed,mass,shapesPerRing:spr} =params;
  let nr = ringRadii.length;
  let spra = [];
  let speeda = [];
  let massa = [];
  let initialAngles = this.steppedArray(2*Math.PI,spr);
  let speeds = this.uniformArray(0,spr);
  speeds[0] =speed;
  let masses = this.uniformArray(mass,spr);
  let iaa = [];
  for (let i=0;i<nr;i++) {
    spra.push(spr);
    speeda.push(speeds);
    massa.push(masses);
    iaa.push(initialAngles);
  }
  this.shapesPerRing = spra;  
  this.speeds = speeda;  
  this.masses = speeda;  
  this.initialAngles = iaa;
}

   
rs.buildShapes = function () {
  let {shapes,particles,circleP} = this;
  let np = particles.length;
  for (let i = 0;i<np;i++) {
    let p = particles[i]
    let crc = circleP.instantiate();
    crc.particle = p;
    p.shape = crc;
    shapes.push(crc);
  }
}

rs. updateAngle = function (particle,t) {
  let {initialAngle,initialTime,speed} = particle;
  let deltaT = t-initialTime;
  let deltaA = speed*deltaT;
  particle.currentAngle = initialAngle+deltaA;
}

rs.updateAngles = function (t) {
  let {particles} = this;   
  particles.forEach( (p) => this.updateAngle(p,t));
}

rs.displayPosition  = function (particle) {
  let {shape,currentAngle:a,radius:r} = particle;
  debugger;
  let p = Point.mk(r*Math.cos(a),r*Math.sin(a));
  shape.moveto(p);
}


rs.displayPositions = function () {
  let {particles} = this;   
  particles.forEach( (p) => this.displayPosition(p));
}

rs.approaching = function (p0,p1) {
}
rs.nextParticleCollision = function (particle) {
  let {currentTime,shapesPerRing,particles,particlesByRing:pbr}  = this;
  let {ring,indexInRing:iir,speed,mass,currentAngle:ca} = particle;
  let str = shapesPerRing[ring];// shapes this ring
  let ptr = pbr[ring];// particles this ring
  let nxti = (iir+1)%str;
  let prvi = iir?iir-1?str-1;
  nxtp = ptr[nxti];
  prvp = ptr[prvi];
}
rs.onUpdate = function () {
  let {stepsSoFar:ssf,currentTime:t} = this;
  console.log('steps',ssf,'time',t);
  //let nrp = this.computeNearestPositions(positions);
  this.updateAngles(t);
  this.displayPositions();
}
   
rs.initialize = function () {
   debugger;
   this.initProtos();
  this.addFrame();
  this.set('shapes',arrayShape.mk());
  this.set('lines',arrayShape.mk());
  this.buildUniformArrays({speed:.2,mass:2,shapesPerRing:8});
  this.particles = [];
  this.particlesByRing = [];
  this.buildParticles();
  this.buildShapes();
  //this.updatePositions(0);
}


rs.updateState = function () {
  debugger;
  let {stepsSoFar:ssf} = this;
  let t =  this.currentTime = ssf;
  console.log('steps',ssf,'time',t);
  //let nrp = this.computeNearestPositions(positions);
  this.updateAngles(t);
  this.displayPositions();
}
export {rs};



