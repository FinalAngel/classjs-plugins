/*global module:false*/
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			files: ['tests/*.html']
		},
		jshint: {
			all: ['Gruntfile.js',
				'src/**/cl.accordion.js',
				'src/**/cl.autocomplete.js',
				'src/**/cl.carousel.js',
				//'src/**/cl.debug.js',
				'src/**/cl.gallery.js',
				'src/**/cl.lightbox.js',
				'src/**/cl.mobilemenu.js',
				'src/**/cl.parallax.js',
				'src/**/cl.scroll.js',
				'src/**/cl.touch.js',
				'src/**/cl.uniform.js',
				'tests/cl.*.js'],
			options: {
				// http://www.jshint.com/docs/options/
				// Enforcing options
				bitwise: true,
				camelcase: true,
				curly: false,
				eqeqeq: true,
				freeze: true,
				immed: true,
				indent: true,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				quotmark: 'single',
				undef: false,
				unused: true,
				// Relaxing options
				boss: true,
				expr: true,
				jquery: true,
				// Global variables
				globals: {
					jQuery: true,
					Cl: true
				}
			}
		}
	});

	// Travis CI task.
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Default task.
	grunt.registerTask('default', ['qunit', 'jshint']);
};