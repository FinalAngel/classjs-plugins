/*!
 * Cl.Autocomplete
 * @author      Ales Kocjancic - github.com/finalangel/classjs-plugins
 * @copyright   Distributed under the BSD License.
 * @version     1.1.0
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
    'use strict';

    // creating class
    Cl.Autocomplete = new Class({

        options: {
            'url': false,
            'minLength': 3,
            'easing': 'swing',
            'duration': 300,
            'delay': 30,
            'fx': 'slide',
            'closeOnBlur': true,
            'showEmpty' : false,
            'dropdown': false,
            'cls': {
                'field': 'input[type="search"]',
                'filter': 'input[name="filter"]',
                'results': '.autocomplete-results',
                'filtering': '.autocomplete-filtering',
                'item': '.autocomplete-item',
                'close': '.autocomplete-close, .close',
                'focus': '.autocomplete-focus',
                'submit': '.autocomplete-submit',
                'icon': '.autocomplete-icon',
                'highlightFieldOnClick': true,
                'openAllOnClick': true,
                'clearFieldOnClick': false
            },
            'attr': {
                'value' : 'data-value'
            },
            'lang': {
                'error': 'There has been an error!',
                'empty': 'No results.'
            }
        },

        initialize: function(container, options) {
            this.container = $(container);
            this.options = $.extend(true, {}, this.options, options);
            this.url = this.options.url ? this.options.url : this.container.attr('action');
            this.results = this.container.find(this.options.cls.results);
            this.field = this.container.find(this.options.cls.field);
            this.fltr = this.container.find(this.options.cls.filter, this.container);
            this.callbacks = {};

            this.timer = function(){};
            this.query = '';

            this._setup();
        },

        _setup: function() {
            var that = this;

            this.results.hide().attr('aria-hidden', true);

            // add search event
            this.field.on('keyup focus paste click', function() {
                that.search();
            });
            // add key events
            this.container.on('keydown', function(e) {
                var pressed = e.charCode ? parseInt(e.charCode) : e.keyCode ? parseInt(e.keyCode) : 0;
                switch (pressed) {
                    case 27:  // escape
                        that.hide();
                        break;
                    case 38:  // up
                        e.preventDefault();
                        that._focusPreviousResult();
                        break;
                    case 40:  // down
                        e.preventDefault();
                        that._focusNextResult();
                        break;
                }
            });

            // stop propagation event on container so body can close
            if (this.options.closeOnBlur) {
                this.container.on('click', function (e) {
                    e.stopPropagation();
                });
                $(document.body).on('click', function () {
                    that.hide();
                    that._fire('close');
                });
            }

            // bind extra form submit buttons
            $(this.options.cls.submit, this.container).bind('click', function(e) {
                e.preventDefault();
                that.container.submit();
            });

            // setup dropdown
            if (this.options.dropdown) {
                this._typeDropdown();
            }

        },

        _typeDropdown: function() {
            var that = this;

            // initial value
            var initial = this.field.val();
            this.field.attr(this.options.attr.value, initial);

            // clear on click
            this.field.on('click', function(e) {
                if(that.options.cls.highlightFieldOnClick){ that.field.select(); }
                if(that.options.cls.clearFieldOnClick){ that.field.val(''); }
                if(that.options.cls.openAllOnClick){
                    that.search(' ', true);
                }else{
                    that.search();
                }
            });

            // toggle on icon click
            $(this.options.cls.icon, this.container).bind('click', function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                if (that._isVisible()) {
                    that.hide();
                    that._fire('close');
                }
                else {
                    if(that.options.cls.clearFieldOnClick){ that.field.val(''); }
                    if(that.options.cls.highlightFieldOnClick){ that.field.select(); }
                    if(that.options.cls.openAllOnClick){
                        that.search(' ', true);
                    }else{
                        that.search();
                    }
                }
                that.field.focus();
                if(!that.options.cls.highlightFieldOnClick){ that.field.blur(); }
            });

            // callback close
            this.callbacks.close = function () {

                // reset original value
                var original = that.field.attr(that.options.attr.value);
                that.field.val(original);
            };
        },

        show: function() {
            this.results.attr('aria-hidden', false);

            if(this.options.fx === 'toggle') this.results.show();
            if(this.options.fx === 'fade') this.results.fadeIn(this.options.duration);
            if(this.options.fx === 'slide') this.results.slideDown(this.options.duration);

            // trigger callback
            this._fire('show');
        },

        hide: function() {
            this.results.attr('aria-hidden', true);

            if(this.options.fx === 'toggle') this.results.hide();
            if(this.options.fx === 'fade') this.results.fadeOut(this.options.duration, this.options.transition);
            if(this.options.fx === 'slide') this.results.slideUp(this.options.duration, this.options.transition);

            // trigger callback
            this._fire('hide');
        },

        search: function(query, showAll) {
            var that = this;
            query = query || this.field.val();
            showAll = showAll || false;
            if(this._validate(query)) {
                that.query = query;
                clearTimeout(that.timer);

                that.timer = setTimeout(function() {
                    that._request(showAll);
                }, that.options.delay);
            }

            // trigger callback
            this._fire('search');
        },

        _focusNextResult: function() {
            var items = this.results.find(this.options.cls.item);
            if (items.length > 0) {
                var current = items.filter(':focus').first();
                if (items.index(current) >= 0) {
                    if (items.index(current)+1 === items.length) {
                        this.field.focus();
                    } else {
                        items.eq(items.index(current)+1).focus();
                    }
                } else {
                    items.eq(0).focus();
                }
            }
        },

        _focusPreviousResult: function() {
            var items = this.results.find(this.options.cls.item);
            if (items.length > 0) {
                var current = items.filter(':focus').first();
                if (items.index(current) >= 0) {
                    if (items.index(current) === 0) {
                        this.field.focus();
                    } else {
                        items.eq(items.index(current)-1).focus();
                    }
                } else {
                    items.eq(items.length-1).focus();
                }
            }
        },

        // validates query
        _validate: function(query) {
            // dropdown passes when different
            if (this.options.dropdown) {
                return (query !== this.field.attr(this.options.attr.value));
            }
            // passes if query is not empty, query is not open and has the correct length
            else {
                return (query !== '' && query.length >= this.options.minLength && query !== this.query);
            }
        },

        _request: function(showAll) {
            var that = this;
            var data = "";

            showAll = showAll || false;

            if(showAll){
                data = 'filter=&q=';
            }else{
                data = this.container.find('input').serialize();
            }

            // ajax request
            $.ajax({
                'type': 'GET',
                'url': this.url,
                'dataType': 'html',
                'data': data,
                'success': function(data) {
                    if(data && data.length > 0) {
                        that._replace(data);
                    } else {
                        that._showEmpty();
                    }
                },
                'error': function() {
                    that._showError();
                },
                'headers': {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
        },

        _replace: function(data) {
            var that = this;

            // result
            this.results.html(data);

            // handle item selection
            $(this.options.cls.item, this.results).bind('click', function(evt) {
                evt.preventDefault();

                // set field value
                var val = $(this).attr(that.options.attr.value);
                if (val) {
                    that.field.val(val);
                    that.field.attr(that.options.attr.value,val);
                }

                // hide
                that.hide();

                // refocus
                $(that.field).focus();

                // notify
                that._fire('selected');
            });

            // bind filter event
            $(this.options.cls.filtering, this.results).bind('click', function(evt) {
                evt.stopPropagation();
                evt.preventDefault();

                // set filter
                var filter = $(this).attr('data-filter');
                $(that.fltr).val(filter);

                // refocus
                $(that.field).focus();

                // search
                that.search();
            });

            // bind focus event
            $(this.options.cls.focus, this.results).bind('click', function(evt) {
                evt.preventDefault();

                // refocus
                $(that.field).focus();
            });

            // bind close event
            $(this.options.cls.close, this.results).bind('click', function(evt) {
                evt.preventDefault();

                // hide
                that.hide();

                // refocus
                $(that.field).focus();

                // notify
                that._fire('close');
            });

            // show
            if (!this.results.is(':visible')) {
                this.show();
            }
        },

        _showEmpty: function() {
            if (this.options.showEmpty) {
                this._replace('<p class="autocomplete-message">' + this.options.lang.empty + '</p>');
            }
            else {
                this._replace('');
            }
        },

        _showError: function() {
            this._replace('<p class="autocomplete-message">' + this.options.lang.error +'</p>');
        },

        _isVisible: function() {
            return (this.results.is(':visible'));
        },

        _fire: function (keyword) {
            // cancel if there is no callback found
            if(this.callbacks[keyword] === undefined) return false;
            // excecute callback
            this.callbacks[keyword](this);
        }

    });

})(jQuery);