'use strict';

$(document).ready(function () {
	var State = {
		postData: {}
	};

	$('.js-go-delivery').on('click', goDelivery);
	$('.js-go-verify').on('click', goVerify);
	$('.js-go-payment').on('click', goPayment);
	$('.js-go-back').on('click', goBack);
	$('.js-order-data').on('change', checkFilledForm);
	$('#js-payment-add').on('click', addOrder);

	$("input[name=phone]").mask("+7(999)-999-99-99");

	$('#js-confirm-phone-button').on('click', function (e) {
		var code = $('#js-confirm-phone-input').val();
		$.post('/api/order/confirmPhone', { code: code }).done(function (result) {
			if (result.status === 'ok') {
				$('[data-target=section-order]').hide();
				$('[data-target=section-delivery]').show();
				$('.section-content').scrollTop(0);

				State.activeSection = 'section-delivery';

				nextNav('delivery');
			} else {
				console.log(result);
				alert(result.message);
			}
		});
	});

	$('.js-basket-nav').on('click', '.basket-nav__el', function (e) {
		var target = this.dataset.target;

		if ($(this).hasClass('link-disable')) return true;

		$('[data-target=' + State.activeSection + ']').hide();
		$('[data-target=section-' + target + ']').show();

		State.activeSection = 'section-' + target;
	});

	function goBack(e) {
		var href = this.dataset.href;
		var current = this.dataset.current;
		$('[data-target=' + href + ']').show();
		$('[data-target=' + current + ']').hide();
	}

	function addOrder() {
		$.post('/api/order/addOrder', State.postData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			return location.href = '/order-complete/' + result.orderHash;
		});
	}

	function checkFilledForm(e) {
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
			$('.js-go-next-step').removeClass('order-disabled');
		} else {
			$('.js-go-next-step').addClass('order-disabled');
		}
	}

	function goDelivery(e) {

		var orderData = getOrderData();

		if (orderData === false) return alert('Заполнены не все обязательные поля');

		Object.assign(State.postData, orderData);

		return $.post('/api/order/setOrderData', orderData).done(function (result) {
			if (result.status == 'confirm phone') {
				$('.js-order-data').attr('disabled', 'disabled');
				return $('.js-confirm-phone').show();
			} else if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			} else {
				$('[data-target=section-order]').hide();
				$('[data-target=section-delivery]').show();
				$('.section-content').scrollTop(0);

				State.activeSection = 'section-delivery';

				nextNav('delivery');
			}
		});
	}

	function goPayment(e) {

		var deliveryMethod = $('.js-input-tabs:checked').data('value');
		State.postData.deliveryMethod = deliveryMethod;

		$('[data-target=section-delivery]').hide();
		$('[data-target=section-payment]').show();
		$('.section-content').scrollTop(0);

		State.activeSection = 'section-payment';

		nextNav('payment');
	}

	function goVerify(e) {

		var paymentMethod = $('.input-payment:checked').data('case');

		$('[data-target=section-payment]').hide();
		$('[data-target=section-verify]').show();
		$('.section-content').scrollTop(0);

		State.activeSection = 'section-verify';
		State.postData.paymentMethod = paymentMethod;

		nextNav('verify');
	}

	function nextNav(target) {
		$('.basket-nav__el[data-target=' + target + ']').removeClass('link-disable').addClass('current');
	}

	function getOrderData(e) {

		var errors = [];
		var orderData = {};

		$('.js-order-data').each(function (i, elem) {
			var $elem = $(elem);

			var dataRequired = $elem.hasClass('required');
			var dataValue = $elem.val();
			var dataName = $elem.prop('name');

			if (dataRequired === true && dataValue.length == 0) {
				errors.push($elem);
			} else if (dataValue.length > 0) {
				orderData[dataName] = dataValue;
			}
		});

		if (errors.length > 0) {
			return false;
		}

		return orderData;
	}
});