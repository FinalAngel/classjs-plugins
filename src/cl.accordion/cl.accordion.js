/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.1.2
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
	'use strict';

	// creating class
	Cl.Accordion = new Class({
		/*
			TODO 1.2.0
			- add api for additional close elements (or api triggers)?
			- add fadeIn / fadeOut options
		 */

		options: {
			'index': null,
			'expanded': false,
			'event': 'click focusin',
			'easing': 'linear',
			'duration': 300,
			'grouping': true,
			'forceClose': false,
			'disableAnchors': true,
			'autoHeight': false,
			'cls': {
				'expanded': 'expanded',
				'collapsed': 'collapsed',
				'trigger': '.trigger',
				'container': '.container',
				'text': '.text'
			},
			'lang': {
				'expanded': 'Expanded ',
				'collapsed': 'Collapsed '
			}
		},

		initialize: function (container, options) {
			this.container = $(container);
			this.options = $.extend(true, {}, this.options, options);

			this.triggers = this.container.find(this.options.cls.trigger);
			this.containers = this.container.find(this.options.cls.container);
			this.index = null;
			this.callbacks = {};

			// cancel if triggers and containers are not even
			if(this.triggers.length !== this.containers.length) return false;

			var that = this;
			// this fixes chromes jQuery(window).load issue
			jQuery(window).load(function () {
				that._setup();
			});
		},

		_setup: function () {
			var that = this;

			// calculate height for each item
			if(this.options.autoHeight) {
				this.containers.each(function (index, item) {
					$(item).height($(item).height());
				});
			}

			// add event to each trigger
			this.triggers.on(this.options.event, function (e) {
				e.preventDefault();
				that.toggle(that.triggers.index(this));
			});

			// prevent click events on substitutes
			if(this.options.disableAnchors) {
				this.triggers.find('a', function (e) {
					e.preventDefault();
				});
			}

			// setup initial states
			if(this.options.expanded) {
				this.show(undefined, true);
			} else {
				// trigger event
				this.hide(undefined, true);
			}

			// if index is defined and the elements are not expanded, show provided index
			if(this.options.index !== null && !this.options.expanded) this.toggle(this.options.index);
		},

		toggle: function (index) {
			// trigger event
			this._fire('toggle');

			// cancel if index is the same end forceClose disabled or not provided
			if(this.index === index && !this.options.forceClose || this.index === undefined) return false;
			// set global index
			this.index = index;

			// redirect to required behaviour
			(this.containers.eq(index).is(':visible')) ? this.hide(index) : this.show(index);

			// trigger callback
			this._fire('toggle', this);
		},

		show: function (index, fast) {
			// trigger event
			this._fire('show');

			// if no index is provided, show all
			this._setExpanded(index, fast);

			// trigger callback
			this._fire('show', this);
		},

		hide: function (index, fast) {
			// trigger event
			this._fire('hide');

			// if no index is provided, hide all
			this._setCollapsed(index, fast);

			// trigger callback
			this._fire('hide', this);
		},

		_setExpanded: function (index, fast) {
			// exception if grouping is enabled
			if(this.options.grouping && !fast) this.hide();

			if(index === undefined) {
				if(!fast) this.containers.slideDown(this.options.duration, this.options.easing);
				if(fast) this.containers.show();

				this.containers
					.attr('aria-hidden', false);

				this.triggers
					.addClass(this.options.cls.expanded)
					.removeClass(this.options.cls.collapsed)
					.attr('aria-selected', true)
					.attr('aria-expanded', true)
						.find('.text').html(this.options.lang.expanded);
			} else {
				this.containers.eq(index)
					.slideDown(this.options.duration, this.options.easing)
					.attr('aria-hidden', false);

				this.triggers.eq(index)
					.addClass(this.options.cls.expanded)
					.removeClass(this.options.cls.collapsed)
					.attr('aria-selected', true)
					.attr('aria-expanded', true)
						.find('.text').html(this.options.lang.expanded);
			}
		},

		_setCollapsed: function (index, fast) {
			if(index === undefined) {
				if(!fast) this.containers.slideUp(this.options.duration, this.options.easing);
				if(fast) this.containers.hide();

				this.containers
					.attr('aria-hidden', true);

				this.triggers
					.addClass(this.options.cls.collapsed)
					.removeClass(this.options.cls.expanded)
					.attr('aria-selected', false)
					.attr('aria-expanded', false)
						.find('.text').html(this.options.lang.collapsed);
			} else {
				this.containers.eq(index)
					.slideUp(this.options.duration, this.options.easing)
					.attr('aria-hidden', true);

				this.triggers.eq(index)
					.addClass(this.options.cls.collapsed)
					.removeClass(this.options.cls.expanded)
					.attr('aria-selected', false)
					.attr('aria-expanded', false)
						.find('.text').html(this.options.lang.collapsed);
			}
		},

		_fire: function (keyword, scope) {
			if(scope) {
				// cancel if there is no callback found
				if(this.callbacks[keyword] === undefined) return false;
				// excecute callback
				this.callbacks[keyword](scope);
			} else {
				// excecute event
				$.event.trigger('accordion-' + keyword);
			}
		}

	});

})(jQuery);