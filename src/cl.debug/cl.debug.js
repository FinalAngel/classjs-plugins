/*!
 * @author:		Angelo Dini
 * @copyright:	http://www.divio.ch under the BSD Licence
 * @requires:	jQuery
 */

//##################################################
// #CL EXTENSION#
(function($){
	// Version 1.0
	// Todo: add geosearcher helper
	// Todo: add information window
	/*
		new build:
		- add horizontal navigation vor more display options
		- show browser / client information, window heights etc.
		- show seperate enablers disablers
		- add more settings
		- add generic localstorage handlers
	 */
	Cl.debug = {

		options: function () {},

		init: function (options) {
			this.options = $.extend({}, this.options, options);
			this.template = '';
			// setup required styles
			this.setCSS();
			// setup required html frame
			this.setHTML();
			// setup events and initial states
			this.setup();
			// add modules
			this.modules();
			// attach toolbar to document
			this.load();
		},

		setCSS: function () {
			this.template += '<style type="text/css">';
			this.template += '#divio-dt { position:fixed; right:0; bottom:0; z-index:99999; font-size:11px; width:180px; }';
			this.template += '.divio-dt-header { height:25px; overflow:hidden; background:#00aeef; }';
			this.template += '.divio-dt-hide { float:left; } .divio-dt-close { float:right; }';
			this.template += '.divio-dt-body { position:relative; color:#616161; background:#eee; clear:both; overflow:hidden; }';
			this.template += '.divio-dt-body ul { list-style-type:none; padding:0; margin:0; }';
			this.template += '.divio-dt-body ul li { list-style-type:none; padding:0; margin:0; }';
			this.template += '.divio-dt-body a { display:block; cursor:pointer; color:#616161; padding:1px 8px; border-bottom:1px solid #00aeef; }';
			this.template += '.divio-dt-body a span { color:#00aeef; font-weight:bold; font-family:"Verdana"; font-size:10px; }';
			this.template += '.divio-dt-body a:hover { color:#000; text-decoration:none; background:#fff; }';
			this.template += '</style>';
		},

		setHTML: function () {
			var logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAAZCAMAAABO1iMkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NTMxQUZEQjNBQTIxMUUxQkJBMjlFOTlENjg3RDk0MSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5NTMxQUZEQzNBQTIxMUUxQkJBMjlFOTlENjg3RDk0MSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk1MzFBRkQ5M0FBMjExRTFCQkEyOUU5OUQ2ODdEOTQxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk1MzFBRkRBM0FBMjExRTFCQkEyOUU5OUQ2ODdEOTQxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+eWe++QAAARRQTFRFAK3uAJ7ZgNX0AKzsgMvnAKjngM/sv+b0AKbkAKvqgNX1AKvrQLnngMrmAK3tAKnoAKDcgMrlAKblAKThgNPyAKfm3/L47/j8gM7rELLuAJzWAKLfAKXjQMHxgNDu3/H4gM3pAKHd7/n87/n9IKjcn930n9zzgMvoEK/qEKLagNLxv+TyAKTiQL3sAKLeYMvzv+b1z+v2QLjlQLro3/T8AJ/av+j4YL/jv+X0v+f2EK7p3/P6IKzgMLns3/P73/T7z+v1YMHmMK7dz+z3AJrUMLzwgNT0ILTrn9fsj9Dpv+XzgNTzQLTgEKTbAKDb3/L5r97vv+j3QLPeUMLscMXkELDsYMLnYL7hgMnlAKrp////AK7vezgZZgAAAaZJREFUeNrslOdu2zAURq8jyxGpiBq2PGIndfbeo81u9h7d5cf3f49SkiUblQMESIECQb5fvLqHByB5IVL/LvTuelMuWuEDaXhD1yOck2rwAZ4QUX1OxPmIrhsZy1co77K30c2moYwKIBWbBm5j5McRDndJAhXd2+xhLyjncldRdYpRnCqwRGwUCJXcr2FiVreFVh+bFAKjjJaQstfADsu5zEEsDBeiDDvAhpAlwFJGeQaYEkrNTmDBY8oCSlJsAE7Cnn3GqtvP9aklowR1YMhIXEoWPgAHJOaBu5ASlzEE1IOYXbzBoNnP1fkaWTIXWV+BL/YlcLVsq66rJP/a9QKXsseegG/TqE269FoXmZM17AEzZUP1cZ0+43qcj0emMt7r0tdf1C9fvY83Z67xSsxO4RlXN2tlkbmS6//YEplLlNd62Hr+Hd2fjt+ZL9+fM4mtF9thQgQn/vexZIrCdnGdkTnnp+zvX15+vuzFrUIaL9CzbXlN2Wm1HpbdhJNNz9K9wEvRraabn3uymUzD9HnIYHan17u0maGXImOzzvu/8P+6/ggwAO/sHayqG462AAAAAElFTkSuQmCC';
			var close = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NTMxQUZERjNBQTIxMUUxQkJBMjlFOTlENjg3RDk0MSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5NTMxQUZFMDNBQTIxMUUxQkJBMjlFOTlENjg3RDk0MSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk1MzFBRkREM0FBMjExRTFCQkEyOUU5OUQ2ODdEOTQxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk1MzFBRkRFM0FBMjExRTFCQkEyOUU5OUQ2ODdEOTQxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+iHgIJQAAAAxQTFRFQMLyEJvO////AK7vWmpDTAAAADxJREFUeNpiYMYFGIatDBOYyYRFhgEkxcSIzTSgFJIEij0oEqh6GJkYmLHawwixC9NtjGDpERAL6AAgwAADKwcXukvHXQAAAABJRU5ErkJggg%3D%3D';

			// template
			this.template += '<div id="divio-dt">';
			this.template += '  <div class="divio-dt-header">';
			this.template += '      <a href="/" class="divio-dt-hide"><img src="' + logo + '" alt="" /></a>';
			this.template += '      <a href="/" class="divio-dt-close"><img src="' + close + '" alt="" /></a>';
			this.template += '  </div>';
			this.template += '  <div class="divio-dt-wrapper"><div class="divio-dt-body clearfix"><ul></ul></div></div>';
			this.template += '</div>';
			this.template = $(this.template);
		},

		setup: function () {
			var that = this;
			// create helper body variable
			this.body = this.template.find('.divio-dt-body ul');

			// attach close event
			this.template.find('.divio-dt-close').bind('click', function (e) {
				e.preventDefault();
				$('#divio-dt').remove();
			});

			// set debug toolbars initial visibility
			if(this.getStorage('divio-toolbar-hidden') === "true") {
				this.template.css('width', 100);
				this.body.hide();
			}

			// set debug toolbars initial position
			if(this.getStorage('divio-toolbar-position') === "top") {
				this.template.css({ 'top': 0 , 'bottom': 'auto'});
			}

			// attach hide event
			this.template.find('.divio-dt-hide').bind('click', function (e) {
				e.preventDefault();
				that.template.css('width', 180);
				that.body.slideToggle(function () {
					if(that.body.is(':visible')) {
						that.setStorage('divio-toolbar-hidden', false);
						that.template.css('width', 180);
					} else {
						that.setStorage('divio-toolbar-hidden', true);
						that.template.css('width', 100);
					}
				});
			});
		},

		modules: function () {
			// links
			this.module_links();
			// modifiers
			this.module_editable();
			this.module_designmode();
			this.module_resizeable();
			// bookmarklets
			this.module_firebug();
			this.module_grid();
			this.module_advanced();
			// settings
			this.module_position();
		},

		module_links: function () {
			var template = '';
			var links = [
				{ 'name': 'JQuery', 'url': 'http://docs.jquery.com/Main_Page' },
				{ 'name': 'Compass', 'url': 'http://compass-style.org/index/mixins/' },
				{ 'name': 'Django Templates', 'url': 'http://docs.djangoproject.com/en/dev/ref/templates/builtins/' }
			];
			// loop through the array
			$(links).each(function (index, item) {
				template += '<li><a href="' + item.url + '" target="_blank"><span>&raquo;</span> <strong>Docs</strong> ' + item.name + '</a></li>';
			});
			// attach links to body
			this.body.append(template);
		},

		module_editable: function () {
			var name = 'Edit Mode';
			var attr = 'contenteditable';
			var value = [true, false];
			var type = 'attr';
			// use helper to do the magic
			this.helper_enabler(name, attr, value, type);
		},

		module_designmode: function () {
			var name = 'Design Mode';
			var attr = 'designMode';
			var value = ['on', 'off'];
			var type = 'attr';
			// use helper to do the magic
			this.helper_enabler(name, attr, value, type);
		},

		module_resizeable: function () {
			var name = 'Resizable';
			var attr = 'resize';
			var value = ['both', 'none'];
			var type = 'css';
			// use helper to do the magic
			this.helper_enabler(name, attr, value, type);
		},

		module_firebug: function () {
			var name = 'Firebug Lite';
			var script = "javascript:(function(F,i,r,e,b,u,g,L,I,T,E){if(F.getElementById(b))return;E=F[i+'NS']&&F.documentElement.namespaceURI;E=E?F[i+'NS'](E,'script'):F[i]('script');E[r]('id',b);E[r]('src',I+g+T);E[r](b,u);(F[e]('head')[0]||F[e]('body')[0]).appendChild(E);E=new%20Image;E[r]('src',I+L);})(document,'createElement','setAttribute','getElementsByTagName','FirebugLite','4','firebug-lite.js','releases/lite/latest/skin/xp/sprite.png','https://getfirebug.com/','#startOpened');";
			// use helper to do the magic
			this.helper_bookmarklet(name, script);
		},

		module_grid: function () {
			var name = 'Grid';
			var script = "javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://gridder.andreehansson.se/releases/latest/960.gridder.js';})();";
			// use helper to do the magic
			this.helper_bookmarklet(name, script);
		},

		module_advanced: function () {
			var name = 'More';
			var script = "javascript:(function(){var%20jselem=document.createElement('SCRIPT');jselem.type='text/javascript';jselem.src='http://stevesouders.com/mobileperf/mobileperfbkm.js';document.getElementsByTagName('body')[0].appendChild(jselem);})();";
			// use helper to do the magic
			this.helper_bookmarklet(name, script);
		},

		helper_bookmarklet: function (name, script) {
			var template = '';
				template += '<li><a href="' + script + '"><span>&raquo;</span> <strong>Load</strong> ' + name + '</a></li>';
				template = $(template);
				template.bind('click', function () {
					$(this).css('opacity', 0.5);
				});
			this.body.append(template);
		},

		module_position: function () {
			var that = this;
			var state = (this.getStorage('divio-toolbar-position') === "top") ? 'top' : 'bottom';
			var text = '<span>&raquo;</span> <strong>Settings</strong> Position ';
			var template = '';
				template += '<li><a href="/">' + text + state + '</a></li>';
				template = $(template);
				template.bind('click', function (e) {
					e.preventDefault();
					if(state === 'bottom') {
						state = 'top';
						$('#divio-dt').css('top', 0).css('bottom', 'auto');
						$(this).html(text + state);
						that.setStorage('divio-toolbar-position', 'top');
					} else {
						state = 'bottom';
						$('#divio-dt').css('bottom', 0).css('top', 'auto');
						$(this).html(text + state);
						that.setStorage('divio-toolbar-position', 'bottom');
					}
				});
			this.body.append(template);
		},

		helper_enabler: function (name, attr, value, type) {
			var that = this;
			var state = false;
			var template = '';
				template += '<li><a href="# class="divio-dt-html"><span>&raquo;</span> <strong style="color:#cb3333;">Enable</strong> ' + name + '</a></li>';
				template = $(template);
				template.bind('click', function (e) {
					e.preventDefault();
					if(state === false) {
						(type === 'attr') ? $('body').attr(attr, value[0]) : $('*').css(attr, value[0]);
						$(this).find('strong').css('color', '#6f9935').text('Disable');
						state = true;
					} else {
						(type === 'attr') ? $('body').attr(attr, value[1]) : $('*').css(attr, value[1]);
						$(this).find('strong').css('color', '#cb3333').text('Enable');
						state = false;
					}
				});
			this.body.append(template);
		},

		load: function () {
			// append elements to body
			$('body').append(this.template);
		},

		setStorage: function (attribute, value) {
			// cancel if this feature is not supported by some browser
			if($.browser.msie) return false;
			// save storage
			localStorage.setItem(attribute, value);
		},

		getStorage: function (attribute) {
			// cancel if feature is not supported by some browser
			if($.browser.msie) return false;
			// retrieve storage
			return localStorage.getItem(attribute);
		}
	};
	// autoinit
	Cl.debug.init();
})(jQuery);