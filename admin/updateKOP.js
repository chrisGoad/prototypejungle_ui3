



var fs = require('fs');
/*
 var xferFile = function(dir,ffl) {
    console.log('read',ffl);
     var scripts = '';
     let spath = (dir==='')?ffl:dir+'/'+ffl;
     let isHtml = endsIn(ffl,'.html');
    let ipath = '../../prototypejungle_ui3/'+spath;
    if (isHtml) {
      var vl = fs.readFileSync(ipath).toString();
      console.log('read',ipath);
     let  ovl = insertBoilerplate(vl,scripts,'');
     console.log('writing',ffl);
     fs.writeFileSync(spath,ovl);
    } else {
      console.log('copying ',ipath,' to ',spath);
      fs.copyFileSync(ipath, spath);
    }

  }
 */ 

  var xferFile = function(dir,ifl,iofl) {
    let ofl = iofl?iofl:ifl;
   let ipath = dir+'/'+ifl; 
    //var vl = fs.readFileSync(ipath).toString();
    let opath = '../kop/'+dir+'/'+ofl;
    console.log('copying ',ipath,' to ',opath);
    fs.copyFileSync(ipath, opath);
   
  }
  
  
const xferFiles = function (dir,files) {
  files.forEach( (file) => xferFile(dir,file));
}

xferFile('public','galleries.html');
xferFile('public','reallySetAtKOP.js','setAtKOP.js');
//xferFile('public','galleries.html','index.html');
//xferFile('public','images.html','index.html');
xferFiles('public',['dropPages.js','dropTitles.js','dropImages.html','draw.html',
                     'linesPages.js','linesTitles.js','linesImages.html',
                     'animPages.js','animTitles.js','animImages.html',
                     'stillsPages.js','stillsTitles.js','stillsImages.html',
                     'allPages.js','allTitles.js','allImages.html',
                     'allAPages.js','allATitles.js','allAImages.html',
                     'gridPages.js','gridTitles.js','gridImages.html',
                     'partitionPages.js','partitionTitles.js','partitionImages.html',
                     'webPages.js','webTitles.js','webImages.html',
                     'page.html','pageSupport.js']);
 xferFiles('public/doc',['all_images.html','kop_anim.html','kop_drop.html','generators.html','kop_partition.html','kop_grid.html','kop_web.html','kop_stills.html',
    'kop_lines.html','kop_general.html','style.css']);
 xferFiles('public/doc',['index.html','prototypetree.html','geometry.html','shapes.html','basics.html','method_modules.html','grid.html',
                         'boundedRandomGrids.html','lines.html','drop.html','partition.html','docSupport.js','prototypeDiagram1_withText.svg',
                         'example1.mjs','grid_example2.mjs','instantiation.html','instantiate.js','crossTree.svg',
                         'instantiateDiagram1.jpg','instantiateDiagram2.jpg',"example1.jpg"]);
  xferFiles('public/mlib',['grid.mjs','drop.mjs','lines.mjs','basics.mjs','boundedRandomGrids.mjs','partTree2.mjs']);
  xferFiles('public/generators',['grid_distortion_field.mjs']);
              xferFile('public','index.html');
          

//xferFiles('public',['gPages.js','gTitles.js','gLocals.js','page.html','pageSupport.js']);

 




  