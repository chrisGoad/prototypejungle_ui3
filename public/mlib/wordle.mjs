

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

item.wOk = function (str) {
  if (str === 'tacos') {
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
  return 1;
}
 
item.wgenAll = function (sofar) {
  if (this.acount > 100000) {
    return;
  }
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
      this.wcount++;
    }
    return;
  }
  for (let i=0;i<pln;i++) {
   // console.log(this.acount,'sfln',sfln,'i',i);
    this.acount++;
    let plet = plets[i];
    if (sofar.indexOf(plet) > -1) {
      continue;
    }
    let nxt = sofar+plet;
    this.wgenAll(nxt);
  }
}

item.wgenTop = function () {
  this.wcount = 0;
  this.acount = 0;
  this.wgenAll('');
  console.log('count',this.wcount);
}



  
  
  
}
export {rs};
 
