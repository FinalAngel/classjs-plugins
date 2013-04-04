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
	Cl.MobileMenu = new Class({

		options: {
			'easing': 'linear',
			'duration': 300,
			'bound': 539,
			'ratio': 70 / 100,
			'offset': {
				'left': 0,
				'top': 0
			},
			'cls': {
				'menu': '.mainnav',
				'inner': '> ul',
				'knob': '.mainnav-knob'
			},
			'overlay': '<div class="mainnav-overlay"></div>'
		},

		initialize: function (options) {
			this.options = $.extend(true, {}, this.options, options);

			this.html = $('html');
			this.body = $('body');

			this.menu = $(this.options.cls.menu);
			this.knob = $(this.options.cls.knob);
			this.overlay = $(this.options.overlay);

			this.initialized = false;
			this.visible = false;
			this.timer = function () {};
			this.width = null;
			this.height = this.menu.outerHeight(true);
			this.callbacks = {};

			this._setup();
		},

		_setup: function () {
			var that = this;

			// setup initial states
			this.menu.attr('aria-expanded', false);

			// attach trigger to mainmenu
			this.knob.on('click', function (e) {
				e.preventDefault();
				that.toggle();
			});

			// attach event to overlay
			this.overlay.on('click', function () { that.hide(); });

			// show navigation if focus
			this.menu.on('focusin focusout', function (e) {
				// cancel if viewport is smaller than expected
				if($(window).width() >= that.options.bound) return false;
				// start timer
				clearTimeout(that.timer);
				that.timer = setTimeout(function () {
					(e.type === 'focusin') ? that.show() : that.hide(0)
				}, 50);
			});

			// attach resize event for hiding mobile menu
			$(window).on('resize.menu', function () {
				if(that.visible && $(window).width() >= that.options.bound) that.hide(0);

				that.menu.height('auto');
			});
		},

		toggle: function () {
			// trigger event
			this._fire('toggle');

			(this.visible) ? this.hide() : this.show();

			// if not initialized, inject overlay
			if(!this.initialized) this.body.append(this.overlay);
			this.initialized = true;

			// trigger callback
			this._fire('toggle', this);
		},

		show: function (speed) {
			// trigger event
			this._fire('show');

			// switch aria
			this.menu.attr('aria-expanded', true);

			// calculate width, use original if once calculated
			if(!this.visible) this.width = ($(window).width() * this.options.ratio);

			// fix html size and animate
			this.html.animate({
				'margin-left': this.width
			}, (speed !== undefined) ? speed : this.options.duration, this.options.easing)
				.css('width', $(window).width())
				.css('overflow-x', 'hidden');
			// figure out the correct height for the menu
			var height = ($(window).height() > this.body.height()) ? $(window).height() : this.body.height();
			if(this.height > height) height = this.height;
			// set correct menu css
			this.menu.css({
				'width': this.width,
				'height': height + 1, // +5 = address bar fix
				'top': this.options.offset.top,
				'left': -this.width + this.options.offset.left
			});
			// show overlay
			this.overlay.show();

			// set new state
			this.visible = true;

			// trigger callback
			this._fire('show', this);
		},

		hide: function (speed) {
			// trigger event
			this._fire('hide');

			var that = this;

			// switch aria
			this.menu.attr('aria-expanded', false);

			// animate back and remove attributes
			this.html.animate({
				'margin-left': 0
			}, (speed !== undefined) ? speed : this.options.duration, this.options.easing, function () {
				that.menu.removeAttr('style');
				that.html.removeAttr('style');
			});
			// hide overlay
			this.overlay.hide();

			// set new state
			this.visible = false;

			// trigger callback
			this._fire('hide', this);
		},

		_fire: function (keyword, scope) {
			if(scope) {
				// cancel if there is no callback found
				if(this.callbacks[keyword] === undefined) return false;
				// excecute callback
				this.callbacks[keyword](scope);
			} else {
				// excecute event
				$.event.trigger('mobilemenu-' + keyword);
			}
		}
	});

})(jQuery);