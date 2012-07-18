/*!
 * @author      Angelo Dini
 * @version     1.0 Beta 1
 * @copyright	Distributed under the BSD License.
 * @requires:	class.js, jQuery
 */

// insuring namespace is defined
var Cl = window.Cl || {};

// new Cl.Lightbox(triggers, options);
(function($){
	'use strict';

	Cl.Lightbox = new Class({

		/*
		 * options and constructor
		 */
		options: {
			// defines prefix for css and events
			'prefix': 'cl_',
			// sets animation transition effect
			'transition': 'linear',
			// sets animation transition time
			'duration': 500,
			// sets the lightbox visibility speed
			'speed': 300,

			// if true, groups matched elements inside one lightbox
			'group': false,
			// if true, enables infinite page sliding for groups
			'cycle': true,
			// if true, shows the dimmer
			'modal': true,
			// if true, allowes the dimmer to be closed on click
			'modalClickable': true,
			// if true, disabled all close events, the lightbox can only be closed on spedific call of instance.close()
			'modalClosable': true,

			// if true, enables responsive behaviours
			'responsive': true,
			// if true, uses fixed positioning calculations instead of css attributes
			'fixed': true,
			// if true, scales content el width and height to 100%
			'autoScale': true,
			// if true, hides overflowing content
			'scrolling': false,

			// if true, shows preloader until content is fully loaded (iframes)
			'forceLoad': true,
			// see "_extract" method for more options
			'forceType': '',

			// the styles object will be added before preloading is applied
			'styles': {},
			// forcing dimensions before preloading is applied
			'dimensions': {
				// initial width for loader
				'initialWidth': 50,
				// initial height for loader
				'initialHeight': 50,
				// window outer bound if responsive is true
				'bound': 50,
				// padding which is added to the content element
				'offset': 20,
				// force content width
				'width': null,
				// force content height
				'height': null
			},
			'keys': {
				// if true, enables key mechanics
				'enabled': true,
				// sets "esc" and "c" keys
				'close': [27, 99],
				// sets "arrow-right" and "n" keys
				'next': [39, 110],
				// sets "arrow-left" and "p" keys
				'previous': [37, 112]
			},
			'lang': {
				// added to close button
				'close': 'Close lightbox',
				// added to error content
				'errorMessage': '<p><strong>The requested element could not be loaded.</strong><br />Plase try again.</p>',
				// added to next button
				'next': 'Next',
				// added to previous button
				'previous': 'Previous',
				// status text which is shown underneath the content
				'status': 'Slide {current} of {total}.'
			},
			// callbacks
			// TODO TEST AND CHECK NAMES
			'callbacks': {
				'open': function () {},
				'load': function () {},
				'complete': function () {},
				'close': function () {},
				'unload': function () {},
				'resize': function () {}
			}
		},

		initialize: function (triggers, options) {
			var that = this;

			this.body = $(document.body);
			this.window = $(window);
			this.options = $.extend(true, {}, this.options, options || triggers);
			this.isLoaded = false;
			this.isOpen = false;

			// attach initial event on lightbox triggers
			this.triggers = $(triggers);
			this.triggers.bind('click', function (e) {
				e.preventDefault();
				that.open.call(that, this, true);
			});
		},

		/*
		 * public methods
		 */
		open: function (el) {
			this._fireEvent('open', 'open', this);

			// set correct loader state
			var loader = (this.isOpen) ? false : true;
			// check if there is already an instance available
			if(!this.isLoaded) this._build();

			this._show(loader);
			this._preload(el);

			this._attachEvents();
			this.isOpen = true;
		},

		close: function () {
			this._fireEvent('close', 'close', this);

			this._hide();
			this._unload();

			this._detachEvents();
			this.isOpen = false;
		},

		resize: function (width, height) {
			this._fireEvent('resize', 'resize', this);

			this._resize('animate', width, height);
		},

		destroy: function () {
			this._fireEvent('destroy');

			this.triggers.unbind('click');
			this.instance.remove();
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
		},

		getElement: function () {
			return this.element || null;
		},

		/*
		 * private methods
		 */
		_build: function () {
			this._fireEvent('setup');

			// insure that this instant is loaded so setup is not called twice
			this.isLoaded = true;

			// setup template
			var template = this._tpl(this.options.prefix);
				template = template.replace('{controls}', this._tplControls(this.options.prefix));
			var prefix = this.options.prefix;

			// save current instance
			this.instance = $(template);
			this.frame = this.instance.filter('.'+prefix+'lightbox');
			this.dimmer = this.instance.filter('.'+prefix+'lightbox-dim');
			this.content = this.instance.find('.'+prefix+'lb-content');
			this.loader = this.instance.find('.'+prefix+'lb-loader');
			this.loadingBay = this.instance.find('.'+prefix+'lightbox-bay');
			this.controls = this.instance.find('.'+prefix+'lb-controls');

			// attach styles from options to content
			this.content.css(this.options.styles);

			// attach frame to the dom
			this.body.append(this.instance);
		},

		_preload: function (el) {
			this._fireEvent('load', 'load', this);

			// define global helper variables
			this.element = this.getElement();
			this.width = null;
			this.height = null;

			// define local helper variables
			var source = $(el);
			var url = source.attr('href');
			var type = this.options.forceType || this._extract(url);

			// helper variables
			var that = this;

			var connectors = {
				'youtube': 'http://www.youtube.com/embed/{id}?rel=0',
				'flash': '<embed src="{url}" width="100%" height="100%" type="application/x-shockwave-flash" />',
				'quicktime': ''
			};

			// preprocess width or height attributes
			var extractWidth = url.match(/(width=)([0-9]+)/i);
			var extractHeight = url.match(/(height=)([0-9]+)/i);

			this.width = (extractWidth) ? extractWidth[2] : source.data('width') || this.options.dimensions.width;
			this.height = (extractHeight) ? extractHeight[2] : source.data('height') || this.options.dimensions.height;

			// generate collection if group is enabled and a group is provided
			if(this.options.group) {
				this.collection = this.triggers;
				this.index = this.collection.index(source);
				this.bound = this.collection.length;
			}

			// create the element
			switch(type) {
				case 'image':
						// we need to add date gettime to prevent caching in ie7
						this.element = $(new Image()).attr({ 'src': url + '?' + new Date().getTime(), 'alt': source.attr('title') });
						preload();
					break;
				case 'youtube':
						var id = url.match(this.extractors.youtube)[2];
						this.element = iframe(connectors.youtube.replace('{id}', id));
						this._load(that.element);
					break;
				case 'flash':
						this.element = $(connectors.flash.replace('{url}', source.attr('href')));
						this.loadingBay.append(this.element);
						this._load(that.element);
					break;
				case 'ajax':
						ajax(url);
					break;
				case 'inline':
						this.element = $(url).clone(true, true);
						this.loadingBay.append(this.element);
						(this.element.length) ? this._load(this.element) : error();
					break;
				default:
						this.element = iframe(url);
						this._load(that.element);
			}

			// preload element and pass to _load
			function preload() {
				that.element.load(function () {
					that._load(that.element);
				}).error(function () {
					error();
				});
			}
			// loading content through ajax
			function ajax() {
				$.ajax({
					'url': url,
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
			if(!(el.prop('tagName') === 'IFRAME' && this.options.forceLoad)) this.resize(this.width, this.height);

			// render element
			setTimeout(function () {
				that._complete.call(that, el);
			}, this.options.speed);
		},

		_complete: function (el) {
			// trigger api chain
			this._fireEvent('complete', 'complete', this);

			var that = this;
			// load element and show
			this.content.append(el.css('visibility', 'visible').hide().fadeIn(this.options.duration));
			// hide loader depending on content
			var loader = that.content.find('.'+that.options.prefix+'lb-loader');
			var iframe = this.content.find('iframe');
			if(iframe.length && this.options.forceLoad) {
				iframe.load(function () {
					that.resize(that.width, that.height);
					loader.hide();
				});
			} else {
				loader.hide();
				// insure flash content is shown
				el.show();
			}
			// show controls
			this._showControls();
			// set element properties
			if(this.options.autoScale) el.css({ 'width': '100%', 'height': '100%' });
			// set scrolling for element
			this.content.css('overflow', (this.options.scrolling) ? 'auto' : 'hidden');
		},

		_unload: function () {
			this._fireEvent('unload', 'unload', this);
			// reattaches the loader to the html content
			this.content.html(this.loader);
			// rremove element
			this.element.remove();
		},

		_show: function (loader) {
			// show the dimmer
			if(this.options.modal) this._showDim();
			// reset lightbox to loader
			this.content.html(this._tplLoader(this.options.prefix));
			// show instance frame
			this.frame.show();
			// set correct loader position
			if(loader) this._resize('css', this.options.dimensions.initialWidth, this.options.dimensions.initialHeight);
			// hide controls
			this._hideControls();
		},

		_hide: function () {
			// hide the dimmer
			if(this.options.modal) this._hideDim();
			// hide instance frame
			this.frame.hide();
			// hide controls
			this._hideControls();
		},

		_extract: function (url) {
			// save regexes for type definition
			this.extractors = {
				'images': /(\.(gif|png|jpe?g|bmp|ico)((#|\?|\&).*)?)$/i,
				'youtube': /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))$/i,
				'flash': /(\.(swf|flv)((#|\?|\&).*)?)$/i,
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
			this.window.bind('resize.'+this.options.prefix+'lightbox', function () {
				that._resize.call(that, 'css');
			});
			if(this.options.fixed) {
				this.window.bind('scroll.'+this.options.prefix+'lightbox', function () {
					that._resize.call(that, 'css');
				});
			}

			// the dimmer is loaded when "modal" is set to true
			if(this.options.modal) {
				// than bind the resize event to the windnt
				this.window.bind('resize.'+this.options.prefix+'lightboxdim', function () {
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
			}

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
			var nav = that.controls.find('.'+that.options.prefix+'lb-navigation a');
			this.content.bind('mouseenter', function () {
				if(!that.collection) return false;
				nav.stop().css('opacity', 1).fadeIn();
			});
			this.frame.bind('mouseleave', function () {
				if(!that.collection) return false;
				nav.stop().fadeOut();
			});

			// enable key navigation
			if(this.options.keys.enabled) {
				$(document).bind('keydown', function (e) {
					if(($.inArray(parseInt(e.charCode) || parseInt(e.keyCode), that.options.keys.close) >= 0) && that.options.modalClosable) that.close();
					if($.inArray(parseInt(e.charCode) || parseInt(e.keyCode), that.options.keys.next) >= 0) that.next();
					if($.inArray(parseInt(e.charCode) || parseInt(e.keyCode), that.options.keys.previous) >= 0) that.previous();
				});
			}
		},

		_detachEvents: function () {
			// unbind window dimmer resize event
			if(this.options.modal) this.window.unbind('resize.'+this.options.prefix+'lightboxdim');
			// unbind dimmer click area
			if(this.options.modalClickable) this.dimmer.unbind('click');
			// unbind window resize event for the lightbox
			this.window.unbind('resize.'+this.options.prefix+'lightbox');
			this.window.unbind('scroll.'+this.options.prefix+'lightbox');
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

		_fireEvent: function (event, callback, scope) {
			// triggered events: setup, open, load, complete, close, unload, resize, destroy
			$.event.trigger(this.options.prefix + event);
			if(callback) this.options.callbacks[callback](scope || this);
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
			var textOffset = $(this.controls.find('.'+this.options.prefix+'lb-text')).data('height') || 0;
			// disable textOffset if grouping is enabled
			if(!this.collection) textOffset = 0;

			// TODO: first width and than height - maybe there is a better solution to do it together
			// TODO: we need to add some resstriction, image should never span out of document window
			// width boundry calculations
			if(windowWidth <= width + this.options.dimensions.bound) {
				width = originalWidth - (width - windowWidth + this.options.dimensions.bound);
				// aspect ratio
				height = Math.floor(height * width / originalWidth);
			// height boundry calculations
			} else if(windowHeight <= height + this.options.dimensions.bound + textOffset) {
				height = originalHeight - (height - windowHeight + this.options.dimensions.bound) - textOffset;
				// aspect ratio
				width = Math.floor(width * height / originalHeight);
			}

			// animate to element content dimensions
			this.content.stop()[type]({
				'width': width,
				'height': height
			}, this.options.speed, this.options.transition);


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
			}, this.options.speed, this.options.transition);
		},

		_setError: function (message) {
			message = message || '<p>'+this.options.lang.errorMessage+'</p>';
			// return template
			return $(this._tplError(this.options.prefix)).html(message);
		},

		_showControls: function () {
			var close = this.controls.find('.'+this.options.prefix+'lb-close');
			// show close only if modalClosable is true
			if(this.options.modalClosable) close.fadeIn();

			// at this point grouping will be shown
			if(!this.collection) return false;

			// update controls text
			var content = this.controls.find('.'+this.options.prefix+'lb-text');
			var status = content.find('.'+this.options.prefix+'lb-status');
			var text = this.options.lang.status;
				text = text.replace('{current}', this.index+1);
				text = text.replace('{total}', this.bound);

			// set status
			status.text(text);

			// show content
			content.slideDown(this.options.duration);
		},

		_hideControls: function () {
			var close = this.controls.find('.'+this.options.prefix+'lb-close');
				close.hide();

			var content = this.controls.find('.'+this.options.prefix+'lb-text');
				content.data('height', content.outerHeight(true));
				content.hide();
		},

		_showDim: function () {
			($.browser.msie && $.browser.version < 8) ? this.dimmer.show() : this.dimmer.fadeIn();

			(this.options.modalClosable) ? this.dimmer.css('cursor', 'pointer') : this.dimmer.css('cursor', 'default');
		},

		_hideDim: function () {
			// hide the dimmer, skip the fade transition on ie cause of performance issues
			($.browser.msie && $.browser.version < 8) ? this.dimmer.hide() : this.dimmer.fadeOut();
		},

		_resizeDim: function (initial) {
			// TODO: still needs fixes for IE7
			var offset = ($.browser.msie) ? ($.browser.version <= 7) ? 21 : 17 : 0;
			if(!initial) {
				// before we add the scroll dimensions, insure we do not alter the scrolling dimensions
				// by itself, otherwise the scrollbars would infinite extend
				this.dimmer.css({
					'width': $(window).width(),
					'height': $(window).height()
				});
				this._resizeDim(true);
			} else {
				// we need to add the additional scroll dimensions after the dimmer is shown
				var scrollHeight = $(document).height() - $(window).height();
				// TODO: there is a jumping error
				var scrollWidth = $(document).width() - $(window).width();
				this.dimmer.css({
					'width': $(window).width() + scrollWidth - offset,
					'height': $(window).height() + scrollHeight
				});
			}
		},

		_tpl: function (prefix) {
			return  '<div class="'+prefix+'lightbox" style="display:none;">' +
					'	<div class="'+prefix+'lb-inner">' +
					'		<section class="'+prefix+'lb-content">{content}</section>' +
					//'		<section class="'+prefix+'lb-description">{description}</section>' +
					'		<section class="'+prefix+'lb-controls">{controls}</section>' +
					'	</div>' +
					'   <div class="'+prefix+'lightbox-bay"></div>' +
					'</div>' +
					'<div class="'+prefix+'lightbox-dim"></div>';
		},

		_tplControls: function (prefix) {
			return  '<p class="'+prefix+'lb-close">' +
					'   <a href="#">'+this.options.lang.close+'</a>' +
					'</p>' +
					'<p class="'+prefix+'lb-navigation">' +
					'   <a class="'+prefix+'lb-next" href="#next">'+this.options.lang.next+'</a>' +
					'   <a class="'+prefix+'lb-previous" href="#previous">'+this.options.lang.previous+'</a>' +
					'</p>' +
					'<div class="'+prefix+'lb-text">' +
					'   <a class="'+prefix+'lb-next" href="#next">'+this.options.lang.next+'</a>' +
					'   <a class="'+prefix+'lb-previous" href="#previous">'+this.options.lang.previous+'</a>' +
					'   <span class="'+prefix+'lb-status">'+this.options.lang.status+'</span>' +
					'   <span class="'+prefix+'lb-caption">&nbsp;</span>' +
					'</div>';
		},

		_tplLoader: function (prefix) {
			return '<div class="'+prefix+'lb-loader"></div>';
		},

		_tplError: function (prefix) {
			return '<div class="'+prefix+'lb-error"></div>';
		}

	});
})(jQuery);