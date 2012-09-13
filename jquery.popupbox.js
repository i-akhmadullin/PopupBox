/*  $("selector").popupbox();
	then you can use
	$("selector").popupbox("_open");
	$("selector").popupbox("_close");
*/
;(function ($) {
	$.popupbox = function(el, options) {
		var $doc  = $(document.documentElement);
		var $body = $(document.body);
		var base  = this, o; // o - настройки
		base.el   = el;
		base.$el  = $(el);
		base.$el.data('popupbox', base);
		base.isOpen = false;

		base.options = o = $.extend({},$.popupbox.defaults, options);

		base.wnd     = createElementWithClass('div', o.windowClass);
		base.close   = createElementWithClass('a',   o.closeClass);
		base.popup   = createElementWithClass('div', o.popupClass);
		base.helper  = createElementWithClass('div', o.helperClass);
		base.overlay = createElementWithClass('div', o.overlayClass);

		base.$wnd     = $(base.wnd);
		base.$close   = $(base.close);
		base.$popup   = $(base.popup);
		base.$helper  = $(base.helper);
		base.$overlay = $(base.overlay);

		base._build = function() {
			var contentUrl = base.$el.attr('href');
			base.$content = $(contentUrl ? contentUrl : base.$el).clone(true,true);
			base.wnd.appendChild(base.$content[0]);
			base.$content.show();

			base.popup.appendChild(base.helper);
			base.popup.appendChild(base.wnd);
			base.wnd.appendChild(base.close);
			base.close.setAttribute('href', '#');

			if (o.overlay) {
				base.popup.insertBefore(base.overlay, base.popup.firstChild);
			}
		};

		base._init = function() {
			base._build();

			base._addClickListener();
			base._addKeyDownListener();
		};

		base._open = function() {
			var callback = function() {
				$body.append(base.$popup);
				base.$overlay.show();
				base.$popup.show();
				base.isOpen = true;
				execFunction('afterShow');
			};
			execFunction('beforeShow', callback);
		};

		base._close = function() {
			var callback = function() {
				base.$popup.remove();
				base.$overlay.css('display', 'none');
				base.$popup.css('display', 'none');
				base.isOpen = false;
				execFunction('afterClose');
			};
			execFunction('beforeClose', callback);
		};

		base._addClickListener = function() {
			$doc.on('click', '.' + o.closeClass + (!o.modal ? ',' + '.' + o.popupClass : ""), function() {
				base._close();
				return false;
			});
			$doc.on('click', '.' + o.windowClass, function() {
				return false;
			});
			base.$el.click(function(e) {
				if (base.isOpen) { return false; }
				base._open();
				e.returnValue = false;
				return false;
			});
		};

		base._addKeyDownListener = function() {
			$('body').keydown(function(e) {
				if (!base.isOpen) { return; }
				if (e.keyCode === 27) {
					base._close();
				}
			});
		};

		base._init();

		function execFunction(funct, cb) {
			var f = o[funct];
			if (f && typeof(f) == 'function') {
				f(base, cb);
			} else if (cb) {
				cb();
			}
		}
		function createElementWithClass(tag, classname) {
			var el = document.createElement(tag);
			el.className = classname;
			return el;
		}
	};

	$.popupbox.defaults = {
		popupClass:   'b-popupbox',
		closeClass:   'b-popupbox__close',
		helperClass:  'b-popupbox__helper',
		windowClass:  'b-popupbox__window',
		overlayClass: 'b-popupbox__overlay',
		overlay:      true,
		modal:        false,

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
		} else if ('_open' === options || '_close' === options) {
			return this.each(function() {
				var popupbox = $.data(this, 'popupbox');
				if (popupbox) {
					popupbox[options]();
				}
			});
		}
	};
})(jQuery);