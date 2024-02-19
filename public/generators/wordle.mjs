
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

rs.initializee = function () {
  debugger;
  let s0n = '';
  let s1n = 'o';
  let s2n = '';
  let s3n = 'nal';
  let s4n = 't';
  this.prohibs = [s0n,s1n,s2n,s3n,s4n];
  this.plets = 'onalt';

  this.addFrame();
  this.wgenTop();
}


rs.initialize = function () {
  debugger;
  let s0n = 's';
  let s1n = 'o';
  let s2n = '';
  let s3n = 'a';
  let s4n = '';
  this.prohibs = [s0n,s1n,s2n,s3n,s4n];
  let k0 = null;
  let k1 = null;
  let k2 = 'c';
  let k3 = null;
  let k4 = 't';
  this.known = [k0,k1,k2,k3,k4];
  this.plets = 'qtyasofghjkzxcbm';
  this.plets = 'tyasofghjkcbm';
  this.plets = 'socat';

  this.addFrame();
  this.wgenTop();
}


rs.initialize = function () {
  debugger;
  let s0n = 's';
  let s1n = '';
  let s2n = '';
  let s3n = 'a';
  let s4n = '';
  this.prohibs = [s0n,s1n,s2n,s3n,s4n];
  let k0 = null;
  let k1 = null;
  let k2 = 'c';
  let k3 = null;
  let k4 = null;
  this.known = [k0,k1,k2,k3,k4];
  this.plets = 'qtyasofghjkzxcbm';
 // this.plets = 'tyasofghjkcbm';
 // this.plets = 'socat';

  this.addFrame();
  this.wgenTop();
}


rs.initialize = function () {
  debugger;
  let s0n = '';
  let s1n = 'h';
  let s2n = '';
  let s3n = 'a';
  let s4n = 't';
  this.dprohibs  = ['jk','kj','bk','kb','jh','hj','mk','bj','jb','qq','qk','kq'];
  //this.dprohibs  = [];
  this.prohibs = [s0n,s1n,s2n,s3n,s4n];
  let k0 = 's';
  let k1 = null;
  let k2 = 'a';
  let k3 = null;
  let k4 = null;
  this.known = [k0,k1,k2,k3,k4];
  /*
  let row0 = 'qwertyuiop';
  let row1 = 'asdfghjkl';
  let row2 = 'zxcvbnm';
  */
  let row0 = 't';
  let row1 = 'ashjk';
 // let row2 = 'zxb';
  let row2 = 'bxz';
 this.plets = row0+row1+row2
 this.plets = 'abcdefghijklmnopqrstuvwxyz';
 this.plets = 'abhjkqstxz';

  this.addFrame();
  this.wgenTop();
}


rs.alphabetize =function (str) {
  let abet = 'abcdefghijklmnopqrstuvwxyz';
  let abz = '';
  for (let i=0;i<26;i++) {
    let x = abet[i];
    if (str.indexOf(x)>-1) {
      abz = abz+x;
    }
  }
  return abz;
}

rs.removeLetters = function (str,lets) {
  let rstr = '';
  if (typeof lets=== 'string') {
    let ln = str.length;;
    for (let i=0;i<ln;i++) {
      let etr = str[i];
      if (!(lets.indexOf(etr)>-1)) {
        rstr = rstr+etr;
      }
    }
  } else {
    rstr = str;
    let aln = lets.length;
    for (let i=0;i<aln;i++) {
      rstr = this.removeLetters(rstr,lets[i]);
    }
  }     
  return rstr;
}


 rs.complement = function (letset) {
   let abet = 'abcdefghijklmnopqrstuvwxyz';
   let cm = '';
   let ln = abet.length;
  for (let i=0;i<ln;i++) {
    let lt = abet[i];
    if (letset.indexOf(lt) === -1) {
      cm = cm+lt;
    }
  }
  return cm;
}
  
  rs.initialize = function () {
  debugger;
  let s0n = '';
  let s1n = '';
  let s2n = 'gr';
  let s3n = 'd';
  let s4n = '';
  this.dprohibs  = ['jk','kj','bk','kb','jh','hj','mk','bj','jb','qq','qk','kq','kh','fz','qp','pq','jl','lj'];
  //this.dprohibs  = [];
  this.prohibs = [s0n,s1n,s2n,s3n,s4n];
  let k0 = null;
  let k1 = 'r';
  let k2 = null;
  let k3 = 'c';
  let k4 = 'e';
  this.known = [k0,k1,k2,k3,k4];
  let row0 = 'qwertyuiop';
  row0 = 'qeryuip';
  let row1 = 'asdfghjkl'
  row1 = 'adfgjkl'
  let row2 = 'zxcvbnm';
  row2 = 'zxcvbn';
 // this.possLets = this.alphabetize(row0+row1+row2);
  this.possLets = this.alphabetize('abcdefghijklmnopqrstuvwxyz');
  let cm = this.complement('mghtwodsflukba');
  this.possLets = this.alphabetize(cm);
 // this.iplets = this.alphabetize('irce');
  this.addFrame();
  //this.wgenTop('b');
  this.wgen4known('irce');
  this.tries();
}


rs.tries = function () {
  let abet = 'abcdefghijklmnopqrstuvwxyz';
  debugger;
  //let rbet = this.removeLetters(abet,['stank','would','vicar','grime']);
  //let rbet = this.removeLetters(abet,['stank','would','vicar','beget']);
  this.addFrame();
  let rbets = [];
  let iputs = [];
  iputs.push(['spent','would','vicar']);
  iputs.push(['stank','would','vicar']);
  iputs.push(['stank','would','vicar','flesh']);
  iputs.push(['stank','would','vicar','flesh','blame']);
  iputs.push(['might','words','fluke']);
  iputs.push(['might','words','fluke','brace']);
  iputs.push(['spent','would','vicar']);
  let ln = iputs.length;
  for (let i=0;i<ln;i++) {
    let iput = iputs[i];
    let rm = this.removeLetters(abet,iput);
    console.log('iput',JSON.stringify(iput),'rm',rm);;
  }
}

 
export {rs};



