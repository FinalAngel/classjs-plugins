/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.0.beta2
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
	'use strict';

	// creating class
	Cl.Scroll = new Class({

		options: {
			'offset': 0,
			'snap': false,
			'hash': true,
			'duration': 300,
			'transition': 'swing'
		},

		initialize: function (triggers, options) {
			this.triggers = $(triggers);
			this.options = $.extend(true, {}, this.options, options);

			this.body = $('body, html');

			this._setup();
		},

		_setup: function () {
			var that = this;

			// add events
			this.triggers.bind('click', function (e) {
				e.preventDefault();
				that._scan($(this));
			});

			// check if there is already an appropriate hashtag available
			var hash = window.location.hash || '';
			if(hash !== '') this._scan($(hash));

			// cancel when scrolling
			this.body.bind('mousewheel', function () {
				that.body.stop();
			});
		},

		_scan: function (el) {
			var hash = el.attr('href');
			var container = $(hash);

			// if there is no element abort
			if(!container.length) return false;

			// get the containers position
			var position = container.offset().top;

			// initiate scrolling
			this.scrollTo(position, hash);
		},

		scrollTo: function (position, hash) {
			// trigger event
			this._fire('scrollto');

			var that = this;

			this.body.animate({
				'scrollTop': position
			}, this.options.duration, this.options.transition, function () {
				if(that.options.hash) window.location.hash = hash || '';
			});

			// trigger callback
			this._fire('scrollto', this);
		},

		_fire: function (keyword, scope) {
			if(scope) {
				// cancel if there is no callback found
				if(this.callbacks[keyword] === undefined) return false;
				// excecute callback
				this.callbacks[keyword](scope);
			} else {
				// excecute event
				$.event.trigger('gallery-' + keyword);
			}
		}

	});

})(jQuery);