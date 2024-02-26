

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
   // console.log('str',str,'mlets',mlets,'nmf',nmf,'nme',nme,'fnd',fnd);
  //  debugger;
  }
  if (nmf < nme) {
    return 0;
  }
  if (nme>0) {
    //debugger;
  }
  let dps = this.dprohibs;
  if (str==='aiaaa') {
    debugger;
  }
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
 
item.wgenAll = function (sofar) {
  if (this.acount > 10000000) {
    return;
  }
  if (sofar === 'e') {
   debugger;
  }
  //let {noDups,possLets:plets,dupsRemoved:dr} = this;
  let {noDups,possLets:plets,possibles5:p5,known} = this;
  let dr = this.removeDups(plets);
 
  let drln = dr.length;
  let ok = this.wOk(sofar);
  if (!ok) {
    return;
  }
  let ln = sofar.length;
  if (ln === 5) {
   //console.log('check',sofar);
    if (sofar === 'apart') {
      // debugger;
    }
     // console.log(this.acount,'ok',sofar);
    this.possibles5.push(sofar);
    this.wcount++;
    return;
  }
  let lnp5 = p5.length;
  
  for (let i=0;i<drln;i++) {
   // console.log(this.acount,'sfln',sfln,'i',i);
    this.acount++;
    let lt = dr[i];
    if (noDups && (sofar.indexOf(lt) > -1)) {
      continue;
    }
    let nxt = sofar+lt;
    if (nxt === 'ee') {
      debugger;
    }
    let nxtOk = this.wOk(nxt);
    if ((known[0] === 'e') && nxtOk) {
     // console.log('nxt',nxt);
    }
    if (nxtOk) {
      this.wgenAll(nxt);
    }
  }
  let nlnp5 = p5.length;
  if ((ln === 4) && (nlnp5>lnp5)) {
    this.possibles4.push(sofar);
  }
}
// ak = all known
item.wgenTop = function (ak,lt,k) {
  let {showPossibles4:p4,known} = this;
  let plets = this.plets = ak?k:(lt?k+lt:this.possLets);
  let k0 = known[0];
  if ((k0 === 'e')&&(lt ==='b')) {
     debugger;
  }
  this.wcount = 0;
  this.acount = 0;
  let rd = this.removeDups(plets);
  this.dupsRemoved = rd;
  let rdln = rd.length;
  let pln = plets.length;
  if (pln === 5) {
    this.mandatory = rd;
    if (lt && (rd.indexOf(lt) === -1)) {
      debugger;
      return;
    }
  }
  this.noDups = (rdln === 5);
  //this.noDups = 0;
  let possibles4 = this.possibles4 = [];
  let possibles5 = this.possibles5 = [];
  //debugger;
  this.wgenAll('');
  let posb=p4?this.possibles4:possibles5;
  if (posb.length===1) {
    debugger;
  }
  if (posb.length>0) {
   // console.log(this.checkStr);
    console.log('lt',lt,'p4',p4,'possibles',posb);
  }
  //console.log('possibles',possibles);
  //console.log('count',possibles.length);
}

item.wgenffk = function (f4) {//first four known
  let {possLets} = this;
  let ln = possLets.length;
  for (let i=0;i<ln;i++) { 
    let lt = possLets[i];
    let pw = f4+lt;
    if (this.wOk(pw)) {
      console.log('pw',pw);
    }
  }
}
item.wgen4known = function (k) {
  let {possLets} = this;
  console.log('possLets',possLets);
 
  let ln = possLets.length;
  for (let i=0;i<ln;i++) {
    let lt = possLets[i];
    if (lt === 'p') {
     // debugger;
    }
    this.checkStr = 'CHECK '+lt;
    //console.log('CHECK',lt);
 //   this.known[0] = lt;
    this.wgenTop(0,lt,k);
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
  
item.tryFirsts4 = function (k) {
  let {possLets,known,prohibs} = this;
  debugger;
  let phb0 = prohibs[0];
  let allowed = this.removeLetters(possLets,phb0);
  let ln = allowed.length;
  for (let i=0;i<ln;i++) {
    let ai = allowed[i];
    if (ai==='e') {
      debugger;
    }
    known[0] = ai;
    let aik = k+ai;
    let raik = this.removeDups(aik);
    let noDups = raik.length === 5;
    this.noDups = noDups;
    console.log('FIRST',ai);
    if (noDups) {
      this.wgenAllKnown(raik);
    } else {
      this.wgen4known(k);
    }
  }
}


item.wgenAllKnown = function (k) {
  console.log('k',k);
   this.wgenTop(1,null,k);
   let p5 = this.possibles4;
   let p4 = this.possibles5;
   //console.log('possibles5',p5);
   //console.log('possibles4',p4);
}




  
  
  
}
export {rs};
 
