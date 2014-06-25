/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright   Distributed under the BSD License.
 */

/*
 * TESTS
 */

var gallery = new Cl.Gallery();

module('cl.gallery.js');

test('Options', function() {
    var options = ['index', 'timeout', 'autoplay', 'easing', 'duration', 'autoHeight', 'autoResize', 'engine'];
    var defaults = [null, 5000, false, 'swing', 300, true, true, 'fade'];
    // tests
    $.each(options, function (index, option) {
        deepEqual(gallery.options[option], defaults[index], option + ' is available');
    });

    // custom checks
    var cls = gallery.options.cls;
    equal(cls.active, 'active', 'active is availalbe');
    equal(cls.wrapper, '.wrapper', 'wrapper is availalbe');
    equal(cls.viewport, '.viewport', 'viewport is availalbe');
    equal(cls.elements, '.item', 'elements is availalbe');
    equal(cls.next, '.trigger-next a', 'next is availalbe');
    equal(cls.previous, '.trigger-previous a', 'previous is availalbe');
    equal(cls.navigation, 'nav a', 'navigation is availalbe');

    var clsLength = getLength(gallery.options.cls);
    ok(clsLength === 7, 'there are ' + clsLength + ' cls options');

    var length = getLength(gallery.options);
    ok(length === 9, 'there are ' + length + ' options');
});

test('Methods', function() {
    var methods = ['next', 'previous', 'move', 'play', 'stop', 'update'];
    // tests
    $.each(methods, function (index, method) {
        equal(typeof(gallery[method]), 'function', method + ' is available');
    });

    // check method count
    ok(methods.length === 6, 'there are ' + methods.length + ' methods');
});