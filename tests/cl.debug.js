/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright   Distributed under the BSD License.
 */

/*
 * TESTS
 */

var debug = new Cl.Debug();

module('cl.debug.js');

test('Options', function() {
    var options = ['closed', 'collapsed'];
    var defaults = [false, true];
    // tests
    $.each(options, function (index, option) {
        deepEqual(debug.options[option], defaults[index], option + ' is available');
    });

    //var length = getLength(debug.options);
    //ok(methods.length === 2, 'there are ' + methods.length + ' methods');
});