/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.3.0
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
	'use strict';

	// creating class
	Cl.Carousel = new Class({
		/*
			TODO 1.3.1
			- add better swipe implementation

			TODO 1.4.0
			- add items using ajax
			- generating the navigation on the fly
		 */

		options: {
			'index': 0, // initial page to load
			'timeout': null, // timeout for autoplay, if 0 or null autoplay is ignored
			'autoplay': false, // if true starts animation again after it has been canceled
			'easing': 'linear',
			'duration': 300, // duration for animation
			'move': 'auto', // either "single" to move one element or "auto" to move the whole slider
			'momentum': true, // allow scrolling over the left and right border
			'cls': {
				'active': 'active', // class that will be used for active states
				'disabled': 'disabled',
				'wrapper': '.wrapper',
				'viewport': '.viewport',
				'elements': '.item',
				'next': '.trigger-next a',
				'previous': '.trigger-previous a',
				'navigation': 'nav a'
			}
		},

		initialize: function (container, options) {
			this.container = $(container);
			this.options = $.extend(true, {}, this.options, options);

			this.wrapper = this.container.find(this.options.cls.wrapper);
			this.viewport = this.wrapper.find(this.options.cls.viewport);
			this.elements = this.viewport.find(this.options.cls.elements);
			this.navigation = this.container.find(this.options.cls.navigation);

			this.index = this.options.index;
			this.bound = this.elements.length;
			this.timer = function () {};
			this.callbacks = {};

			this.triggers = {
				'next': this.container.find(this.options.cls.next),
				'previous': this.container.find(this.options.cls.previous)
			};

			var that = this;
			// this fixes chromes jQuery(window).load issue
			jQuery(window).load(function () {
				that._setup();
			});
		},

		_setup: function () {
			var that = this;

			// calculate viewport width
			this.viewport.css('width', this.elements.length * this.elements.outerWidth(true));
			// calculate container height
			this.wrapper.css('height', this.viewport.height());

			// cancel if bound is bigger then containing items
			if(this.bound < Math.ceil(this.wrapper.outerWidth(true) / $(this.elements[0]).outerWidth(true))) {
				this.triggers.next.hide();
				this.triggers.previous.hide();
				return false;
			}

			// bind event for next triggers
			this.triggers.next.bind('click', function (e) {
				e.preventDefault();
				// determine autoplay status
				if(!that.options.autoplay) that.options.timeout = null;
				that.next();
			});

			// bind event for previous triggers
			this.triggers.previous.bind('click', function (e) {
				e.preventDefault();
				// determine autoplay status
				if(!that.options.autoplay) that.options.timeout = null;
				that.previous();
			});

			// bind navigation
			this.navigation.bind('click', function (e) {
				e.preventDefault();
				// determine autoplay status
				if(!that.options.autoplay) that.options.timeout = null;
				that.move(that.navigation.index($(this)));
			});

			// show elements
			this.navigation.show();
			this.triggers.next.show();
			this.triggers.previous.show();

			// start autoplay
			if(this.options.timeout) this.play();

			// add swipe event
			if(typeof($.fn.swipe) === "function" && (Cl.Utils.mobile() || Cl.Utils.tablet())) this._swipe();

			// init first
			this.move();
		},

		next: function () {
			// trigger event
			this._triggerEvent('next');

			var width = $(this.elements[0]).outerWidth(true);
			var viewBound = Math.ceil(this.wrapper.width() / width);
			var counter = this.index;

			// add handling for single / auto options
			if(this.options.move == 'auto') counter = viewBound * this.index;

			// cancel if bound is reached and momentum is false
			if(counter >= this.bound - viewBound && !this.options.momentum) return false;
			// continue with first slide if momentum is true
			if(counter >= this.bound - viewBound && this.options.momentum) {
				this.index = -1;
			}

			// increment settings
			this.index = this.index + 1;

			// trigger callback
			this._triggerCallback('next', this);

			// move
			this.move();
		},

		previous: function () {
			// trigger event
			this._triggerEvent('previous');

			var width = $(this.elements[0]).outerWidth(true);
			var viewBound = Math.ceil(this.wrapper.width() / width);
			var counter = this.bound - viewBound + 1;

			// add handling for single / auto options
			if(this.options.move == 'auto') counter = viewBound - 1;

			// cancel if bound is reached and momentum is false
			if(this.index <= 0 && !this.options.momentum) return false;
			// continue with last slide if momentum is true
			if(this.index <= 0 && this.options.momentum) {
				this.index = counter;
			}

			// increment settings
			this.index = this.index - 1;

			// trigger callback
			this._triggerCallback('previous', this);

			// move
			this.move();
		},

		move: function (index) {
			// trigger event
			if(index) this._triggerEvent('move');

			// set new index if neccessary
			// we need to check for undefined as 0 is false
			this.index = (index !== undefined) ? index : this.index;

			// check if we should autoplay
			this.play();

			// local vars
			var next = this.triggers.next;
			var previous = this.triggers.previous;
			var nav = this.navigation;

			var width = $(this.elements[0]).outerWidth(true);
			var viewBound = Math.ceil(this.wrapper.width() / width);
			var moveBound = (this.options.move === 'single') ? 1 : viewBound;
			var position = -(width * (this.index * moveBound));

			// animation settings
			this.viewport.stop().animate({
				'left': position
			}, this.options.duration, this.options.easing);

			// change active navigation
			nav.removeClass(this.options.cls.active);
			nav.eq(this.index).addClass(this.options.cls.active);

			// remove classes
			next.removeClass(this.options.cls.disabled);
			previous.removeClass(this.options.cls.disabled);

			// add appropriate classes to left trigger
			if(this.index <= 0 || viewBound >= this.bound) previous.addClass(this.options.cls.disabled);
			// add appropriate classes to right trigger
			if(viewBound + this.index >= this.bound || viewBound >= this.bound) next.addClass(this.options.cls.disabled);

			// trigger callback
			if(index) this._triggerCallback('move', this);
		},

		play: function () {
			var that = this;
			// stp previous
			this.stop();
			// cancel if timeout is still 0
			if(this.options.timeout <= 0) return false;
			// start timer
			this.timer = setInterval(function () {
				that.next();
			}, this.options.timeout);
		},

		stop: function () {
			clearInterval(this.timer);
		},

		destroy: function () {
			this.viewport.removeAttr('css');
			this.wrapper.removeAttr('css');
			this.triggers.next.removeAttr('css');
			this.triggers.previous.removeAttr('css');
			// remove events
			this.triggers.next.unbind('click');
			this.triggers.previous.unbind('click');
			this.navigation.unbind('click');
			// remove interval
			this.stop();
		},

		// add swipe events for mobile
		_swipe: function () {
			// requires touchSwipe from plugins
			var that = this;

			this.container.swipe({
				'swipeLeft': swipeLeft,
				'swipeRight': swipeRight
			});

			// inverse movement
			function swipeLeft() {
				that.stop();
				that.next();
			}
			function swipeRight() {
				that.stop();
				that.previous();
			}
		},

		_triggerCallback: function (fn, scope) {
			// cancel if there is no callback found
			if(this.callbacks[fn] === undefined) return false;
			// excecute fallback
			this.callbacks[fn](scope);
		},

		_triggerEvent: function (event) {
			$.event.trigger('carousel-' + event);
		}

	});

})(jQuery);
