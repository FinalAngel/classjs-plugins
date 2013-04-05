/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.3.1
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
	'use strict';

	// creating class
	Cl.Carousel = new Class({
		/*
			TODO 1.3.2
			- add bound handling if there are less or equal items than viewBound
			TODO 1.4.0
			- add items using ajax
			- add unlimited moving
		 */

		options: {
			'index': null,
			'timeout': null,
			'autoplay': false,
			'easing': 'linear',
			'duration': 300,
			'move': 'auto',
			'momentum': true,
			'cls': {
				'active': 'active',
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

			this.index = null;
			this.bound = this.elements.length;
			this.realBound = this._setBound();
			this.timer = function () {};
			this.callbacks = {};
			this.width = null;

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
			if(this.bound < Math.ceil(this.wrapper.outerWidth(true) / this.elements.eq(0).outerWidth(true))) {
				this.triggers.next.hide();
				this.triggers.previous.hide();
				return false;
			}

			// bind event for next triggers
			this.triggers.next.on('click', function (e) {
				e.preventDefault();
				// determine autoplay status
				if(!that.options.autoplay) that.options.timeout = null;
				that.next();
			});

			// bind event for previous triggers
			this.triggers.previous.on('click', function (e) {
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
				that.move(that.navigation.index($(this)));
			});

			// show elements
			this.navigation.show();
			this.triggers.next.show();
			this.triggers.previous.show();

			// init first
			this.move(this.options.index || 0);
		},

		next: function () {
			// trigger event
			this._fire('next');

			// move
			this.move(this.index + 1);

			// trigger callback
			this._fire('next', this);
		},

		previous: function () {
			// trigger event
			this._fire('previous');

			// move
			this.move(this.index - 1);

			// trigger callback
			this._fire('previous', this);
		},

		move: function (index) {
			// trigger event
			this._fire('move');

			// cancel if index is the same
			if(index === this.index) return false;

			// set new index
			this.index = this._setIndex(index);

			// check if we should autoplay
			if(this.autoplay) this.stop();
			if(this.options.timeout > 0) this.play();

			// cancel autoplay if momentum is true and autoplay activated
			if(!this.options.momentum && this.index >= (this.realBound - 1)) this.stop();

			// animation settings
			this.viewport.stop().animate({
				'left': -(this.width * this.index)
			}, this.options.duration, this.options.easing);

			// remove classes
			this.triggers.next.removeClass(this.options.cls.disabled);
			this.triggers.previous.removeClass(this.options.cls.disabled);

			// determine how many items to display
			this.navigation.hide().filter(':lt(' + this.realBound + ')').show();

			// change active navigation
			this.navigation.removeClass(this.options.cls.active);
			this.navigation.eq(this.index).addClass(this.options.cls.active);

			// add appropriate classes to left trigger
			if(this.index <= 0 && !this.options.momentum) this.triggers.previous.addClass(this.options.cls.disabled);
			// add appropriate classes to right trigger
			if(this.index >= this.realBound - 1 && !this.options.momentum) this.triggers.next.addClass(this.options.cls.disabled);

			// add aria states to carousel
			this._accessibility();

			// trigger callback
			this._fire('move', this);
		},

		play: function () {
			// trigger event
			this._fire('play');

			var that = this;
			// start timer
			this.timer = setInterval(function () {
				that.next();
			}, this.options.timeout);

			// set runner
			this.autoplay = true;

			// trigger event
			this._fire('play', this);
		},

		stop: function () {
			// trigger event
			this._fire('stop');

			// we just need to clear the intervall
			clearInterval(this.timer);

			// unset runner
			this.autoplay = false;

			// trigger event
			this._fire('stop', this);
		},

		update: function () {
			// trigger event
			this._fire('update');

			// update gallery scripts
			this.move(this.index);

			// trigger event
			this._fire('update', this);
		},

		destroy: function () {
			// trigger event
			this._fire('destroy');

			this.viewport.removeAttr('style');
			this.wrapper.removeAttr('style');
			this.triggers.next.removeAttr('style');
			this.triggers.previous.removeAttr('style');
			// remove events
			this.triggers.next.off('click');
			this.triggers.previous.off('click');
			this.navigation.off('click');
			// remove labels
			this.elements.removeAttr('aria-hidden').removeAttr('aria-selected');
			// remove interval
			this.stop();

			// trigger event
			this._fire('destroy', this);
		},

		_setIndex: function (index) {
			var width = this.elements.eq(0).outerWidth(true);
			var viewBound = Math.floor(this.wrapper.width() / width);
			var bound = this._setBound();

			// set correct width
			this.width = width;
			if(this.options.move === 'auto') this.width = width * viewBound;

			if(index < 0) index = (this.options.momentum) ? bound - 1 : 0;
			if(index >= bound) index = (this.options.momentum) ? 0 : bound - 1;

			return this.index = index;
		},

		_setBound: function () {
			var width = this.elements.eq(0).outerWidth(true);
			var viewBound = Math.floor(this.wrapper.width() / width);

			if(this.options.move === 'auto') {
				this.realBound = Math.ceil(this.bound / viewBound);
			} else {
				this.realBound = this.bound;
			}

			return this.realBound;
		},

		_accessibility: function () {
			var that = this;
			var width = this.elements.eq(0).outerWidth(true);
			var viewBound = Math.floor(this.wrapper.width() / width);
			var index = null;

			// if only one item is moved at a time
			this.elements
				.attr('aria-hidden', true)
				.attr('aria-selected', false);
			this.elements.eq(this.index).attr('aria-selected', true);

			for(var i = 0; i < viewBound; i++) {
				index = that.index * viewBound;
				if(that.options.move === 'single') index = that.index;
				this.elements.eq(index + i).attr('aria-hidden', false);
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
				$.event.trigger('carousel-' + keyword);
			}
		}

	});

})(jQuery);
