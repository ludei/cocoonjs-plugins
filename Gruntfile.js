var fs = require('fs');

module.exports = function( grunt ) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    /** 
    * Concatenante all the extensions
    * 
    */
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'src/cocoon.js',
          'src/cocoon_signal.js',
          'src/cocoon_app.js',

          'src/device/cocoon_platform.js',
          'src/device/cocoon_utils.js',
          'src/device/cocoon_dialog.js',
          'src/device/cocoon_webview.js',
          'src/device/cocoon_proxify.js',
          'src/device/cocoon_device.js',
          'src/device/cocoon_motion.js',
          'src/device/cocoon_touch.js',
          'src/device/cocoon_widget.js',
          'src/device/cocoon_camera.js',
          'src/device/cocoon_gamepad.js',

          'src/billing/cocoon_ad.js',
          'src/billing/cocoon_store.js',
          
          'src/social/cocoon_notification.js',
          'src/social/cocoon_social.js',
          'src/social/cocoon_manager.js',
          'src/social/cocoon_local_storage.js',
          'src/social/cocoon_google_play_games.js',
          'src/social/cocoon_game_center.js',
          'src/social/cocoon_facebook.js',

          'src/multiplayer/cocoon_multiplayer.js',
          'src/multiplayer/cocoon_multiplayer_loopback.js',
          'src/multiplayer/cocoon_multiplayer_googleplaygames.js',
          'src/multiplayer/cocoon_multiplayer_game_center.js'

        ],
        dest: 'src/build/cocoon.js'
      },
    },
    /** 
    * Copy from src/ to build/
    * 
    */
    copy: {
      main: {
        expand: true,
        cwd: 'src/build/',
        src: '**',
        dest: 'build/',
        flatten: true,
        filter: 'isFile',
      },
    },
    /** 
    * Minify the extensions
    * 
    */
    uglify: {
      options: {
        mangle: false
      },
      dist: {
          files: {
              'build/cocoon.min.js': ['src/build/cocoon.js'],
              'build/cocoon_box2d.min.js': ['src/device/cocoon_box2d.js']
          }
      }
    }

  });
  /** 
  * Clean directories and build the extensions
  * 
  */
  grunt.registerTask('complete', function() {
    var buildPath = "src/build/";
    var documPath = "build/doc";
    
    var done = this.async();
    
    deleteFolderRecursive(buildPath);
    deleteFolderRecursive(documPath);

    console.log("The build file is located here: " , __dirname + '/build/cocoon.js');

      fs.readFile(__dirname + '/build/cocoon.js', function read(err, data) {
          if (err) {
              throw err;
          }
          try {
            console.log("#########EVALUATING COCOONJ EXTENSIONS#########");
            eval(
              "window = global;" +
              "global.window.ext = {};" +
              "global.window.ext.IDTK_SRV_BOX2D = true;" +
              "global.window.addEventListener = function(){};"+
              "global.window.debug = true; " +
              "global.navigator = {}; " +
              data.toString()
            );
          } catch (e) {
            console.log("#########ERROR INSIDE COCOONJS EXTENSIONS:#########");
            console.log(e);
            console.log("######### EO ERROR INSIDE COCOONJS EXTENSIONS:#########");
            done(false);
          }
      });
      
  });

  grunt.registerTask('jsdoc', function() {
    var spawn = require('child_process').spawn;
    var done = this.async();

    var ls = spawn('jsdoc', [ __dirname + '/build/cocoon.js' , "-d" , __dirname + '/build/doc', "-t" , __dirname + '/template', "-c" , __dirname + '/template/jsdoc.conf.json', '--verbose' ], {
      stdio:['ipc']
    });
    console.log("Generating JSDoc...");

    ls.stdout.on('data', function(data) {
      console.log('JSDOC output: ');
      console.log(data.toString('utf8'));
    });
    
    ls.on('close', function (code) {
      if(code == 0){
        done();
      }else{
        console.log("Can't create JSDoc, exit code: " + code);
        done(false);
      }
    });

  });
  /** 
  * Grunt's plugins
  * 
  */
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  /** 
  * Setup the tasks, by execution order.
  * 
  */
  grunt.registerTask('default', ['concat','uglify','copy','complete']);
  grunt.registerTask('documentation', ['jsdoc']);

};
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};