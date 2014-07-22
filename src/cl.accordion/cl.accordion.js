/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright   Distributed under the BSD License.
 * @version     1.1.7
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
    'use strict';

    // creating class
    Cl.Accordion = new Class({
        /*
            TODO 1.2.0
            - add api for additional close elements (or api triggers)?
            - add fadeIn / fadeOut options
         */

        options: {
            'index': null,
            'expanded': false,
            'event': 'click',
            'easing': 'swing',
            'duration': 300,
            'grouping': true,
            'forceClose': false,
            'disableAnchors': true,
            'autoHeight': false,
            'cls': {
                'expanded': 'expanded',
                'collapsed': 'collapsed',
                'trigger': '.trigger',
                'container': '.container',
                'text': '.text'
            },
            'lang': {
                'expanded': 'Expanded ',
                'collapsed': 'Collapsed '
            },
            'callbacks': {}
        },

        initialize: function (container, options) {
            this.container = $(container);
            this.options = $.extend(true, {}, this.options, options);

            this.triggers = this.container.find(this.options.cls.trigger);
            this.containers = this.container.find(this.options.cls.container);
            this.index = null;
            this.callbacks = this.options.callbacks;

            // cancel if triggers and containers are not even
            if(this.triggers.length !== this.containers.length) return false;

            // move to setup
            this._setup();
        },

        _setup: function () {
            var that = this;

            // set the correct height
            if(this.options.autoHeight) this._setHeight();

            // add event to each trigger
            this.triggers.on(this.options.event, function (e) {
                if(that.options.disableAnchors) e.preventDefault();
                that.toggle(that.triggers.index(this));
            });

            // prevent click events on substitutes
            if(this.options.disableAnchors) {
                this.triggers.find('a', function (e) {
                    e.preventDefault();
                });
            }

            // setup initial states
            for (var i = 0; i < this.triggers.length; i++) {
                if (this.options.expanded || this.container.data('expanded') || this.triggers.eq(i).data('expanded')) {
                    this.show(i, true);
                }
                else {
                    this.hide(i, true);
                }
            }

            // set first item
            if(this.options.index !== null) this.show(this.options.index, true);

            // check for hash
            var hash = window.location.hash;
            if(!this.options.expanded && hash !== undefined) {
                var el = this.container.find('a[href="'+hash+'"]');
                if(el.length) el.trigger(this.options.event);
            }
        },

        toggle: function (index) {
            // cancel if index is the same end forceClose disabled or not provided
            if(this.index === index && !this.options.forceClose || this.index === undefined) return false;
            // set global index
            this.index = index;

            // redirect to required behaviour
            (this.containers.eq(index).is(':visible')) ? this.hide(index) : this.show(index);

            // trigger callback
            this._fire('toggle');
        },

        show: function (index, fast) {
            // if no index is provided, show all
            this._setExpanded(index, fast);

            // trigger callback
            this._fire('show');
        },

        hide: function (index, fast) {
            // if no index is provided, hide all
            this._setCollapsed(index, fast);

            // trigger callback
            this._fire('hide');
        },

        _setExpanded: function (index, fast) {
            // exception if grouping is enabled
            if(this.options.grouping && !fast) this.hide();

            if(index === undefined) {
                if(!fast) this.containers.slideDown({
                    duration:this.options.duration,
                    easing: this.options.easing
                });
                if(fast) this.containers.show();

                this.containers
                    .attr('aria-hidden', false);

                this.triggers
                    .addClass(this.options.cls.expanded)
                    .removeClass(this.options.cls.collapsed)
                    .attr('aria-selected', true)
                    .attr('aria-expanded', true)
                        .find(this.options.cls.text).html(this.options.lang.expanded);
            } else {
                if(!fast) this.containers.eq(index)
                    .slideDown({
                        duration:this.options.duration,
                        easing: this.options.easing,
                        complete: this.callbacks.complete
                    })
                    .attr('aria-hidden', false);
                if(fast) this.containers.show();

                this.triggers.eq(index)
                    .addClass(this.options.cls.expanded)
                    .removeClass(this.options.cls.collapsed)
                    .attr('aria-selected', true)
                    .attr('aria-expanded', true)
                        .find(this.options.cls.text).html(this.options.lang.expanded);
            }

            // assign correct index
            if (typeof(index) !== 'undefined') {
                this.index = index;
            }
        },

        _setCollapsed: function (index, fast) {
            if(index === undefined) {
                if(!fast) this.containers.slideUp(this.options.duration, this.options.easing);
                if(fast) this.containers.hide();

                this.containers
                    .attr('aria-hidden', true);

                this.triggers
                    .addClass(this.options.cls.collapsed)
                    .removeClass(this.options.cls.expanded)
                    .attr('aria-selected', false)
                    .attr('aria-expanded', false)
                        .find(this.options.cls.text).html(this.options.lang.collapsed);
            } else {
                if(!fast) this.containers.eq(index)
                    .slideUp(this.options.duration, this.options.easing)
                    .attr('aria-hidden', true);
                if(fast) this.containers.hide();

                this.triggers.eq(index)
                    .addClass(this.options.cls.collapsed)
                    .removeClass(this.options.cls.expanded)
                    .attr('aria-selected', false)
                    .attr('aria-expanded', false)
                        .find(this.options.cls.text).html(this.options.lang.collapsed);
            }
        },

        _setHeight: function () {
            this.containers.each(function (index, item) {
                $(item).height($(item).height());
            });
        },

        _fire: function (keyword) {
            // cancel if there is no callback found
            if(this.callbacks[keyword] === undefined) return false;
            // excecute callback
            this.callbacks[keyword](this);
        }

    });

})(jQuery);