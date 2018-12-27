$(document).ready(function () {

	var sliderItemHeight = 0,
		carouselItemHeight = 0;
	var carouselItemsCount = 0,
		carouselItemWidth = 0;
	var windowWidth = 0;

	windowWidth = $(window).width();

	carouselItemsCount = 5.5;

	if (windowWidth > 1600) {
		carouselItemsCount = 5.5;
	}

	carouselItemWidth = $('#carousel').width() / carouselItemsCount;

	$('.carousel-link__container').find('a').on('click', function (e) {
		e.stopPropagation();
	});

	// $('#carousel li').css({ width: carouselItemWidth });

	var a = $('#carousel').flexslider({
		animation: "slide",
		controlNav: false,
		slideshow: false,
		itemWidth: carouselItemWidth,
		itemMargin: 10,
		asNavFor: '#slider',
		mousewheel: true,
		keyboard: false,
	});

	$('#slider').flexslider({
		animation: "slide",
		controlNav: false,
		directionNav: false,
		touch: false,
		animationLoop: false,
		slideshow: false,
		sync: "#carousel",
	});

	$('#alert-slider').flexslider({
		animation: "slide",
		directionNav: true,
		animationLoop: false,
		slideshow: false
	});

	setSlidersSize();

	// костыль для того, чтобы родительский элемент слайдера занимал весь экран;
	$('.slider-container').parent().css({ flex: '1' });

	function setSlidersSize() {

		sliderItemHeight = ($(window).height() - $('.document-header').outerHeight(true) - $('.document-footer').outerHeight(true)) * 0.6;
		carouselItemHeight = ($(window).height() - $('.document-header').outerHeight(true) - $('.document-footer').outerHeight(true)) * 0.4 - 16;
		var alertContainerHeight = void 0;

		$('.slider-item').css({ height: sliderItemHeight });
		$('.carousel-item').css({ height: carouselItemHeight });

		if ($('.alert-container').length) {
			var setAlertListHeight = setInterval(function () {
				if ($('.alert-container').position().top > 0) {
					alertContainerHeight = sliderItemHeight - $('.alert-container').position().top;

					$('.alert-container').css({ height: alertContainerHeight });
					clearInterval(setAlertListHeight);
				}
			}, 0);
		}
	}

	$(window).on('resize', function (e) {
		setTimeout(function () {
			setSlidersSize();
		}, 0);
	});

	$('.js-slide-add').on('click', function (e) {
		e.stopPropagation();
		e.preventDefault();
		return false;
	});

	$('.js-slide-delete').on('click', function (e) {
		e.stopPropagation();
		e.preventDefault();
		return false;
	});

	// Открытие закрытие мобильного слайдера
	$('.accordeon-menu__item-link').click(function (e) {
		e.preventDefault();
		$('.accordeon-menu__item').removeClass('accordeon-menu__item--active');
		$(this).parent(".accordeon-menu__item").addClass('accordeon-menu__item--active');
	});
});