
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
  this.tries();
  return;
  // prohibited letters at each position
  let s0n = '';
  let s1n = '';
  let s2n = 'gr';
  let s3n = 'd';
  let s4n = '';
  this.prohibs = [s0n,s1n,s2n,s3n,s4n];

  // prohibited dipthongs
  this.dprohibs  = ['jk','kj','bk','kb','jh','hj','mk','bj','jb','qq','qk','kq','kh','fz','qp','pq','jl','lj'];
  // known letters
  let k0 = '';
  let k1 = 'r';
  let k2 = '';
  let k3 = 'c';
  let k4 = 'e';
  this.known = [k0,k1,k2,k3,k4];
  let cm = this.complement('mghtwodsflukba');
  // possible letters
  this.possLets = this.alphabetize(cm);
  this.addFrame();
  //this.wgenTop();
  this.wgen4known('irce');
 // this.wgenAllknown('ircep');
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
  const checkBlend = (str) => {
    let bl = this.blend3(str);
    if (bl) {
     console.log('BLEND',bl);
    } else {
     console.log('NO BLEND');
    }
  }
  this.wOk('astry');
 
  //checkBlend('aibfo');
  //checkBlend('aibfd');
}
       

 
export {rs};



