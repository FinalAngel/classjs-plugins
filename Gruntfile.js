/*global module:false*/
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			all: ['tests/*.html']
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
		},
		uglify: {
			all: {
				files: {
					'src/cl.accordion/cl.accordion.min.js': ['src/cl.accordion/cl.accordion.js'],
					'src/cl.autocomplete/cl.autocomplete.min.js': ['src/cl.autocomplete/cl.autocomplete.js'],
					'src/cl.carousel/cl.carousel.min.js': ['src/cl.carousel/cl.carousel.js'],
					'src/cl.debug/cl.debug.min.js': ['src/cl.debug/cl.debug.js'],
					'src/cl.gallery/cl.gallery.min.js': ['src/cl.gallery/cl.gallery.js'],
					'src/cl.lightbox/cl.lightbox.min.js': ['src/cl.lightbox/cl.lightbox.js'],
					'src/cl.mobilemenu/cl.mobilemenu.min.js': ['src/cl.mobilemenu/cl.mobilemenu.js'],
					'src/cl.parallax/cl.parallax.min.js': ['src/cl.parallax/cl.parallax.js'],
					'src/cl.scroll/cl.scroll.min.js': ['src/cl.scroll/cl.scroll.js'],
					'src/cl.touch/cl.touch.min.js': ['src/cl.touch/cl.touch.js'],
					'src/cl.uniform/cl.uniform.min.js': ['src/cl.uniform/cl.uniform.js']
				},
				options: {
					report: 'min'
				}
			}
		}
	});

	// Travis CI task.
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task.
	grunt.registerTask('default', ['uglify', 'qunit', 'jshint']);
};