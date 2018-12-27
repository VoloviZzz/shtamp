$(document).ready(function (e) {
	$('.js-feedback-form').on('submit', function (e) {

		var formData = {};

		for (var i = 0; i < this.elements.length; i++) {
			var element = this.elements[i];

			if (element.name) {
				formData[element.name] = element.value;
			}
		}

		for (var key in formData) {
			if (formData[key] !== '' && !!formData[key] === false) {
				alert('Отсутствует поле: ' + key);
				return false;
			}
		}

		$.post('/api/feedback/add', formData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}


			alert('Сообщение отправлено');
			return location.reload();
		})

		return false;
	})
})
