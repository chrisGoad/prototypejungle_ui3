
var fs = require('fs');
let xferImages = process.argv[2];
let dir = 'public/images/std_size';
console.log('dir',dir);
let dirc =fs.readdirSync(dir);
console.log('dirc',dirc);


let notAnims = {bounce_16_f077:1,bounce_16_f073:1,drop_move_2:1};
let anims= {drop_circles_21:1,cubes_1:1,drop_circles_19:1,drop_circles_20:1,drop_circles_26:1};
let animNms = ['bounce_','curves_','path_avoidance','PathAvoidance','3d_grid','color_path'];
const isOne = function (fln,nots,sos,names,kind){
  if (nots[fln]) {
    console.log(fln,' is not',kind);
    return 0;
  }
  if (sos[fln]) {
    console.log(fln,' is',kind);
    return 1;
  }
  let lna = names.length;
  for (let i=0;i<ln;i++) {
    anm = names[i];
   
    let idx = fln.indexOf(anm);
    if (idx>=0) {
      console.log(fln,' is ',kind);
     return 1;
    }
  }
return 0;
}

const isAnim = function (fln) {
    return isOne(fln,notAnims,anims,animNms,'Anim')
}
let instanceNms = ['rectangle_gon_grid'];
let instances = {bounce_3:1}
let notInstances= {}

const isInstance = function (fln) {
    return isOne(fln,notInstances,instances,instanceNms,'Instance')
}


 const xferFile = function(dir,ifl,iofl) {
    let ofl = iofl?iofl:ifl;
   let ipath = dir+'/'+ifl; 
    //var vl = fs.readFileSync(ipath).toString();
    let opath = '../kop/'+dir+'/'+ofl;
   // console.log('copying ',ipath,' to ',opath);
    fs.copyFileSync(ipath, opath);
   
  }
let ln = dirc.length;
let outp = 'module.exports = { sections:[ \n'
for (let i=0;i<ln;i++ ) {
//for (let i=0;i<10;i++ ) {
  let di  = dirc[i];
//console.log(i,di);
  let dis = di.split('.');
  let ext = dis[1];
  let fln = dis[0];
 // console.log('fln',fln);

   let anim = isAnim(fln);
   let inst = isInstance(fln);
  let iog = inst?'instances':'generators';
  //console.log('i',i,'di',di,'dis',dis,'fln',fln,'ext',ext);
  let kind = fln.split('_')[0];
 
  if ((ext === 'jpg')&&(kind!=='web')&&(!anim))  {
	  let cmd = `[0,'${fln}','${iog}','','',{}], \n`;
    outp+=cmd;
    if (xferImages) {
      xferFile('public/images/std_size/',di);
      xferFile('public/images/thumbs/',di);
    }
  }
}
outp+=']}';

fs.writeFileSync('admin/allImages.js',outp);