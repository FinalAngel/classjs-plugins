/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.0.0
 */

/*
 * TESTS
 */

var accordion = new Cl.Accordion();

module("cl.accordion.js");

test('Options', function() {
	var options = ['index', 'expanded', 'event', 'easing', 'duration', 'grouping', 'forceClose',
		'disableAnchors'];
	var defaults = [null, false, 'click focusin', 'linear', 300, true, false, true];
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

	var length = getLength(accordion.options);
	ok(length === 10, 'there are ' + length + ' options')
});

test('Methods', function() {
	var methods = ['toggle', 'show', 'hide'];
	// tests
	$.each(methods, function (index, method) {
		equal(typeof(accordion[method]), 'function', method + ' is available');
	});
	
	// check method count
	ok(methods.length === 3, 'there are 3 methods')
});