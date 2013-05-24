/*!
 * Cl.Autocomplete
 * @author      Ales Kocjancic - github.com/finalangel/classjs-plugins
 * @copyright   Distributed under the BSD License.
 * @version     1.0.beta2
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
			'delay': 300,
			'duration': 300,
			'closeOnBlur': false,
			'cls': {
				'field': 'input[type="search"]',
				'results': '.autocomplete-results',
				'item': '.autocomplete-item',
				'close': '.close',
				'submit': '.all-results'
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

			this.timer = function(){};
			this.query = '';

			this._setup();
		},

		_setup: function() {
			var that = this;

			this.results.hide().attr('aria-hidden', true);

			// add search event
			this.field.on('keyup focus paste click', function(e) {
				that.triggerSearch();
			});
			// add key events
			this.container.on('keydown', function(e) {
				var pressed = e.charCode ? parseInt(e.charCode) : e.keyCode ? parseInt(e.keyCode) : 0;
				switch (pressed) {
					case 27:  // escape
						that.close();
						break;
					case 38:  // up
						e.preventDefault();
						that.focusPreviousResult();
						break;
					case 40:  // down
						e.preventDefault();
						that.focusNextResult();
						break;
				}
			});

			// stop propagation event on container so body can close
			if (this.options.closeOnBlur) {
				this.field.on('click', function (e) {
					e.stopPropagation();
				});
				$(document.body).on('click', function () {
					that.close();
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
				that.close();
			});
		},

		focusNextResult: function() {
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

		focusPreviousResult: function() {
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

		open: function() {
			this.results
				.fadeIn(this.options.duration / 2)
				.attr('aria-hidden', false);
		},

		close: function() {
			this.results
				.fadeOut(this.options.duration)
				.attr('aria-hidden', true);
		},

		triggerSearch: function() {
			var that = this;
			var query = this.field.val();
			if(this._valid(query)) {
				that.query = query;
				clearTimeout(that.timer);
				that.timer = setTimeout(function() {
					that._request();
				}, that.options.delay);
			}
		},

		// validates query
		_valid: function(query) {
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
				this.results.slideDown(this.options.duration);
			}
		},

		_showEmpty: function() {
			this._replace('<p class="message">' + this.options.lang.empty + '</p>');
		},

		_showError: function() {
			this._replace('<p class="message">' + this.options.lang.error +'</p>');
		}

	});

})(jQuery);
