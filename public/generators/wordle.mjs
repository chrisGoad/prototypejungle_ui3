
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addWordleMethods} from '/mlib/wordle.mjs';

let rs = basicP.instantiate();


addWordleMethods(rs);

rs.setName('wordle');
let ht=50;


let topParams = {width:ht,height:ht,angleOffset:0*Math.PI/10,framePadding:-0.1*ht,frameStroke:'white',frameStrokeWidth:.2,
timePerStep:1/(16*32),stopTime:1,recordingMotion:1,saveAnimation:1,distanceThreshold:3,
    circleRadius:.2,nearestFadeFactor:20,shapesPerPath:200,speed:1,segsPerCircle:20,radius:.4*ht,numSlices:8,bendRadius:1.5};

Object.assign(rs,topParams);







  
  rs.initialize = function () {
  debugger;
  this.doubles ='';
   this.allowBadBlends = 0;

  // prohibited letters at each position
  let s0n = '';
  let s1n = '';
  let s2n = '';
  let s3n = 'n';
  let s4n = 'd';
  this.prohibs = [s0n,s1n,s2n,s3n,s4n];

  // prohibited dipthongs
  // prohibited dipthongs
  this.dprohibs  = [];
  // known 
  let k0 = '';
  let k1 = 'a';
  let k2 = 'n';
  let k3 = 'd';
  let k4 = 'y'
  this.known = [k0,k1,k2,k3,k4];
  this.notPossibles = [];
  this.possibles5 = [];
  this.possibles4 = [];
  let inc = this.includedLets();
  console.log('inc',inc);
  let abet=this.abet = 'abcdefghijklmnopqrstuvwxyz';
  let cm;
  cm = this.icomp(3);
  console.log('cm',cm);
  let cm2 = this.complement('farce gusty blind chomp' );
 // cm2 = this.complement('farce nymph quick ghost blend');//bleed
  let cm3 = this.complement( 'farce bough clamp winds');//bleed
 // cm2 = this.complement('farce nymph blind ghost vowel');
    console.log('cm2',cm2);
    console.log('cm3',cm3);
//return;

 // cm = this.complement('palms choke blind rusty xz');
  //cm = this.complement('farce gusty blind chomp vowel');
  //cm = this.complement('fare gsty bind');// chomp vowel');
  
 
 
 
 
console.log('cm',cm);
 // let abet=this.abet = 'fjqvxyz';
//  let cm = this.complement('might clasp brief wound');
//  let cm = this.complement('parse might wound black');
  // possible letters
  let possLets =this.possLets = this.alphabetize(cm);
  this.addFrame();
 this.tryFirsts();
  console.log('possibles5',this.possibles5);
  let prm = this.removeLetters(possLets,this.mandatory);
  console.log('prm',prm);
}

/*
  rs.initializeee = function () {
  debugger;
//  this.tries();
  //return;
  // prohibited letters at each position

  this.doubles ='';
  let s0n = '';
  let s1n = '';
  let s2n = 's';
  let s3n = 'n';
  let s4n = 'e';
  this.prohibs = [s0n,s1n,s2n,s3n,s4n];

  // prohibited dipthongs
  this.dprohibs  = []//['jk','kj','bk','kb','jh','hj','mk','bj','jb','qq','qk','kq','kh','fz','qp','pq','jl','lj'];
  // known letters
  let k0 = '';
  let k1 = '';
  let k2 = '';
  let k3 = '';
  let k4 = '';
  this.known = [k0,k1,k2,k3,k4];
  this.notPossibles = [];
  this.possibles5 = [];
  this.possibles4 = [];
  let abet=this.abet = 'abcdefghijklmnopqrstuvwxyz';
 // this.tries();
 // return;
  //let cm = abet;
//  let cm = this.complement('might clasp brief wound');
  let cm = this.complement('mht casp');//brief wound');
  // possible letters
  this.possLets = this.alphabetize(cm);
  this.addFrame();
  //this.wgenffk('pipe');
  //this.first4 = 'pipe';
  //this.wgenTop();
  // this.showPossibles4 = 1;
  //this.wgen3known('ort');
 // return;
 // let tc = cm[4];
 // console.log('TOP CHECK',tc);
 //debugger;
 //this.wgen4known('fort');
 this.allowBadBlends = 0;
 this.tryFirsts('gil');
  //this.wgenAllKnown('aml');
  //this.tries();
  
  console.log('possibles4',this.possibles4);
  console.log('possibles5',this.possibles5);
  console.log('not possibles',this.notPossibles);
}


rs.tries = function () {
  let abet = 'abcdefghijklmnopqrstuvwxyz';
  debugger;
  //let rbet = this.removeLetters(abet,['stank','would','vicar','grime']);
  //let rbet = this.removeLetters(abet,['stank','would','vicar','beget']);
  this.addFrame();
  let rbets = [];
  let iputs = [];
  iputs.push(['spent','would','vicar']); // 3 11
  iputs.push(['stank','would','vicar']);
  iputs.push(['stank','would','vicar','flesh']);
  iputs.push(['stank','would','vicar','flesh','blame']);
  iputs.push(['might','words','fluke']);
  iputs.push(['might','words','fluke','brace']);
  iputs.push(['might','words','fluke','bunch','plays']);
  iputs.push(['might','clasp','wound']);
  iputs.push(['might','clasp','brief']); // 3 12
  iputs.push(['might','clasp','brief','wound']);//4 7 this one
  iputs.push(['might','clasp','wound','grove']);
  iputs.push(['crane','sloth','fluid']);
  iputs.push(['crane','sloth','fluid','bagle']);
  iputs.push(['spent','would','vicar']);
  let ln = iputs.length;
  for (let i=0;i<ln;i++) {
    let iput = iputs[i];
    let rm = this.removeLetters(abet,iput);
    console.log('iput',JSON.stringify(iput),'rm',rm,'iln',iput.length,'rln',rm.length);;
  }
  const checkBlend = (str) => {
    let bl = this.blend3(str);
    if (bl) {
     console.log('BLEND',bl);
    } else {
     console.log('NO BLEND');
    }
  }
 // this.wOk('astry');
 
  //checkBlend('aibfo');
  //checkBlend('aibfd');
}

// the data structure
//{segs0,segs1,ints, intsBySeg0,intsBySeg1 } where each int has the form has the form {point,segNum0,segNum1} where the point is the intersection
//of the two given segs, one from pgon0 the other from pgon1 
rs.lineSegsOfPgon = function (pgon) {
  let ln = pgon.length;
  let segs = [];
  for (let i=0;i<=ln;i++) {
    let p0=pgon[i];
    let p1 = pgon[(i+1)%ln];
    let ls=LineSegment.mk(p0,p1);
    segs.push(ls);
  }
  return segs;
}


rs.orderInts = function (seg,ints) {
  let end0 = seg.end0;
  ints.sort((int0,int1) => {
    let d0 = p0.distance(end0);
    let d1 = p1.distance(end0);
    if (d0<d1) { 
      return -1;
    } else if (d0===d1) {
      return 0;
    } else {
      return 1;
    }
  });
}

rs.intersectionsOfSegWithSegs = function (seg,segNum0,segs) {
  let ln = segs.length;
  let ints = [];
  for (let i=0;i<ln;i++) {
    let p = seg.intersect(segs[i]);
    if (p) { 
      ints.push({point:p,segNum0:segNum0,segNum1:i});
    }
  }
  this.orderInts(ints);
  return ints;
}

rs.insidePgon = function (p,segs) {
  let ln = segs.length;
  for (let  i=0;i<ln;i++) {
    let seg = segs[i];
    let {end0,end1} = seg;
    let v0 = end.difference(e0);
    let nv0 = v0.normal();
    let vtp = p.difference(e);
    let d = vtp.dotp(nv0);
    if (d<0) {
      return 0;
    }
  }
  return 1;
}   
    

  
rs.intersectionsOfSegsWithSegs = function (segs0,segs1) {
  let ln = segs0.length;
  let segis = [];
  for (let i=0;i<ln;i++) {
    let seg = segs0[i];
    let sgi = this.intersectionOfSegWithSegs(seg,segs1);
    segis.push(sgi);
  }
  return segis;
}
    
      
rs.intersectPolygons = function (pgon0,pgon1) {
  let segs0 = this.lineSegsOfPgon(pgon0);
  let segs1 = this.lineSegsOfPgon(pgon1);
  let ln0 = segs0.length;
  let ln1= segs1.length;
  let segi0 
}
       
*/
 
export {rs};


