/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright   Distributed under the BSD License.
 */

/*
 * TESTS
 */

var uniform = new Cl.Uniform();
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
        fixture.append('<form action="." method="post" class="frm frm-upload-1"><input type="file" class="uniform" /></form>');
        fixture.append([
            '<form action="." method="post" class="frm frm-upload-2">',
                '<fieldset>',
                    '<h4>File field</h4>',
                    '<div><label>upload <input type="file" class="uniform" /></label></div>',
                    '<div><label>upload <input type="file" class="uniform" disabled="disabled" /></label></div>',
                '</fieldset>',
                '<fieldset>',
                    '<h4>Select field</h4>',
                    '<div><label>choose <select class="uniform"><option value="">Select 1</option><option>Select 2</option><option>Select 3</option></select></label></div>',
                    '<div><label>choose <select class="uniform" disabled><option value="">Select 1</option><option>Select 2</option><option>Select 3</option></select></label></div>',
                '</fieldset>',
                '<div class="col-two">',
                    '<fieldset>',
                        '<h4>Radio field</h4>',
                        '<div><label><input type="radio" name="radiogroup1" class="uniform" /> radiogroup 1</label></div>',
                        '<div><input type="radio" name="radiogroup1" class="uniform" id="field-radiotest" required="required" /> <label for="field-radiotest">radiogroup 1</label></div>',
                        '<div><label><input type="radio" name="radiogroup1" class="uniform" checked="checked" /> radiogroup checked</label></div>',
                        '<div><label><input type="radio" name="radiogroup1" class="uniform" disabled="disabled" /> radiogroup disabled</label></div>',
                    '</fieldset>',
                '</div>',
                '<div class="col-two col-last">',
                    '<fieldset>',
                        '<h4>Checkbox field</h4>',
                        '<div><label><input type="checkbox" name="check1" class="uniform" /> checkbox 1</label></div>',
                        '<div><input type="checkbox" name="check3" class="uniform" id="field-checktest" required="required" /> <label for="field-checktest">checkbox 3</label></div>',
                        '<div><label><input type="checkbox" name="check4" class="uniform" checked="checked" /> checkbox checked</label></div>',
                        '<div><label><input type="checkbox" name="check5" class="uniform" disabled="disabled" /> checkbox disabled</label></div>',
                    '</fieldset>',
                '</div>',
            '</form>'
        ].join(''));
        fixture.find('form').on('submit', function (e) {
            e.preventDefault();
        });

        new Cl.Uniform('.uniformed input:radio');
        new Cl.Uniform('.frm .uniform');
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
    equal(cls.checked, 'checked', 'checked is available');

    var lang = uniform.options.lang;
    equal(lang.fileBtn, 'Upload', 'fileBtn is available');
    equal(lang.fileStatus, 'Please select a file...', 'fileStatus is available');

    var clsLength = getLength(uniform.options.cls);
    ok(clsLength === 9, 'there are ' + clsLength + ' cls options');

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
    var upload = fixture.find('.frm-upload-1 input[type="file"]');

    ok(upload.length === 1, 'upload field is available.');
});

test('Test Uniform File Upload', function() {
    var fixture = $('#qunit-fixture');
    var upload = fixture.find('.frm-upload-2 input[type="file"]');

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
    var radio = fixture.find('.frm-upload-2 input[type="radio"]');
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
    ok(radio.eq(3).parent().hasClass('uniform-ready') === true, 'parent gets class ready when uniform is ready');
    ok(radio.eq(3).hasClass('uniform-ready') === true, 'radio gets class ready when uniform is ready');

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
    radio.eq(1).prop('checked', true).trigger('change');
    ok(radio.eq(1).siblings().is(':visible') === true, 'knob changed to visible after trigger change on radio.');
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

test('change event triggered only once when click on radio wrapped in label', function () {
    var fixture = $('#qunit-fixture');
    var radio = fixture.find('.frm-upload-2 input[type="radio"]');
    var counter = 0;
    radio.eq(0).on('change', function () {
        counter += 1;
    });
    fakeClick(radio.eq(0).parents('label')[0]); // trigger fake click because phantomjs does not bubble down to radio
    equal(counter, 1, 'change triggered only once');
});

test('change event triggered only once when click on radio uniformed input, not on label', function () {
    var fixture = $('#qunit-fixture');
    var radio = fixture.find('.frm-upload-2 input[type="radio"]');
    var counter = 0;
    radio.eq(1).on('change', function () {
        counter += 1;
    });
    fakeClick(radio.eq(1).closest('.uniform-radio')[0]); // trigger fake click because phantomjs does not bubble down to radio
    equal(counter, 1, 'change triggered only once');
});

test('change event is not triggered if click happened on already checked radio', function () {
    var fixture = $('#qunit-fixture');
    var radio = fixture.find('.frm-upload-2 input[type="radio"]:checked');
    var counter = 0;
    radio.eq(0).on('change', function () {
        counter += 1;
    });
    fakeClick(radio.eq(0).parents('.uniform-radio')[0]); // trigger fake click because phantomjs does not bubble down to radio
    equal(counter, 0, 'change triggered only once');
});

test('checked class is set on initialization', function () {
    var fixture = $('#qunit-fixture');
    var uncheckedCheckbox = fixture.find('[name=check1]');
    var checkedCheckbox = fixture.find('[name=check4]');
    var uncheckedRadio = fixture.find('.not-a-form :radio:first');
    var checkedRadio = fixture.find(':radio:checked:first');

    equal(uncheckedCheckbox.parent().hasClass('uniform-checked'), false, 'unchecked checkbox has no class on init');
    equal(checkedCheckbox.parent().hasClass('uniform-checked'), true, 'checked checkbox has class on init');
    equal(uncheckedRadio.parent().hasClass('uniform-checked'), false, 'unchecked radio has no class on init');
    equal(checkedRadio.parent().hasClass('uniform-checked'), true, 'checked radio has class on init');
});

test('checked class is set/unset when checkbox is selected', function () {
    var fixture = $('#qunit-fixture');
    var checkbox = fixture.find('[name=check1]');
    checkbox.prop('checked', true).trigger('change');
    equal(checkbox.parent().hasClass('uniform-checked'), true, 'checked class is set on change');
    checkbox.prop('checked', false).trigger('change');
    equal(checkbox.parent().hasClass('uniform-checked'), false, 'checked class is unset on change');
});

test('checked class is set/unset when radio is selected', function () {
    var fixture = $('#qunit-fixture');
    var radio1 = fixture.find('.form1 :radio').eq(0);
    var radio2 = fixture.find('.form1 :radio').eq(1);
    equal(radio1.is(':checked'), true, 'initially selected');
    equal(radio2.is(':checked'), false, 'initially not selected');

    radio2.prop('checked', true).trigger('change');
    equal(radio1.parent().hasClass('uniform-checked'), false, 'no class on first radio after change');
    equal(radio2.parent().hasClass('uniform-checked'), true, 'added class on second radio after change');
});
