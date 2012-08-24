;(function ($) {
	$.popupbox = function(el, options) {

		var base = this, o; // o - настройки
		base.$el = $(el);
		base.$el.data("link", base);

		base.isOpen = false;

		base.init = function() {

			base.options = o = $.extend({},$.popupbox.defaults, options);

			base.addClickListener();
			base.addKeyDownListener();
		};
		base.open = function() {
			console.log( 'opening popup' );
			base.isOpen = true;
		};
		base.close = function() {
			console.log( 'closing popup' );
			base.isOpen = false;
		};
		base.addClickListener = function() {
			base.$el.click(function(e) {
				if (base.isOpen) { return false; }
				base.open();
			});
		};

		base.addKeyDownListener = function() {
			$(document).keyup(function(e) {
				if (!base.isOpen) { return false; }
				if (e.keyCode == 27) {
					base.close();
				}
			});
		};

		base.init();
	};

	$.popupbox.defaults = {
		option: "someoption"
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
