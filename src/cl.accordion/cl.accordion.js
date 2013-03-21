/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.1.0
 */

// insure namespace is defined
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
			'index': null, // first element to show
			'expanded': false, // show element on initialization
			'event': 'click', // jquery event
			'easing': 'linear',
			'duration': 300, // animation duration
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
			this.callbacks = {};

			// we need to set the heights for each element
			this.containers.each(function (index, item) {
				$(item).height($(item).outerHeight(true));
			});

			// cancel if triggers and containers are not even
			if(this.triggers.length !== this.containers.length) return false;

			this._setup();
		},

		_setup: function () {
			var that = this;

			this.triggers.bind(this.options.event, function (e) {
				that.toggle(that.triggers.index(this));
			});

			// hide containers
			if(!this.options.expanded) {
				this.containers.hide();
			} else {
				this.triggers.addClass(this.options.cls.expanded);
			}

			// show correct index
			if(this.options.index !== null && !this.options.expanded) this.toggle(this.options.index);
		},

		toggle: function (index) {
			// trigger event
			this._triggerEvent('toggle');

			// cancel if index is the same
			if(this.index === index && !this.options.forceClose) return false;

			// set global vars
			this.index = index;

			// hide containers if grouping is active
			if(this.options.grouping) this.hide();

			// redirect to required behaviour
			(this.containers.eq(index).is(':visible')) ? this.hide(index) : this.show(index);

			// trigger callback
			this._triggerCallback('toggle', this);
		},

		show: function (index) {
			// trigger event
			this._triggerEvent('show');

			var container = this.containers.eq(index);
			var trigger = this.triggers.eq(index);

			// if no index is provided, hide all
			if(index === undefined) this.containers.slideDown(this.options.duration, this.options.easing);

			// do animation
			container.slideDown(this.options.duration, this.options.easing);

			// add and remove classes
			this.triggers.addClass(this.options.cls.collapsed);
			trigger.addClass(this.options.cls.expanded).removeClass(this.options.cls.collapsed);

			// trigger callback
			this._triggerCallback('show', this);
		},

		hide: function (index) {
			// trigger event
			this._triggerEvent('hide');

			var container = this.containers.eq(index);
			var trigger = this.triggers.eq(index);

			// if no index is provided, hide all
			if(index === undefined) this.containers.slideUp(this.options.duration, this.options.easing);

			// do animation
			container.slideUp(this.options.duration, this.options.easing);

			// add and remove classes
			this.triggers.addClass(this.options.cls.expanded);
			trigger.addClass(this.options.cls.collapsed).removeClass(this.options.cls.expanded);

			// trigger callback
			this._triggerCallback('hide', this);
		},

		_triggerCallback: function (fn, scope) {
			// cancel if there is no callback found
			if(this.callbacks[fn] === undefined) return false;
			// excecute fallback
			this.callbacks[fn](scope);
		},

		_triggerEvent: function (event) {
			$.event.trigger('accordion-' + event);
		}

	});

})(jQuery);