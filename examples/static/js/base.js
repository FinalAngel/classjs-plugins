jQuery(document).ready(function ($) {

	// iframe function
	$('.iframe').on('click', function (e) {
		e.preventDefault();

		// calculate size
		var size = ($(window).height() - $('header').height() - $('footer').height());
		var style = 'width:100%; height:' + size + 'px; margin:0; border:none; margin:0 0 -5px;';
		var inner = $('section .inner');

		inner.html('<iframe src="' + $(this).attr('href') + '" style="' + style + '" frameborder="0"></iframe>');
		inner.css('padding', 0);
		inner.find('iframe').css('overflow', 'hidden');

		inner.find('iframe').load(function () {
			$(this).contents().find('body').css('overflow-x', 'hidden')
		});

		// add resizing
		$(window).on('resize', function () {
			var size = ($(window).height() - $('header').height() - $('footer').height());
			$('iframe').css('height', size);
		});

		// remove scrollbars
		$('body').css('overflow', 'hidden');
	});
});

// helper for tests
var getLength = function (object) {
	var count = 0;

	for(key in object) {
		if(object.hasOwnProperty(key)) count++;
	}

	return count;
};
