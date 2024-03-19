
var fs = require('fs');
let xferImages = process.argv[2];
let dir = 'public/images/std_size';
//console.log('dir',dir);
let dirc =fs.readdirSync(dir);
//console.log('dirc',dirc);
/*let omit ={bounce_0:1,'3d_grid_2':1,'3d_grid_0':1,bounce_11:1,bounce_13:1,bounce_14:1,bounce_16_f073:1,bounce_2:1,bounce_6:1,bounce_7:1,bounce_8:1,
           bounce_3:1,CMB:1,color_path_0:1,crosshatch_0:1,curves_2:1,drop_circles_17:1,drop_dandelion:1,drop_dandelion_with_circles:1,drop_ice:1}*/
let omit =['bounce_0','3d_grid_2','3d_grid_0','bounce_11','bounce_13','bounce_14','bounce_16_f073','bounce_2','bounce_6','bounce_7','bounce_8',
           'bounce_3','CMB','color_path_0','crosshatch_0','curves_2','drop_circles_17','drop_dandelion','drop_dandelion_with_circles','drop_ice',
           'drop_move','gridSpinner_18','gridSpinner_19','gridSpinner_14','gridSpinner_2','gridSpinner_3','gridSpinner_4','gridSpinner_6','gridSpinner_8',
           'gridSpinner_9','=gridSpinner','gridSpinner_12','gridSpinner_16','grid_emergence','example1','l2ine_path_2_11b','line_path_2_9',
           '=motion_1','motion_14','motion_14','motion_16','motion_17','motion_18','motion_19','=motion_2','motion_20','motion_22','motion_23',
           'motion_25','motion_26','motion_27','motion_28','motion_29'];
// figure out what went wrong with rectangle_gon_grid
/*let notAnims = {bounce_16_f077:1,crosshatch_0_f001:1,rectangle_gon_grid_9:1,curves_0:1,drop_circles_14_5x7:1,drop_circles_15:1,
               drop_circles_25:1,drop_circles_21:1,drop_leaves:1,};*/
let notAnims = ['bounce_16_f077','crosshatch_0_f001','rectangle_gon_grid_9','curves_0','drop_circles_14_5x7','drop_circles_15',
               'drop_circles_25','drop_circles_21','drop_leaves','drop_on_top','motion_24_f','motion_29_f'];

/*let anims= {drop_circles_21:1,cubes_1:1,drop_circles_19:1,drop_circles_20:1,drop_circles_26:1,CMB:1,drop_circles_14_5x7:1,drop_circles_15:1,
   drop_circles_25:1,drop_on_top_2:1,drop_on_top_7:1,drop_on_top_7_combo_1:1,drop_on_top_5:1,example1:1,emergence:1};*/
let anims= ['drop_circles_21','cubes_1','drop_circles_19','drop_circles_20','drop_circles_26','CMB','drop_circles_14_5x7','drop_circles_15',
   'drop_circles_25','drop_on_top_2','drop_on_top_7','drop_on_top_7_combo_1','drop_on_top_5','example1','emergence'];
let animNms = ['bounce_','curves_','path_avoidance','PathAvoidance','3d_grid','color_path','rectangle_gon_grid','crosshatch','drop_dandelion',
    'drop_ice','drop_leaves','drop_move','line_path','motion_','gridSpinner','mutate_','path_rwalk_','paths_'];
let mp4s ={};
//let notMp4s ={bounce_12:1,'bounce_15:1,'bounce_17:1,'bounce_18:1,'bounce_19:1};
let notMp4s =['bounce_12','bounce_15','bounce_17','bounce_18','bounce_19'];
let mp4Nms =['bounce_','crosshatch_','emergence','gridSpinner_10','gridSpinner_11','=motion_3'];
let isOneVerbose='crosshatch_1';

const occursIn = function (fln,names) {
  let lna = names.length;
  for (let i=0;i<ln;i++) {
    anm = names[i];
    if (anm && (anm[0]==='=')){
      let abnm = anm.substring(1);
      if (abnm === fln) {
         console.log('exact match fln=',fln);
         return 1
      }
    }
      
    let idx = fln.indexOf(anm);
    if (idx>=0) {
     return 1;
    }
  }
}
  
const isOne = function (fln,nots,sos,names,kind){
  //if (omit[fln]) {
  if (occursIn(fln,omit)) {
    if (isOneVerbose===fln) {
      console.log(fln,' omitted');
    }
    return 0;
  }
 // if (nots[fln]) {
  if (occursIn(fln,nots)) {
    if (isOneVerbose === fln) {
      console.log(fln,' is not',kind);
    }
    return 0;
  }
 // if (sos[fln]) {
  if (occursIn(fln,sos)) {
    if (isOneVerbose===fln) {
      console.log(fln,' is',kind);
    }
    return 1;
  }
  let ocn= occursIn(fln,names);
  if (ocn) { 
    if (isOneVerbose===fln) {
      console.log(fln,' is ',kind);
    }
    return 1;
  }
return 0;
}

const isAnim = function (fln) {
    return isOne(fln,notAnims,anims,animNms,'Anim')
}
let instanceNms = ['rectangle_gon_grid','flows','gridSpinner','line_path','motion_','part_','part2_','paths_','mutate_','bounce_','curves_','path_rwalk_'];
let instances = ['bounce_3'];
let notInstances= [];

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