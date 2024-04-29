
const toBoolean = (v) => {
  if (typeof v === 'string') {
    return (v==='0')?false:true;
  } else {
    return false;
  }
}

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
//console.log('capitalize cat',capitalize('cat'));

  
//console.log('upper _',toUpperCase('_'));
  
let neverTitle = 0;
let kind = process.argv[2];
let forKOP = toBoolean(process.argv[3]);
let sortByOrderstr = "1";
let alwaysLocal = 0;

//console.log('kind',kind);

let signed = 0

let forPJ = kind === 'forPJ';
let book = kind === 'book';
let top = kind === 'top';
let drop = kind === 'drop';
let grid = kind === 'grid';
let lines = kind === 'lines';
let anim = kind === 'anim';
let stills = kind === 'stills';
let partition = kind === 'partition';
let web = kind === 'web';
let alll = kind === 'all';
let allA = kind === 'allA';
let sortByOrder = toBoolean(sortByOrderstr);
/*let byKind = kind === 'byKind';*/
let alternate = kind === 'alt';
let byLikes = kind === 'byLikes';
let byAspect = kind === 'byAspect';
let vertical = kind === 'vertical';
let horizontal = kind === 'horizontal';
let horizontalnf = kind === 'horizontalnf'; // horizontal no frame
let square = kind === 'square';
let imagesHere = kind === 'imagesHere';
let images = (kind === 'images') || imagesHere;

let local_images = alwaysLocal || (kind === 'local_images') || alternate ;
//console.log('local_images',local_images);
let whichPage = 1;
let orderMin,orderMax;
if (forKOP) {
  orderMin = -1;
  orderMax = 10000;
} else {
  orderMin = -1;
  orderMax = 10000;
}

console.log('kind','['+kind+']','sortByOrder',sortByOrder,'forKOP',forKOP,'top',top);

let sectionsPath;
let imKind;
 if (alll)  {
  sectionsPath = './allImages.js';
  imKind = 'g'
} else if (allA)  {
  sectionsPath = './allAnimations.js';
  imKind = 'g'
} else if (byLikes) {
  sectionsPath = './images.js';
  imKind = 'g';
} else if (alternate) {
 sectionsPath = './altSections.js';
  sortByOrder = 0;
  imKind = 'book';
}  else if (top)  {
  sectionsPath = './galleries.js';
  imKind = 'g'
} else if (images || forKOP  || forPJ || drop || grid || lines || anim || partition || web)  {
  sectionsPath = './images.js';
  imKind = 'g'
}   else if (local_images)  {
  sectionsPath = './images.js';
  imKind = 'g'
} else {
  console.log("unrecognized kind ","'"+kind+"'");
  return;
}
console.log('sectionsPath',sectionsPath,'imKind',imKind);

 
 pagesPath = `public/${kind}Pages.js`;
 console.log('pagesPath',pagesPath);
  pagesVar = `${imKind}Pages`;
  pagesVar = `${kind}Pages`;
  titlesPath = `public/${imKind}Titles.js`;
  titlesPath = `public/${kind}Titles.js`;
  titlesVar = `${imKind}Titles`;
  titlesVar = `${kind}Titles`;
  localsPath = `public/${imKind}Locals.js`;
  localsVar = `${imKind}Locals`;
  
 console.log('pagesPath',pagesPath)
let outPath;
if (alternate) {
  outPath = 'public/altImages.html';
} else if (book) {
  outPath = 'public/bookImages.html';
} else if (drop) {
   outPath = 'public/dropImages.html';
}else if (partition) {
   outPath = 'public/partitionImages.html';
}  else if (top) {
   outPath = 'public/galleries.html';
}  else if (grid) {
  outPath = 'public/gridImages.html';
} else if (lines) {
  outPath = 'public/linesImages.html';
} else if (anim) {
  outPath = 'public/animImages.html';
} else if (stills) {
  outPath = 'public/stillsImages.html';
}else if (alll) {
  outPath = 'public/allImages.html';
} else if (allA) {
  outPath = 'public/allAImages.html';
}  else if (web) {
  outPath = 'public/webImages.html';
} else {
  outPath = 'public/images.html';
}
console.log('sectionsPath', sectionsPath,'outPath',outPath);

var fs = require('fs');

let fileExt = alternate?'mjs':'mjs';
let thePages = [];
let theTitles = [];
let theLocals = []
let pageTop = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>`+(forKOP?'Kingdom of Pattern':'PrototypeJungle')+`</title>
  <style>
    .theGrid {
      display:grid;
      padding-top:10px;
      grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr;
    }
    .indent {
      padding-left:40px;
    }
		.centered {
			text-align:center;
		  font-size:13pt;
			display: flex;
		  align-items: center;
		  justify-content: center;
		}
		p {
			padding-top:5px;
			padding-bottom:5px;
			margin-top:0px;
			margin-bottom:0px;
		}
    .topPad {
      padding-top:40px;
    }
    .emphasis {
      font-style:italic;
      font-weight:bold;
     }
    .introLineLarge {
      text-align:center;
      padding-bottom:10px;
      padding-top:10px;
      font-size:16pt;
      color:white;
    }
     .introLineSmall {
      text-align:center;
      padding-bottom:5px;
      padding-top:5px;
      font-size:12pt;
    }
      
  </style>
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
</head>
<body style="color:white;font-size:16pt;font-family:arial;background-color:black" >
`;

let headLine = '<p class="introLineLarge"><a style="color:white" href="https://kingdomofpattern.com">Kingdom of Pattern</a></p>';
headLine = '<p class="introLineLarge"><a style="color:white" href="index.html">Kingdom of Pattern</a></p>';
let pageIntro;
if (imKind === 'g') {
  if (forKOP) {
    let kindTitle,aboutUrl;
    if (top) {
      pageIntro = 
      `
      <p class="introLineLarge">Kingdom of Pattern</p>
      <p class="introLineLarge">Theory (<a style="color:white;text-decoration:underline" href="https://eutelic.medium.com/a-phenomenology-of-visual-pattern-643cf577ad6c">here</a>)
       and Practice (below). </p>

      <p  class="introLineSmall">As you will see from <a style="color:white;text-decoration:underline" href="https://eutelic.medium.com/a-phenomenology-of-visual-pattern-643cf577ad6c">theory</a>, the phrase "Kingdom of Pattern" is not a claim to grandeur.</p>
      <p class="introLineSmall">Images by Chris Goad, via JavaScript and <a style="color:white" href="https://developer.mozilla.org/en-US/docs/Web/SVG">SVG</a>.</p> 

    


      <p class="introLineSmall">To visit the galleries, click on their titles or images.</p>
    `
   } else if (partition) {

      kindTitle = 'Partition Trees';
      aboutURL = "kop_partition.html";
    } else if (drop) {
      kindTitle = 'Drops';
      aboutURL = "kop_drop.html";
    } else if (web) {
      kindTitle = 'Webs';
      aboutURL = "kop_web.html";
    } else if (grid) {
      kindTitle = 'Grids';
      aboutURL = "kop_grid.html";
    } else if (lines) {
      kindTitle = 'Lines'
      aboutURL = "kop_lines.html";
    } else if (anim) {
      kindTitle = 'Animation'
      aboutURL = "kop_anim.html";
    } else if (stills) {
      kindTitle = 'Frames From Animations'
      aboutURL = "kop_stills.html";
    }  else if (alll) {
      kindTitle = 'Images';
      aboutURL = "all_images.html";
    }  else if (allA) {
      kindTitle = 'Animations';
      aboutURL = "kop_anim.html";
    }
    if (!top) {
    
      aboutStart = anim?'':`<a style="color:white" href="doc/${aboutURL}">`;
      aboutLink = `${aboutStart}about ${kindTitle}</a>`;
      let aboutLine = '';//alll?`<p class="introLineSmall">${aboutLink}</p>`:'';;  
      let enlargeText = allA?'To run the animations, click on the images.':'To enlarge the images, click on them.';
      pageIntro = 
      `
      ${headLine}
      <p class="introLineLarge">${kindTitle}</p>    
      ${aboutLine}  
      <p class="introLineSmall">${enlargeText}</p>
      
      
    `;
    
    
    } 
   } else  {
    if (local_images) {
      pageIntro = 
      `
      <p class="introLineLarge"><a href="index.html">PrototypeJungle</a></p>
      <p class="introLineSmall">These are the images that you have rebuilt in your local copy of PrototypeJungle</p>
      <p class="introLineSmall">Initially, no images will appear</p>
      `;
    } else {
       pageIntro = 
      `
      <p class="introLineLarge"><a style="color:white" href="index.html">PrototypeJungle</a></p>
      `;
    }
  }
}   
let pageScript = 
`<script>
document.addEventListener('DOMContentLoaded', () => {
	debugger;
	let cWidth =document.documentElement.clientWidth;
	let imWid = Math.floor(0.09*cWidth);
	let images = document.querySelectorAll('img');
	images.forEach((im) => {
		im.width = ''+imWid;
	});
});
</script>	
`;
let pageNumber = 0;
let numPages = 0;
 const titleMapp = {line_path_2_11:'line path 0',mmotion_18_4:'motion 0',mmotion_18_8:'motion 1',mmotion_18_16:'motion 2',mmotion_18_32:'motion 3',
  mmotion_3:'motion 4',ddrop_circles3:'drop_3',bounce_16:'Square Dance',motion_24:'Colliding Orbits',drop_circles_20:'Necker',
  gons_3:'Pulsation 1',step_ring_0:'Pulsation 2',motion_18_32:'Mandala',crosshatch_1:'Crosshatch',part2_0_34:'Paths 1',part2_0_1:'Vortex',drop_circles_14:'Bloom',
  droppp_circles_3:'Dropped Circles',drop_interpolate_0:'Motion Illusion',grid_distortion_field_warped:'Distortion Field',
  drop_all_0:'Thatch',drop_all_2:'Inversion',drop_circles3:'Pop',drop_space_junk:'Space Junk',drop_many_textures:'Many Textures',
  drop_on_circles:'Borromean Knot',drop_metal_2:'Metal',drop_embedded_circles:'Embedded Circles',drop_on_line:'Cross 1',
  drop_on_top_2:'Drop on Top 1',drop_on_top_7:'Drop on Top 2',drop_rects_1:'Field of Squares',drop_starry_night:'Starry Night',
  drop_square:'Cross 2',grid_drop_0:'Spilled Paint',grid_cloudy_sky:'Cloudy Sky',triangle_1:'Triangle',lines_2:'Cobweb',part_0_4:'Partition 29',
  part2_0_41a:'Partition 25',part2_0_43:'You are getting very sleepy',paths_10:'Tower',part2_0_35:'Evolving Partition 1',part2_0_46:'Evolving Partition 2',
  part2_0_41b:'Partition 25',grid_quilt_1:'Quilt 1',grid_quilt_3:'Quilt 2',grid_two_quilts:'Two Quilts',path_rwalk_4_0:'Swarm',
  grid_droplets_wide:'Droplets',gggrid_fade:'Fade',gggrid_ramp:'Ramp',interpolate_colors_3:'Interpolate Colors 1',interpolate_colors_6:'Interpolate Colors 2',
 interpolate_colors_8:'Interpolate Colors 3',interpolate_colors_9:'Interpolate Colors 4',
 ip_test_2:'Waves',triangle_0:'Form',grid_1:'Bulge',grid_3:'Grid Grid',grid_4:'Rumpled 1',grid_6:'Rumpled 2',path_avoidance_5:'Figure/Ground',
 motion_18_16:'Motion 5',motion_18_4:'Motion 6',motion_18_8:'Motion 7',mutate_2:'Mutate 1',mutate_6:'Mutate 2',curves_7:'Beast',
 path_avoidance_6:'Intersections',cubes_1:'Cubes',curves_10:'Stretch',line_path_2_11:'Bounce 9',drop_circles_26:'Manic',
 drop_semi_ordered:'Semi-ordered',grid_smoke_1:'Smoke',stripes_1:'Stripes',lines_chaos_within_order:'Chaos within Order'}
  
  
  // gridSpinner_13:'Spinner',gridSpinner_5:'Walkers',part2_0_43:'You are getting very sleepy',curves_10:'Stretch',paths_10:'Tower',};
  
let numericMaps = {dropCircles:{3:1,0:2,1:3,10:4,13:5,15:6,18:7,4:8,7:9,9:10},
partition:{10:1,12:2,
13:3,14:4,15:5,16:6,
17:7,19:8,2:9,20:10,
22:11,23:12,24:13,
25:14,26:15,27:16,28:17,
29:18,3:19,37:20,4:21,
5:22,51:23,52:24,56:25,
6:26,7:27,9:28
},
    //10:1,11:2,12:3,13:4,14:5,15:6,16:7,17:8,18:9,19:10,2:11,
//20:12,21:13,22:14,23:15,
//24:16,25:17,26:18,27:19,28:20,29:21,3:22,37:23,
//4:24,41:25,44:26,5:27,50:28,51:29,52:30,56:31,6:32,7:33,9:34},
bounce:{1:1,13:2,15:3,17:4,18:5,4:6,5:7,9:8},
curves:{1:1,3:2,4:3,5:4,6:5,8:6,9:7},
gridSpinner:{13:1,5:2,0:3,1:4,10:5,11:6,15:7,17:8,7:9},
motion:{10:1,11:2,12:3,15:4,2:5,3:9,0:6,1:7,21:8,4:9,32:10,5:11,9:12},
paths:{3:2,4:3,5:4,7:5}
};


  const titleFun = (str)=> {
    if ((!alll)&&(!allA)) {
      return str;
    }
    if (str.indexOf('curves_10')>-1) {
       console.log(str,'!!!');
    }
    let mpt = titleMap[str];
    if (mpt) {
       //console.log('str',str,'mpt',mpt);
        //console.log(str,'->',mpt);

       return mpt;
    }
    return;
    let spl = str.split('_');
    let sp0=spl[0];
    let sp1=spl[1];
    let sp2=spl[2];
    let spln = spl.length;
 //   console.log('spln',spln,'sp0',sp0,'sp1',sp1,'sp2',sp2);
    if (sp0==='grid') {
//          console.log('grid!!!!!!!!!!');
     }
    if (spln=== 2) {
      let ttl;
      let csp0=capitalize(sp0);
     // if ((sp0 === 'grid')||(sp0 === 'lines')||(sp0 === 'drop')) {
       // ttl = capitalize(sp1);
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
       console.log(str,'==>',ttl);
         return ttl;
      }
 
      if ((sp0==='part2')&&(sp1==='0')) {
         let nummap = numericMaps.partition;
         let numm = nummap[sp2];
         if (!numm) {
           return;
         }
         //let num = numm?numm:sp2;
        let ttl = 'Partition '+numm;
       //  let ttl = 'Partition '+sp2;
         console.log(str,'=>==>',ttl);
         return ttl;
      }
      if ((sp0==='drop')&&(sp1==='circles')) {
        let ttl = 'dropCircles '+sp2;
        console.log(str,'=>==>',ttl);
        return ttl;

      }
       if ((sp0==='drop')&&(sp1==='all')) {
        return 'drop '+sp2;
      }
       if (0&&(sp0==='motion')&&(sp1==='18')) {
        return 'motion 1'+sp2;
      }
    }
    return str;
  }
const thingString = function (order,ix,dir,useThumb,ititle,props) {
	debugger;
  let {variant,likes,posted,category,sources,noTitle,video} = props;
  //console.log('POSTED',posted,'category',category,'kind',kind);
  if (!alll&&!allA&&((kind !=='alt') && (kind !== 'book') &&(category !==  kind))) {
    return '</div>';a
  }
  if (ititle==='Droplets') {
    console.log('DropletsAAAAAAAAAA');
  }
  //let fr = anim?props.frame:'';
  let fr = allA?props.frame:'';
  if (fr) {
    //console.log('FR',fr,'kind',kind);
  }
	let spix = ix.split('.');
	let path = spix[0];
  let verbose = path==='motion_5';
  if (verbose) {
    console.log('path',path);
  }
	let ext = video?video:((spix.length === 1)?'jpg':spix[1]);
	let x = path + '.'+ ext;
 // console.log('ix',ix,'x',x);
 

 // let title = noTitle?pageNumber+'':titleFun(ititle)
  let title = ititle;

  
  //console.log('ititle',ititle,'title',title);
  theTitles.push(title);
  let vpath = (variant?path+'_v_'+variant:path);
  //console.log('variant',variant);
  //console.log('vpath',vpath);
 // let vx = fr?vpath+'__'+fr+'.'+ext:vpath+'.'+ext;
  let vx = vpath+'.'+ext;
  let vpath_fr = fr?vpath+'__'+fr:vpath;
 // console.log('vx',vx);
  thePages.push(vx);
	let imsrc = `images/std_size/${vpath_fr}.jpg`;
	let thumbsrc = `images/thumbs/${vpath_fr}.jpg`;
  let localSrc =`public/images/thumbs/${vpath_fr}.jpg`;
  let videoSrc = video?`images/std_size/${vpath}.${video}`:null; 
  if (fr) {
    console.log('thumbsrc',thumbsrc,'kind',kind);
  }
	let pageArg = 'page='+pageNumber;
  //let kindArg = 'imKind='+imKind;
//  console.log('kind',kind);
  let kindArg = 'imKind='+kind;
  let noTitleArg = '';//noTitle?'&noTitle=1':'';
  let localArg = 'local='+(local_images||imagesHere?1:0);
//  console.log('local_images',local_images,'imagesHere',imagesHere);
	let theImageArg = '';
	pageNumber++;
	let lastPageArg = (pageNumber === numPages)?'&lastPage=1':'';
	let rs,srcUrl,aboutURL,aboutStart,aboutLink;
	let astart = `<a style="color:white" href="page.html?image=${vx}&${pageArg}&${kindArg}&${localArg}${noTitleArg}">`;
  	let galURL,galStart,galLink;
  if (top) {
    if (title === 'Drops') {
      galURL = "dropImages.html";
     // console.log('galURL');
    } else if (title === 'Lines') {
      galURL = "linesImages.html";
    } else if (title === 'Animations') {
      galURL = "animImages.html";
    }else if (title === 'Partitions') {
      galURL = "partitionImages.html";
    } else if (title === 'Grids') {
      galURL = "gridImages.html";
    } else if (title === 'Webs') {
      galURL = "webImages.html";
    } else if (title === 'Stills') {
      galURL = "stillsImages.html";
    } else if (alll) {
      galURL = "allImages.html";
    } 
    

    galStart = `<a style="color:white" href="${galURL}">`;
    galLink = `${galStart}${title}</a>`
  }
  //console.log('ASTART',astart);
  let propsStr = imagesHere?`<span style="font-size:10pt">${likes?'Likes '+likes:''} ${posted?"":" NOT POSTED"} ${local_images?'Local':''} ${category}</span><br>`:'';;
  let sourcenm = `source${sources?'s':''}`;
 // console.log('forKOP',forKOP);
	if (forKOP) {
		//let titleLink = title?`${astart}${title}</a></p>`:'';
		let titleLink = title?`${astart}${title}</a>`:'';
		//console.log('titleLink',titleLink);
    srcUrl = (sources)?`https://prototypejungle.net/doc/${path}_sources.html`:`https://prototypejungle.net/${dir}/${path}.${fileExt}`;
    rs = stills?`<div><p class="centered">${titleLink}</p><p class="centered">Frame ${props.frame}</p>`:`<div><p class="centered">${titleLink}</p>`
    rs = rs +`<p class="centered">${astart}<img width="200" src="${thumbsrc}" alt="Image Missing"></a></p></div>`;
     // console.log("RRRRSSS",rs);

	} else  {
  //  console.log('WWWWWWWWWWW');
 // if (top) {
		//console.log('top','galLink',galLink);
    rs = `<div><p class="centered">${galLink}</p>`;

    rs = rs +
    `<p class="centered">${galStart}<img width="200" src="${thumbsrc}" alt="Image Missing"></a></p></div>`;
	//} else if (!forKOP) {
    srcUrl = (sources)?`doc/${path}_sources.html`:`${dir}/${path}.${fileExt}`;
   // console.log('srcUrl',srcUrl);
	//	console.log('not for KOP');
    rs = `<div><p style="text-align:center"><a href="http://localhost:8081/draw.html?source=/${dir}/${path}.${fileExt}${theImageArg}">${title}</a><br>
    <a href="${srcUrl}">${sourcenm}</a><br>
    ${propsStr}
    ${astart}<img width="200" src="${thumbsrc}"></a></p></div>
    `;
	}
 // console.log ('rs = ',rs);
	return rs;
}

let numThingsPerLine = 4;

const stripOrnt = function (str) {
    let spl = str.split('_');
    let sln = str.length;
    let ln = spl.length;
    let rs = str;
    let lst;
    if (ln > 1) {
      lst = spl[ln-1];
      if ((lst === 'v') || (lst === 'h')) {
        rs = str.substring(0,sln-2);
      } else if (lst === 'sq') {
        rs = str.substring(0,sln-3);
      }
    }
   // console.log('stripOrnt','lst',lst,str,' = ',rs);
    return rs;
  }
 
   //  first anim favorites
 const favorites =  ['crosshatch_1','bounce_16','curves_10','motion_24','drop_circles_20','gridSpinner_13','gridSpinner_5','part2_0_43','paths_10','motion_18_32',
 'gons_3',
 //now image favorites
  'part2_0_1','drop_circles_14','drop_interpolate_0','ip_test_2',
 'triangle_0','grid_droplets_wide','drop_rects_1','drop_all_0',
 'drop_all_2','grid_distortion_field_warped','drop_circles3','drop_on_line',
 'drop_circles_3','interpolate_colors_8','drop_on_top_2','drop_channels'
];
/* 'part2_0_1','drop_circles_14','drop_circles_3','drop_interpolate_0',
 'grid_distortion_field_warped','grid_droplets_wide','grid_fade','grid_ramp',
'interpolate_colors_3','interpolate_colors_6',
'ip_test_2','lines_bug_eyes',
'quad_9_6',
'triangle_0' ];*/
let sectionString = function (things) {
 // console.log('things',things);
	let numThingsThisLine = 0;
	let startLine =  `
<div class="theGrid">
  <div></div>
  `;
	let rs = `
<div class="theGrid">
  <div></div>
  `;
	let ln = things.length;
  //console.log('ln',ln);
  const compareLikes = function (thing1,thing2) {
    let likes1 = (thing1.length >= 6)?thing1[5]:0;
    let likes2 = (thing1.length >= 6)?thing2[5]:0;
    if (likes1 === likes2) {
      return 0;
    }
    if (likes1 < likes2) { 
      return 1;
    }
    return -1;
  }
  if (byLikes) {
   // things.sort(compareLikes);
  }
  const compareByOrder = function (thing1,thing2) {
    let title1 = thing1[1];
    let title2= thing2[1];
    let order1 = favorites.indexOf(title1);
    let order2 = favorites.indexOf(title2);
    if (0&&(order1>-1)&&(order2>-1)) {
      console.log('order1',order1,title1);
      console.log('order2',order2,title2);
    }
    if (order1 === order2) {
    
      return 0;
    }
    if ((order2 > -1)&&(order1 == -1)) {
      //console.log('case1',1);
      return 1;
    }
    if ((order2 > order1)  && (order1!==-1)) { 
      //console.log('case2',1);
      return -1;
    }
     if ((order1 > order2)  && (order2!==-1)) { 
      //console.log('case3',-1);
      return 1;
    }
    //console.log(-1);
    return -1;
  }

  //console.log('things unordered',things);
  if (allA||alll) {//&&sortByOrder) {
    console.log('sortByOrder');
    things.sort(compareByOrder);
  }
  // console.log('things ordered',things);
//  ln = 2;
	for (let i=0;i<ln;i++) {
		let thing = things[i];
   //console.log('thing',thing,'i',i);
    let tln = thing.length;
    if (tln === 1) {
   //   console.log("Section");
      let txt = thing[0];
      numThingsThisLine = numThingsPerLine;
      rs += `</div><br><div style="text-align:center">${txt}</div><br><div>`;
    } else {
      let [order,file,directory,useThumb,title,props] = thing;
      console.log('FFFFILE',file);
     // console.log('PROPS',props);
      //console.log('file',file);
     // let tov = typeof variant;
    //  console.log('is variant',tov);
      let ord = thing[0];
      let atitle=title?title:file;
      let ts = thingString(ord,file,directory,useThumb,atitle,props);
//console.log('ts',ts);
      if (ts!=='</div>') {
        rs+=ts;
       numThingsThisLine++;
      }
    }
	//	console.log('numThingsThisLine',numThingsThisLine,'i',i,'ln',ln);
		if ((numThingsThisLine === numThingsPerLine) && (i<(ln-1))) {
		//	console.log('EOL');
			rs += `</div><br>
	`+ startLine;
			numThingsThisLine = 0;
	  }
  };
  rs += `</div><br>
`;
 debugger;
 return rs;
}



const sectionsString = function (sections) {
	let rs = '';
	rs += sectionString(sections);
	return rs;

}
const writeThePages = function () {
	let js = `let ${pagesVar}= ${JSON.stringify(thePages)};`;
 // console.log('writeThePagess',js,pagesVar,pagesPath);
	fs.writeFileSync(pagesPath,js);
}
const writeTheTitles = function () {
	let js = `let ${titlesVar} = ${JSON.stringify(theTitles)};`
 //   console.log('writeTheTitles',js,titlesPath);

	fs.writeFileSync(titlesPath,js);
//	fs.writeFileSync(alternate?'public/altTitles.js':(byKind?'public/byKindTitles.js':'public/theTitles.js'),js);
}
const writeTheLocals = function () {
	let js = `let ${localsVar} = ${JSON.stringify(theLocals)};`
   // console.log('writeTheTitles',js,titlesPath);
	fs.writeFileSync(localsPath,js);
}

		
const writePage = function (sections) {
	// console.log('Page Intro',pageIntro);
	let frs = '';
	frs += pageTop;
  frs += pageIntro;
  frs += pageScript;
	let ss =sectionsString(sections);
	frs +=ss;
 // console.log('sectionsScript',ss);
	fs.writeFileSync(outPath,frs);
}

let sectionsC = require(sectionsPath);
//console.log('sectionsC',sectionsC);
let imageOrder  = require('./imageOrder.js');
//console.log('sectionsC', sectionsC);

const order2dict = function (order) {
  let rs = {};
  order.forEach( (ln) => {
    let [o,s] = ln;
    rs[s] = o;
  });
  return rs;
}

let orderDict = order2dict(imageOrder);

//console.log('orderDict',orderDict);

const countPages = function (sections) {
	let rs = 0;
	sections.forEach((section) => {
		section.forEach((thing) =>  rs++);
	});
	return rs;
}
		

 writePage(sectionsC.sections);
 writeThePages();
 writeTheTitles();
 console.log('numPages',numPages);
 