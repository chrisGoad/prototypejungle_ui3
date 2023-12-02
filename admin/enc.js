

function inb(n,lb,ub) {
  return ((lb <= n) && (n <= ub));
}

function bir(n,lb,ub,b) {
  var rs = n + b;
  if (rs > ub) rs = lb + (rs - ub) - 1;
  else if (rs < lb) rs = ub + 1 - (lb - rs);
  return rs;
}

function enc(c,b) {
 var cc = c.charCodeAt(0);
 if (inb(cc,97,122)) rs = bir(cc,97,122,b); else
 if (inb(cc,65,90)) rs = bir(cc,65,90,b); else
 if (inb(cc,48,57)) rs = bir(cc,48,57,b); else
 return c;
 return String.fromCharCode(rs);
}

function cenc(c,b) {
  return enc(enc(c,b),-b);
}

function digits(n) {
  var s = n + "";
  var rs = [];
  var ln = s.length;
  for (var i=0;i<ln;i++) {
    var cc = s.charCodeAt(i);
    rs.push(cc-48);
  }
  return rs;
}


function ecs(s,n,dc) {
  var d = digits(n);
  var dln = d.length;
  var rs = "";
  var ln = s.length;
  for (var i=0;i<ln;i++) {
    var b = d[i%dln];
    if (dc) b = -b;
    rs += enc(s.charAt(i),b);
  }
  return rs;
}

function dcs(s,n) {
 return ecs(s,n,true);
}

function cecs(s,n) {
  var c = ecs(s,n);
  console.log(c);
  var rs = dcs(c,n);
  if (rs == s) console.log("OK"); else console.log("ERROR ERROR ERROR");
  return rs;
}

function dc(s) {
  return dcs(s,pp); 
}

function ec(s) {
  return cecs(s,pp);
}