/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.0.beta1
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
	'use strict';

	// creating class
	Cl.Parallax = new Class({

		options: {
			'event': 'scroll', // scroll or mouse
			'axis': ['top'],
			'steps': 5, // pixel step thats taken
			'inverted': false, // inverts animation direction
			'duration': 100,
			'transition': 'linear'
		},

		initialize: function (elements, options) {
			this.elements = $(elements);
			this.options = $.extend(true, {}, this.options, options);

			this._setup();
		},

		_setup: function () {
			var that = this;

			// loop through the elements and set settings
			this.elements.each(function (index, item) {
				item = $(item);

				// this parallax script uses relative/absolute positioned elements
				var position = {
					'top': parseInt(item.css('top')) || 0,
					'right': parseInt(item.css('right')) || 0,
					'bottom': parseInt(item.css('bottom')) || 0,
					'left': parseInt(item.css('left')) || 0
				};
				item.data('position', position);
			});

			// attach the event if scroll
			if(this.options.event === 'scroll') {
				$(window).bind('scroll', function (e) {
					that.elements.each(function (index, item) {
						that._parallax.scroll.call(that, $(item));
					});
				});
			}
		},

		// parallax events
		_parallax: {

			'scroll': function (el) {
				// check if element is visible
				var that = this;
				var top = el.data('position').top;
				var elPos = el.offset().top;
				var scrollPos = $(window).scrollTop();
				var windowHeight = $(window).height();

				// this checks only if its visible from the top
				var isVisible = (elPos - scrollPos - windowHeight + el.height() <= 0) ? true : false;

				// animate if visible
				if(isVisible) {
					$(this.options.axis).each(function (index, axis) {
						var pos = -(top - scrollPos + el.height());
						pos = pos / that.options.steps;

						el.stop().animate({
							'top': (that.options.inverted) ? (top - pos) : (top + pos)
						}, that.options.duration, that.options.transition);
					});
				}
			},

			'mouse': function () {}

		}

	});

})(jQuery);