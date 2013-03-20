/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.1.0
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
	'use strict';

	// creating class
	Cl.Lightbox = new Class({

		/*
			TODO 1.1.1
			- when cycle is enabled, remove next and prev (or disable) when reaching bound

			TODO 1.2
			- add slideshow, play and pause options
		 */

		options: {
			'prefix': 'cl',
			'group': true,
			'cycle': true,
			'modal': true,
			'modalClickable': true,
			'modalClosable': true,
			'forceLoad': false,
			'easing': 'linear',
			'duration': 300,
			'speed': 300,
			'fixed': true,
			'responsive': true,
			'ajax': false,
			'controls': true,
			'styles': {},
			'dimensions': {
				'initialWidth': 50,
				'initialHeight': 50,
				'bound': 50,
				'offset': 20,
				'width': null,
				'height': null
			},
			'keys': true,
			'keyCodes': {
				'close': [27, 99], // enables "esc" and "c" keys
				'next': [39, 110], // enables "arrow-right" and "n" keys
				'previous': [37, 112] // enables "arrow-left" and "p" keys
			},
			'lang': {
				'close': 'Close lightbox',
				'errorMessage': '<p><strong>The requested element could not be loaded.</strong><br />' +
					'Plase contact us if this error occurs again.</p>',
				'next': 'Next',
				'previous': 'Previous',
				'status': 'Slide {current} of {total}.'
			}
		},

		initialize: function (triggers, options) {
			var that = this;

			this.body = $(document.body);
			this.window = $(window);
			this.options = $.extend(true, {}, this.options, options || triggers);
			this.isLoaded = false;
			this.isOpen = false;
			this.callbacks = {};
			this.dimTimer = function () {};

			// attach initial event on lightbox triggers
			this.triggers = $(triggers);
			this.triggers.bind('click', function (e) {
				e.preventDefault();
				that.open.call(that, this);
			});
		},

		_setup: function () {
			// trigger event
			this._triggerEvent('setup');

			// insure that this instant is loaded so setup is not called twice
			this.isLoaded = true;

			// setup template
			var template = this._tpl(this.options.prefix);

			// save instance
			this.instance = $(template);

			// attach controls
			this.instance.find('.'+this.options.prefix+'-lightbox-controls').html(this._tplControls(this.options.prefix));

			// global variables
			this.frame = this.instance.filter('.'+this.options.prefix+'-lightbox');
			this.dimmer = this.instance.filter('.'+this.options.prefix+'-lightbox-dim');
			this.content = this.instance.find('.'+this.options.prefix+'-lightbox-content');
			this.loader = this.instance.find('.'+this.options.prefix+'-lightbox-loader');
			this.loadingBay = this.instance.find('.'+this.options.prefix+'-lightbox-bay');
			this.description = this.instance.find('.'+this.options.prefix+'-lightbox-description');

			this.controls = this.instance.find('.'+this.options.prefix+'-lightbox-controls');
			this.nav = this.controls.find('.'+this.options.prefix+'-lightbox-navigation');
			this.closeBtn = this.controls.find('.'+this.options.prefix+'-lightbox-close');
			this.text = this.controls.find('.'+this.options.prefix+'-lightbox-text');
			this.status = this.controls.find('.'+this.options.prefix+'-lightbox-status');

			// attach styles from options to content
			this.content.css(this.options.styles);

			// attach frame to the dom
			this.body.append(this.instance);

			// trigger event
			this._triggerCallback('setup', this);
		},

		/*
		 * PUBLIC API
		 */
		open: function (el) {
			// trigger event
			this._triggerEvent('open');

			// handle instance open call
			if(el === undefined) el = this.triggers.first();

			// check if there is already an instance available
			if(!this.isLoaded) this._setup();

			// determine if the window should be resized to the loader size
			this._show((this.isOpen) ? false : true);
			this._preload(el);

			this._attachEvents();
			this.isOpen = true;

			// trigger callback
			return this._triggerCallback('open', this);
		},

		close: function () {
			// trigger event
			this._triggerEvent('close');

			this._hide();
			this._unload();

			this._detachEvents();
			this.isOpen = false;

			// trigger callback
			return this._triggerCallback('close', this);
		},

		resize: function (width, height) {
			// trigger event
			this._triggerEvent('resize');

			this._resize('animate', width, height);

			// trigger callback
			return this._triggerCallback('resize', this);
		},

		destroy: function () {
			// trigger event
			this._triggerEvent('destroy');

			this.triggers.unbind('click');
			this.instance.remove();

			// trigger callback
			return this._triggerCallback('destroy', this);
		},

		next: function () {
			// trigger event
			this._triggerEvent('next');

			// cancel if there is no collection
			if(!this.collection) return false;

			// cancel if bound is reached and cycle is false
			if(!this.options.cycle && this.index >= this.bound-1) return false;

			// increase index and reset if outer bound is reached
			this.index = this.index + 1;
			if(this.index >= this.bound) this.index = (this.options.cycle) ? 0 : this.bound-1;

			// load next element
			this.open(this.collection[this.index]);

			// trigger callback
			return this._triggerCallback('next', this);
		},

		previous: function () {
			// trigger event
			this._triggerEvent('previous');

			// cancel if there is no collection
			if(!this.collection) return false;

			// cancel if bound is reached and cycle is false
			if(!this.options.cycle && this.index <= 0) return false;

			// increase index and reset if outer bound is reached
			this.index = this.index - 1;
			if(this.index < 0) this.index = (this.options.cycle) ? this.bound-1 : 0;

			// load next element
			this.open(this.collection[this.index]);

			// trigger callback
			return this._triggerCallback('previous', this);
		},

		getElement: function () {
			return this.element || null;
		},

		getCollection: function () {
			return this.collection || null;
		},

		/*
		 * PRIVATE METHODS
		 */
		_preload: function (el) {
			this._triggerEvent('load');

			// define global helper variables
			this.element = this.getElement();
			this.width = null;
			this.height = null;
			this.source = $(el);
			this.url = this.source.attr('href');
			this.type = this._extract(this.url);

			// helper variables
			var that = this;

			var connectors = {
				'youtube': 'http://www.youtube.com/embed/{id}?rel=0',
				'flash': '<embed src="{url}" width="100%" height="100%" type="application/x-shockwave-flash" />',
				'quicktime': ''
			};

			// preprocess width or height attributes
			var extractWidth = this.url.match(/(width=)([0-9]+)/i);
			var extractHeight = this.url.match(/(height=)([0-9]+)/i);

			this.width = (extractWidth) ? extractWidth[2] : this.source.data('width') || this.options.dimensions.width;
			this.height = (extractHeight) ? extractHeight[2] : this.source.data('height') || this.options.dimensions.height;

			// generate collection if group is enabled and a group is provided
			if(this.options.group && this.triggers.length > 1) {
				this.collection = this.triggers;
				this.index = this.collection.index(this.source);
				this.bound = this.collection.length;
			}

			// forces ajax
			if(this.options.preload) this.type = 'preload';

			// create the element
			switch(this.type) {
				case 'image':
					// we need to add date gettime to prevent caching in ie7
					this.element = $(new Image()).attr({ 'src': this.url + '?' + new Date().getTime(), 'alt': this.source.attr('title') });
					load();
					break;
				case 'youtube':
					var id = this.url.match(this.extractors.youtube)[2];
					this.element = iframe(connectors.youtube.replace('{id}', id));
					this._load(that.element);
					break;
				case 'flash':
					this.element = $(connectors.flash.replace('{url}', this.source.attr('href')));
					this.loadingBay.append(this.element);
					this._load(that.element);
					break;
				case 'ajax':
					ajax(this.url);
					break;
				case 'inline':
					this.element = $(this.url).clone(true, true);
					this.loadingBay.append(this.element);
					(this.element.length) ? this._load(this.element) : error();
					break;
				default:
					this.element = iframe(this.url);
					this._load(that.element);
			}

			// preload element and pass to _load
			function load() {
				that.element.load(function () {
					var self = this;
					// check if element has dimensions
					that.width = self.width;
					that.height = self.height;

					that._load(that.element);
				}).error(function () {
					error();
				});
		}
			// loading content through ajax, so style can be maintained
			function ajax() {
				$.ajax({
					'url': that.url,
					'method': 'get',
					'cache': false,
					'success': function (data) {
						that.element = $(data);
						that._load(that.element);
					},
					'error': function () {
						error();
					}
				});
			}
			// setting error and pass to _load
			function error() {
				var error = that._setError(that.options.lang.errorMessage);
				// attach element to dom
				that.loadingBay.append(error);
				// set element dimensions
				that._load(error);
			}

			// wrapps element with iframe
			function iframe(url) {
				return $('<iframe />', {
					'src': url,
					'allowtransparency': true,
					'scrollbars': 'no',
					'frameborder': 0
				});
			}

			this._triggerCallback('load', this);
		},

		_load: function (el) {
			var that = this;

			// if we could not determine the correct size by now, try to get it from the generated element
			this.width = this.width || el.outerWidth(true) || 480;
			this.height = this.height || el.outerHeight(true) || 320;

			// set width bounds
			if(this.width >= 9999) this.width = 480;
			if(this.height >= 9999) this.height = 320;

			// resize viewport to element dimensions
			if(!(el.attr('tagName') === 'IFRAME' && this.options.forceLoad)) this.resize(this.width, this.height);

			// render element
			setTimeout(function () {
				that._complete.call(that, el);
			}, this.options.duration);
		},

		_complete: function (el) {
			// trigger event
			this._triggerEvent('complete');

			var that = this;

			// load element and show
			this.content.html(el.css('visibility', 'visible').hide().fadeIn(this.options.speed));

			// add description and show if given
			if(this.source.attr('title')) this.description.html(this.source.attr('title')).slideDown(this.options.speed);

			var iframe = this.content.find('iframe');
			// hide loader depending on content
			if(iframe.length && this.options.forceLoad) {
				iframe.css('visibility', 'hidden');
				iframe.load(function () {
					that.loader.hide();
					// that.resize(that.width, that.height);
					iframe.css('visibility', 'visible');
				});
			} else {
				that.loader.hide();
				// insure flash content is shown
				el.show();
			}
			// show controls
			if(this.options.controls) this._showControls();

			// trigger callback
			this._triggerCallback('complete', this);
		},

		_unload: function () {
			// trigger event
			this._triggerEvent('unload');

			// remove element
			this.element.remove();

			// trigger callback
			this._triggerCallback('unload', this);
		},

		_show: function (state) {
			// show the dimmer
			if(this.options.modal) this._showDim();
			// resets
			this.content.html('');
			this.loader.show();
			this.description.hide();
			// handle accessibility
			this._accessibility(true);
			// show instance frame
			this.frame.show();
			// set correct state position
			if(state) this._resize('css', this.options.dimensions.initialWidth, this.options.dimensions.initialHeight);
			// hide controls
			this._hideControls();
		},

		_hide: function () {
			// hide the dimmer
			if(this.options.modal) this._hideDim();
			// handle accessibility
			this._accessibility(false);
			// hide instance frame
			this.frame.hide();
		},

		_extract: function (url) {
			// save regexes for type definition
			this.extractors = {
				'images': /(\.(gif|png|jpe?g|bmp|ico)((#|\?|\&).*)?)$/i,
				'youtube': /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))$/i,
				'flash': /(\.(swf)((#|\?|\&).*)?)$/i,
				'ajax': /(\.(htm?l|txt)((#|\?|\&).*)?)$/i,
				'inline': /(#[\w'-]+?)$/i
			};

			// handle extractors
			if(this.extractors.images.test(url)) {
				return 'image';
			} else if(this.extractors.flash.test(url)) {
				return 'flash';
			} else if(this.extractors.youtube.test(url)) {
				return 'youtube';
			} else if(this.extractors.ajax.test(url)) {
				return 'ajax';
			} else if(this.extractors.inline.test(url)) {
				return 'inline';
			} else {
				return 'iframe';
			}
		},

		_attachEvents: function () {
			var that = this;

			// cancel if lightbox is already open
			if(this.isOpen) return false;

			// attach window resize event for lightbox
			this.window.bind('resize.'+this.options.prefix+'.lightbox', function () {
				that._resize.call(that, 'css');
			});
			if(this.options.fixed) {
				this.window.bind('scroll.'+this.options.prefix+'.lightbox', function () {
					that._resize.call(that, 'css');
				});
			}

			// the dimmer is loaded when "modal" is set to true
			if(this.options.modal) {
				// than bind the resize event to the windnt
				this.window.bind('resize.'+this.options.prefix+'.lightboxdim', function () {
					that._resizeDim.call(that, false);
				});

				// we have to resize the dimmer on lightbox call
				this._resizeDim(true);
			}

			// the dimmer is clickable when "modalClickable" is set to true
			if(this.options.modalClickable) {
				// add event to hide dimmer when clicking on the grey area
				this.dimmer.bind('click', function (e) {
					e.preventDefault();
					if(!that.options.modalClosable) return false;
					that.close.call(that);
				});
			} else {
				// reset the cursor
				this.dimmer.css('cursor', 'default');
			}

			if(this.options.controls) {
				// attach close to appropriate button
				this.controls.find('a[href="#close"]').bind('click', function (e) {
					e.preventDefault();
					if(!that.options.modalClosable) return false;
					$(this).show();
					that.close.call(that);
				});

				// attach previous event
				this.controls.find('a[href="#previous"]').bind('click', function (e) {
					e.preventDefault();
					that.previous.call(that);
				});
				// attach next event
				this.controls.find('a[href="#next"]').bind('click', function (e) {
					e.preventDefault();
					that.next.call(that);
				});
				// attach hover event for buttons
				this.content.bind('mouseenter', function () {
					if(!that.collection) return false;
					that.nav.find('a').stop().css('opacity', 1).fadeIn(that.options.speed);
				});
				this.frame.bind('mouseleave', function () {
					if(!that.collection) return false;
					that.nav.find('a').stop().fadeOut(that.options.speed);
				});
			}

			// enable key navigation
			if(this.options.keys) {
				$(document).bind('keydown', function (e) {
					if(($.inArray(parseInt(e.charCode) || parseInt(e.keyCode), that.options.keyCodes.close) >= 0) && that.options.modalClosable) that.close();
					if($.inArray(parseInt(e.charCode) || parseInt(e.keyCode), that.options.keyCodes.next) >= 0) that.next();
					if($.inArray(parseInt(e.charCode) || parseInt(e.keyCode), that.options.keyCodes.previous) >= 0) that.previous();
				});
			} else {
				$('.' + this.options.prefix + '-lightbox-navigation').hide();
			}
		},

		_detachEvents: function () {
			// unbind window dimmer resize event
			this.window.unbind('resize.'+this.options.prefix+'.lightboxdim');
			// unbind dimmer click area
			this.dimmer.unbind('click');
			// unbind window resize event for the lightbox
			this.window.unbind('resize.'+this.options.prefix+'.lightbox');
			this.window.unbind('scroll.'+this.options.prefix+'.lightbox');
			// unbind close event
			this.controls.find('a[href="#close"]').unbind('click');
			// detach controls events
			this.controls.find('a[href="#previous"]').unbind('click');
			this.controls.find('a[href="#next"]').unbind('click');
			this.content.unbind('mouseenter');
			this.frame.unbind('mouseleave');
			// disable key navigation
			$(document).unbind('keydown');
		},

		_triggerCallback: function (fn, scope) {
			// cancel if there is no callback found
			if(this.callbacks[fn] === undefined) return false;
			// excecute fallback
			this.callbacks[fn](scope);
		},

		_triggerEvent: function (event) {
			$.event.trigger(this.options.prefix + '.' + event);
		},

		_resize: function (type, width, height) {
			// set defaults
			type = type || 'css';
			width = parseInt(width) || parseInt(this.width);
			height = parseInt(height) || parseInt(this.height);

			// set dimensions
			var windowWidth = this.window.width();
			var windowHeight = this.window.height();
			var originalWidth = width;
			var originalHeight = height;
			var textOffset = $(this.controls.find('.'+this.options.prefix+'-lightbox-text')).data('height') || 0;
			// disable textOffset if grouping is enabled
			if(!this.collection || !this.options.controls) textOffset = 0;

			// width boundry calculations
			if(windowWidth <= width + this.options.dimensions.bound && this.options.responsive) {
				width = originalWidth - (width - windowWidth + this.options.dimensions.bound);
				// aspect ratio
				if(this.type === 'image') height = Math.floor(height * width / originalWidth);
				// height boundry calculations
			}
			if(windowHeight <= height + this.options.dimensions.bound + textOffset && this.options.responsive) {
				height = originalHeight - (height - windowHeight + this.options.dimensions.bound) - textOffset;
				// aspect ratio
				if(this.type === 'image') width = Math.floor(width * height / originalHeight);
			}

			// animate to element content dimensions
			this.content.stop()[type]({
				'width': width,
				'height': height
			}, this.options.duration, this.options.easing);

			var offset = this.options.dimensions.offset / 2;
			var left = (windowWidth - width) / 2 - offset;
			var top = (windowHeight - height) / 2 + this.window.scrollTop() - offset - textOffset / 2;

			// removing padding padding and margins from left and top alignments
			left = left - ((this.content.outerWidth(true) - this.content.width())/2);
			top = top - ((this.content.outerHeight(true) - this.content.height())/2);

			// animate to new element position
			this.frame.stop()[type]({
				'left': left,
				'top': top
			}, this.options.duration, this.options.easing);
		},

		_setError: function (message) {
			message = message || '<p>'+this.options.lang.errorMessage+'</p>';
			// return template
			return $(this._tplError(this.options.prefix)).html(message);
		},

		_accessibility: function (state) {
			// state true for enable, false for disable
			if(state) {
				$('*').attr('tabindex', -1);
				this.instance.find('a').attr('tabindex', 0);
			} else {
				$('*').removeAttr('tabindex');
			}
		},

		/*
		 * PRIVATE CONTROL METHODS
		 */
		_showControls: function () {
			// show close only if modalClosable is true
			if(this.options.modalClosable) this.closeBtn.fadeIn();

			// at this point grouping will be shown
			if(!this.collection) return false;

			// update controls text
			var text = this.options.lang.status;
				text = text.replace('{current}', this.index + 1);
				text = text.replace('{total}', this.bound);

			// set status
			this.status.text(text);

			// show content
			this.text.slideDown(this.options.speed);
		},

		_hideControls: function () {
			this.closeBtn.hide();

			this.text.data('height', this.text.outerHeight(true));
			this.text.hide();
		},

		/*
		 * PRIVATE DIMMER METHODS
		 */
		_showDim: function () {
			($.browser && $.browser.msie && $.browser.version < 8) ? this.dimmer.show() : this.dimmer.fadeIn();

			(this.options.modalClosable) ? this.dimmer.css('cursor', 'pointer') : this.dimmer.css('cursor', 'default');
		},

		_hideDim: function () {
			// hide the dimmer, skip the fade transition on ie cause of performance issues
			($.browser && $.browser.msie && $.browser.version < 8) ? this.dimmer.hide() : this.dimmer.fadeOut();
		},

		_resizeDim: function () {
			var that = this;
			var offset = ($.browser && $.browser.msie && $.browser.version <= 7) ? 21 : 0;

			// first set the dimmer to 100% when resizing so we avoid jumpint errors
			this.dimmer.css({
				'position': 'fixed',
				'width': '100%',
				'height': '100%'
			});

			// than we clear all previous timeouts
			clearTimeout(this.dimTimer);

			// and last set a timeout to set the correct dimensions
			this.dimTimer = setTimeout(function () {
				var scrollHeight = $(document).height() - $(window).height();
				var scrollWidth = $(document).width() - $(window).width();
				that.dimmer.css({
					'position': 'absolute',
					'width': $(window).width() + scrollWidth - offset,
					'height': $(window).height() + scrollHeight
				});
			}, 100);
		},

		/*
		 * TEMPLATES
		 */
		_tpl: function (prefix) {
			return  '' +
				'<div class="'+prefix+'-lightbox" hidden="hidden">' +
				'	<div class="'+prefix+'-lightbox-inner">' +
				'		<div class="'+prefix+'-lightbox-loader"></div>' +
				'		<div class="'+prefix+'-lightbox-content"></div>' +
				'		<div class="'+prefix+'-lightbox-description"></div>' +
				'		<div class="'+prefix+'-lightbox-controls"></div>' +
				'	</div>' +
				'   <div class="'+prefix+'-lightbox-bay"></div>' +
				'</div>' +
				'<div class="'+prefix+'-lightbox-dim"></div>';
		},

		_tplControls: function (prefix) {
			return  '' +
				'<p class="'+prefix+'-lightbox-close">' +
				'   <a href="#close">'+this.options.lang.close+'</a>' +
				'</p>' +
				'<p class="'+prefix+'-lightbox-navigation">' +
				'   <a class="'+prefix+'-lightbox-previous" href="#previous">'+this.options.lang.previous+'</a>' +
				'   <a class="'+prefix+'-lightbox-next" href="#next">'+this.options.lang.next+'</a>' +
				'</p>' +
				'<p class="'+prefix+'-lightbox-text">' +
				'   <span class="'+prefix+'-lightbox-status">'+this.options.lang.status+'</span>' +
				'   <a class="'+prefix+'-lightbox-previous" href="#previous">'+this.options.lang.previous+'</a>' +
				'   <a class="'+prefix+'-lightbox-next" href="#next">'+this.options.lang.next+'</a>' +
				'</p>';
		},

		_tplError: function (prefix) {
			return '<div class="'+prefix+'-lightbox-error"></div>';
		}

	});
})(jQuery);