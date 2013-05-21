/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.0.2
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
				'radio': '<span class="{cls}" role="radio"><span class="{knob}"></span></span>',
				'checkbox': '<span class="{cls}" role="checkbox"><span class="{knob}"></span></span>',
				'file': '<span class="{cls}"><span class="{input}"><!-- file --></span><span class="{btn}">{btntext}</span><span class="{status}">{statustext}</span></span>',
				'select': '<span class="{cls}"><span class="{input}"><!-- select --></span><span class="{status}"></span><span class="{arrow}"></span></span>'
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
			// trigger event
			this._fire('update');

			this.elements.each(function (index, item) {
				var input = $(item);
					if(input.is(':checked')) input.trigger('click');
					input.trigger('change');
			});

			// trigger event
			this._fire('update', this);
		},

		destroy: function () {
			// trigger event
			this._fire('destroy');

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
						.off('blur.' + cls.prefix);
			});

			// trigger event
			this._fire('destroy', this);
		},

		_scan: function (field) {
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
					if(field.prop('tagName') === 'SELECT'
						&& field.attr('multiple') === undefined) this._setupSelect(field);
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
					if(parseInt(knob.css('left')) === 0) {
						knob.css('left', that.options.offset);
					} else {
						knob.css('left', 0);
					}
				} else { // radio
					// we need to determine the radio group and trigger/enable them at once
					input.closest('form').find('input[type="radio"][name="' + input.attr('name') + '"]')
						.parents('.' + clsKnob)
						.css('left', that.options.offset);
					knob.css('left', 0);
				}

				// api call
				input.trigger(cls.prefix + 'change');

				// change accessibility labels
				(parseInt(knob.css('left')) === 0) ? parent.attr('aria-checked', true) : parent.attr('aria-checked', false);
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
			(field.is(':checked')) ? parent.attr('aria-checked', true) : parent.attr('aria-checked', false);
			if(field.attr('required')) parent.attr('aria-required', true);

			// initial state
			if(!field.is(':checked')) field.parents('.' + cls.prefix).children().css('left', this.options.offset);

			// add common elements
			this._common(field, parent);
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
				'height': field.css('height'),
				'padding': field.css('padding'),
				'margin': field.css('margin')
			});

			// inject element
			field.wrap(tpl).css('left', this.options.offset);
			field.on('click.' + cls.prefix, function (e) {
				// prevent event bubbling
				e.stopPropagation();
			});
			field.on('change.' + cls.prefix, function () {
				// set new value to status
				var value = $(this).val().replace(/^C:\\fakepath\\/i, '');
				$(this).parents('.' + cls.prefix).find('.' + clsStatus).text(value);
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
			if(field.attr('required')) parent.attr('aria-required', true);

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
				'height': field.css('height'),
				'padding': field.css('padding'),
				'margin': field.css('margin')
			});

			// inject element
			field.wrap(tpl).css('opacity', 0); //  this.options.offset

			// set the correct content
			var parent = field.parents('.' + cls.prefix);
			var text = parent.find('.' + clsStatus);

			// attach change event
			field.on('change', function () {
				text.text($(this).find('option:selected').text());
			});

			// set correct value
			text.text(field.find('option:selected').text());

			// we need to set a fixed with if field is 100%
			field.css('width', tpl.outerWidth(true));

			// set initial accessibility labels
			if(field.attr('required')) parent.attr('aria-required', true);

			// add common elements
			this._common(field);
		},

		_common: function (field) {
			var cls = this.options.cls;

			// add focus event
			field.on('focus.' + cls.prefix + ' blur.' + cls.prefix, function (e) {
				var wrap = $(this).parents('.' + cls.prefix);
				var wrapCls = cls.prefix + '-' + cls.focus;
				(e.type === 'focus') ? wrap.addClass(wrapCls) : wrap.removeClass(wrapCls);
			});

			// add classes depending on the state
			if(field.is(':disabled')) field.parents('.' + cls.prefix).addClass(cls.prefix + '-' + cls.disabled);

			// add classes from the field (for example, error styles)
			field.parents('.' + cls.prefix).last().addClass(field.attr('class'));
		},

		_fire: function (keyword, scope) {
			if(scope) {
				// cancel if there is no callback found
				if(this.callbacks[keyword] === undefined) return false;
				// excecute callback
				this.callbacks[keyword](scope);
			} else {
				// excecute event
				$.event.trigger('uniform-' + keyword);
			}
		}

	});
})(jQuery);