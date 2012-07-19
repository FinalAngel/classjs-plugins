/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.0.1
 */

// insure namespace is defined
var Cl = window.Cl || {};

(function($){
	'use strict';

	// creating class
	Cl.Accordion = new Class({

		options: {
			'active': null, // first element to show
			'expanded': false, // show element on initialization
			'event': 'click', // click or hover
			'fx': 'slide', // toggle, fade or slide
			'duration': 300, // animation duration
			'timeout': 300, // used for queuing
			'transition': 'linear',
			'grouping': true, // enables only one item to be opened at a time
			'forceClose': false, // if true closes current element when clicking again
			'cls': {
				'expanded': 'expanded', // class that will be added
				'collapsed': 'collapsed', // class that will be added
				'trigger': '.trigger',
				'container': '.container'
			}
		},

		initialize: function (container, options) {
			this.container = $(container);
			this.options = $.extend(true, {}, this.options, options);

			this.triggers = this.container.find(this.options.cls.trigger);
			this.containers = this.container.find(this.options.cls.container);
			this.index = null;

			this._setup();
		},

		_setup: function () {
			var that = this;

			// attach events
			this.triggers.bind(this.options.event, function (e) {
				e.preventDefault();
				that.trigger.call(that, that.triggers.index(e.currentTarget));
			});

			// hide containers
			if(!this.options.expanded) this.containers.hide();

			// show first element
			if(!this.options.active !== null) this.trigger(this.options.active);
		},

		trigger: function (index) {
			// cancel if index is the same
			if(this.index === index && !this.options.forceClose) return false;
			// set global vars
			this.index = index;

			// set local vars
			var container = this.containers.eq(index);
			var trigger = this.triggers.eq(index);

			// hide containers if grouping is active
			if(this.options.grouping) this._hide(this.containers, this.triggers);

			// redirect to required behaviour
			(container.is(':visible')) ? this._hide(container, trigger) : this._show(container, trigger);
		},

		_hide: function (container, trigger) {
			// bind event options
			if(this.options.fx == 'toggle') container.hide();
			if(this.options.fx == 'slide') container.stop(true, true)
				.slideUp(this.options.duration, this.options.transition);
			if(this.options.fx == 'fade') container.stop(true, true)
				.fadeOut(this.options.duration, this.options.transition);

			// add and remove classes
			trigger.addClass(this.options.cls.collapsed).removeClass(this.options.cls.expanded);
		},

		_show: function (container, trigger) {
			// bind event options
			if(this.options.fx == 'toggle') container.show();
			if(this.options.fx == 'slide') container.stop(true, true)
				.slideDown(this.options.duration, this.options.transition);
			if(this.options.fx == 'fade') container.stop(true, true)
				.fadeIn(this.options.duration, this.options.transition);

			// add and remove classes
			trigger.addClass(this.options.cls.expanded).removeClass(this.options.cls.collapsed);
		}

	});

})(jQuery);