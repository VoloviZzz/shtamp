'use strict';

$(document).ready(function (e) {
	$('.js-clear-cart').on('click', function (e) {
		$.post('/api/shoppingCart/clearCart').done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		});
	});

	$('.js-item-remove').on('click', function (e) {
		var position_id = $(this).data('id');

		$.post('/api/shoppingCart/removeFromCart', { position_id: position_id }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		});
	});

	function handleEditCount(_ref) {
		var currentTarget = _ref.currentTarget;

		var $this = $(currentTarget);
		var vector = $this.data('vector');
		var good_id = $this.data('goodId');

		if (!!vector === false || !!good_id === false) {
			console.log('Отсутствуют параметры для изменения количества', vector, good_id);
			return false;
		}

		return editCount({ good_id: good_id, vector: vector });
	}

	function editCount(_ref2) {
		var good_id = _ref2.good_id,
		    vector = _ref2.vector;

		$.post('/api/shoppingCart/editCount', { good_id: good_id, vector: vector }).done(function (data) {
			if (data.status !== 'ok') {
				console.log(data);
				return alert(data.message);
			}

			location.reload();
		});
	}

	$('.js-goods-count-edit').on('click', handleEditCount);
});