'use strict';

$(document).ready(function () {

	$('.js-documents-title-update').on('input', updDocumentTitle);
	$('.js-documents-toggle-public').on('click', toggleDocumentPublic);
	$('.js-documents-delete').on('click', deleteDocument);
	$('.js-documents-add').on('click', addDocument);
	$('.js-documentsText-update').on('change', updDocumentText);

	var documentId = $('#js-document-id').val();

	function updDocumentText(e, data) {
		var postData = {
			id: documentId,
			value: data.trim(),
			target: 'text'
		};

		sendRequest('/api/documents/upd', postData).catch(function (error) {
			console.log(error.message);
			alert('Произошла ошибка во время выполнения запроса');
			return;
		});
	}

	function updDocumentTitle() {

		var $this = $(this);

		var postData = {
			id: $this.data('id'),
			value: $this.val().trim(),
			target: 'title'
		};

		sendRequest('/api/documents/upd', postData).catch(function (error) {
			console.log(error.message);
			alert('Произошла ошибка во время выполнения запроса');
			return;
		});
	}

	function toggleDocumentPublic() {
		var $this = $(this);

		if (confirm('Подвердить действие?') === false) {
			return false;
		}

		var postData = {
			id: $this.data('id'),
			value: $this.val()
		};

		sendRequest('/api/documents/togglePublished', postData).catch(function (error) {
			console.log(error.message);
			alert('Произошла ошибка во время выполнения запроса');
			return;
		}).then(function () {
			return location.reload();
		});
	}

	function deleteDocument() {
		var $this = $(this);

		if (confirm('Подвердить действие?') === false) {
			return false;
		}

		var postData = {
			id: $this.data('id')
		};

		sendRequest('/api/documents/del', postData).catch(function (error) {
			console.log(error.message);
			alert('Произошла ошибка во время выполнения запроса');
			return;
		}).then(function () {
			return location.reload();
		});
	}

	function addDocument() {
		var $this = $(this);

		if (confirm('Подвердить действие?') === false) {
			return false;
		}

		var postData = {};

		sendRequest('/api/documents/add', postData).then(function () {
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