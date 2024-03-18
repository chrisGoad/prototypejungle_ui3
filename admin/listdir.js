
var fs = require('fs');
let xferImages = process.argv[2];
let dir = 'public/images/std_size';
//console.log('dir',dir);
let dirc =fs.readdirSync(dir);
//console.log('dirc',dirc);
let omit ={bounce_0:1,'3d_grid_2':1,'3d_grid_0':1,bounce_11:1,bounce_13:1,bounce_14:1,bounce_16_f073:1,bounce_2:1,bounce_6:1,bounce_7:1,bounce_8:1,
           bounce_3:1,CMB:1,color_path_0:1,crosshatch_0:1,curves_2:1};
// figure out what went wrong with rectangle_gon_grid
let notAnims = {bounce_16_f077:1,crosshatch_0_f001:1,rectangle_gon_grid_9:1,curves_0:1};
let anims= {drop_circles_21:1,cubes_1:1,drop_circles_19:1,drop_circles_20:1,drop_circles_26:1,CMB:1,drop_circles_14_5x7:1,drop_circles_15:1,
   drop_circles_17:1,drop_circles_25:1,drop_on_top_2:1,drop_on_top_7:1,drop_on_top_7_combo_1:1,drop_on_top_5:1,example1:1,emergence:1};
let animNms = ['bounce_','curves_','path_avoidance','PathAvoidance','3d_grid','color_path','rectangle_gon_grid','crosshatch','drop_dandelion',
    'drop_ice','drop_leaves','drop_move','line_path','motion_','gridSpinner','mutate_','path_rwalk_'];
let mp4s ={};9
let notMp4s ={bounce_12:1,bounce_15:1,bounce_17:1,bounce_18:1,bounce_19:1};
let mp4Nms =['bounce_','crosshatch_'];
let isOneVerbose='crosshatch_1';
const isOne = function (fln,nots,sos,names,kind){
  if (omit[fln]) {
    if (isOneVerbose===fln) {
      console.log(fln,' omitted');
    }
    return 0;
  }
  if (nots[fln]) {
    if (isOneVerbose === fln) {
      console.log(fln,' is not',kind);
    }
    return 0;
  }
  if (sos[fln]) {
    if (isOneVerbose===fln) {
      console.log(fln,' is',kind);
    }
    return 1;
  }
  let lna = names.length;
  for (let i=0;i<ln;i++) {
    anm = names[i];
   
    let idx = fln.indexOf(anm);
    if (idx>=0) {
      if (isOneVerbose===fln) {
        console.log(fln,' is ',kind);
      }
     return 1;
    }
  }
return 0;
}

const isAnim = function (fln) {
    return isOne(fln,notAnims,anims,animNms,'Anim')
}
let instanceNms = ['rectangle_gon_grid','flows','gridSpinner','line_path','motion_','part_','part2_','paths_','mutate_','bounce_','curves_','path_rwalk_'];
let instances = {bounce_3:1}
let notInstances= {}

const isInstance = function (fln) {
    return isOne(fln,notInstances,instances,instanceNms,'Instance')
}


const isMp4 = function (fln) {
    let io = isOne(fln,notMp4s,mp4s,mp4Nms,'mp4')
    if (isOneVerbose===fln) {
      console.log('fln',fln,'isMp4',io);
    }
    return io;
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
 
  if ((ext === 'jpg')&&(kind!=='web')&&(!anim)&&(!omit[fln]))  {
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

let aoutp = 'module.exports = { sections:[ \n'
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
  let mp4=isMp4(fln);
  let vid = mp4?'mp4':'gif';
  if (fln==='crosshatch_1') {
     console.log('fln',fln,'vid',vid);
  }
  if ((ext === 'jpg')&&(kind!=='web')&&(anim))  {
	  let cmd = `[0,'${fln}','${iog}','','',{video:'${vid}'}], \n`;
    aoutp+=cmd;
    if (xferImages) {
      xferFile('public/images/std_size/',di);
      xferFile('public/images/thumbs/',di);
    }
  }
}
aoutp+=']}';

fs.writeFileSync('admin/allAnimations.js',aoutp);