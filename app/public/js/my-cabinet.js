"use strict";

$(document).ready(function (e) {

	var defaultState = {};

	var _ref = new Forms(),
		getFormData = _ref.getFormData;

	$('#js-upload-avatar').on('change', function (e) {

		var fd = new FormData();

		var $input = $(this);
		var files = $input.get(0).files;
		var id = $input.data('id');

		for (var index = 0; index < files.length; index++) {
			var file = files[index];

			fd.append('upload', file);
		}

		$input.attr('disabled', 'disabled');

		$.ajax({
			url: '/api/images/upload',
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

				var avatar = result.data.fileUrl;

				$.post('/api/clients/update', { target: 'avatar', value: avatar, id: id }).done(function (result) {
					if (result.status !== 'ok') {
						console.log(result);
						return alert(result.message);
					}

					location.reload();
				})
			}
		});
	})

	$(".js-masked-phone").mask("+7(999)-999-99-99"); //номер телефона

	var contactForm = $('#contact-form');
	var contactData = getFormData(contactForm);

	$('.js-contact-form').on('submit', function (e) {
		e.preventDefault();

		var url = $(this).attr('action');
		var formData = getFormData(this);
		var validForm = true;

		$(this).serializeArray().forEach(function (v) {

			if (contactData[v.name] === v.value) {
				delete formData[v.name];
				return false;
			}

			var checkValidRes = checkValid(v.name, v.value);

			if (checkValidRes === false) {
				validForm = false;
				alert('Недопустимый формат ввода для поля: ' + getRusFiledName(v.name));
				delete formData[v.name];
				return false;
			}
		});

		if (validForm === false) return false;
		if (Object.keys(formData) < 1) return false;

		$.post(url, formData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			$('.js-confirm-wrapper').removeClass('d-none');
		});

		return false;
	});

	$('.js-confirm-form').on('submit', function (e) {
		e.preventDefault();

		var code = this.elements.code.value.trim();

		$.post('/api/my-cabinet/confirmPhone', { code: code }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			alert('Номер телефона успешно сменен');
			$('.js-confirm-form').remove();
		})

		return false;
	})

	$('.js-general-form').on('submit', function (e) {
		e.preventDefault();

		var url = $(this).attr('action');
		var formData = getFormData(this);
		var validForm = true;

		$(this).serializeArray().forEach(function (v) {

			var checkValidRes = checkValid(v.name, v.value);

			if (checkValidRes === false) {
				validForm = false;
				alert('Недопустимый формат ввода для поля: ' + getRusFiledName(v.name));
				delete formData[v.name];
				return false;
			}
		});

		if (validForm === false) return false;
		if (Object.keys(formData) < 1) return false;

		$.post(url, formData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			return location.reload();
		});

		return false;
	});

	$('#security-form').on('submit', function (e) {
		e.preventDefault();

		var $this = $(this);
		var postData = {
			ctrl: 'change-user-password',
			oldPass: $('#old-password').val().trim(),
			newPass: $('#new-password').val().trim(),
			checkPass: $('#check-password').val().trim()
		};

		if (postData.oldPass == '' || postData.newPass == '' || postData.checkPass == '') {
			return alert('Для смены пароля все поля должны быть заполнены.');
		}

		if (postData.newPass == postData.oldPass) {
			return alert('Старый и новый пароль должны отличаться.');
		}

		if (postData.newPass !== postData.checkPass) {
			return alert('Неверный повторный пароль. Проверьте правильность ввода и попробуйте снова.');
		}

		if (checkValid('password', postData.newPass) === false) {
			return alert('Недопустимые символы при наборе пароля. Допускаются буквы латинского алфавита, а также числа.');
		}

		$.post("/api/my-cabinet/changeSecurity", postData).done(function (result) {
			if (result.status !== 'ok') return alert(result.message);

			location.reload();
		});
	});

	var getRusFiledName = function getRusFiledName(name) {
		switch (name) {
			case 'phone':
				return 'Телефон';
				break;
			case 'mail':
				return 'Почта';
				break;
			case 'surname':
				return 'Фамилия';
				break;
			case 'firstname':
				return 'Имя';
				break;
			case 'patronymic':
				return 'Отчество';
				break;
		}
	};

	var checkValid = function checkValid() {
		var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'text';
		var value = arguments[1];

		var reText = /^[A-Za-zА-Яа-яЁё]+$/;
		var reEmail = /[^@]+@[^@]+\.[a-zA-Z]{2,6}/;
		var rePass = /^[a-zA-Z0-9]+$/;

		var res = false;

		if (type == 'phone') {
			res = true;
		} else if (type == 'mail') {
			res = reEmail.test(value);
		} else if (type == 'password') {
			res = rePass.test(value);
		} else {
			res = reText.test(value);
		}

		return res;
	};
});