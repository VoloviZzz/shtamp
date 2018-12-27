'use strict';

$(document).ready(function () {

	$('.js-good-change').on('change', function (e) {
		var postData = {};

		postData.id = this.dataset.id;
		postData.target = this.dataset.target;
		postData.value = this.value.trim();

		if (!!postData.id === false || !!postData.target === false || !!postData.value === false && postData.value !== '') return alert('Ошибка входных параметров');

		$.post('/api/goodsPosition/upd', postData).done(function (result) {

			if (result.status !== 'ok') {
				console.log(result.error);
				alert(result.message);
			}

			return location.reload();
		});
	})

	$('.js-goodsPosition-delete').on('click', function (e) {
		var id = $(this).data('id');

		if (!confirm('Удалить товар с сайта?')) return false;

		$.post('/api/goodsPosition/delete', { id: id }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.href = '/shop';
		});
	});

	$('.js-goodsPhoto-delete').on('click', function (e) {
		var id = $(this).data('id');

		if (confirm('Удалить?') === false) return false;

		$.post('/api/photos/delete', { id: id }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		});
	});

	$('.js-goodsPhoto-setMainPhoto').on('click', function (e) {

		var postData = {};
		var $this = $(this);

		var value = $this.data('id');
		var id = $this.data('position-id');
		var target = 'main_photo';

		postData.value = value;
		postData.id = id;
		postData.target = target;

		$.post('/api/goodsPosition/upd', postData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result.error);
				alert(result.message);
			}

			return location.reload();
		})
	})

	$('#uploadable-files').on('change', function (e) {
		var $input = $(this);
		var files = $input.get(0).files;
		var fd = new FormData();
		var id = $input.data('id');

		for (var index = 0; index < files.length; index++) {
			var file = files[index];

			fd.append('upload-' + index, file);
		}

		$input.attr('disabled', 'disabled');

		$.ajax({
			url: '/api/goodsPosition/addPhoto?goodId=' + id,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function success(result) {
				$input.removeAttr('disabled');

				if (result.status !== 'ok') {
					console.log(result);
					return alert(result.message);
				}

				location.reload();
			}
		});
	});

	$('.js-good-edit').on('input', function (e) {
		var postData = {};

		postData.id = this.dataset.id;
		postData.target = this.dataset.target;
		postData.value = this.value.trim();

		if (!!postData.id === false || !!postData.target === false || !!postData.value === false && postData.value !== '') return alert('Ошибка входных параметров');

		$.post('/api/goodsPosition/upd', postData).done(function (result) {

			if (result.status == 'ok') return false;

			console.log(result.error);
			alert(result.message);
		});
	});

	$('.js-good-toggleService').on('change', function (e) {
		var postData = {};

		postData.id = this.dataset.id;
		postData.target = this.dataset.target;
		postData.value = this.value;

		if (!!postData.id === false || !!postData.target === false || !!postData.value === false && postData.value !== '') return alert('Ошибка входных параметров');

		$.post('/api/goodsPosition/upd', postData).done(function (result) {

			if (result.status !== 'ok') {
				console.log(result.error);
				alert(result.message);
			}

			location.reload();
		});
	});

	// установка значения параметру
	$('.js-params-values-select').on('change', function (e) {
		var postData = {
			ctrl: 'addPropsBindValue',
			good_id: $(this).data('good'),
			prop_id: $('.js-params-select').val(),
			prop_value_id: $(this).val()
		};

		$.post('/api/goodsPosition/addPropsBindValue', postData).done(function (result) {
			if (result.status == 'bad') {
				console.log(result);
				return alert(result.message);
			}

			return location.reload();
		});
	});

	// выбор параметра для установки значения
	$('.js-params-select').on('change', function (e) {

		var selectValue = $(this).val();

		var postData = {
			ctrl: 'getParamsValues',
			id: $(this).data('id'),
			prop_id: selectValue
		};

		if (selectValue == "0") {
			$('.js-params-values-select').attr('disabled', "");
			$('.js-params-values-select').val('0');

			$('.js-params-values-select option').each(function (i, elem) {
				var elemValue = elem.value;

				if (elemValue != "0") elem.remove();
			});

			return false;
		} else {
			$('.js-params-values-select').removeAttr('disabled');
		}

		$.post('/api/goodsPosition/getParamsValues', postData).done(function (result) {
			if (result.status == 'bad') {
				console.log(result);
				return alert(result.message);
			}

			$('.js-params-values-select option').each(function (i, elem) {
				var elemValue = elem.value;

				if (elemValue != "0") elem.remove();
			});

			result.body.paramsValues.map(function (v) {
				$('.js-params-values-select').append($("<option></option>").attr("value", v.id).text(v.title));
			});
		}).catch(function (error) {
			alert('Что-то пошло не так');
		});
	});

	$('.js-props-values-add').on('submit', function (e) {
		e.preventDefault();

		var inputTitle = this.elements['param_value_title'];

		var propId = this.elements['prop-id'].value;
		var value = inputTitle.value;

		if ((!!propId === false || propId == '0') || !!value === false) {
			alert('Оба поля должны быть заполнены');
			return false;
		};

		var postData = {
			prop_id: propId,
			prop_value: value
		};

		$.post('/api/goodsPosition/addPropsValues', postData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			alert('Значение добавлено');
			inputTitle.value = '';
		});

		return false;
	});

	$('.js-props-add').on('submit', function (e) {

		var title = this.elements['param-title'].value.trim();

		$.post('/api/goodsPosition/addProps', { title: title }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		});

		return false;
	})

	$('.js-paramsBindValues-delete').on('click', function (e) {
		var postData = {
			ctrl: 'deleteParamsBindValues',
			id: $(this).data('id')
		};

		var $this = $(this);

		if (confirm('Удалить?') === false) return false;

		$.post('/api/goodsPosition/deleteParamsBindValues', postData).done(function (result) {
			if (result.status == 'bad') {
				console.log(result);
				return alert(result.message);
			}

			$this.parents('.js-paramBindValue-item').remove();
		})
	});

	$('.js-change-goodsPosition-priceType').on('change', function (e) {
		var selectedTarget = $(this).data('target');

		var value = {
			'default': ['0', '0'],
			'contract_price': ['1', '0'],
			'float_price': ['0', '1']
		}[selectedTarget];

		var postData = {
			id: $(this).data('id'),
			target: ['contract_price', 'float_price'],
			value: value
		};

		postData = JSON.stringify(postData);

		$.post('/api/goodsPosition/changePriceType', { data: postData }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				if (result.message) {
					return alert(result.message);
				}
			}
		})
	})
});