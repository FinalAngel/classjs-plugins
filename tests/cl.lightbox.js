/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 */

/*
 * TESTS
 */

var lightbox = new Cl.Lightbox();

module('cl.lightbox.js');

test('Options', function() {
	var options = ['prefix', 'group', 'cycle', 'modal', 'modalClickable', 'modalClosable', 'forceLoad',
		'easing', 'duration', 'speed', 'fixed', 'responsive', 'ajax', 'controls', 'cls', 'opacity', 'styles', 'keys'];
	var defaults = ['cl', true, true, true, true, true, false, 'swing', 300, 300, true, true, false, true, '', 0.8, {}, true];
	// tests
	$.each(options, function (index, option) {
		deepEqual(lightbox.options[option], defaults[index], option + ' is available');
	});

	// custom checks
	var dimensions = lightbox.options.dimensions;
	equal(dimensions.initialWidth, 50, 'initialWidth is availalbe');
	equal(dimensions.initialHeight, 50, 'initialHeight is availalbe');
	equal(dimensions.offset, 20, 'offset is availalbe');
	equal(dimensions.width, null, 'width is availalbe');
	equal(dimensions.height, null, 'height is availalbe');

	var keycodes = lightbox.options.keyCodes;
	deepEqual(keycodes.close, [27, 99], 'close is availalbe');
	deepEqual(keycodes.next, [39, 110], 'next is availalbe');
	deepEqual(keycodes.previous, [37, 112], 'previous is availalbe');

	var lang = lightbox.options.lang;
	equal(lang.close, 'Close lightbox', 'close is availalbe');
	equal(lang.errorMessage, '<p><strong>The requested element could not be loaded.</strong><br />' +
		'Please contact us if this error occurs again.</p>', 'errorMessage is availalbe');
	equal(lang.next, 'Next', 'next is availalbe');
	equal(lang.previous, 'Previous', 'previous is availalbe');
	equal(lang.status, 'Slide {current} of {total}.', 'status is availalbe');
});

test('Methods', function() {
	var methods = ['open', 'close', 'resize', 'destroy', 'next', 'previous', 'getElement', 'getCollection'];
	// tests
	$.each(methods, function (index, method) {
		equal(typeof(lightbox[method]), 'function', method + ' is available');
	});
	// check method count
	ok(methods.length === 8, 'there are ' + methods.length + ' methods');
});