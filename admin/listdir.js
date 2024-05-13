
var fs = require('fs');
let xferImages = process.argv[2];
let dir = 'public/images/std_size';
//console.log('dir',dir);
let dirc =fs.readdirSync(dir);
//dirc = ['drop_circles3.jpg'];
//console.log('dirc',dirc);
let jsd = JSON.stringify(dirc);
 const titleMap = {line_path_2_11:'line path 0',mmotion_18_4:'motion 0',mmotion_18_8:'motion 1',mmotion_18_16:'motion 2',mmotion_18_32:'motion 3',
  mmotion_3:'motion 4',ddrop_circles3:'drop_3',bounce_16:'Square Dance',motion_24:'Colliding Orbits',drop_circles_20:'Necker',
  gons_3:'Pulsation 1',step_ring_0:'Pulsation 2',motion_18_32:'Mandala',crosshatch_1:'Crosshatch',
  part2_0_34:'Paths 1',part2_0_1:'Vortex',drop_circles_14:'Bloom',drop_channels:'Channels',
  droppp_circles_3:'Dropped Circles',drop_interpolate_0:'Motion Illusion',grid_distortion_field_warped:'Distortion Field',
  drop_all_0:'Thatch',drop_all_2:'Inversion',drop_circles3:'Pop',drop_circles_3:'Drop Circles 1',drop_space_junk:'Space Junk',drop_many_textures:'Many Textures',
  drop_on_circles:'Borromean Knot',drop_metal_2:'Metal',drop_embedded_circles:'Embedded Circles',drop_on_line:'Cross 1',
  drop_on_top_2:'Drop on Top',drop_on_top_7:'Drop on Top 2',drop_rects_1:'Field of Squares',drop_starry_night:'Starry Night',
  drop_square:'Cross 2',grid_drop_0:'Spilled Paint',grid_cloudy_sky:'Cloudy Sky',triangle_1:'Triangle',lines_2:'Cobweb',part_0_4:'Partition 29',
  part2_0_41a:'Partition 25',part2_0_43:'You are getting very sleepy',paths_10:'Tower',part2_0_35:'Evolving Partition 1',part2_0_46:'Evolving Partition 2',
  part2_0_41b:'Partition 25',grid_quilt_1:'Quilt 1',grid_quilt_3:'Quilt 2',grid_two_quilts:'Two Quilts',path_rwalk_4_0:'Swarm',
  grid_droplets_wide:'Droplets',gggrid_fade:'Fade',gggrid_ramp:'Ramp',interpolate_colors_3:'Interpolate Colors',interpolate_colors_6:'Interpolate Colors 2',
 interpolate_colors_8:'Interpolate Colors',interpolate_colors_9:'Interpolate Colors 4',
 ip_test_2:'Waves',triangle_0:'Form',grid_1:'Bulge',grid_3:'Grid Grid',grid_4:'Rumpled 1',grid_6:'Rumpled 2',path_avoidance_5:'Figure/Ground',
 motion_18_16:'Motion 5',motion_18_4:'Motion 6',motion_18_8:'Motion 7',mutate_2:'Mutate 1',mutate_6:'Mutate 2',curves_7:'Beast',
 path_avoidance_6:'Intersections',cubes_1:'Cubes',curves_10:'Stretch',line_path_2_11:'Bounce 9',drop_circles_26:'Manic',
 drop_semi_ordered:'Semi-ordered',grid_smoke_1:'Smoke',stripes_1:'Stripes',lines_chaos_within_order:'Chaos within Order',part2_0_2:'Partition 9'}
 
 
let numericMaps = {dropCircles:{3:1,18:2,4:3},
partition:{27:1,23:2,5:3,10:4,3:5,29:6,6:7,26:8,9:9
},
bounce:{1:1,13:2,15:3,17:4,18:5,4:6,5:7,9:8},
curves:{1:1,3:2,4:3,5:4,6:5,8:6,9:7},
gridSpinner:{13:1,5:2,0:3,1:4,10:5,11:6,15:7,17:8,7:9},
motion:{10:1,11:2,12:3,15:4,2:5,3:9,0:6,1:7,21:8,4:9,32:10,5:11,9:12},
paths:{3:2,4:3,5:4,7:5}
};

const lowerCaseA = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const toUpperCase = function (lt) {
  let idx = lowerCaseA.indexOf(lt);
  if (idx<0) {
    return lt;
  }
  let uc = upperCaseA[idx];
  return uc;
}

const capitalize = function (str) {
  let ln = str.length;
  if (ln===0) {
     return str;
  }
  let lt0 = str[0];
  let clt0 = toUpperCase(lt0);
  let rst = str.substring(1);
  let vl = clt0+rst;
  return vl;
}

  const titleFun = (str)=> {
  
    if (str.indexOf('curves_10')>-1) {
       console.log(str,'!!!');
    }
    let mpt = titleMap[str];
    if (mpt) {
       //console.log('str',str,'mpt',mpt);
        //console.log(str,'->',mpt);

       return mpt;
    } else {
      return str;
    }
    let spl = str.split('_');
    let sp0=spl[0];
    let sp1=spl[1];
    let sp2=spl[2];
    let spln = spl.length;
 //   console.log('spln',spln,'sp0',sp0,'sp1',sp1,'sp2',sp2);
    if (spln=== 2) {
      let ttl;
      let csp0=capitalize(sp0);
      if ((sp0==='bounce')||(sp0 === 'curves')||(sp0==='gridSpinner')||(sp0 === 'motion')||(sp0 === 'paths')||
      (sp0==='drop')||(sp0==='grid')||(sp0==='lines')){
        let sp1n =1*sp1;
        let sp1num  = Number.isInteger(sp1n);
        if (sp1num) {
          let nummap = numericMaps[sp0];
          let num = nummap?nummap[sp1n]:sp1;
          if (num===undefined) {
            console.log('num UNDEFINED 00');
            return num;
          }
          ttl = csp0+' '+num;
        } else {
          ttl = capitalize(sp1);
        }
        console.log(str,'=>=>=>00',ttl);
        return ttl;
      }
    }
    if (spln===3) {
      if ((sp0==='drop')&&(sp1==='circles')) {
         let nummap = numericMaps.dropCircles;
         let num = nummap[sp2];
         if (num===undefined) {
            console.log('num UNDEFINED 11');
            return num;
         }
         let ttl = 'Drop Circles '+num;
       //console.log(str,'==>',ttl);
         return ttl;
      }
 
      if ((sp0==='part2')&&(sp1==='0')) {
         let nummap = numericMaps.partition;
         let numm = nummap[sp2];
         if (!numm) {
           return;
         }
        let ttl = 'Partition '+numm;
         //console.log(str,'=>==>',ttl);
         return ttl;
      }
      if ((sp0==='drop')&&(sp1==='circles')) {
        let ttl = 'dropCircles '+sp2;
        //console.log(str,'=>==>',ttl);
        return ttl;

      }
       if ((sp0==='drop')&&(sp1==='all')) {
        return 'drop '+sp2;
      }
       if (0&&(sp0==='motion')&&(sp1==='18')) {
        return 'motion 1'+sp2;
      }
    }
    return undefined;
  }


let frameMap = {crosshatch_1:'f083'};
// figure out what went wrong with rectangle_gon_grid

let notAnims = ['bounce_16_f077','crosshatch_0_f001','rectangle_gon_grid_9','curves_0','drop_circles_14_5x7','drop_circles_15',
               'drop_circles_25','drop_circles_21','drop_leaves','drop_on_top','motion_24_f','motion_29_f','mutate_6_f',];
let anims= ['drop_circles_21','cubes_1','drop_circles_19','drop_circles_20','drop_circles_26','CMB','drop_circles_14_5x7',
'drop_circles_15','spin_1','step_ring','part2_0_43','part2_0_31','bounce_13','paths_10','part2_0_46','stripes_1',
   'drop_circles_25','drop_on_top_2','drop_on_top_7','drop_on_top_7_combo_1','drop_on_top_5','example1','emergence','reflected_path_0','gons_3'];
let animNms = ['bounce_','curves_','path_avoidance','PathAvoidance','3d_grid','color_path','rectangle_gon_grid','crosshatch','drop_dandelion',
    'drop_ice','drop_leaves','drop_move','=line_path_2_11','motion_','gridSpinner','mutate_','path_rwalk_','paths_','=part2_0_34',
    'part2_0_43','part2_0_35'];
let mp4s =[];
let notMp4s =['bounce_12','bounce_15','bounce_17','bounce_18','bounce_19'];
let mp4Nms =['bounce_','crosshatch_','emergence','gridSpinner_10','gridSpinner_11','gridSpinner_17','=motion_3','paths_5','path_avoidance_6','motion_10',
'=reflected_path_0','gons_3','motion_18','motion_11','motion_21','paths_5','part2_0_34','part2_0_35','reflected_path_0_1'];

let gifs = [];
let notgifs =[];
let gifNms =['part2_0_43','part2_0_46','stripes_1'];

let isOneVerbose='';

const occursIn = function (fln,names) {
  let lna = names.length;
  for (let i=0;i<ln;i++) {
    anm = names[i];
    if (anm && (anm[0]==='=')){
      let abnm = anm.substring(1);
      if (abnm === fln) {
         //console.log('exact match fln=',fln);
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
  if (0&&framesIncluded[fln]&&(kind==='Anim')) {
    console.log('Included Frame',fln,'kind',kind,'fi',framesIncluded);
    debugger;
    return 1;
  }
  if (fln.indexOf('__f')>-1) {
    console.log('NOTT',fln);
    return 0;
  }
  if (occursIn(fln,nots)) {
    if (isOneVerbose === fln) {
      console.log(fln,' is not',kind);
    }
    return 0;
  }
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
    let isa = isOne(fln,notAnims,anims,animNms,'Anim');
    console.log('isAnim',fln,isa);
    return isa;;
}
let instanceNms = ['rectangle_gon_grid','flows','gridSpinner','line_path','motion_','part_','part2_','paths_','mutate_','bounce_','curves_','path_rwalk_','spirals_0_','reflected_path_0_1'];
let instances = ['bounce_3','gons_3','interpolate_colors','grid_distortion_field','grid_maze_wide'];
let notInstances= [];

const isInstance = function (fln) {
    return isOne(fln,notInstances,instances,instanceNms,'Instance')
}


const isMp4 = function (fln) {
    return 1;
    let io = isOne(fln,notMp4s,mp4s,mp4Nms,'mp4')
    if (isOneVerbose===fln) {
      console.log('fln',fln,'isMp4',io);
    }
    return io;
}


const isgif = function (fln) {
    let io = isOne(fln,notgifs,gifs,gifNms,'gif')
    if (isOneVerbose===fln) {
      console.log('fln',fln,'isMp4',io);
    }
    return io;
}

 const xferFile = function(dir,ifl,iofl) {
    let ofl = iofl?iofl:ifl;
   let ipath = dir+'/'+ifl; 
    let opath = '../kop/'+dir+'/'+ofl;
   // console.log('copying ',ipath,' to ',opath);
    fs.copyFileSync(ipath, opath);
   
  }
  
  
let ln = dirc.length;
let outp = 'module.exports = { sections:[ \n'
for (let i=0;i<ln;i++ ) {
  let di  = dirc[i];
  let dis = di.split('.');
  let ext = dis[1];
  let fln = dis[0];
  let title = titleFun(fln);
  if (!title) {
    continue;
  }
 /* let gd = fln.indexOf('grid_drop')===0;
  if (gd) {
    console.log('FLN',fln);
  }*/
  if (fln.indexOf('__f')>-1) {
  //  console.log('NOTTTTT',fln);
    continue;
  }
    let anim = isAnim(fln);
   let inst = isInstance(fln);
  let iog = inst?'instances':'generators';
  //console.log('i',i,'di',di,'dis',dis,'fln',fln,'ext',ext);
  let kind = fln.split('_')[0];
   if ((ext === 'jpg')&&(!anim))  {
	  let cmd = `[0,'${fln}','${iog}','','${title}',{}], \n`;
    //console.log('cmd',cmd);
    outp+=cmd;
    if (xferImages) { 
      xferFile('public/images/std_size/',di);
      xferFile('public/images/thumbs/',di);
    }
  } 
}
console.log('OOKK]}');
outp+=']}';

fs.writeFileSync('admin/allImages.js',outp);
console.log('ANIMANIM');
let aoutp = 'module.exports = { sections:[ \n'
for (let i=0;i<ln;i++ ) {
  let di  = dirc[i];
//console.log(i,di);
  let dis = di.split('.');
  let ext = dis[1];
  let fln = dis[0];
  let title = titleFun(fln);
  if (!title) {
    continue;
  }
  let fr = frameMap[fln];
  if (fr) {
    console.log('Frame',fr);
  }  
  let anim = isAnim(fln);
   let inst = isInstance(fln);
  let iog = inst?'instances':'generators';
  //console.log('i',i,'di',di,'dis',dis,'fln',fln,'ext',ext);
  let kind = fln.split('_')[0];
  let mp4=isMp4(fln);
  let gif=isgif(fln);
  let vid = gif?'gif':'mp4'
  if (fln==='crosshatch_1') {
     console.log('fln',fln,'vid',vid);
  }
  if ((ext === 'jpg')&&(kind!=='web')&&(anim))  {
	  let cmd = fr?`[0,'${fln}','${iog}','','',{video:'${vid}',frame:'${fr}'}], \n`:`[0,'${fln}','${iog}','','${title}',{video:'${vid}'}], \n`;
    aoutp+=cmd;
    if (xferImages) {
      xferFile('public/images/std_size/',di);
      xferFile('public/images/thumbs/',di);
    }
  }
}
aoutp+=']}';

fs.writeFileSync('admin/allAnimations.js',aoutp);
fs.writeFileSync('admin/allFiles.js',jsd);