/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright   Distributed under the BSD License.
 */

/*
 * TESTS
 */

var autocomplete = new Cl.Autocomplete();

module('cl.autocomplete.js');

test('Options', function() {
    var options = ['url', 'minLength', 'easing', 'duration', 'delay', 'fx', 'closeOnBlur'];
    var defaults = [false, 3, 'swing', 300, 300, 'slide', false];
    // tests
    $.each(options, function (index, option) {
        deepEqual(autocomplete.options[option], defaults[index], option + ' is available');
    });

    // custom checks
    var cls = autocomplete.options.cls;
    equal(cls.field, 'input[type="search"]', 'field is availalbe');
    equal(cls.results, '.autocomplete-results', 'results is availalbe');
    equal(cls.item, '.autocomplete-item', 'item is availalbe');
    equal(cls.close, '.autocomplete-close', 'close is availalbe');
    equal(cls.submit, '.autocomplete-submit', 'submit is availalbe');

    var lang = autocomplete.options.lang;
    equal(lang.error, 'There has been an error!');
    equal(lang.empty, 'No results.');

    var clsLength = getLength(autocomplete.options.cls);
    ok(clsLength === 5, 'there are ' + clsLength + ' cls options');

    var langLength = getLength(autocomplete.options.lang);
    ok(langLength === 2, 'there are ' + langLength + ' lang options');

    var length = getLength(autocomplete.options);
    ok(length === 9, 'there are ' + length + ' options');
});

test('Methods', function() {
    var methods = ['show', 'hide', 'search'];
    // tests
    $.each(methods, function (index, method) {
        equal(typeof(autocomplete[method]), 'function', method + ' is available');
    });

    // check method count
    ok(methods.length === 3, 'there are ' + methods.length + ' methods');
});