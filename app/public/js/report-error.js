$(document).ready(function (e) {
	$('#js-report-error-send').on('click', function (e) {
		var text = $('#js-report-error-text').val().trim();

		$.post('/api/report-error/add', { text: text }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			alert('Сообщение об ошибке успешно отправлено');
			location.reload();
		});
	})
})