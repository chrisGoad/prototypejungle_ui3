

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
  let ln = str.length;
  let n = ln -3;
  for (let i=0;i<=n;i++) {
    let bl = str.substring(i,i+3);
    let allC = 1;
    for (let j=0;j<3;j++) {
      let lt = bl[j];
      if (vowels.indexOf(lt) > -1) {
        allC = 0;
      }
    }
    if (allC) {
      return bl;
    }
  }
}

item.badBlend = function (str) {
//  debugger;
 //return 0;
  let bl = this.blend3(str);
  if (!bl) {
    return 0;
  }
  let okblends = ['thr','scr','spr','shr','spl','str','tch','nch'];
  if (okblends.indexOf(bl) > -1) {
   // console.log('okblend',bl);
   return 0;
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
   let {abet} = this;
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
item.wOk1 = function (str) {
  if (1 && this.badBlend(str)) {
    return 0;
  }
  if (str === 'sense') {
    debugger;
  }
  let ln = str.length;
  let possibles = this.possibles5;
  if (possibles.indexOf(str) > -1) {
    return 0;
  }
  let mlets = this.mandatory;
  let mln = mlets.length;
  let nme = mln-(5-ln);
  let nmf = 0;
  let fnd = '';
  if (nme >0) {
    for (let i=0;i<ln;i++) {
      let lt = str[i];
      if (mlets.indexOf(lt)>-1) {
        if (fnd.indexOf(lt) === -1) {
          fnd = fnd+lt;
          nmf++;
        }
      }
    }
  }
  let ok = nmf>=nme;
  /*
  if (ok && (ln===5)) {
    console.log('mlets',mlets,'str',str,'nme',nme,'mln',mln,'ln',ln,'fivemln',5-ln,'nmf',nmf,'ook',nmf>=nme);
  }*/
  if (nmf < nme) {
    return 0;
  }
  let dps = this.dprohibs;
  let prohibs = this.prohibs;
  let known = this.known;
  let strln = str.length;
  for (let i=0;i<strln;i++) {
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

item.wOk = function (str) {
  let ok = this.wOk1(str);
  let ln = str.length;
  if (ok) {
    if (ln === 5) {
      this.possibles5.push(str);
    } else if (ln===4) {
      this.possibles4.push(str);
    }
  } else {
 //   this.notPossibles.push(str);
  }
  return ok;
}
 
item.wgenAll = function (sofar) {
  if (this.acount > 10000000) {
    return;
  }
  let {noDups,possLets:plets,possibles5:p5,known} = this;
  let dr = this.removeDups(plets);
  let drln = dr.length;
  let ln = sofar.length;
  if (sofar === 'aaab') {
    debugger;
  }
  let ok = this.wOk(sofar);
  if (ln === 5) {
       return;
  }
  let lnp5 = p5.length;
  
  for (let i=0;i<drln;i++) {
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
  let {showPossibles4:p4,known,mandatory} = this;
  let plets = this.plets = ak?k:this.possLets;
  let k0 = known[0];
  this.wcount = 0;
  this.acount = 0;
  let rd = this.removeDups(plets);
  this.dupsRemoved = rd;
  let mln = mandatory.length;
  this.noDups = mln === 5;
  this.wgenAll('');
}

item.wgenffk = function (f4) {//first four known
  let {possLets} = this;
  let ln = possLets.length;
  for (let i=0;i<ln;i++) { 
    let lt = possLets[i];
    let pw = f4+lt;
    this.wOk(pw); 
  }
}
item.wgen4known = function (k) {
  let {possLets} = this;
  this.mandatory = k;  
  let ln = possLets.length;
  for (let i=0;i<ln;i++) {
    let lt = possLets[i];
    this.wgenTop(0,lt,k);
  }
}

item.wgen3known = function (k) {
  let {possLets:plets} = this;
  let ln = plets.length;
  for (let i=0;i<ln;i++) {
    let v = plets[i];
    console.log('TOP CHECK',v);
    this.wgen4known(v+k);
  };
}
  
item.tryFirsts4 = function (k) {
  let {possLets,known,prohibs} = this;
  debugger;
  this.mandatory = k;
  let phb0 = prohibs[0];
  let allowed = this.removeLetters(possLets,phb0);
  let ln = allowed.length;
  for (let i=0;i<ln;i++) {
    let ai = allowed[i];
    known[0] = ai;
    let aik = k+ai;
    let raik = this.removeDups(aik);
    let noDups = raik.length === 5;
    this.noDups = noDups;
    if (noDups) {
      this.wgenAllKnown(raik);
    } else {
      this.wgen4known(k);
    }
  }
} 
  
item.tryFirsts3 = function (k) {
  let {possLets,known,prohibs} = this;
  this.mandatory = k;
  let phb0 = prohibs[0];
  let allowed = this.removeLetters(possLets,phb0);
  let ln = allowed.length;
  for (let i=0;i<ln;i++) {
    let ai = allowed[i];
    known[0] = ai;
    this.wgen3known(k);
    
  }
}


item.wgenAllKnown = function (k) {
  this.mandatory = k;
  this.wgenTop(1,null,k);
}  

item.allFirstTwo = function () {
  let aft = [];
  let {abet} = this;
  for  (let i0 = 0;i0<26;i0++) {
    let L0 = abet[i0];
    for (let i1 = 0;i1<26;i1++) {
      let L1 = abet[i1];
      let w = ''+L0+L1;
      aft.push(w);
    }
  }
  debugger;
}

}
export {rs};
 
