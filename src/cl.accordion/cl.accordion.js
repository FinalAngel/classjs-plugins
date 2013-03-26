/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.1.1
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
	'use strict';

	// creating class
	Cl.Accordion = new Class({
		/*
			TODO 1.2.0
			-
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

			this._setup();
		},

		_setup: function () {
			var that = this;

			// calculate height for each item
			this.containers.each(function (index, item) {
				$(item).height($(item).height());
			});

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
				this.containers.show();
				this.triggers.addClass(this.options.cls.expanded);
				this.triggers.find('.text').html(this.options.lang.expanded);
				this.containers.attr('aria-expanded', true);
			} else {
				this.containers.hide();
				this.triggers.addClass(this.options.cls.collapsed);
				this.triggers.find('.text').html(this.options.lang.collapsed);
				this.containers.attr('aria-expanded', false);
			}

			// if index is defined and the elements are not expanded, show provided index
			if(this.options.index !== null && !this.options.expanded) this.toggle(this.options.index);
		},

		toggle: function (index) {
			// trigger event
			this._fire('toggle');

			// cancel if index is the same end forceClose disabled
			if(this.index === index && !this.options.forceClose) return false;

			// set global index
			this.index = index;

			// if grouping is enabled
			if(this.options.grouping) {
				// hide all containers
				this.hide();
				// reset triggers to initial states
				this.triggers.removeClass(this.options.cls.expanded)
					.addClass(this.options.cls.collapsed)
					.find('.text').html(this.options.lang.collapsed);
			}

			// redirect to required behaviour
			(this.containers.eq(index).is(':visible')) ? this.hide(index) : this.show(index);

			// trigger callback
			this._fire('toggle', this);
		},

		show: function (index) {
			// trigger event
			this._fire('show');

			// if no index is provided, hide all
			if(index === undefined) {
				this.containers.slideDown(this.options.duration, this.options.easing);
			// otherwise show element
			} else {
				this.containers.eq(index).slideDown(this.options.duration, this.options.easing);
				this.triggers.eq(index).addClass(this.options.cls.expanded).removeClass(this.options.cls.collapsed)
					.find('.text').html(this.options.lang.expanded);
			}

			// trigger callback
			this._fire('show', this);
		},

		hide: function (index) {
			// trigger event
			this._fire('hide');

			// if no index is provided, hide all
			if(index === undefined) {
				this.containers.slideUp(this.options.duration, this.options.easing);
			// otherwise hide element
			} else {
				this.containers.eq(index).slideUp(this.options.duration, this.options.easing);
				this.triggers.eq(index).addClass(this.options.cls.collapsed).removeClass(this.options.cls.expanded)
					.find('.text').html(this.options.lang.collapsed);
			}

			// trigger callback
			this._fire('hide', this);
		},

		_fire: function (keyword, scope) {
			if(scope) {
				// cancel if there is no callback found
				if(this.callbacks[keyword] === undefined) return false;
				// excecute callback
				this.callbacks[fn](scope);
			} else {
				// excecute event
				$.event.trigger('accordion-' + event);
			}
		}

	});

})(jQuery);