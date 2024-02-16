



var fs = require('fs');

  var xferFile = function(dir,ifl,iofl) {
    let ofl = iofl?iofl:ifl;
   let ipath = dir+'/'+ifl+'.jpg'; 
    //var vl = fs.readFileSync(ipath).toString();
    let opath = '../kop/'+dir+'/'+ofl+'.jpg';
    console.log('copying ',ipath,' to ',opath);
    fs.copyFileSync(ipath, opath);
   
  }
  
  
const xferFiles = function (dir,files) {
  files.forEach( (file) => xferFile(dir,file));
}

//xferFiles('public/images/hi_res',['part2_0_1','part2_0_2','part2_0_25','part2_0_7','quad_9_3','quad_9_6','quad_11','part2_0_19','part2_0_3','quad_15_1','part2_0_6','part2_0_27']);

//xferFiles('public/images/hi_res',['web_random_radius_v_3','drop_light','drop_dandelion','drop_circles_23','drop_ice','drop_iris','drop_night','drop_arrows','drop_clouds','drop_metal_2','drop_space_junk','drop_all_0','drop_circles_14','drop_circles_3','drop_circles_10','drop_rects_1']);

//xferFiles('public/images/hi_res',['motion_29','lines_chaos_within_order','lines_lights','lines_bugeyes','lines_2']);

xferFiles('public/images/hi_res',['grid_fade','grid_void','grid_comet','grid_vortex','grid_ramp','grid_enigma','grid_cloudy_sky','grid_bump','grid_distortion_field_warped','grid_code','grid_quilt_1','grid_shield','grid_mat','grid_smoke_1','grid_cloth','grid_two_quilts','grid_quilt_3','grid_metal','grid_1','grid_droplets','grid_maze','grid_3','grid_atlas','grid_book','grid_signals','grid_beacons','grid_star_maps']);
