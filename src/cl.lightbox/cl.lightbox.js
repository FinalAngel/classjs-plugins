/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright	Distributed under the BSD License.
 * @version     1.2.2
 */

// ensure namespace is defined
var Cl = window.Cl || {};

(function($){
	'use strict';

	// creating class
	Cl.Lightbox = new Class({
		/*
			TODO 1.3
			- add slideshow, play and pause options
			- collections refactor (so collections can be added and removed)
		 */

		options: {
			'prefix': 'cl',
			'group': true,
			'cycle': true,
			'modal': true,
			'modalClickable': true,
			'modalClosable': true,
			'forceLoad': false,
			'easing': 'swing',
			'duration': 300,
			'speed': 300,
			'fixed': true,
			'responsive': true,
			'ajax': false,
			'controls': true,
			'cls': '',
			'opacity': 0.8,
			'styles': {},
			'dimensions': {
				'initialWidth': 50,
				'initialHeight': 50,
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
					'Please contact us if this error occurs again.</p>',
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

			// attach initial event on lightbox triggers
			this.triggers = $(triggers);
			this.triggers.on('click', function (e) {
				e.preventDefault();
				that.open.call(that, this);
			});
		},

		_setup: function () {
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
			this.timer = function () {};
			// attach styles from options to content
			this.content.css(this.options.styles);

			// attach frame to the dom
			this.body.append(this.instance);

			// trigger callback
			this._fire('setup');
		},

		// PUBLOC METHODS
		open: function (el) {
			var that = this;
			// check if there is already an instance available
			if(this.isLoaded === false) this._setup();

			// set a timeout if open is called before html is injected
			setTimeout(function () {
				// insure that this instant is loaded so setup is not called twice
				that.isLoaded = true;

				// show the lightbox
				that._show((that.isOpen) ? false : true);

				// load given jquery element
				if(typeof(el) === 'object') {
					that._preload(el);
				}
				// load string element
				if(typeof(el) === 'string') {
					that._preload('<a href="' + el + '"></a>');
				}
				// load first element of collection
				if(el === undefined && that.triggers.length) {
					that._preload(that.triggers.first());
				}

				that._attachEvents();
				that.isOpen = true;

				// trigger callback
				return that._fire('open');
			}, 50);

		},

		close: function () {
			this._hide();
			this._unload();

			this._detachEvents();
			this.isOpen = false;

			// trigger callback
			return this._fire('close');
		},

		resize: function (width, height) {
			this._resize('animate', width, height);

			// trigger callback
			return this._fire('resize');
		},

		destroy: function () {
			this.triggers.off('click');
			this.instance.remove();

			// trigger callback
			return this._fire('destroy');
		},

		next: function () {
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
			return this._fire('next');
		},

		previous: function () {
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
			return this._fire('previous');
		},

		getElement: function () {
			return this.element || null;
		},

		getCollection: function () {
			return this.collection || null;
		},

		// PRIVATE METHODS
		_preload: function (el) {
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
			if(this.options.ajax) this.type = 'ajax';

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
						data = '<div class="' + that.options.prefix + '-lightbox-ajax">' + data;
						data = data + '</div>';
						// after wrapper is added create element
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
				var err = that._setError(that.options.lang.errorMessage);
				// attach element to dom
				that.loadingBay.append(err);
				// set element dimensions
				that._load(err);
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

			// create the element
			switch(this.type) {
				case 'image':
					// we need to add date gettime to prevent caching in ie7
					this.element = $(new Image()).attr({ 'src': this.url + '?' + new Date().getTime(), 'alt': this.source.attr('title') });
					load();
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

			// trigger callback
			this._fire('load');
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

			// insure when fast switching, that the timeout is canceled
			clearTimeout(this.timer);
			// render element
			this.timer = setTimeout(function () {
				that._complete.call(that, el);
			}, this.options.duration);
		},

		_complete: function (el) {
			var that = this;

			// load element and show
			this.content.html(el.css('visibility', 'visible').hide().fadeIn(this.options.speed));

			// add description and show if given
			if(this.source.attr('title')) this.description.html(this.source.attr('title')).slideDown(this.options.speed, function () { that.resize(); });

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

			// reset accessibility
			this.content.find('a').attr('tabindex', 0);

			// trigger callback
			this._fire('complete');
		},

		_unload: function () {
			// remove element
			this.element.remove();

			// trigger callback
			this._fire('unload');
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

			// disable scrolling
			$('body').addClass('cl-lightbox-noscroll');
		},

		_hide: function () {
			// hide the dimmer
			if(this.options.modal) this._hideDim();
			// handle accessibility
			this._accessibility(false);
			// hide instance frame
			this.frame.hide();

			// enable scrolling
			$('body').removeClass('cl-lightbox-noscroll');
		},

		_extract: function (url) {
			// save regexes for type definition
			this.extractors = {
				'images': /(\.(gif|png|jpe?g|bmp|ico)((#|\?|\&).*)?)$/i,
				'flash': /(\.(swf)((#|\?|\&).*)?)$/i,
				'ajax': /(\.(htm?l|txt)((#|\?|\&).*)?)$/i,
				'inline': /(#[\w'-:\\]+?)$/i
			};

			// handle extractors
			if(this.extractors.images.test(url)) {
				return 'image';
			} else if(this.extractors.flash.test(url)) {
				return 'flash';
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
			this.window.on('resize.'+this.options.prefix+'-lightbox', function () {
				that._resize.call(that, 'css');
			});
			if(this.options.fixed) {
				this.window.on('scroll.'+this.options.prefix+'-lightbox', function () {
					that._resize.call(that, 'css');
				});
			}

			// the dimmer is clickable when "modalClickable" is set to true
			if(this.options.modalClickable) {
				// add event to hide dimmer when clicking on the grey area
				this.dimmer.on('click', function (e) {
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
				this.controls.find('.'+this.options.prefix+'-lightbox-close a').on('click', function (e) {
					e.preventDefault();
					if(!that.options.modalClosable) return false;
					$(this).show();
					that.close.call(that);
				});

				// attach previous event
				this.controls.find('.'+this.options.prefix+'-lightbox-previous').on('click', function (e) {
					e.preventDefault();
					that.previous.call(that);
				});
				// attach next event
				this.controls.find('.'+this.options.prefix+'-lightbox-next').on('click', function (e) {
					e.preventDefault();
					that.next.call(that);
				});
				// attach hover event for buttons
				this.content.on('mouseenter', function () {
					if(!that.collection) return false;
					that.nav.find('a').stop().css('opacity', 1).fadeIn(that.options.speed);
				});
				this.frame.on('mouseleave', function () {
					if(!that.collection) return false;
					that.nav.find('a').stop().fadeOut(that.options.speed);
				});
			}

			// enable key navigation
			if(this.options.keys) {
				$(document).on('keydown.'+this.options.prefix+'-lightbox', function (e) {
					if(($.inArray(parseInt(e.charCode) || parseInt(e.keyCode), that.options.keyCodes.close) >= 0) && that.options.modalClosable) that.close();
					if($.inArray(parseInt(e.charCode) || parseInt(e.keyCode), that.options.keyCodes.next) >= 0) that.next();
					if($.inArray(parseInt(e.charCode) || parseInt(e.keyCode), that.options.keyCodes.previous) >= 0) that.previous();
				});
			} else {
				$('.' + this.options.prefix + '-lightbox-navigation').hide();
			}
		},

		_detachEvents: function () {
			// unbind window resize event for the lightbox
			this.window.off('resize.'+this.options.prefix+'-lightbox');
			this.window.off('scroll.'+this.options.prefix+'-lightbox');
			// unbind dimmer click area
			this.dimmer.off('click');
			// unbind close event
			this.controls.find('.'+this.options.prefix+'-lightbox-close a').off('click');
			// detach controls events
			this.controls.find('.'+this.options.prefix+'-lightbox-previous').off('click');
			this.controls.find('.'+this.options.prefix+'-lightbox-next').off('click');
			this.content.off('mouseenter');
			this.frame.off('mouseleave');
			// disable key navigation
			$(document).off('keydown.'+this.options.prefix+'-lightbox');
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

			var bound = this.options.dimensions.offset;
			var widthBound = windowWidth <= (width + bound * 2) && this.options.responsive;
			var heightBound = windowHeight <= this.instance.outerHeight(true) + (bound * 2);

			// WIDTH CALCULATION IN RESPONSIVE MODE
			if(widthBound) {
				width = originalWidth - (width - windowWidth + (bound * 2));
				// aspect ratio
				if(this.type === 'image') height = Math.floor(height * width / originalWidth);
			}

			// animate to element content dimensions
			this.content.stop()[type]({
				'width': width,
				'height': height
			}, this.options.duration, this.options.easing);

			// TOP CALCULATIONS
			var description = this.instance.find('.'+this.options.prefix+'-lightbox-description');
			var controls = this.instance.find('.'+this.options.prefix+'-lightbox-controls');

			var heightOffset = (description.is(':visible')) ? description.outerHeight(true) : 0;
			heightOffset = heightOffset + (controls.is(':visible')) ? controls.outerHeight(true) : 0;

			var top = (windowHeight - height) / 2 + this.window.scrollTop();
			top = top - ((this.content.outerHeight(true) - this.content.height())/2);
			// bound limits
			if(heightBound) {
				// we need to fix the top alignment
				top = bound + $(window).scrollTop();
				this.isFixed = true;
			} else {
				this.isFixed = false;
			}
			// top should never be negative
			if(top <= bound) top = bound;

			// LEFT CALCULATIONS
			// removing padding padding and margins from left and top alignments
			var left = (windowWidth - width) / 2;
			left = left - ((this.content.outerWidth(true) - this.content.width())/2);

			// ANIMATION HANDLING
			if(this.isFixed) {
				this.frame.stop()[type]({
					'left': left
				}, this.options.duration, this.options.easing);
			} else {
				this.frame.stop()[type]({
					'left': left,
					'top': top - heightOffset
				}, this.options.duration, this.options.easing);
			}

			// dimmer resize
			if(this.options.modal) this._resizeDim();
		},

		_setError: function (message) {
			message = message || '<p>'+this.options.lang.errorMessage+'</p>';
			// return template
			return $(this._tplError(this.options.prefix)).html(message);
		},

		_accessibility: function (state) {
			// state true for enable, false for disable
			if(state) {
				$('a, input, textarea, select').attr('tabindex', -1);
				this.instance.find('a').attr('tabindex', 1);
			} else {
				$('a, input, textarea, select').removeAttr('tabindex');
			}
		},

		_fire: function (keyword) {
			// cancel if there is no callback found
			if(this.callbacks[keyword] === undefined) return false;
			// excecute callback
			this.callbacks[keyword](this);
		},

		// PRIVATE CONTROLS METHODS
		_showControls: function () {
			var that = this;

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
			this.text.slideDown(this.options.speed, function () { that.resize(); });
		},

		_hideControls: function () {
			this.closeBtn.hide();

			this.text.data('height', this.text.outerHeight(true));
			this.text.hide();
		},

		// PRIVATE DIMMER METHODS
		_showDim: function () {
			// cancel if dimmer is already shown
			if(this.dimmer.is(':visible')) return false;
			// show dimmer
			this.dimmer.css('opacity', 0)
				.show()
				.animate({ 'opacity': this.options.opacity });

			(this.options.modalClosable) ? this.dimmer.css('cursor', 'pointer') : this.dimmer.css('cursor', 'default');
		},

		_hideDim: function () {
			// hide the dimmer, skip the fade transition on ie cause of performance issues
			this.dimmer.fadeOut();
		},

		_resizeDim: function () {
			this.dimmer.css({
				'position': 'fixed',
				'width': '100%',
				'height': '100%'
			});
		},

		// TEMPLATES
		_tpl: function (prefix) {
			var cls = (this.options.cls) ? ' ' + this.options.cls : '';

			return  '' +
				'<div class="'+prefix+'-lightbox'+cls+'" hidden="hidden">' +
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