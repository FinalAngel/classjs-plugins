/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 */

/*
 * TESTS
 */

var carousel = new Cl.Carousel();

module('cl.carousel.js');

test('Options', function() {
	var options = ['index', 'timeout', 'autoplay', 'easing', 'duration', 'move', 'momentum'];
	var defaults = [null, null, false, 'linear', 300, 'auto', true];
	// tests
	$.each(options, function (index, option) {
		deepEqual(carousel.options[option], defaults[index], option + ' is available');
	});

	// custom checks
	var cls = carousel.options.cls;
	equal(cls.active, 'active', 'active is availalbe');
	equal(cls.disabled, 'disabled', 'disabled is availalbe');
	equal(cls.wrapper, '.wrapper', 'wrapper is availalbe');
	equal(cls.viewport, '.viewport', 'viewport is availalbe');
	equal(cls.elements, '.item', 'elements is availalbe');
	equal(cls.next, '.trigger-next a', 'next is availalbe');
	equal(cls.previous, '.trigger-previous a', 'previous is availalbe');
	equal(cls.navigation, 'nav a', 'navigation is availalbe');

	var clsLength = getLength(carousel.options.cls);
	ok(clsLength === 8, 'there are ' + clsLength + ' cls options');

	var length = getLength(carousel.options);
	ok(length === 8, 'there are ' + length + ' options');
});

test('Methods', function() {
	var methods = ['next', 'previous', 'move', 'play', 'stop', 'update', 'destroy'];
	// tests
	$.each(methods, function (index, method) {
		equal(typeof(carousel[method]), 'function', method + ' is available');
	});

	// check method count
	ok(methods.length === 7, 'there are ' + methods.length + ' methods')
});