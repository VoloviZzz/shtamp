$(document).ready(() => {
	$('.flexslider').flexslider({
		animation: 'slide'
	})

	window.delOrder = function delOrder(id) {

		if (confirm('Вы действительно хотите удалить заказ?') === false) return false;

		$.post('/api/del_order', { order: id }).done(function (data) {
			if (data.status !== 'ok') {
				console.log(data);
				return alert(data.message || 'Что-то пошло не так');
			}

			location.reload();
		})
	}

	window.invoicePay = function invoicePay(invoice) {

		$.post('/api/preparePayment', { invoice: invoice }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message || 'Что-то пошло не так');
			}

			return document.location.href = 'https://auth.robokassa.ru/Merchant/Index.aspx?' + result.data.params;
		})
	}

	window.ordAssign = function ordAssign() {
		$.post('/api/ord_assign', {}).done(function (result) {
			$('.MyWindow').remove();
			$('<div/>')
				.addClass('MyWindow')
				.html(result.data)
				.appendTo('.document-content');
		})
	}

	window.flowerMods = function flowerMods(good) {
		$.post('/api/flower_mods', { good: good }).done(function (result) {
			$('.MyWindow').remove();
			$('<div/>')
				.addClass('MyWindow')
				.html(result.data)
				.appendTo('.document-content');
		})
	}

	window.changeCount = function changeCount(elem) {

		var price = $('#sum').data('price'),
			count = elem.value,
			freeCount = $('#sum').data('count'),
			sum = count > 0 ? ((price * count) + 200) : 0;

		if (count <= freeCount) {
			$('#sum').text(sum + 'рублей');
		}
		else {
			alert('Отсутствует достаточное количество!');
			return false;
		}
	}

	window.createFlowerAssign = function createFlowerAssign(elem) {
		var mod = elem.dataset.id,
			pers = elem.dataset.pers,
			count = $('#count').val();

		$.post('/api/create_flower_assign', { mod: mod, pers: pers, count: count }).done(function (data) {
			if (data.status !== 'ok') {
				console.log(data);
				return alert('Что-то пошло не так');
			}

			return location.reload();
		})
	}

	window.flowerConfirm = function flowerConfirm(mod, count) {
		$.post('/api/flowers_confirm', { person: window.dead_id, mod: mod, count: count }).done(function (result) {
			$('.MyWindow').remove();
			$('<div/>')
				.addClass('MyWindow')
				.html(result.data)
				.appendTo('.document-content');
		})
	}

	$('#js-add-visited').on('click', function (e) {

		var postData = {
			ctrl: 'add_visited',
			id: $(this).data('id')
		}

		$.post('/api/dead/addVisited', postData).done(result => {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			return location.reload();
		})
	})

	$('#js-del-visited').on('click', function (e) {

		var postData = {
			ctrl: 'del_visited',
			id: $(this).data('id')
		}

		if (confirm('Удалить?') === false) return false;

		$.post('/api/dead/delVisited', postData).done(result => {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			return location.reload();
		})
	});

	baguetteBox.run('.baguetteBoxOne', {
		animation: false,
		onChange(currentIndex, imagesCount) {
			var bagImage = $('#baguetteBox-figure-0 img');
			var imageSrc = bagImage.attr('src');
			var defImage = $(`.baguetteBoxOne img[src="${imageSrc}"]`);

			if (defImage.hasClass('img90')) {
				bagImage.addClass('img90')
			}
		}
	});

	$('.js-delete-btn').on('click', function (e) {
		var $this = $(this);
		var postData = {
			ctrl: 'delete-memory-item',
			id: $this.data('id'),
			target: $this.data('target'),
			creator: $this.data('creator')
		}

		if (!confirm('Хотите удалить запись из книги памяти?')) return false;

		$.post("/api/memory_book/delete-item", postData)
			.done(result => {
				if (result.status == 'ok') {
					return location.reload();
				}

				alert(result.message);
			})
	})

	$('.js-add-necrologue').on('click', () => {
		$('.js-form-add-necrologue').toggle();
	})

	$('.js-send-necrologue').on('click', function (e) {
		var postData = {
			ctrl: 'add_necrologue',
			value: $('.js-necrologue-text').val().trim(),
			id: $(this).data('id')
		};

		if (postData.value == '') {
			return alert('Некролог не может быть пустым');
		}

		if (postData.value.length < 10) {
			return alert('Некролог не может быть коротким');
		}

		$(this).prop('disabled', true);

		$.post('/api/memory_book/add_necrologue', postData).done(result => {
			if (result.status !== 'ok') {
				$(this).prop('disabled', false);
				console.error(result);
				return alert(result.message);
			}

			return location.reload();
		})
			.catch(error => {
				console.error(error);
				console.error(error.message);
			})
	})

	$('.js-send-biography').on('click', function (e) {
		var postData = {
			ctrl: 'add_biography',
			value: $('.js-biography-text').val().trim(),
			id: $(this).data('id')
		};

		if (postData.value == '') {
			return alert('Биография не может быть пустой');
		}

		if (postData.value.length < 10) {
			return alert('Биография не может быть короткой');
		}

		$(this).prop('disabled', true);

		$.post('/api/memory_book/add_biography', postData).done(result => {
			if (result.status !== 'ok') {
				$(this).prop('disabled', false);
				console.error(result);
				return alert(result.message);
			}

			return location.reload();
		}).catch(error => {
			console.error(error);
			console.error(error.message);
		})
	})

	$('.js-select-photos').on('click', function (e) {
		$('.js-upload-file').click();
	})

	$('.js-add-biographie').on('click', () => {
		$('.js-form-add-biography').toggle();
	})

	$('#js-uploadable-files').on('change', function (e) {
		var fd = new FormData();
		var dead_id = $(this).data('id');

		for (var i = 0; i < this.files.length; i++) {
			fd.append('upload-' + i, this.files[i]);
		}

		$.ajax({
			url: '/api/memory_book/loadPhoto?dead_id=' + dead_id,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function success(result) {
				if (result.status !== 'ok') {
					console.log(result);
					return alert(result.message);
				}

				location.reload();
			}
		});
		return false;
	});

	$('.js-memoryItem-update').on('change', function (e) {

		var $textarea = $(this);

		var postData = {};

		postData.id = $textarea.data('id');
		postData.target = $textarea.data('target');
		postData.table = $textarea.data('table');
		postData.value = $textarea.val().trim();

		$.post('/api/memory_book/update', postData).done(function (result) {
			console.log(result);
		})
	})

	$('.js-memoryItem').on('click', '.js-show-edit-form', function (e) {
		var $item = $(e.delegateTarget);

		var $text = $item.find('.js-memoryItem-text');
		var $editForm = $item.find('.js-memoryItem-update');
		var $editButton = $item.find('.js-show-edit-form');

		$item.toggleClass('js-active-edit');

		$editButton.text('Сохранить');

		$text.toggle();
		$editForm.toggle();

		if ($item.hasClass('js-active-edit') === false) return location.reload();
	})
})