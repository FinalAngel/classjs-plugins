/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright   Distributed under the BSD License.
 */

/*
 * TESTS
 */

var uniform = new Cl.Uniform();

module('cl.uniform.js', {
    setup: function () {
        var fixture = $('#qunit-fixture');
        fixture.append([
            '<div class="uniformed">',
                '<form class="form1" action="."><input type="radio" name="x" value="1" checked="checked" /><input type="radio" name="x" value="2" /></form>',
                '<form class="form2" action="."><input type="radio" name="x" value="3" checked="checked" /><input type="radio" name="x" value="4" /></form>',
                '<div class="not-a-form">',
                    '<input type="radio" name="x" value="5" />',
                    '<input type="radio" name="x" value="6" />',
                    '<input type="radio" name="x" value="7" checked="checked" />',
                    '<input type="radio" name="x" value="8" />',
                '</div>',
            '</div>'
        ].join(''));

        new Cl.Uniform('.uniformed input:radio');

    }
});

test('Options', function() {
    var options = ['offset'];
    var defaults = [-9999];
    // tests
    $.each(options, function (index, option) {
        deepEqual(uniform.options[option], defaults[index], option + ' is available');
    });

    // custom checks
    var cls = uniform.options.cls;
    equal(cls.prefix, 'uniform', 'prefix is available');
    equal(cls.radio, 'radio', 'radio is available');
    equal(cls.checkbox, 'checkbox', 'checkbox is available');
    equal(cls.file, 'file', 'file is available');
    equal(cls.select, 'select', 'select is available');
    equal(cls.disabled, 'disabled', 'disabled is available');
    equal(cls.focus, 'focus', 'focus is available');
    equal(cls.ready, 'ready', 'ready is available');

    var lang = uniform.options.lang;
    equal(lang.fileBtn, 'Upload', 'fileBtn is available');
    equal(lang.fileStatus, 'Please select a file...', 'fileStatus is available');

    var clsLength = getLength(uniform.options.cls);
    ok(clsLength === 8, 'there are ' + clsLength + ' cls options');

    var langLength = getLength(uniform.options.lang);
    ok(langLength === 2, 'there are ' + clsLength + ' lang options');

    var tplLength = getLength(uniform.options.tpl);
    ok(tplLength === 5, 'there are ' + tplLength + ' tpl options');

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
    ok(methods.length === 2, 'there are ' + methods.length + ' methods');
});

test('Test for issue #41: Uniform Upload in IE', function() {
    var fixture = $('#qunit-fixture');
    fixture.append('<form action="." method="post"><input type="file" class="uniform" /></form>');
    fixture.find('form').on('submit', function (e) {
        e.preventDefault();
    });
    new Cl.Uniform('.uniform');
    // set a value
    var upload = fixture.find('input[type="file"]');

    ok(upload.length === 1, 'upload field is available.');
});

test('Test for issue #59: radios with same name across different forms', function () {
    var fixture = $('#qunit-fixture');

    equal(fixture.find('.form1').find('input:radio:checked').val(), '1', 'initial values are ok');
    equal(fixture.find('.form2').find('input:radio:checked').val(), '3', 'initial values are ok');
    // NOTE: these tests are commented because PhantomJS currently incorrectly handles radio groups that are injected/modified
    // https://github.com/ariya/phantomjs/issues/12039
    // equal(fixture.find('.not-a-form').find('input:radio:checked').val(), '7', 'initial values are ok');
});

test('Test for issue #59: radios with same name across different forms', function () {
    var fixture = $('#qunit-fixture');
    fixture.find('.form1').find('input:radio:last').prop('checked', true).trigger('change');

    equal(fixture.find('.form1').find('input:radio:checked').val(), '2', 'change in the form affects only that form');
    equal(fixture.find('.form2').find('input:radio:checked').val(), '3', 'change in the form affects only that form');
    // equal(fixture.find('.not-a-form').find('input:radio:checked').val(), '7', 'change in the form affects only that form');
});

test('Test for issue #59: radios with same name across different forms', function () {
    var fixture = $('#qunit-fixture');
    fixture.find('.not-a-form').find('input:radio:first').prop('checked', true).trigger('change');

    equal(fixture.find('.form1').find('input:radio:checked').val(), '1', 'change outside of the form affects only radios that are outside of forms');
    equal(fixture.find('.form2').find('input:radio:checked').val(), '3', 'change outside of the form affects only radios that are outside of forms');
    equal(fixture.find('.not-a-form').find('input:radio:checked').val(), '5', 'change outside of the form affects only radios that are outside of forms');
});
