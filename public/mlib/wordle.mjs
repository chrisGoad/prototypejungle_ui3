

const rs = function (item) {



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

item.lettersAppearing = function (str0,str1) { //letters from string 0 that appear in string1
  let ln = str0.length;
  let la = '';
  for (let i=0;i<ln;i++) {
    let let0 = str0[i];
    if (str1.indexOf(let0) > - 1) {
      la = la+let0;
    }
  }
  return la;
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
 if (this.allowBadBlends) {
    return 0;
  }
  let bl = this.blend3(str);
  if (!bl) {
    return 0;
  }
  let okblends = ['thr','scr','spr','shr','spl','str','tch','nch','ntr','ngs','gst','lch','rsh','rch','xth'];
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
item.checkForKnown = function (str) {
  let known = this.known;
  let strln = str.length;
  for (let i=0;i<strln;i++) {
    let clet = str[i];
    let k = known[i];
    if (k && (k!== clet)) {
      return 0;
    }
  }
  return 1
}

item.checkForProhibs = function (str) {
 let prohibs = this.prohibs;
  let strln = str.length;
  for (let i=0;i<strln;i++) {
    let clet = str[i];
  
    let cno = prohibs[i];
    if (cno.indexOf(clet) > -1) {
      return 0;
    }
  }
  return 1;
}

item.checkForPossibles= function (str) {
   let ln = str.length;
  let possibles = this.possibles5;
  if (possibles.indexOf(str) > -1) {
    return 0;
  }
  return 1;
}

item.checkForMandatories = function (str) {
 let mlets = this.mandatory;
  let ln = str.length;
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
  return ok;
}

item.checkForDoubles= function (str) {
  let db = this.doubles;
  if (!db) {
    return 1;
  }
  const appears_twice = function (str,d) {
    let ln = str.length;
    let cnt = 0;
    for (let j=0;j<ln;j++) {
      let clet = str[j];
      if (clet === d) {
        cnt++;
      }
      if (cnt === 2) {
        return 1;
      }
    }
    return 0;
  }
  let dbln = db.length;
  for (let i=0;i<dbln;i++) {
    let d = db[i];
    if (!appears_twice(str,d)) {
      return 0;
    }
  }
  return 1;
}


item.wOk1 = function (str) {
 if (str.length ===5) {
  //debugger;
 }
 if (str === 'exac') {
    debugger;
  }
 if (this.badBlend(str)) {
    return 0;
  }
  if (!this.checkForDoubles(str)) {
    return 0;
  }
 // console.log('doubles',str);
  if (!this.checkForKnown(str)) {
    return 0;
  } 
  if (!this.checkForProhibs(str)) {
    return 0;
  }
  if (!this.checkForPossibles(str)) {
    return 0;
  }
  if (!this.checkForMandatories(str)) {
    return 0;
  }
  return 1;
}

item.wOk11 = function (str) {
  if (1 && this.badBlend(str)) {
    return 0;
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
  }  if (str.length === 5) {
    console.log('str',str);
   // debugger;
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
  let {beenChecked} = this;
  if (0 && beenChecked.indexOf(str)>-1) {
    console.log('beenChecked ',str)
    return 0;
  }
  if (str==='mulch') {
     debugger;
  }
  let ok = this.wOk1(str);
  beenChecked.push(str);
  //console.log('ok1',str,'=',ok);
  //if (str.substring(0,3)==='faz') {
  if (str==='fazzz') {
    debugger;
  }
  
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
  if (sofar === 'mulc') {
    console.log('sofar',sofar);
    //debugger;
  }
  if (this.acount > 10000000) {
    return;
  }
  let {noDups,possLets:plets,possibles5:p5,known} = this;
  let dr = this.removeDups(plets);
  let drln = dr.length;
  let ln = sofar.length;
  if (sofar === 'seeps') {
   // debugger;
  }
  let ok = this.wOk(sofar);
  if (!ok) {
    return;
  }
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
  if (!mandatory) {
   // debugger;
  }
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
//  this.mandatory = k;
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
    //console.log('TOP CHECK 3 known',v);
   // debugger;
    this.wgen4known(v+k);
  };
}

item.wgen2known = function (k) {
  let {possLets:plets} = this;
  let ln = plets.length;
  for (let i=0;i<ln;i++) {
    let v = plets[i];
  //  console.log('TOP CHECK 2 known',v);
    this.wgen3known(v+k);
  };
}


item.wgen1known = function (k) {
  let {possLets:plets} = this;
  let ln = plets.length;
  for (let i=0;i<ln;i++) {
    let v = plets[i];
  // console.log('TOP CHECK 2 known',v);
    this.wgen2known(v+k);
  };
}
  
item.tryFirsts4 = function (k) {
  let {possLets,known,prohibs} = this;
  let k0 = known[0];
 // debugger;
  let phb0 = prohibs[0];
  let allowed = this.removeLetters(possLets,phb0);
  if (k0) {
    this.wgen4known(k);
    return;
  }
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

item.tryFirsts5 = function (k) {
  this.wgenAllKnown(k);
}

  
item.tryFirsts3 = function (k) {
  let {possLets,known,prohibs} = this;
  let phb0 = prohibs[0];
  let allowed = this.removeLetters(possLets,phb0);
  let ln = allowed.length;
  for (let i=0;i<ln;i++) {
    let ai = allowed[i];
    known[0] = ai;
    this.wgen3known(k);
    
  }
}

  
item.tryFirsts2 = function (k) {
  let {possLets,known,prohibs} = this;  
  let phb0 = prohibs[0];
  let allowed = this.removeLetters(possLets,phb0);
  let ln = allowed.length;
  for (let i=0;i<ln;i++) {
    let ai = allowed[i];
    known[0] = ai;
    this.wgen2known(k);
    
  }
}


item.tryFirsts1 = function (k) {
  let {possLets,known,prohibs} = this;  
  let phb0 = prohibs[0];
  let allowed = this.removeLetters(possLets,phb0);
  let ln = allowed.length;
  for (let i=0;i<ln;i++) {
    let ai = allowed[i];
    known[0] = ai;
    this.wgen1known(k);
    
  }
}

item.tryFirsts =  function () {
  let {known,prohibs} = this;
  debugger;
  let k0 = known[0];
  let k = '';
  let st = k0?1:0;
  for (let i=st;i<5;i++) {
    let kn = known[i];
    if (kn) { 
      k=k+kn;
    }
  };
  prohibs.forEach((ph) => {
    if (ph) { 
      k=k+ph;
    }
  });
 // debugger;
  k = this.removeDups(k);
  //console.log('k',k);
  this.mandatory = k;
  let ln = k.length;
  if (k0) {
    if (ln ===1) {
      this.wgen1known(k);
    } else if (ln ===2) {
      this.wgen2known(k);
    } else if (ln ===3) {
      this.wgen3known(k);
    } else if (ln === 4) {
      this.wgen4known(k);
    } else if (ln===5) {
      this.wgenAllKnown(k);
    } else {
      console.log('k',k, ' is too short');
    }
  } else {
    if (ln ===1) {
      this.tryFirsts1(k);
    } else if (ln ===2) {
      this.tryFirsts2(k);
    } else if (ln ===3) {
      this.tryFirsts3(k);
    } else if (ln === 4) {
      this.tryFirsts4(k);
    } else if (ln===5) {
      this.tryFirsts5(k);
    } else {
      console.log('k',k, ' is too short');
    }
  }
}
item.wgenAllKnown = function (k) {
  //this.mandatory = k;
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
  //debugger;
}

item.stdWords = ['farce','gusty','blind', 'chomp','awake'];

item.includedLets = function () {
  let inc = '';
  let {prohibs,known} = this;
  for (let i =0;i<5;i++) {
    inc = inc+prohibs[i];
    inc = inc+known[i];
  }
  return inc;
}

item.icomp= function (n) {
  //debugger;
  let exl = '';
  let abet = 'abcdefghijklmnopqrstuvwxyz';
  let {stdWords} =this;
  let inc = this.includedLets();
  for (let i=0;i<n;i++) {
    let csw = stdWords[i]
    exl = exl + this.removeLetters(csw,inc);
  }
  return this.complement(exl);
}
  
 
}
export {rs};
 