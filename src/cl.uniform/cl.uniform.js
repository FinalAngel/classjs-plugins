/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.0.4
 */

// insure namespace is defined
var Cl = window.Cl || {};

(function($){
    'use strict';

    // creating class
    Cl.Uniform = new Class({

        options: {
            'offset': -9999,
            'cls': {
                'prefix': 'uniform',
                'radio': 'radio',
                'checkbox': 'checkbox',
                'file': 'file',
                'select': 'select',
                'disabled': 'disabled',
                'focus': 'focus'
            },
            'lang': {
                'fileBtn': 'Upload',
                'fileStatus': 'Please select a file...'
            },
            'tpl': {
                'radio': '<span class="{cls}" role="radio"><span class="{knob}"><!-- radio --></span></span>',
                'checkbox': '<span class="{cls}" role="checkbox"><span class="{knob}"><!-- checkbox --></span></span>',
                'file': '<label class="{cls}"><span class="{input}"><!-- file --></span><span class="{btn}" aria-hidden="true">{btntext}</span><span class="{status}" aria-hidden="true">{statustext}</span></label>',
                'select': '<span class="{cls}"><span class="{input}"><!-- select --></span><span class="{status}" aria-hidden="true"></span><span class="{arrow}"></span></span>'
            }
        },

        initialize: function (elements, options) {
            this.elements = $(elements);
            this.options = $.extend(true, {}, this.options, options);

            this._setup();
        },

        _setup: function () {
            var that = this;

            // global vars
            this.callbacks = {};

            // loop through individual entries
            this.elements.each(function (index, item) {
                that._scan($(item));
            });
        },

        update: function () {
            var that = this;
            this.destroy();
            this.elements.each(function (index, item) {
                that._scan($(item));
            });

            // trigger event
            this._fire('update');
        },

        destroy: function () {
            var cls = this.options.cls;

            this.elements.each(function (index, item) {
                var input = $(item);
                input.parent().siblings('span').remove();
                input.unwrap()
                    .unwrap()
                    .removeAttr('style')
                    .off('click.' + cls.prefix)
                    .off('change.' + cls.prefix)
                    .off('focus.' + cls.prefix)
                    .off('blur.' + cls.prefix)
                    .data('ready', false);
            });

            // trigger event
            this._fire('destroy');
        },

        _scan: function (field) {
            // validate if uniform is already attached
            if(field.data('ready')) return false;

            // delegate form elements to their responsive setup handlers
            switch(field.attr('type')) {
                case 'checkbox':
                    this._setupRadioCheck(field, 'checkbox');
                    break;
                case 'radio':
                    this._setupRadioCheck(field, 'radio');
                    break;
                case 'file':
                    this._setupFile(field);
                    break;
                case undefined:
                    if(field.prop('tagName') === 'SELECT' && field.attr('multiple') === undefined) this._setupSelect(field);
                    break;
                default:
                    break;
            }
        },

        _setupRadioCheck: function (field, type) {
            var that = this;
            var cls = this.options.cls;
            var clsTpl = cls.prefix + ' ' + cls.prefix + '-' + cls[type];
            var clsKnob = cls.prefix + '-' + cls[type] + '-knob';

            var tpl = $(this.options.tpl[type]
                .replace('{cls}', clsTpl)
                .replace('{knob}', clsKnob));

            // inject element
            field.wrap(tpl).css('left', this.options.offset);
            field.on('click.' + cls.prefix, function (e) {
                // prevent event bubbling
                e.stopPropagation();

                // getting vars
                var input = $(this);
                var knob = $(this).parents('.' + clsKnob);

                // cancel event if element is disabled
                if(input.is(':disabled')) return false;

                if(type === 'checkbox') {
                    // we need to check if we should activate or deactivate the checkbox
                    var enabled = parseInt(knob.css('left'), 10) === 0 || knob.css('left') === 'auto';
                    if(enabled) {
                        knob.css('left', that.options.offset);
                    } else {
                        knob.css('left', 0);
                    }

                    // accessibility
                    parent.attr('aria-checked', !enabled);

                } else { // radio
                    // we need to determine the radio group and trigger/enable them at once
                    var group = input.closest('form').find('input[type="radio"][name="' + input.attr('name') + '"]');
                    group.parents('.' + clsKnob)
                        .css('left', that.options.offset);
                    knob.css('left', 0);

                    // accessibility
                    group.parents('.' + cls.prefix).attr('aria-checked', false);
                    parent.attr('aria-checked',true);
                }

                // api call
                input.trigger(cls.prefix + 'change');
            });

            // start attaching events
            var parent = field.parents('.' + cls.prefix);
            parent.on('click.' + cls.prefix, function (e) {
                // prevent event bubbling
                e.preventDefault();
                e.stopPropagation();

                // delegate to input
                var input = $(this).find('input');
                input.trigger('click');
            });

            // set initial accessibility labels
            if(field.is(':checked')) {
                parent.attr('aria-checked', true);
            } else {
                parent.attr('aria-checked', false);
            }

            // initial state
            if(!field.is(':checked')) field.parents('.' + cls.prefix).children().css('left', this.options.offset);

            // add common elements
            this._common(field);
        },

        _setupFile: function (field) {
            var cls = this.options.cls;
            var clsTpl = cls.prefix + ' ' + cls.prefix + '-' + cls.file;
            var clsInput = cls.prefix + ' ' + cls.prefix + '-input';
            var clsBtn = cls.prefix + '-' + cls.file + '-btn';
            var clsStatus = cls.prefix + '-' + cls.file + '-status';

            var tpl = $(this.options.tpl.file
                .replace('{cls}', clsTpl)
                .replace('{input}', clsInput)
                .replace('{btn}', clsBtn)
                .replace('{btntext}', this.options.lang.fileBtn)
                .replace('{status}', clsStatus)
                .replace('{statustext}', this.options.lang.fileStatus));

            // auto calculate sizes
            tpl.css({
                'width': field.css('width'),
                'padding': field.css('padding'),
                'margin': field.css('margin')
            });

            // inject element
            field.wrap(tpl).css('left', this.options.offset);
            field.on('change.' + cls.prefix, function () {
                // set new value to status
                var value = $(this).val().replace(/^C:\\fakepath\\/i, '');
                $(this).parents('.' + cls.prefix).find('.' + clsStatus).text(value);
            });

            // parent wrapper label (triggers input)
            var parent = field.parents('.' + cls.prefix);
            parent.attr('for', field.attr('id'));

            // add common elements
            this._common(field);
        },

        _setupSelect: function (field) {
            var cls = this.options.cls;
            var clsTpl = cls.prefix + ' ' + cls.prefix + '-' + cls.select;
            var clsInput = cls.prefix + ' ' + cls.prefix + '-input';
            var clsStatus = cls.prefix + '-' + cls.select + '-status';
            var clsArrow = cls.prefix + '-' + cls.select + '-arrow';

            var tpl = $(this.options.tpl.select
                .replace('{cls}', clsTpl)
                .replace('{input}', clsInput)
                .replace('{status}', clsStatus)
                .replace('{arrow}', clsArrow));

            // auto calculate sizes
            tpl.css({
                'width': field.css('width'),
                'padding': field.css('padding'),
                'margin': field.css('margin')
            });

            // inject element
            field.wrap(tpl).css('opacity', 0); //  this.options.offset

            // set the correct content
            var parent = field.parents('.' + cls.prefix);
            var text = parent.find('.' + clsStatus);

            // attach change event
            field.on('change keyup', function () {
                text.text($(this).find('option:selected').text());
            });

            // set correct value
            text.text(field.find('option:selected').text());

            // we need to set a fixed with if field is 100%
            field.css('width', tpl.outerWidth(true));

            // add common elements
            this._common(field);
        },

        _common: function (field) {
            var cls = this.options.cls;
            var parent = field.parents('.' + cls.prefix).last();

            // add focus event
            field.on('focus.' + cls.prefix + ' blur.' + cls.prefix, function (e) {
                var wrap = $(this).parents('.' + cls.prefix);
                var wrapCls = cls.prefix + '-' + cls.focus;

                if(e.type === 'focus') {
                    wrap.addClass(wrapCls);
                } else {
                    wrap.removeClass(wrapCls);
                }
            });

            // add classes depending on the state
            if(field.is(':disabled')) parent.addClass(cls.prefix + '-' + cls.disabled);

            // set initial accessibility labels
            if(field.attr('required')) parent.attr('aria-required', true);

            // add initialized class
            field.data('ready', true);

            // add classes from the field (for example, error styles)
            parent.addClass(field.attr('class'));
        },

        _fire: function (keyword) {
            // cancel if there is no callback found
            if(this.callbacks[keyword] === undefined) return false;
            // excecute callback
            this.callbacks[keyword](this);
        }

    });

})(jQuery);