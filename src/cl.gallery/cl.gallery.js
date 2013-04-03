/*!
 * @author      Aleš Kocjančič - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     2.0.0
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
	'use strict';

	// creating class
	Cl.Gallery = new Class({
		/*
			TODO 2.1.0
			- add coverflow feature
		 */

		options: {
			'index': null, // initial image to show
			'timeout': 5000, // if set, the gallery will start moving automatically
			'autoplay': false, // same as carousel
			'easing': 'linear',
			'duration': 300, // duration for animation
			'move': 'next', // direction to move by default (next, previous or random)
			'engine': 'slide', // animation type (fade, slide)
			'cls': { // these selectors are all relative to the container
				'active': 'active', // class that will be used for active thumbnails
				'wrapper': '.wrapper', // viewport wrapper
				'viewport': '.viewport', // item container
				'elements': '.item',
				'next': '.trigger-next a', // right trigger
				'previous': '.trigger-previous a', // left trigger
				'navigation': 'nav a' // navigation triggers container
			}
		},

		initialize: function (container, options) {
			this.container = $(container);
			this.options = $.extend(true, {}, this.options, options);

			this.wrapper = this.container.find(this.options.cls.wrapper);
			this.viewport = this.container.find(this.options.cls.viewport);
			this.elements = this.container.find(this.options.cls.elements);
			this.navigation = this.container.find(this.options.cls.navigation);

			this.triggers = {
				'next': this.container.find(this.options.cls.next),
				'previous': this.container.find(this.options.cls.previous)
			};

			this.index = null;
			this.bound = this.elements.length;
			this.direction = '';
			this.queue = false;
			this.timer = function () {};
			this.callbacks = {};

			var that = this;
			// this fixes chromes jQuery(window).load issue
			jQuery(window).load(function () {
				if(that.elements.length > 0) that._setup();
			});
		},

		_setup: function () {
			var that = this;

			// dynamically set height if necessary (only happens on page reload)
			this.wrapper.css('height', this.elements.eq(0).outerHeight(true));

			// bind event for next triggers
			this.triggers.next.on('click', function(e) {
				e.preventDefault();
				// determine autoplay status
				if(!that.options.autoplay) that.options.timeout = null;
				that.next();
			});

			// bind event for previous triggers
			this.triggers.previous.on('click', function(e) {
				e.preventDefault();
				// determine autoplay status
				if(!that.options.autoplay) that.options.timeout = null;
				that.previous();
			});

			// bind navigation
			this.navigation.on('click', function (e) {
				e.preventDefault();
				// determine autoplay status
				if(!that.options.autoplay) that.options.timeout = null;
				that.move(that.navigation.index($(this)), 'random');
			});

			// show elements
			this.navigation.show();
			this.triggers.next.show();
			this.triggers.previous.show();

			// start autoplay
			if(this.options.timeout) this.play();

			// init first
			this.move(this.options.index || 0, 'setup');
		},

		next: function () {
			// trigger event
			this._fire('next');

			// move
			this.move(this.index + 1, 'next');

			// trigger callback
			this._fire('next', this);
		},

		previous: function () {
			// trigger event
			this._fire('previous');

			// move
			this.move(this.index - 1, 'previous');

			// trigger callback
			this._fire('previous', this);
		},

		move: function (index, direction) {
			// cancel if queue
			if(this.queue) return false;

			// set new height
			this.wrapper.css('height', this.elements.eq(this.index).outerHeight(true));

			// cancel if index is the same
			if(index === this.index) return false;

			// set new index
			this.index = this._setIndex(index);

			// set direction
			this.direction = direction || this.options.move;

			// rest timer
			this.play();

			// add accessibility
			this._accessibility();

			// change active navigation
			this.navigation.removeClass(this.options.cls.active);
			this.navigation.eq(this.index).addClass(this.options.cls.active);

			// start the engine
			this.engine[this.options.engine].call(this);
		},

		play: function () {
			// trigger event
			this._fire('play');

			var that = this;
			// stp previous
			this.stop();
			// cancel if timeout is still 0
			if(this.options.timeout <= 0) return false;
			// start timer
			this.timer = setInterval(function () {
				that.next();
			}, this.options.timeout);

			// trigger event
			this._fire('stop');
		},

		stop: function () {
			// trigger event
			this._fire('stop');

			// we just need to clear the intervall
			clearInterval(this.timer);

			// trigger event
			this._fire('stop');
		},

		update: function () {
			// update gallery scripts
			this.move(this.index);
		},

		engine: {

			'fade': function () {
				// add fade animation
				this.elements.fadeOut(this.options.duration, this.options.transition);
				this.elements.eq(this.index).fadeIn(this.options.duration, this.options.transition);
			},

			'slide': function () {
				// set queue
				this.queue = true;

				// setup
				if(this.direction === 'setup') {
					var el = this.elements.eq(this.index);
					// we need to set a fixed width and height
					this.elements.show().css('left', -9999);
					el.css('left', 0);
					// we don't need a queue here
					this.queue = false;
				} else {
					// get current element
					var width = this.viewport.outerWidth();
					var visible = this.elements.filter(function () {
						return parseInt($(this).css('left')) === 0;
					});

					// animate old element
					visible.animate({
						'left': (this.direction === 'previous') ? width : -width
					}, this.options.duration, this.options.transition, function () {
						// ensure element is out of reach
						$(this).css('left', -9999);
					});
					// animate new element
					this.elements.eq(this.index).css('left', (this.direction === 'previous') ? -width : width).animate({
						'left': 0
					}, this.options.duration, this.options.transition);
				}

				var that = this;
				setTimeout(function () {
					that.queue = false;
				}, this.options.duration);
			}

		},

		_setIndex: function (index) {
			if(index < 0) index = this.bound - 1;
			if(index >= this.bound) index = 0;

			return index;
		},

		_accessibility: function () {
			// if only one item is moved at a time
			this.elements
				.attr('aria-hidden', true)
				.attr('aria-selected', false);
			this.elements.eq(this.index)
				.attr('aria-hidden', false)
				.attr('aria-selected', true);
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