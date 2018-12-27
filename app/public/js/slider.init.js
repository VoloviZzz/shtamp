$(document).ready(function () {

	var currentSlide = sessionStorage.getItem(location.pathname + '-' + 'lastSlide') || 0;

	// если слайдеру установить инициализирующий слайд больше, чем есть всего слайдов,
	// то у него будет установлено смещение transform3d за пределы слайдов,
	// и слайды не будут отображаться
	// два нижних события предотвращают это.
	$('.slider-nav').on('init', function (event, slick) {
		if (slick.slideCount <= slick.options.slidesToShow) {
			$(this).addClass('dont-transform');
		}
	})

	$('.slider-nav').on('breakpoint', function (event, slick) {
		if (slick.slideCount <= slick.options.slidesToShow) {
			$(this).addClass('dont-transform');
		} else {
			$(this).removeClass('dont-transform');
		}
	})

	$('.slider-for').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		fade: true,
		initialSlide: currentSlide * 1,
		swipe: false,
		asNavFor: '.slider-nav'
	});

	$('.slider-nav').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		arrows: true,
		dots: false,
		swipe: false,
		asNavFor: '.slider-for',
		focusOnSelect: true,
		initialSlide: currentSlide * 1,
		centerMode: true,
		responsive: [
			{
				breakpoint: 1150,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 1300,
				settings: {
					slidesToShow: 4,
				}
			}
		]
	}).on("mousewheel", function (event) {
		event.preventDefault();
		if (event.deltaX > 0 || event.deltaY < 0) {
			$(this).slick("slickNext");
		} else if (event.deltaX < 0 || event.deltaY > 0) {
			$(this).slick("slickPrev");
		}
	}).on('afterChange', function (event, slick, currentSlide) {
		sessionStorage.setItem(location.pathname + '-' + 'lastSlide', currentSlide);
	})

	setSlidersSize();

	$(window).on('resize', function (e) {
		setTimeout(function () {
			setSlidersSize();
		}, 0);
	});

	function setSlidersSize() {
		sliderItemHeight = ($(window).height() - $('.document-header').outerHeight(true) - $('.document-footer').outerHeight(true)) * 0.6;
		carouselItemHeight = ($(window).height() - $('.document-header').outerHeight(true) - $('.document-footer').outerHeight(true)) * 0.4;

		$('.slider-for').css({ height: sliderItemHeight });
		$('.slider-nav').css({ height: carouselItemHeight });
	}


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


	$('.accordeon-menu__item-link').click(function (e) {
		e.preventDefault();

		var $this = $(this);
		var active_class = 'accordeon-menu__item--active';
		var active_selector = '.accordeon-menu__item--active';
		var $itemContent = $this.siblings('.accordeon-menu__item-content');
		var contentHasActive = $itemContent.hasClass(active_class);
		var slideSpeed = 1500;
		if (contentHasActive) return false;

		$('.accordeon-menu__item-content').slideUp(slideSpeed); //Закрывает ненужный слайд
		$('.accordeon-menu__item-content').removeClass(active_class);
		$itemContent.addClass(active_class); //присваевает активный класс соседнему с нажатым блоком элементу
		$itemContent.slideDown(500, function () {
			var test = this.offsetTop;
			$('html, body').animate({scrollTop: test}, 500);
		});
	});
});