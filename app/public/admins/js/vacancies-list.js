'use strict';

$(document).ready(function () {

	$('.js-vacancies-title-update').on('input', updVacanciesTitle);
	$('.js-vacancies-toggle-public').on('click', toggleVacanciesPublic);
	$('.js-vacancies-delete').on('click', deleteVacancies);
	$('.js-vacancies-add').on('click', addVacancies);
	$('.js-vacanciesText-update').on('change', updVacanciesText);

	var vacanciesId = $('#js-vacancies-id').val();

	function updVacanciesText(e, data) {
		var postData = {
			id: vacanciesId,
			value: data.trim(),
			target: 'text'
		};

		sendRequest('/api/vacancies/upd', postData).catch(function (error) {
			console.log(error.message);
			alert('Произошла ошибка во время выполнения запроса');
			return;
		});
	}

	function updVacanciesTitle() {

		var $this = $(this);

		var postData = {
			id: $this.data('id'),
			value: $this.val().trim(),
			target: 'title'
		};

		sendRequest('/api/vacancies/upd', postData).catch(function (error) {
			console.log(error.message);
			alert('Произошла ошибка во время выполнения запроса');
			return;
		});
	}

	function toggleVacanciesPublic() {
		var $this = $(this);

		if (confirm('Подвердить действие?') === false) {
			return false;
		}

		var postData = {
			id: $this.data('id'),
			value: $this.val()
		};

		sendRequest('/api/vacancies/togglePublished', postData).catch(function (error) {
			console.log(error.message);
			alert('Произошла ошибка во время выполнения запроса');
			return;
		}).then(function () {
			return location.reload();
		});
	}

	function deleteVacancies() {
		var $this = $(this);

		if (confirm('Подвердить действие?') === false) {
			return false;
		}

		var postData = {
			id: $this.data('id')
		};

		sendRequest('/api/vacancies/del', postData).catch(function (error) {
			console.log(error.message);
			alert('Произошла ошибка во время выполнения запроса');
			return;
		}).then(function () {
			return location.reload();
		});
	}

	function addVacancies() {
		var $this = $(this);

		if (confirm('Подвердить действие?') === false) {
			return false;
		}

		var postData = {};

		sendRequest('/api/vacancies/add', postData).then(function () {
			return location.reload();
		}).catch(function (error) {
			console.log(error.message);
			return alert('Произошла ошибка во время выполнения запроса');
		});
	}

	function sendRequest(url, postData) {
		return new Promise(function (resolve, reject) {
			$.post(url, postData).done(function (data) {
				if (data.status != 'ok') {
					return reject(data);
				}

				return resolve(data);
			}).fail(function (error) {
				return reject(error);
			});
		});
	}
});