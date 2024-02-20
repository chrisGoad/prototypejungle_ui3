

const rs = function (item) {
/*
spent
vicar
would


let s0n = '';
let s1n = 'o';
let s2n = '';
let s3n = 'nal';
let s4n = 't';

let plets = 'onalt';

let notOk = [s0n,s1n,s2n,s3n,s4n];
*/


item.vowels = 'aeiouy';

item.blend3 = function (str) {
  let vowels = 'aeiouy';
  for (let i=0;i<3;i++) {
    let bl = str.substring(i,i+3);
    let allC = 1;
    for (let j=0;j<3;j++) {
      let lt = bl[j];
      if (vowels.indexOf(lt) > -1) {
        allC = 0;
        break;
      }
    }
    if (allC) {
      return bl;
    }
  }
}

item.badBlend = function (str) {
//  debugger;
 // return 0;
  let bl = this.blend3(str);
  let okblends = ['thr','scr','spr','shr','spl','str','tch'];
  if (okblends.indexOf(bl) > -1) {
    console.log('okblend',bl);
  } else {
    console.log('badblend',bl);
    return 1;
  }
}    
    
item.alphabetize =function (str) {
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

item.removeLetters = function (str,lets) {
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

 item.complement = function (letset) {
   let abet = 'abcdefghijklmnopqrstuvwxyz';
   let cm = this.removeLetters(abet,letset);
   return cm;
  // let cm = '';
   let ln = abet.length;
  for (let i=0;i<ln;i++) {
    let lt = abet[i];
    if (letset.indexOf(lt) === -1) {
      cm = cm+lt;
    }
  }
  return cm;
}
item.wOk = function (str) {
  if (this.badBlend(str)) {
    return 0;
  }
  let dps = this.dprohibs;
  if (str==='aiaaa') {
    debugger;
  }
  let prohibs = this.prohibs;
  let known = this.known;
  for (let i=0;i<5;i++) {
    let clet = str[i];
    let k = known[i];
    if (k && (k!== clet)) {
      return 0;
    }
    let cno = prohibs[i];
    if (cno.indexOf(clet) > -1) {
      return 0;
    }
  }
  let dln = dps.length;
  for (let i=0;i<dln;i++) {
    let dp = dps[i];
    if (str.indexOf(dp) > -1) {
      return 0;
    }
  }
  
  return 1;
}
 
item.wgenAll = function (sofar) {
  if (this.acount > 10000000) {
    return;
  }
  let noDups = this.noDups;
  let plets = this.plets;
  let pln = plets.length;
  let ln = sofar.length;
  if (ln === 5) {
   //console.log('check',sofar);
    if (sofar === 'ascot') {
       debugger;
    }
    if (this.wOk(sofar)) {
      console.log(this.acount,'ok',sofar);
      this.possibles.push(sofar);
      this.wcount++;
    }
    return;
  }
  for (let i=0;i<pln;i++) {
   // console.log(this.acount,'sfln',sfln,'i',i);
    this.acount++;
    let plet = plets[i];
    if (noDups && (sofar.indexOf(plet) > -1)) {
      continue;
    }
    let nxt = sofar+plet;
    this.wgenAll(nxt);
  }
}
// ak = all known
item.wgenTop = function (ak,lt,k) {
  this.plets = ak?k:(lt?k+lt:this.possLets);
  this.wcount = 0;
  this.acount = 0;
  let pln = this.plets.length;
  this.noDups = (pln === 5);
  let possibles = this.possibles = [];
  this.wgenAll('');
  console.log('possibles',possibles);
  console.log('count',possibles.length);
}

item.wgen4known = function (k) {
 
  let {possLets} = this;
  let ln = possLets.length;
  for (let i=0;i<ln;i++) {
   let lt = possLets[i];
   console.log('CHECK',lt);
   this.wgenTop(0,lt,k);
  }
}


item.wgenAllknown = function (k) {
   this.wgenTop(1,null,k);
}




  
  
  
}
export {rs};
 
