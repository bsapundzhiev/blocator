module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: '../../scripts',
                    src: ['utils/message.js','utils/wsclient.js', 'utils/parser.js','utils/js-util.js',
			             'controllers/map.js', 'controllers/open-street-map-leaflet.js'],
                    dest: 'www/js'
                }]
            },
	    libs: {
                files: [{
                    expand: true,
                    cwd: '../../',
                    src: ['libs/**/*'],
                    dest: 'www/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['copy']);
};
