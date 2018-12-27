'use strict';

$(document).ready(function () {
    $('.input-tabs').on('change', setDelivery);
    $('.js-delivery-data').on('input', checkFilledForm);
    $('.js-delivery-next-step').on('click', goNextStep);

    var deliveryValue = $('.input-tabs:checked').data('value');

    checkNextStep(deliveryValue);

    function goNextStep(e) {
        var _this = this;

        var $elem = $(this);

        var postData = {
            ctrl: 'setDeliveryData',
            value: deliveryValue,
            data: {}
        };

        $('.js-delivery-data').each(function (i, e) {
            var $e = $(e);

            var dataRequired = $e.hasClass('required');
            var dataValue = $e.val();
            var dataName = $e.prop('name');

            if (dataValue.length > 0) {
                postData.data[dataName] = dataValue;
            }
        });

        postData.data = JSON.stringify(postData.data);

        $.post('', postData).done(function (result) {
            console.log(result);
            if (result.status == 'bad') {
                return alert(result.message);
            }

            location.href = $(_this).data('href');
        });
    }

    function checkNextStep(value) {
        if (value == 2) {
            checkFilledForm();
        } else {
            $('.js-delivery-next-step').removeAttr('disabled');
        }

        deliveryValue = value;
    }

    function checkFilledForm() {
        var deliveryData = {};

        var allInputFilled = true;

        $('.js-delivery-data').each(function (i, elem) {
            $elem = $(elem);

            var dataRequired = $elem.hasClass('required');
            var dataValue = $elem.val();

            if (dataRequired === true && dataValue.length == 0) {
                allInputFilled = false;
            }
        });

        if (allInputFilled === true) {
            $('.js-delivery-next-step').removeAttr('disabled');
        } else {
            $('.js-delivery-next-step').attr('disabled', 'disabled');
        }
    }

    function setDelivery() {
        var $elem = $(this);
        var postData = {
            ctrl: 'setDelivery',
            value: $elem.data('value')
        };

        checkNextStep(postData.value);

        $.post('', postData).done(function (result) {
            console.log(result);
            if (result.status == 'bad') {
                return alert(result.message);
            }
        });
    }
});