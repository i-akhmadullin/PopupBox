;(function ($) {
	$.popupbox = function(el, options) {
		var $doc  = $(document);
		var $body = $('body');
		var base  = this, o; // o - настройки
		base.$el  = $(el);
		base.$el.data("link", base);
		base.isOpen = false;

		base.options = o = $.extend({},$.popupbox.defaults, options);

		base.$wnd     = $("<div class='" + o.windowClass  + "'></div>");
		base.$close   = $("<a class='"   + o.closeClass   + "' href='#'></a>");
		base.$popup   = $("<div class='" + o.popupClass   + "'></div>");
		base.$helper  = $("<div class='" + o.helperClass  + "'></div>");
		base.$overlay = $("<div class='" + o.overlayClass + "'></div>");

		base.build = function() {
			base.$close.appendTo(base.$wnd);
			base.$popup.append( base.$helper, base.$wnd);
			if (o.overlay) {
				base.$popup.prepend(base.$overlay);
			}

			var contentUrl = base.$el.attr("href");
			base.content = $(contentUrl).clone(true,true);
			base.content.appendTo(base.$wnd).show();
		};

		base.init = function() {
			base.build();

			base.addClickListener();
			base.addKeyDownListener();
		};

		base.open = function() {
			$body.append(base.$popup);

			base.$overlay.show();
			base.$popup.show();
			base.isOpen = true;
		};

		base.close = function() {
			base.$overlay.hide();
			base.$popup.hide();
			base.isOpen = false;
		};

		base.addClickListener = function() {
			$doc.on('click', "." + o.closeClass + "," + "." + o.popupClass, function() {
				base.close();
				return false;
			});
			$doc.on('click', "." + o.windowClass, function() {
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
	};

	$.popupbox.defaults = {
		popupClass:   "b-popupbox",
		closeClass:   "b-popupbox__close",
		helperClass:  "b-popupbox__helper",
		windowClass:  "b-popupbox__window",
		overlayClass: "b-popupbox__overlay",
		overlay: true
	};
	$.fn.popupbox = function(options) {
		if ((typeof(options)).match('object|undefined')) {
			return this.each(function() {
				(new $.popupbox(this, options));
			});
		} /*else if (/\d/.test(options) && !isNaN(options)) {
			return this.each(function() {
				var found_popupbox = $.data(this, 'link');
				if (found_popupbox) {
					// var page = (typeof(options) == "number") ? options : parseInt($.trim(options), 10);
					// found_popupbox.gotoPage(page);
				}
			});
		}*/
	};
})(jQuery);
