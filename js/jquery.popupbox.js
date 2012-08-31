/*  $("selector").popupbox()
	then
	$("selector").popupbox("open"),
	$("selector").popupbox("close")
*/
;(function ($) {
	$.popupbox = function(el, options) {
		var $doc  = $(document);
		var $body = $('body');
		var base  = this, o; // o - настройки
		base.$el  = $(el);
		base.$el.data('popupbox', base);
		base.isOpen = false;

		base.options = o = $.extend({},$.popupbox.defaults, options);

		base.$wnd     = $('<div class="' + o.windowClass  + '"></div>');
		base.$close   = $('<a class="'   + o.closeClass   + '" href="#"></a>');
		base.$popup   = $('<div class="' + o.popupClass   + '"></div>');
		base.$helper  = $('<div class="' + o.helperClass  + '"></div>');
		base.$overlay = $('<div class="' + o.overlayClass + '"></div>');

		base.build = function() {
			base.$close.appendTo(base.$wnd);
			base.$popup.append( base.$helper, base.$wnd);
			if (o.overlay) {
				base.$popup.prepend(base.$overlay);
			}

			var contentUrl = base.$el.attr('href');
			base.content = $(contentUrl ? contentUrl : base.$el).clone(true,true);
			base.content.appendTo(base.$wnd).show();
		};

		base.init = function() {
			base.build();

			base.addClickListener();
			base.addKeyDownListener();
		};

		base.open = function() {
			var callback = function() {
				$body.append(base.$popup);
				base.$overlay.show();
				base.$popup.show();
				base.isOpen = true;
				execFunction('afterShow');
			};
			execFunction('beforeShow', callback);
		};

		base.close = function() {
			var callback = function() {
				base.$overlay.hide();
				base.$popup.hide();
				base.isOpen = false;
				execFunction('afterClose');
			};
			execFunction('beforeClose', callback);
		};

		base.addClickListener = function() {
			$doc.on('click', '.' + o.closeClass + ',' + '.' + o.popupClass, function() {
				base.close();
				return false;
			});
			$doc.on('click', '.' + o.windowClass, function() {
				return false;
			});
			base.$el.click(function(e) {
				if (base.isOpen) { return false; }
				base.open();
				return false;
			});
		};

		base.addKeyDownListener = function() {
			$('body').keydown(function(e) {
				if (!base.isOpen) { return; }
				if (e.keyCode === 27) {
					base.close();
				}
			});
		};

		base.init();

		function execFunction(funct, cb) {
			var f = o[funct];
			if (f && typeof(f) == 'function') {
				f(base, cb);
			} else if (cb) {
				cb();
			}
		}
	};

	$.popupbox.defaults = {
		popupClass:   'b-popupbox',
		closeClass:   'b-popupbox__close',
		helperClass:  'b-popupbox__helper',
		windowClass:  'b-popupbox__window',
		overlayClass: 'b-popupbox__overlay',
		overlay:      true,
		beforeShow:   false,
		afterShow:    false,
		beforeClose:  false,
		afterClose:   false
	};
	$.fn.popupbox = function(options) {
		if ((typeof(options)).match('object|undefined')) {
			return this.each(function() {
				(new $.popupbox(this, options));
			});
		} else if ('open' === options || 'close' === options) {
			return this.each(function() {
				var popupbox = $.data(this, 'popupbox');
				if (popupbox) {
					popupbox[options]();
				}
			});
		}
	};
})(jQuery);