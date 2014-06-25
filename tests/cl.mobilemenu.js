/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright   Distributed under the BSD License.
 */

/*
 * TESTS
 */

var mobilemenu = new Cl.Mobilemenu();

module('cl.mobilemenu.js');

test('Options', function() {
    var options = ['easing', 'duration', 'bound', 'ratio', 'offset', 'overlay'];
    var defaults = ['swing', 300, 539, (70/100), { 'left':0, 'top':0 }, '<div class="mainnav-overlay"></div>'];
    // tests
    $.each(options, function (index, option) {
        deepEqual(mobilemenu.options[option], defaults[index], option + ' is available');
    });

    // custom checks
    var cls = mobilemenu.options.cls;
    equal(cls.menu, '.mainnav', 'menu is availalbe');
    equal(cls.inner, '> ul', 'inner is availalbe');
    equal(cls.knob, '.mainnav-knob', 'knob is availalbe');

    var clsLength = getLength(mobilemenu.options.cls);
    ok(clsLength === 3, 'there are ' + clsLength + ' cls options');

    var length = getLength(mobilemenu.options);
    ok(length === 7, 'there are ' + length + ' options');
});

test('Methods', function() {
    var methods = ['toggle', 'show', 'hide'];
    // tests
    $.each(methods, function (index, method) {
        equal(typeof(mobilemenu[method]), 'function', method + ' is available');
    });

    // check method count
    ok(methods.length === 3, 'there are ' + methods.length + ' methods');
});