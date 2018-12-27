$(document).ready(() => {
	$('.flexslider').flexslider({
		animation: 'slide',
		itemWidth: '100%',
		controlNav: true
	})

	baguetteBox.run('.baguetteBoxOne', {
		animation: false,
		onChange(currentIndex, imagesCount) {
			let bagImage = $('#baguetteBox-figure-0 img');
			let imageSrc = bagImage.attr('src');
			let defImage = $(`.baguetteBoxOne img[src="${imageSrc}"]`);
			
			if(defImage.hasClass('img90')) {
				bagImage.addClass('img90')
			}
		}
	});
})