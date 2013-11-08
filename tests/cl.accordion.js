/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 */

/*
 * TESTS
 */

var accordion = new Cl.Accordion();

module('cl.accordion.js');

test('Options', function() {
	var options = ['index', 'expanded', 'event', 'easing', 'duration', 'grouping', 'forceClose',
		'disableAnchors', 'autoHeight'];
	var defaults = [null, false, 'click', 'swing', 300, true, false, true, false];
	// tests
	$.each(options, function (index, option) {
		deepEqual(accordion.options[option], defaults[index], option + ' is available');
	});

	// custom checks
	var cls = accordion.options.cls;
	equal(cls.expanded, 'expanded', 'expanded is availalbe');
	equal(cls.collapsed, 'collapsed', 'collapsed is availalbe');
	equal(cls.trigger, '.trigger', 'trigger is availalbe');
	equal(cls.container, '.container', 'container is availalbe');
	equal(cls.text, '.text', 'text is availalbe');

	var lang = accordion.options.lang;
	equal(lang.expanded, 'Expanded ', 'expanded is availalbe');
	equal(lang.collapsed, 'Collapsed ', 'collapsed is availalbe');

	var clsLength = getLength(accordion.options.cls);
	ok(clsLength === 5, 'there are ' + clsLength + ' options');

	var langLength = getLength(accordion.options.lang);
	ok(langLength === 2, 'there are ' + langLength + ' options');

	var length = getLength(accordion.options);
	ok(length === 11, 'there are ' + length + ' options');
});

test('Methods', function() {
	var methods = ['toggle', 'show', 'hide'];
	// tests
	$.each(methods, function (index, method) {
		equal(typeof(accordion[method]), 'function', method + ' is available');
	});

	// check method count
	ok(methods.length === 3, 'there are ' + methods.length + ' methods');
});

test('Test for issue #39: Actually assign correct index', function() {
	accordion.show(1);
	equal(accordion.index, 1, 'index is set to 1');
	accordion.show(0);
	equal(accordion.index, 0, 'index is set to 0');
});