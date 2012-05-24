/*!
 * @author:		Angelo Dini
 * @copyright:	http://www.divio.ch under the BSD Licence
 * @requires:	Classy, jQuery
 */

//##################################################
// #CL EXTENSION#
(function($){
	// Version 1.0
	Cl.Expandable = Class.$extend({

		options: {
			'expanded': false, // show element on initialization
			'event': 'click', // click or hover
			'fx': 'slide', // toggle, fade or slide
			'duration': 300, // animation duration
			'timeout': 300, // used for queuing
			'grouping': null, // providing a grouping class allows the disable/enabling of only one item
			'triggerClass': '.trigger', // element that triggers hidden (within container)
			'contentClass': '.content', // element that will be hidden (within container)
			'activeClass': 'active' // class will be added on container
		},

		initialize: function (container, options) {
			this.container = $(container);
			this.options = $.extend({}, this.options, options);
			this.timer = function () {};
			this.queue = false;
			this.container.data('expanded', this.options.expanded);
			this._events();

			// trigger elements
			this.trigger('init');
		},

		_events: function () {
			var that = this;
			var trigger = this.container.find(this.options.triggerClass);
			var content = this.container;

			// add click trigger event
			if(this.options.event === 'click') {
				trigger.bind('click', function (e) {
					e.preventDefault();
					that.trigger.call(that, 'trigger');
				});
			}

			// add hover trigger event
			if(this.options.event === 'hover') {
				trigger.bind('trigger', function (e) {
					e.preventDefault();
				});
				content.bind('mouseenter', function () {
					clearTimeout(that.timer);
					that.trigger.call(that, 'show');
				});
				content.bind('mouseleave', function () {
					that.timer = setTimeout(function () {
						that.trigger.call(that, 'hide');
					}, that.options.timeout);
				});
			}
		},

		trigger: function (type) {
			var that = this;

			// setup queue
			if(this.queue) return false;
			this.queue = true;

			// grouping
			if(that.options.grouping !== null) {
				this._grouping();
			}

			// special triggers
			if(type === 'show') this._expand();
			if(type === 'hide') this._collapse();
			if(type === 'init') this.container.addClass(this.options.activeClass);
			if(type === 'init' && !this.container.data('expanded')) {
				this.container.find(this.options.contentClass).hide();
				this.container.removeClass(this.options.activeClass);
			}

			// general trigger
			if(type === 'trigger' && this.container.data('expanded')) {
				// if true show
				this._collapse();
			} else if(type === 'trigger' && this.container.data('expanded') === false) {
				// if false hide
				this._expand();
			}

			// setup timer
			this.timer = setTimeout(function () {
				that.queue = false;
			}, this.options.duration);
		},

		_collapse: function () {
			// get element
			var el = this.container.find(this.options.contentClass);

			// bind event options
			if(this.options.fx == 'toggle') el.stop().hide();
			if(this.options.fx == 'slide') el.stop().slideUp(this.options.duration);
			if(this.options.fx == 'fade') el.stop().fadeOut(this.options.duration);

			// add active state
			this.container.removeClass(this.options.activeClass);

			// set new state
			this.container.data('expanded', false);
		},

		_expand: function () {
			// get element
			var el = this.container.find(this.options.contentClass);

			// bind event options
			if(this.options.fx == 'toggle') el.stop().show();
			if(this.options.fx == 'slide') el.stop().slideDown(this.options.duration);
			if(this.options.fx == 'fade') el.stop().fadeIn(this.options.duration);

			// add active state
			this.container.addClass(this.options.activeClass);

			// set new state
			this.container.data('expanded', true);
		},

		_grouping: function () {
			var that = this;

			$(this.options.grouping).each(function (index, item) {
				if($(item).data('expanded')) {
					var content = $(item).find(that.options.contentClass);

					content.slideUp();

					// set status
					$(item).removeClass(that.options.activeClass);
					$(item).data('expanded', false);
				}
			});
		}
	});
})(jQuery);