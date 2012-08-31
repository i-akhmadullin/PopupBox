$(document).ready(function() {
	$("#simplelink").popupbox({
		//overlay: false,
		beforeShow: function(popup, proceed) {
			popup.$popup.css("margin-top", "-100%");
			proceed();
		},
		afterShow: function(popup) {
			popup.$popup.animate({marginTop: "0"}, 300);
		},
		beforeClose: function(popup, proceed) {
			popup.$popup.animate({marginTop: "-100%"}, 300, function() {
				proceed();
			});
		}
	});
});