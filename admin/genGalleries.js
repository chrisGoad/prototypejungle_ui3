
const toBoolean = (v) => {
  if (typeof v === 'string') {
    return (v==='0')?false:true;
  } else {
    return false;
  }
}
const only_favorites = 1;
const lowerCaseAA = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseAA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const toUpperCasee = function (lt) {
  let idx = lowerCaseA.indexOf(lt);
  if (idx<0) {
    return lt;
  }
  let uc = upperCaseA[idx];
  return uc;
}

const capitalizee = function (str) {
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
//let drop = kind === 'drop';
//let grid = kind === 'grid';
//let lines = kind === 'lines';
//let anim = kind === 'anim';
let stills = kind === 'stills';
//let partition = kind === 'partition';
//let web = kind === 'web';
let alll = kind === 'all';
let allA = kind === 'allA';
let art = kind === 'art';
let sortByOrder = toBoolean(sortByOrderstr);
/*let byKind = kind === 'byKind';*/
let alternate = kind === 'alt';
//let byLikes = kind === 'byLikes';
//let byAspect = kind === 'byAspect';
//let vertical = kind === 'vertical';
//let horizontal = kind === 'horizontal';
//let horizontalnf = kind === 'horizontalnf'; // horizontal no frame
//let square = kind === 'square';
//let imagesHere = kind === 'imagesHere';
let images = (kind === 'images');
//let images = (kind === 'images') || imagesHere;

let local_images = alwaysLocal || (kind === 'local_images') || alternate || art ;
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
if (art)  {
  sectionsPath = './allArt.js';
  imKind = 'g'
} else if (alll)  {
  sectionsPath = './allImages.js';
  imKind = 'g'
} else if (allA)  {
  sectionsPath = './allAnimations.js';
  imKind = 'g'
} /*else if (byLikes) {
  sectionsPath = './images.js';
  imKind = 'g';
}*/ else if (alternate) {
 sectionsPath = './altSections.js';
  sortByOrder = 0;
  imKind = 'book';
}  else if (top)  {
  sectionsPath = './galleries.js';
  imKind = 'g'
} /*else if (images || forKOP  || forPJ || drop || grid || lines || anim || partition || web)  {
  sectionsPath = './images.js';
  imKind = 'g'
} */  else if (local_images)  {
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
 // titlesVar = `${imKind}Titles`;
  titlesVar = `${kind}Titles`;
  longTitlesVar = `${kind}LongTitles`;
  localsPath = `public/${imKind}Locals.js`;
  localsVar = `${imKind}Locals`;
  
 console.log('pagesPath',pagesPath)
let outPath;
if (alternate) {
  outPath = 'public/altImages.html';
} /*else if (book) {
  outPath = 'public/bookImages.html';
} else if (drop) {
   outPath = 'public/dropImages.html';
}else if (partition) {
   outPath = 'public/partitionImages.html';
} */ else if (top) {
   outPath = 'public/galleries.html';
}/*  else if (grid) {
  outPath = 'public/gridImages.html';
} else if (lines) {
  outPath = 'public/linesImages.html';
} else if (anim) {
  outPath = 'public/animImages.html';
} */else if (stills) {
  outPath = 'public/stillsImages.html';
}else if (alll) {
  outPath = 'public/allImages.html';
}else if (art) {
  outPath = 'public/artImages.html';
}  else if (allA) {
  outPath = 'public/allAImages.html';
} /* else if (web) {
  outPath = 'public/webImages.html';
} */else {
  outPath = 'public/images.html';
}
console.log('sectionsPath', sectionsPath,'outPath',outPath);

var fs = require('fs');

let fileExt = alternate?'mjs':'mjs';
let thePages = [];
let theTitles = [];
let theLongTitles = [];
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
   } /*else if (partition) {

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
    } */else if (stills) {
      kindTitle = 'Frames From Animations'
      aboutURL = "kop_stills.html";
    }  else if (alll) {
      kindTitle = 'Images';
      aboutURL = "all_images.html";
    }  else if (allA) {
      kindTitle = 'Animations';
      aboutURL = "kop_anim.html";
    }  else if (art) {
      kindTitle = 'Art';
      aboutURL = "art_images.html";
    }
    if (!top) {
    
      //aboutStart = anim?'':`<a style="color:white" href="doc/${aboutURL}">`;
      aboutStart = `<a style="color:white" href="doc/${aboutURL}">`;
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
 
  
  
const thingString = function (order,ix,dir,useThumb,ititle,props) {
	debugger;
  let {variant,likes,posted,category,sources,noTitle,video} = props;
  //console.log('POSTED',posted,'category',category,'kind',kind);
  if (!alll&&!allA&&!art&&((kind !=='alt') && (kind !== 'book') &&(category !==  kind))) {
    return '</div>';a
  }

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
  let title = ititle.split('-')[0];
  theTitles.push(title);
  theLongTitles.push(ititle);
  let vpath = (variant?path+'_v_'+variant:path);
  //console.log('variant',variant);
  //console.log('vpath',vpath);
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
//  console.log('kind',kind);
  let kindArg = 'imKind='+kind;
  let noTitleArg = '';//noTitle?'&noTitle=1':'';
 // let localArg = 'local='+(local_images||imagesHere?1:0);
  let localArg = 'local='+(local_images);
//  console.log('local_images',local_images,'imagesHere',imagesHere);
	let theImageArg = '';
	pageNumber++;
	let lastPageArg = (pageNumber === numPages)?'&lastPage=1':'';
	let rs,srcUrl,aboutURL,aboutStart,aboutLink;
	let astart = `<a style="color:white" href="page.html?image=${vx}&${pageArg}&${kindArg}&${localArg}${noTitleArg}">`;
  	let galURL,galStart,galLink;
  if (top) {
   /* if (title === 'Drops') {
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
    } else */ if (title === 'Stills') {
      galURL = "stillsImages.html";
    } else if (alll) {
      galURL = "allImages.html";
    } 
    

    galStart = `<a style="color:white" href="${galURL}">`;
    galLink = `${galStart}${title}</a>`
  }
  //console.log('ASTART',astart);
  //let propsStr = imagesHere?`<span style="font-size:10pt">${likes?'Likes '+likes:''} ${posted?"":" NOT POSTED"} ${local_images?'Local':''} ${category}</span><br>`:'';;
  let propsStr = '';
  let sourcenm = `source${sources?'s':''}`;
 // console.log('forKOP',forKOP);
	if (forKOP) {
		let titleLink = title?`${astart}${title}</a>`:'';
		//console.log('titleLink',titleLink);
    srcUrl = (sources)?`https://prototypejungle.net/doc/${path}_sources.html`:`https://prototypejungle.net/${dir}/${path}.${fileExt}`;
    rs = stills?`<div><p class="centered">${titleLink}</p><p class="centered">Frame ${props.frame}</p>`:`<div><p class="centered">${titleLink}</p>`
    rs = rs +`<p class="centered">${astart}<img width="200" src="${thumbsrc}" alt="Image Missing"></a></p></div>`;
     // console.log("RRRRSSS",rs);

	} else  {
  //  console.log('WWWWWWWWWWW');
    rs = `<div><p class="centered">${galLink}</p>`;

    rs = rs +
    `<p class="centered">${galStart}<img width="200" src="${thumbsrc}" alt="Image Missing"></a></p></div>`;
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
 const favorites =  ['crosshatch_1','bounce_16','curves_10','motion_24','drop_circles_20','gridSpinner_13','gridSpinner_5',
 'part2_0_43','paths_10','motion_18_32',
 'gons_3','bounce_1','bounce_17','bounce_4','cubes_1','curves_4','curves_7','curves_8','curves_9','gridSpinner_10','gridSpinner_7',
 'line_path_2_11','motion_21','motion_32','motion_5','mutate_6','part2_0_34','part2_0_46','paths_7','path_avoidance_5','path_avoidance_6',
 'path_rwalk_4_0',
 //now image faves
  'part2_0_1','drop_circles_14','drop_interpolate_0','ip_test_2',
 'triangle_0','grid_droplets_wide','drop_rects_1','lines_chaos_within_order','motion_29',//'drop_all_0',
 'grid_distortion_field_warped','drop_on_line',
 'drop_circles_3','drop_channels',
 'part2_0_23','part2_0_5','part2_0_10',
 'part2_0_3','part2_0_29','part2_0_6','part2_0_26',
 'drop_light','grid_enigma','drop_circles_18','drop_circles_4',
 'grid_comet','grid_mat','grid_drop_0','grid_maze',
 'drop_on_circles','drop_square','drop_triptych','lines_2',
 'grid_cloth','grid_ramp','grid_smoke_1','part2_0_2','part2_0_27','drop_all_0'
 
//'drop_all_2','drop_circles3','interpolate_colors_8','drop_on_top_2',
 ];

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
/*  const compareLikes = function (thing1,thing2) {
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
*/
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
      if (only_favorites && (alll||allA)&(favorites.indexOf(file)===-1)) {
        break;
      }
     // console.log('PROPS',props);
      //console.log('file',file);
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
	let js2 = `;let ${longTitlesVar} = ${JSON.stringify(theLongTitles)};`
 //   console.log('writeTheTitles',js,titlesPath);

	fs.writeFileSync(titlesPath,js.concat(js2));
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
 