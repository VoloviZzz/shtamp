$(document).ready(function () {
	$('.js-add-shopItem').on('click', function (e) {
		const $button = $(this);
		$button.attr('disabled', 'disabled');

		$.post('/api/shopsList/addItem').done(function (result) {

			$button.removeAttr('disabled');

			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		});
	})


	$('.js-delete-shopItem').on('click', function (e) {

		const id = $(this).data('id');

		if (confirm('Удалить?') === false) return false;

		$.post('/api/shopsList/deleteItem', { id: id }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		})
	})
})