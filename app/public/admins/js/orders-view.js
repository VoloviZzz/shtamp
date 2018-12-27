'use strict';

$(document).ready(function () {

	$('.js-change-order-status').on('click', changeOrderStatus);

	function changeOrderStatus(e) {

		var hash = $(this).data('hash');
		var status = $(this).val();

		$.post('/api/order/changeStatus', { hash: hash, status: '' + status }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		});
	}
});