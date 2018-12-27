$(document).ready(function () {
		'use strict';
			init();
});

/*
*
*___________только_функции______
*
*/


	var support = { animations : Modernizr.cssanimations },
		animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

	var sliders = [].slice.call(document.querySelectorAll('.slider')),
		sliders_modal = [].slice.call(document.querySelectorAll('.slider_m')),
		flkties = [],
		flkties_m = [],
		grid = document.querySelector('.grid'),
		grid_modal = document.querySelector('.grid_modal'),
		iso,
		iso_m,
		filterCtrls = [].slice.call(document.querySelectorAll('.filter > button')),
		cart = document.querySelector('.cart'),
		cartItems = cart.querySelector('.cart__count');
		var	onEndAnimation = function( el, callback ) {
				var onEndCallbackFn = function( ev ) {
					if( support.animations ) {
						if( ev.target != this ) return;
						this.removeEventListener( animEndEventName, onEndCallbackFn );
					}
					if( callback && typeof callback === 'function' ) { callback.call(); }
				};
				if( support.animations ) {
					el.addEventListener( animEndEventName, onEndCallbackFn );
				}
				else {
					onEndCallbackFn();
				}
			};

function throttle(fn, delay) {
	var allowSample = true;

	return function(e) {
		if (allowSample) {
			allowSample = false;
			setTimeout(function() { allowSample = true; }, delay);
			fn(e);
		}
	};
}

		function init() {
			imagesLoaded(grid, function() {
				initFlickity();
				initIsotope();
				initEvents();
				classie.remove(grid, 'grid--loading');
			});
		}

		function initFlickity() {
			sliders.forEach(function(slider){
				var flkty = new Flickity(slider, {
					prevNextButtons: false,
					wrapAround: true,
					cellAlign: 'right',
					contain: true,
					resize: false
				});

				flkties.push(flkty);
			});
		}

		function initFlickity_modal() {
			sliders_modal.forEach(function(slider){
				var flkty = new Flickity(slider, {
					prevNextButtons: false,
					wrapAround: true,
					cellAlign: 'right',
					contain: true,
					resize: false
				});

				flkties_m.push(flkty);
			});
		}

		function initIsotope() {
			iso = new Isotope( grid, {
				getSortData: {
			    number: '.meta__price parseInt'
			  },
				isResizeBound: false,
				itemSelector: '.grid__item',
				percentPosition: true,
				masonry: {
					columnWidth: '.grid__sizer'
				},
				transitionDuration: '0.6s'
			});
		}

		function init_modal() {

			imagesLoaded(grid_modal, function() {
				classie.remove(grid_modal, 'grid--loading');
				$(grid_modal).find('.grid__item').show();
				initFlickity_modal();
				initIsotope_modal();
				initEvents();

			});
		}

		function initIsotope_modal() {
			iso_m = new Isotope( grid_modal, {
				isResizeBound: false,
				itemSelector: '.grid__item',
				percentPosition: true,
				masonry: {
					columnWidth: '.grid__sizer'
				},
				transitionDuration: '0.6s'
			});
		}



		function initEvents() {
			filterCtrls.forEach(function(filterCtrl) {
				filterCtrl.addEventListener('click', function() {
					classie.remove(filterCtrl.parentNode.querySelector('.filter__item--selected'), 'filter__item--selected');
					classie.add(filterCtrl, 'filter__item--selected');
					$('.selected').each(function () {
						$(this).removeClass('selected');
					});
					iso.arrange({
						filter: filterCtrl.getAttribute('data-filter')
					});
					recalcFlickities();
					iso.layout();
				});
			});
			window.addEventListener('resize', throttle(function(ev) {
				recalcFlickities()
				iso.layout();
			}, 50));

			[].slice.call(grid.querySelectorAll('.grid__item')).forEach(function(item) {
				item.querySelector('.action--buy').addEventListener('click', addToCart);
			});
		}
		function addToCart(elem) {
			console.log($(elem).data('data'));
			classie.add(cart, 'cart--animate');
			setTimeout(function() {cartItems.innerHTML = Number(cartItems.innerHTML) + 1;}, 200);
			onEndAnimation(cartItems, function() {
				classie.remove(cart, 'cart--animate');
			});
		}
		function recalcFlickities() {
			for(var i = 0, len = flkties.length; i < len; ++i) {
				flkties[i].resize();
			}
		}

function saveEdittingItem() {
	if (useing_item_id == null) {
		Alter.error('Нет id редактируеммого товара. Перезагрузите страницу или обратитесь к администратору','Ошибка');
		return 0;
	}
	var tag_array = [];
	$('.tag-added-hint-block').find('span').each(function () {
		tag_array.push($(this).data('id'));
	});
	tag_array = tag_array.filter(function(item, pos) {
	    return tag_array.indexOf(item) == pos;
	});
	var photos_array = [];
	$('.photos_array').find('.added img').each(function () {
		photos_array.push($(this).attr('src'));
	});
	var query = {
		id : useing_item_id,
		title : $('.editing-item.title').val(),
		brand : $('.editing-item.brand').val(),
		desc : $('.editing-item.desc').val(),
		price : $('.editing-item.price').val(),
		photos_array : JSON.stringify(photos_array),
		tag_array : JSON.stringify(tag_array),
		category : typeof $('#search_category')[0].dataset.id == 'undefined' ? null : $('#search_category')[0].dataset.id
	};
	$.post('api/categoriesList/setitem', query).done(function (res, err) {
		// console.log(res);
	});
}
function addphoto() {
	$('#photos_array').click();
}
function add_cat_hint(title, id) {
	$('#search_category').val(title);
	$('#search_category')[0].dataset.id = id;
}
function add_hint(title, id) {
	$('.tag-added-hint-block').prepend('<span onclick="remove_hint(this)" data-id="'+id+'"><i class="fa fa-remove"></i> '+title+'</span>')
	$('#search_tag').val('');
	$('#search_tag').focus();
	saveEdittingItem();
}
function remove_hint(elem) {
	$(elem).hide(200,function () {$(elem).remove()});
	$('#search_tag').val('');
}
function edit_group(elem) {
	hideed_span = $(elem);
	hideed_span.after(`<input type="text" style="color:#000" class="form-control" onkeyup = "edit_group_title(this, event)" value="`+hideed_span.text().trim()+`">`)
	hideed_span.hide();
}
function edit_group_title(elem, e) {
	if (e.keyCode == 13) {
			Alert.success('Заголовок группы тегов изменён.');
			hideed_span.show(200);
			$(elem).hide(200, function () {
				$(elem).remove();
			});
	}
	$.post('api/categoriesList/setgroup', {
		id: hideed_span.data('id'),
		title: $(elem).val()
	}).done(function (data) {
		hideed_span.text($(elem).val());
	});
}
function edit_tag_title(elem, e) {
	if (e.keyCode == 13) {
			Alert.success('Заголовок тега изменён.');
			hideed_tag.show(200);
			$(elem).hide(200, function () {
				$(elem).remove();
			})
	}
	$.post('api/categoriesList/settag', {
		id: hideed_tag.data('id'),
		title: $(elem).val()
	}).done(function (data) {
		hideed_tag.text($(elem).val());
	});
}

function remove_tag(elem) {
	var elem = $(elem);
	$.post('api/categoriesList/deltag', {id: $(this).data('id')}).done(function (data) {
		Alert.success('Тег удалён');
		elem.parent().hide(200, function () {
			elem.remove();
		})
	});
}

function cyrill_to_latin(text){
	if (text[0] != '/') {
		// text = '/'+text;
	}
	var arrru = ['Я','я','Ю','ю','Ч','ч','Ш','ш','Щ','щ','Ж','ж','А','а','Б','б','В','в','Г','г','Д','д','Е','е','Ё','ё','З','з','И','и','Й','й','К','к','Л','л','М','м','Н','н', 'О','о','П','п','Р','р','С','с','Т','т','У','у','Ф','ф','Х','х','Ц','ц','Ы','ы','Ь','ь','Ъ','ъ','Э','э','"','\'','  ',' '];
	var arren = ['Ya','ya','Yu','yu','Ch','ch','Sh','sh','Sh','sh','Zh','zh','A','a','B','b','V','v','G','g','D','d','E','e','E','e','Z','z','I','i','J','j','K','k','L','l','M','m','N','n', 'O','o','P','p','R','r','S','s','T','t','U','u','F','f','H','h','C','c','Y','y','','','','','E', 'e','','',' ','-'];
	for(var i=0; i<arrru.length; i++){
		var reg = new RegExp(arrru[i], "g");
		text = text.replace(reg, arren[i]);
		}
	return text;
}

function save_edited_cat(elem, e) {
	if (e.keyCode == 13) {
		Alert.success('Имя категории успешно сохранено', 'Успех');
	}
	$.post('api/categoriesList/setcat', {title: $(elem).val(), id: 	$(elem).data('id')}).done(function (res, err) {
		if (res.status != 'ok'){
			Alert.error('Ошибка', res.message);
		}
	});
}







//-------------------
