
var fs = require('fs');
let xferImages = process.argv[2];
let dir = 'public/images/std_size';
console.log('dir',dir);
let dirc =fs.readdirSync(dir);
console.log('dirc',dirc);

 const xferFile = function(dir,ifl,iofl) {
    let ofl = iofl?iofl:ifl;
   let ipath = dir+'/'+ifl; 
    //var vl = fs.readFileSync(ipath).toString();
    let opath = '../kop/'+dir+'/'+ofl;
    console.log('copying ',ipath,' to ',opath);
    fs.copyFileSync(ipath, opath);
   
  }
let ln = dirc.length;
let outp = 'module.exports = { sections:[ \n'
for (let i=0;i<ln;i++ ) {
  let di  = dirc[i];
console.log(i,di);
  let dis = di.split('.');
  let ext = dis[1];
  let fln = dis[0];
  console.log('i',i,'dis',dis,'fln',fln,'ext',ext);
  let kind = fln.split('_')[0];
  if ((ext === 'jpg')&&(kind!=='web'))  {
	  let cmd = `[0,'${fln}','generators','','',{}], \n`;
    outp+=cmd;
    if ((i<10)&&(xferImages)) {
      xferFile(`public/images/std_size/${di}`,'../kop/public/images/std_size');
      xferFile(`public/images/thumbs/${di}`,'../kop/public/thumbs/std_size');
    }
  }
}
outp+=']]';

fs.writeFileSync('admin/allImages.js',outp);