

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

item.removeDups = function (str) {
  let rd = '';
  let ln = str.length;
  for (let i=0;i<ln;i++) {
    let lt = str[i];
    if (rd.indexOf(lt)===-1) {
      rd = rd+lt;
    }
  }
  return rd;
}

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
  if (!bl) {
    return 0;
  }
  let okblends = ['thr','scr','spr','shr','spl','str','tch'];
  if (okblends.indexOf(bl) > -1) {
   // console.log('okblend',bl);
   
  } else {
   // console.log('badblend',bl);
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
  if (1 && this.badBlend(str)) {
    return 0;
  }
  let ln = str.length;
  if (ln === 5) {
    let mlets = this.mandatory;
    if (mlets) {
      let mln = mlets.length;
      for (let i=0;i<mln;i++) {
        let lt = mlets[i];
        if (str.indexOf(lt) === -1) {
          return 0;
        }
      }
    }
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
  let {noDups,plets,dupsRemoved:dr} = this;
 
  let drln = dr.length;
  let ln = sofar.length;
  if (ln === 5) {
   //console.log('check',sofar);
    if (sofar === 'apart') {
       debugger;
    }
    if (this.wOk(sofar)) {
     // console.log(this.acount,'ok',sofar);
      this.possibles.push(sofar);
      this.wcount++;
    }
    return;
  }
  for (let i=0;i<drln;i++) {
   // console.log(this.acount,'sfln',sfln,'i',i);
    this.acount++;
    let lt = dr[i];
    if (noDups && (sofar.indexOf(lt) > -1)) {
      continue;
    }
    let nxt = sofar+lt;
    this.wgenAll(nxt);
  }
}
// ak = all known
item.wgenTop = function (ak,lt,k) {
  let plets = this.plets = ak?k:(lt?k+lt:this.possLets);
 // debugger;
  this.wcount = 0;
  this.acount = 0;
  let rd = this.removeDups(plets);
  this.dupsRemoved = rd;
  let pln = plets.length;
  if (pln === 5) {
    this.mandatory = rd;
  }
  //this.noDups = (pln === 5);
  this.noDups = 0;
  let possibles = this.possibles = [];
  this.wgenAll('');
  //console.log('possibles',possibles);
  //console.log('count',possibles.length);
}

item.wgen4known = function (k) {
  let {possLets} = this;
  console.log('possLets',possLets);
  let ln = possLets.length;
  for (let i=0;i<ln;i++) {
    let lt = possLets[i];
    if (lt === 'p') {
      debugger;
    }
    console.log('CHECK',lt);
 //   this.known[0] = lt;
    this.wgenTop(0,lt,k);
    let posb=this.possibles;
    if (posb.length) {
      console.log(posb);
    }
  }
}

item.wgen3known = function (k) {
  let {possLets:plets} = this;
  console.log('possLets',plets);
  let ln = plets.length;
  for (let i=0;i<ln;i++) {
    let v = plets[i];
    console.log('TOP CHECK',v);
    this.wgen4known(v+k);
  };
 // console.log(this.possibles);
}
  


item.wgenAllknown = function (k) {
   this.wgenTop(1,null,k);
}




  
  
  
}
export {rs};
 
