'use strict';

function Order() {};

Order.prototype.checkFilledForm = function (e) {
	var orderData = {};

	var allInputFilled = true;

	$('.js-order-data').each(function (i, elem) {
		$elem = $(elem);

		var dataRequired = $elem.hasClass('required');
		var dataValue = $elem.val();

		if (dataRequired === true && dataValue.length == 0) {
			allInputFilled = false;
		}
	});

	if (allInputFilled === true) {
		$('.js-go-next-step').removeAttr('disabled');
	} else {
		$('.js-go-next-step').attr('disabled', 'disabled');
	}
};