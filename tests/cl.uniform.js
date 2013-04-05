/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 */

/*
 * TESTS
 */

var uniform = new Cl.Uniform();

module('cl.carousel.js');

test('Options', function() {
	var options = ['offset'];
	var defaults = [-9999];
	// tests
	$.each(options, function (index, option) {
		deepEqual(uniform.options[option], defaults[index], option + ' is available');
	});

	// custom checks
	var cls = uniform.options.cls;
	equal(cls.prefix, 'uniform', 'prefix is availalbe');
	equal(cls.radio, 'radio', 'radio is availalbe');
	equal(cls.checkbox, 'checkbox', 'checkbox is availalbe');
	equal(cls.file, 'file', 'file is availalbe');
	equal(cls.select, 'select', 'select is availalbe');
	equal(cls.disabled, 'disabled', 'disabled is availalbe');
	equal(cls.focus, 'focus', 'focus is availalbe');

	var lang = uniform.options.lang;
	equal(lang.fileBtn, 'Upload', 'fileBtn is availalbe');
	equal(lang.fileStatus, 'Please select a file...', 'fileStatus is availalbe');

	var clsLength = getLength(uniform.options.cls);
	ok(clsLength === 7, 'there are ' + clsLength + ' cls options');

	var langLength = getLength(uniform.options.lang);
	ok(langLength === 2, 'there are ' + clsLength + ' lang options');

	var tplLength = getLength(uniform.options.tpl);
	ok(tplLength === 4, 'there are ' + tplLength + ' tpl options');

	var length = getLength(uniform.options);
	ok(length === 4, 'there are ' + length + ' options');
});

test('Methods', function() {
	var methods = ['update', 'destroy'];
	// tests
	$.each(methods, function (index, method) {
		equal(typeof(uniform[method]), 'function', method + ' is available');
	});

	// check method count
	ok(methods.length === 2, 'there are ' + methods.length + ' methods')
});