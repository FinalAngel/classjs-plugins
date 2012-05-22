/*!
 * @author:		Angelo Dini
 * @copyright:	http://www.divio.ch under the BSD Licence
 * @requires:	Classy, jQuery
 */

//##################################################
// #CL EXTENSION#
(function($){
	// Version 1.0
	Cl.Tabs = Class.$extend({

		options: {
			'active': 0,
			'cls': {
				'triggers': '.trigger a',
				'states': 'li', // defines where the active state will be added
				'containers': '.container',
				'activeTrigger': 'active',
				'activeContainer': 'active'
			}
		},

		initialize: function (container, options) {
			var that = this;

			this.container = $(container);
			this.options = $.extend(true, {}, this.options, options);

			this.containers = this.container.find(this.options.cls.containers);
			this.states =
			this.triggers = this.container.find(this.options.cls.triggers);
			this.triggers.bind('click', function (e) {
				e.preventDefault();
				var index = that.triggers.index(e.currentTarget);
					that.trigger.call(that, index);
			});

			this.setup();
		},

		setup: function () {
			var active = this.options.active;

			this.trigger(active);
		},

		trigger: function (index) {
			this._hide();
			this._show(index);
		},

		_show: function (index) {
			var container = $(this.containers[index]);
				container.show().addClass(this.options.cls.activeContainer);
			var trigger = $(this.triggers[index]);
				trigger.closest(this.options.cls.states).addClass(this.options.cls.activeTrigger);
		},

		_hide: function () {
			this.containers.hide();
			this.containers.removeClass(this.options.cls.activeContainer);

			this.triggers.closest(this.options.cls.states).removeClass(this.options.cls.activeTrigger);
		}

	});
})(jQuery);