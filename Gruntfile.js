/*global module:false*/
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    	qunit: {
			files: ['tests/*.html']
        }
	});

	// Travis CI task.
	grunt.loadNpmTasks('grunt-contrib-qunit');

	// Default task.
	grunt.registerTask('default', ['qunit']);
};