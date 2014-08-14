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
        fixture.append('<form action="." method="post" class="frm"><fieldset><h4>File field</h4><div><label>upload <input type="file" class="uniform" /></label></div><div><label>upload <input type="file" class="uniform" disabled="disabled" /></label></div></fieldset><fieldset><h4>Select field</h4><div><label>choose <select class="uniform"><option value="">Select 1</option><option>Select 2</option><option>Select 3</option></select></label></div><div><label>choose <select class="uniform" disabled><option value="">Select 1</option><option>Select 2</option><option>Select 3</option></select></label></div></fieldset><div class="col-two"><fieldset><h4>Radio field</h4><div><label><input type="radio" name="radiogroup1" class="uniform" /> radiogroup 1</label></div><div><input type="radio" name="radiogroup1" class="uniform" id="field-radiotest" required="required" /> <label for="field-radiotest">radiogroup 1</label></div><div><label><input type="radio" name="radiogroup1" class="uniform" checked="checked" /> radiogroup checked</label></div><div><label><input type="radio" name="radiogroup1" class="uniform" disabled="disabled" /> radiogroup disabled</label></div></fieldset></div><div class="col-two col-last"><fieldset><h4>Checkbox field</h4><div><label><input type="checkbox" name="check1" class="uniform" /> checkbox 1</label></div><div><input type="checkbox" name="check3" class="uniform" id="field-checktest" required="required" /> <label for="field-checktest">checkbox 3</label></div><div><label><input type="checkbox" name="check4" class="uniform" checked="checked" /> checkbox checked</label></div><div><label><input type="checkbox" name="check5" class="uniform" disabled="disabled" /> checkbox disabled</label></div></fieldset></div></form>');
        fixture.find('form').on('submit', function (e) {
            e.preventDefault();
        });
        new Cl.Uniform('.uniform');
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

test('Test Uniform File Upload', function() {
    var fixture = $('#qunit-fixture');
    var upload = fixture.find('input[type="file"]');

    // Basic Test if HTML is available
    ok(upload.length === 2, 'all three upload fields are available.');
    ok(upload.eq(1).prop('disabled') === true, 'second upload is disabled.');

    // set Focus to active file upload
    upload.eq(0).trigger('focus');
    ok($(document.activeElement).prop('tagName') === 'INPUT', 'file upload is focusable');
    // reset Focus
    upload.eq(0).trigger('blur');

    upload.eq(1).trigger('focus');
    ok($(document.activeElement).prop('tagName') === 'BODY', 'disabled file upload is not focusable');
});

test('Test Uniform Radio button', function() {
    var fixture = $('#qunit-fixture');
    var radio = fixture.find('input[type="radio"]');
    var fakeClick = function (el) {
        var ev = document.createEvent('MouseEvent');
        ev.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        el.dispatchEvent(ev);
    };

    // Basic Test if HTML is available
    ok(radio.length === 4, 'all four radio fields are available.');
    ok(radio.eq(1).prop('required') === true, 'second radio is required.');
    ok(radio.eq(2).prop('checked') === true, 'third radio is checked.');
    ok(radio.eq(3).prop('disabled') === true, 'last radio is disabled.');

    // test if span get applied
    ok(radio.eq(0).parent().prop('tagName') === 'SPAN', 'parent span got applied.');
    ok(radio.eq(0).siblings().prop('tagName') === 'SPAN', 'sibling span got applied.');
    ok(radio.eq(0).siblings().length === 1, 'there is only the knob as sibling.');
    ok(radio.eq(0).siblings().is(':visible') === false, 'knob is not visible when radio is not checked, inital state.');
    ok(radio.eq(2).siblings().is(':visible') === true, 'knob is visible when radio is checked, inital state.');
    ok(radio.eq(3).parent().hasClass('uniform-disabled') === true, 'parent gets class disabled when radio is disabled.');

    // normal focus
    radio.eq(0).trigger('focus');
    ok($(document.activeElement).prop('tagName') === 'INPUT', 'radio is focusable');
    ok(radio.eq(0).parent().hasClass('uniform-focus') === true, 'radio span has class uniform-focus');
    // reset Focus
    radio.eq(0).trigger('blur');

    // normal click
    radio.eq(1).trigger('click');
    ok($(document.activeElement).prop('tagName') === 'INPUT', 'radio is set to current focus after click on radio.');
    ok(radio.eq(1).siblings().is(':visible') === true, 'knob changed to visible after click on radio.');
    ok(radio.eq(2).siblings().is(':visible') === false, 'inital state changed after click on a radio.');

    // click on label
    // radio.eq(0).parents('label').trigger('click');
    fakeClick(radio.eq(0).parents('label')[0]); // trigger fake click because phantomjs does not bubble down to radio
    ok(radio.eq(0).siblings().is(':visible') === true, 'knob changed to visible after click on label.');

    // radio trigger change
    radio.eq(1).trigger('change');
    ok(radio.eq(1).siblings().is(':visible') === true, 'knob changed to visible after trigger change on radio.');
});
