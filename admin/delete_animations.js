



var fs = require('fs');
console.log('delete animations');

var dan = function () {
  
  let anims = fs.readdirSync('public/animations');
  //console.log('anims',anims);
  anims.forEach((a) => {
    console.log('a',a);
    fs.rmSync('public/animations/'+a);
  });
  fs.rmdirSync('public/animations');
  fs.mkdirSync('public/animations');
}


dan();





  