$(document).ready(function (e) {
	$('.js-adminSms-authForm').submit(function (e) {
		e.preventDefault();

		var login = this.elements.login.value;
		var password = this.elements.password.value;
		var hashed = this.elements.hashed.checked;

		var formData = {
			login: login,
			password: password,
			hashed: hashed
		};

		var state = {
			setLogin: false,
			setPassword: false,
			setHashed: false
		};

		$.post('/api/globalSiteConfig/add', { title: 'Логин для СМС авторизации', target: 'smsAuthLogin', value: formData.login }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			state.setLogin = true;
		});

		$.post('/api/globalSiteConfig/add', { title: 'Пароль для СМС авторизации', target: 'smsAuthPassword', value: formData.password }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			state.setPassword = true;
		});

		$.post('/api/globalSiteConfig/add', { title: 'Пароль в зашифрованном виде', target: 'smsAuthHashed', value: formData.hashed }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			state.setHashed = true;
		});

		var timer = 0;
		var interval = 100;
		var endRequest = 5000;
		var checkPost = setInterval(function () {
			timer += interval * 1;

			if (timer > endRequest) {
				clearInterval(checkPost);
				alert('Превышено время ожидания');
				return false;
			}

			if (state.setLogin !== true || state.setPassword !== true || state.setHashed !== true) {
				return false;
			}

			clearInterval(checkPost);
			alert('Успешно добавлены');
		}, interval);

		return false;
	});

	$('.js-adminSms-addVariables').on('submit', function (e) {
		e.preventDefault();

		var target = $(this).data('target');
		var value = this.elements.value.value.trim();

		$.post('/api/globalSiteConfig/add', {target: target, value: value }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		});

		return false;
	})
})