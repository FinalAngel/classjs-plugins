/*!
 * Cl.Autocomplete
 * @author      Ales Kocjancic - github.com/finalangel/classjs-plugins
 * @copyright   Distributed under the BSD License.
 * @version     1.0.0
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
	'use strict';

	// creating class
	Cl.Autocomplete = new Class({

		options: {
			'url': false,
			'minLength': 3,
			'easing': 'swing',
			'duration': 300,
			'delay': 300,
			'fx': 'slide',
			'closeOnBlur': false,
			'cls': {
				'field': 'input[type="search"]',
				'results': '.autocomplete-results',
				'item': '.autocomplete-item',
				'close': '.autocomplete-close',
				'submit': '.autocomplete-submit'
			},
			'lang': {
				'error': 'There has been an error!',
				'empty': 'No results.'
			}
		},

		initialize: function(container, options) {
			this.selector = container;
			this.container = $(container);
			this.options = $.extend(true, {}, this.options, options);
			this.url = this.options.url ? this.options.url : this.container.attr('action');
			this.results = this.container.find(this.options.cls.results);
			this.field = this.container.find(this.options.cls.field);
			this.callbacks = {};

			this.timer = function(){};
			this.query = '';

			this._setup();
		},

		_setup: function() {
			var that = this;

			this.results.hide().attr('aria-hidden', true);

			// add search event
			this.field.on('keyup focus paste click', function() {
				that.search();
			});
			// add key events
			this.container.on('keydown', function(e) {
				var pressed = e.charCode ? parseInt(e.charCode) : e.keyCode ? parseInt(e.keyCode) : 0;
				switch (pressed) {
					case 27:  // escape
						that.hide();
						break;
					case 38:  // up
						e.preventDefault();
						that._focusPreviousResult();
						break;
					case 40:  // down
						e.preventDefault();
						that._focusNextResult();
						break;
				}
			});

			// stop propagation event on container so body can close
			if (this.options.closeOnBlur) {
				this.field.on('click', function (e) {
					e.stopPropagation();
				});
				$(document.body).on('click', function () {
					that.hide();
				});
			}

			// bind extra form submit buttons
			$(document).on('click', this.selector+' '+this.options.cls.submit, function(e) {
				e.preventDefault();
				that.container.submit();
			});

			// bind close event
			$(document).on('click', this.selector+' '+this.options.cls.close, function(e) {
				e.preventDefault();
				that.hide();
			});
		},

		show: function() {
			this.results.attr('aria-hidden', false);

			if(this.options.fx === 'toggle') this.results.show();
			if(this.options.fx === 'fade') this.results.fadeIn(this.options.duration);
			if(this.options.fx === 'slide') this.results.slideDown(this.options.duration);

			// trigger callback
			this._fire('show');
		},

		hide: function() {
			this.results.attr('aria-hidden', true);

			if(this.options.fx === 'toggle') this.results.hide();
			if(this.options.fx === 'fade') this.results.fadeOut(this.options.duration, this.options.transition);
			if(this.options.fx === 'slide') this.results.slideUp(this.options.duration, this.options.transition);

			// trigger callback
			this._fire('hide');
		},

		search: function(query) {
			var that = this;
			query = query || this.field.val();
			if(this._validate(query)) {
				that.query = query;
				clearTimeout(that.timer);
				that.timer = setTimeout(function() {
					that._request();
				}, that.options.delay);
			}

			// trigger callback
			this._fire('search');
		},

		_focusNextResult: function() {
			var items = this.results.find(this.options.cls.item);
			if (items.length > 0) {
				var current = items.filter(':focus').first();
				if (items.index(current) >= 0) {
					if (items.index(current)+1 === items.length) {
						this.field.focus();
					} else {
						items.eq(items.index(current)+1).focus();
					}
				} else {
					items.eq(0).focus();
				}
			}
		},

		_focusPreviousResult: function() {
			var items = this.results.find(this.options.cls.item);
			if (items.length > 0) {
				var current = items.filter(':focus').first();
				if (items.index(current) >= 0) {
					if (items.index(current) === 0) {
						this.field.focus();
					} else {
						items.eq(items.index(current)-1).focus();
					}
				} else {
					items.eq(items.length-1).focus();
				}
			}
		},

		// validates query
		_validate: function(query) {
			// passes if query is not empty, query is not open and has the correct length
			return (query !== '' && query.length >= this.options.minLength && query !== this.query);
		},

		_request: function() {
			var that = this;

			$.ajax({
				'type': 'GET',
				'url': this.url,
				'dataType': 'html',
				'data': this.container.serialize(),
				'success': function(data) {
					if(data && data.length > 0) {
						that._replace(data);
					} else {
						that._showEmpty();
					}
				},
				'error': function() {
					that._showError();
				},
				'headers': {
					"X-Requested-With": "XMLHttpRequest"
				}
			});
		},

		_replace: function(data) {
			this.results.html(data);
			if (!this.results.is(':visible')) {
				this.show();
			}
		},

		_showEmpty: function() {
			this._replace('<p class="autocomplete-message">' + this.options.lang.empty + '</p>');
		},

		_showError: function() {
			this._replace('<p class="autocomplete-message">' + this.options.lang.error +'</p>');
		},

		_fire: function (keyword) {
			// cancel if there is no callback found
			if(this.callbacks[keyword] === undefined) return false;
			// excecute callback
			this.callbacks[keyword](this);
		}

	});

})(jQuery);
