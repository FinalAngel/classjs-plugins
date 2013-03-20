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
		 */

		options: {
			'index': 0, // initial page to load
			'timeout': null, // timeout for autoplay, if 0 or null autoplay is ignored
			'easing': 'linear',
			'duration': 500, // duration for animation
			'move': 'single', // either "single" to move one element or "auto" to move the whole slider
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

			this._setup();
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
				clearInterval(that.timer);
				that.next.call(that);
			});

			// bind event for previous triggers
			this.triggers.previous.bind('click', function (e) {
				e.preventDefault();
				clearInterval(that.timer);
				that.previous.call(that);
			});

			// bind navigation
			this.navigation.bind('click', function (e) {
				e.preventDefault();
				that.move(that.navigation.index($(this)));
			});

			// start autoplay
			if(this.options.timeout) this._autoplay();

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

			// cancel if bound is reached and momentum is false
			if(viewBound + this.index >= this.bound && !this.options.momentum) return false;
			// continue with first slide if momentum is true
			if(viewBound + this.index >= this.bound && this.options.momentum) {
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

			// cancel if bound is reached and momentum is false
			if(this.index <= 0 && !this.options.momentum) return false;
			// continue with last slide if momentum is true
			if(this.index <= 0 && this.options.momentum) {
				this.index = this.bound - viewBound + 1;
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
			this._triggerEvent('move');

			// set new index if neccessary
			this.index = (index !== undefined) ? index : this.index;

			var width = $(this.elements[0]).outerWidth(true);
			var viewBound = Math.ceil(this.wrapper.width() / width);
			var moveBound = (this.options.move === 'single') ? 1 : viewBound;
			var position = -(width * (this.index * moveBound));

			// animation settings
			this.viewport.stop().animate({
				'left': position
			}, this.options.duration, this.options.easing);

			// change active navigation
			this.navigation.removeClass(this.options.cls.active);
			this.navigation.eq(this.index).addClass(this.options.cls.active);

			// add appropriate classes to left trigger
			if(this.index <= 0) {
				this.triggers.previous.addClass(this.options.cls.disabled);
				this.triggers.next.removeClass(this.options.cls.disabled);
			} else {
				this.triggers.previous.removeClass(this.options.cls.disabled);
			}
			// add appropriate classes to right trigger
			if(viewBound + this.index >= this.bound) {
				this.triggers.previous.removeClass(this.options.cls.disabled);
				this.triggers.next.addClass(this.options.cls.disabled);
			} else {
				this.triggers.next.removeClass(this.options.cls.disabled);
			}

			// check if we should disable the arrows
			if(viewBound >= this.bound) {
				this.triggers.previous.addClass(this.options.cls.disabled);
				this.triggers.next.addClass(this.options.cls.disabled);
			}

			// trigger callback
			this._triggerCallback('move', this);
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
			clearInterval(this.timer);
		},

		_autoplay: function () {
			var that = this;

			this.timer = setInterval(function () {
				that.next();
			}, this.options.timeout);
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
				that.next();
				// clear timer
				clearInterval(that.timer);
			}
			function swipeRight() {
				that.previous();
				// clear timer
				clearInterval(that.timer);
			}
		},

		_triggerCallback: function (fn, scope) {
			// cancel if there is no callback found
			if(this.callbacks[fn] === undefined) return false;
			// excecute fallback
			this.callbacks[fn](scope);
		},

		_triggerEvent: function (event) {
			$.event.trigger(this.options.prefix + '-carousel-' + event);
		}

	});

})(jQuery);
