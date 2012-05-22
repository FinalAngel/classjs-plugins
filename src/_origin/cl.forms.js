/**
 * @framework:	CFF - Classy Frontend Framework
 * @author:		Angelo Dini
 * @copyright:	http://www.divio.ch under the BSD Licence
 * @requires:	jQuery
 */

/*##################################################|*/
/* #CUSTOM APP# */
(function ($) {

	Cl.Forms = {
		// load common functions
		init: function (options) {
			// extend options
			this.options = $.extend({}, options);

			// remove all label must stars when javascript is enabled
			if($('.frm ol li label span').length) $('.frm ol li label span').remove();

			// add custom dropdowns
			if($.uniform) this.uniform();

			// disable upload fields for ipad
			if(Cl.Browser.ipad()) this.disable();
		},

		uniform: function () {
			var that = this;
			var triggered = false;
			// load uniform on any select or upload field
			$('.content select, input[type="file"]').uniform();

			// loop through all uniform elements and assign their appropriate width
			this.updateFields();

			// attach event when resizing window
			$(window).bind('resize', function (e) {
				that.updateFields();
			});
		},

		updateFields: function () {
			$.each($.uniform.elements, function (index, item) {
				var field = $(item);
				var offset = 0;

				// just because browsers are stupid
				if($.browser.webkit && !Cl.Browser.mobile() && !Cl.Browser.tablet()) {
					offset = 12;
				}
				if(field.is('select')) {
					field.closest('.selector').css({
						'width': field.width() + 2 - offset,
						'margin': '0 ' + field.css('marginRight') + ' 0 0'
					});
				}
			});
		},

		disable: function () {
			var text = this.options.disableText;
			var file = $('input[type="file"]').closest('.field');

			file.css('opacity', 0.6).stop()
				.find('.upload-text')
				.css('color', '#f00')
				.text(text);

			// add value 1 to hidden file
			file.find('input[type="hidden"]').val(1);
		}
	};

	// specific class for overlapping label
	Cl.Forms.Labelify = Class.$extend({

		options: {
			'label': 'label',
			'input': 'input, textarea'
		},

		initialize: function (holder, options) {
			var that = this;

			// merge options
			this.options = $.extend(this.options, options);

			// save variables
			this.holder = $(holder);
			this.holder.each(function (index, holder) {
				that.setup.call(that, $(holder));
			});
		},

		setup: function (holder) {
			var label = holder.find(this.options.label);
			var input = holder.find(this.options.input);

			// set the required styles
			var styles = {
				'position': 'absolute',
				'cursor': 'text'
			};
			label.css(styles);

			// attach events
			holder.delegate(this.options.input, 'focus', function (e) {
				var label = $(this).parent().parent().find('label');
					label.fadeOut();
			});

			holder.delegate(this.options.input, 'blur', function (e) {
				var label = $(this).parent().parent().find('label');
				var input = $(this);
				// check if there is text available
				if(input.val() === '' || input.val() === label.text()) {
					label.fadeIn();
					$(this).val('');
				}
			});

			// hide all labels when there is text inside the labels
			if(input.val() != '') label.hide();
		}

	});

	// validating forms
	Cl.Forms.Validate = Class.$extend({

		initialize: function (holder, options) {
			var that = this;

			// merge options
			options = $.extend({
				'input': 'input, textarea',
				'output': '.extratext small',
				'ajax': null,
				'type': 'POST',
				'event': 'blur',
				'cls': {
					'error': 'frm_error',
					'success': 'frm_success'
				},
				'message': 'This field is required.',
				'precheck': false,
				'silentcheck': false
			}, options);

			// save variables
			holder = $(holder);
			holder.each(function (index, holder) {
				that.setup.call(that, $(holder), options);
				// rechecks all given ajax inputs, this will cause server overhead
				if(that.options.precheck) that.precheck($(holder), options);
			});
		},

		setup: function (holder, options) {
			var that = this;
			
			var input = holder.find(options.input);
			var list = input.closest('li');

			// attach default text if available
			holder.data('defaultText', holder.find(options.output).text());

			input.bind(options.event, function () {
				// set default text
				if(!list.hasClass(options.cls.error)) list.find(options.output).text(holder.data('defaultText'));
				// we do not need to do an ajax request if the input is empty
				if(input.val() === '') {
					// remove any classes
					list.removeClass(options.cls.success)
						.removeClass(options.cls.error);
					return false;
				}
				// if silent check set to success
				if(options.silentcheck) {
					list.removeClass(options.cls.error).addClass(options.cls.success);
					return false;
				}
				// call update
				that.update.call(that, $(this), holder, options);
			});
		},

		update: function (input, holder, options) {
			var that = this;

			var list = input.closest('li');
			var output = list.find(options.output);
			var defaultText = holder.data('defaultText');

			// serialize the selected input field and get the url
			var type = options.type;
			var url = options.ajax || input.closest('form').attr('action');
			var data = input.serialize();

			// special case if checkbox
			if(input.is(':checkbox') && !input.is(':checked')) {
				list.removeClass(options.cls.error).removeClass(options.cls.success);
				return false;
			}

			// lets send the request to the server
			$.ajax({
				'type': type,
				'url': url,
				'data': data,
				'success': function (data) {
					// data.error needs to be returned, if true data.message will be displayed
					data = $.parseJSON(data);

					if(data.error === true) {
						// add error class
						list.addClass(options.cls.error);
						// if no message is given, display the defailt message
						var message = data.message || options.message;
						// display the message
						output.html(message);
					} else {
						// remove error class
						list.removeClass(options.cls.error).addClass(options.cls.success);
					}
				},
				'error': function () {
					// show only error
					list.addClass(options.cls.error);
				}
			});
		},

		precheck: function (holder, options) {
			holder.find(options.input).trigger('blur');
		}

	});

	// validation helper for two field comparisons
	Cl.Forms.DoubleValidate = Class.$extend({

		initialize: function (field1, field2, options) {
			var that = this;

			// merge options
			options = $.extend({
				'dbl_output': '.validate_field2 .extratext small',
				'dbl_message': 'The entered value is not equal.',
				'dbl_ajax': true,
				'cls': {
					'error': 'frm_error',
					'success': 'frm_success'
				}
			}, options);

			options.defaultText = $(options.dbl_output).text();

			$(field2).find('input').bind('blur', function () {
				that.check.call(that, $(field1), $(field2), options);
			});

			// first
			if(options.dbl_ajax) new Cl.Forms.Validate(field1, options);
			//new Cl.Forms.Validate(field2, options);
		},

		check: function (field1, field2, options) {
			val1 = field1.find('input').val();
			val2 = field2.find('input').val();

			var output = $(options.dbl_output);
			var list = output.closest('li');

			// error handling
			if(val1 !== val2) {
				list.removeClass(options.cls.success).removeClass(options.cls.error).addClass(options.cls.error);
				output.html(options.dbl_message);
			} else if(val1 !== '' && val2 !== '') {
				list.removeClass(options.cls.error).addClass(options.cls.success);
				output.html(options.defaultText);
			}
		}

	});

	// copy certain fields
	Cl.Forms.Copy = Class.$extend({

		options: {
			'container': '.container',
			'trigger': '.trigger',
			'placement': '.placement',
			'prefix': 'copy_',
			'remove': '.remove'
		},

		initialize: function (holder, options) {
			var that = this;

			holder = $(holder);
			// save variables
			//holder.delegate(this.options.input, 'focus', function (e) {


			var trigger = holder.find(options.trigger);
				trigger.bind('click', function (e) {
					e.preventDefault();

					// we need to keep the scroll position
					var scroll = holder.find('.wizard_maxheight').scrollTop();

					that.copy.call(that, holder, options);

					// set new scroll
					holder.find('.wizard_maxheight').scrollTop(scroll);
				});
		},

		copy: function (holder, options) {
			var that = this;
			var container = holder.find(options.container);

			var copy = container.clone(true, true);
				// we need to remove some classes
				copy.show()
					.removeClass(options.container.replace('.', ''))
					.removeClass('copy_hidden')
					.removeClass('jsrequired');

			// replace name
			copy.find('*[name^="' + options.prefix + '"]').each(function (index, item) {
				var name = $(item).attr('name');
				$(item).attr('name', name.replace(that.options.prefix, ''));
			});

			// attach remove events
			copy.delegate(options.remove, 'click', function (e) {
				e.preventDefault();
				copy.remove();
			});

			holder.find(options.placement).before(copy);

			// update lightbox
			// $.colorbox.resize();
		}
	});

	Cl.Forms.Order = Class.$extend({

		options: {
			'triggerUp': '.trigger-up',
			'triggerDown': '.trigger-down',
			'rowClass': '.row',
			'field': ''
		},

		initialize: function (holder, options) {

			var that = this;
			var container = $(holder);

			options = $.extend(options, {
				'holder': holder
			});

			var upTrigger = container.find(options.triggerUp);
				upTrigger.bind('click', function (e) {
					e.preventDefault();
					that.moveUp.call(that, $(e.currentTarget), options);
				});
			var downTrigger = container.find(options.triggerDown);
				downTrigger.bind('click', function (e) {
					e.preventDefault();
					that.moveDown.call(that, $(e.currentTarget), options);
				});

			// we need to listen to the delete or add event
			container.find(options.triggerDelete).click(function () {
				that.update(options);
			});
			$(options.triggerAdd).click(function () {
				that.update(options);
			});

			// call update for the first time
			that.update(options);
		},

		moveUp: function (el, options) {
			var that = this;
			var rows = $(options.holder).parent().find(options.rowClass + ':visible');
			var row = el.closest(options.rowClass);
			var index = rows.index(row);

			// cancel if index is less than 0
			if(index <= 0) {
				that.update(options);
				return false;
			}

			// change the position
			$(rows[index-1]).before(row);

			// set new state if successfull
			that.update(options);
		},

		moveDown: function (el, options) {
			var that = this;
			var rows = $(options.holder).parent().find(options.rowClass + ':visible');
			var row = el.closest(options.rowClass);
			var index = rows.index(row);

			// cancel if index is less than 0
			if(index >= rows.length-1) {
				that.update(options);
				return false;
			}

			// change the position
			$(rows[index+1]).after(row);

			// set new state if successfull
			that.update(options);
		},

		update: function (options) {
			var rows = $(options.holder).parent().find(options.rowClass + ':visible');

			// reset classes
			rows.find(options.triggerUp).addClass(options.triggerUp.replace('.', '') + '-active');
			rows.find(options.triggerDown).addClass(options.triggerDown.replace('.', '') + '-active');

			// set first rows first item to inactive
			var first = $(rows[0]).find(options.triggerUp);
				first.removeClass(options.triggerUp.replace('.', '') + '-active');

			// set last rows last item to inactive
			var last = $(rows[rows.length-1]).find(options.triggerDown);
				last.removeClass(options.triggerDown.replace('.', '') + '-active');

			// set new order
			// TODO: this handling might need to change depending on the backend requirements
			rows.each(function (index, item) {
				$(item).find(options.field).val(index);
			});
		}

	});

	Cl.Forms.Timestamp = Class.$extend({

		initialize: function (el) {
			var that = this;

			this.container = $(el);
			this.elements = this.container.find('select');
			this.elements.bind('change', function () {
					that.setTimestamp(that);
				});

			this.setTimestamp();
		},

		setTimestamp: function () {
			var that = this;

			var date = this.getValues();
			var timestamp = this.getTimestamp(date.year, date.month, date.day);

			// insert timestamp in inputfield
			this.container.find('.timestamp').val(timestamp);

			this.getRevertedTimestamp(this.container.find('.timestamp').val());
		},

		getTimestamp: function (year, month, day) {
			return Math.round(new Date(year, month, day)/1000);
		},

		getRevertedTimestamp: function (unix) {
			var date = new Date(unix*1000);
				date.day = date.getDate();
				date.month = date.getMonth();
				date.year = date.getFullYear();

			return date;
		},

		getValues: function () {
			var date = {};

			this.elements.each(function (index, item) {
				if($(item).hasClass('input-select-day')) {
					date.day = $(item).val();
				}
				if($(item).hasClass('input-select-month')) {
					date.month = $(item).val();
				}
				if($(item).hasClass('input-select-year')) {
					date.year = $(item).val();
				}
			});

			return date;
		}

	});

// prevent conflicts
})(jQuery);
