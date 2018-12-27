$(document).ready(function (e) {

	$('.js-routesTarget-delete').on('click', function (e) {

		if (confirm('Удалить?') === false) {
			return false;
		}

		var postData = {};

		var id = $(this).data('id');

		if (!!id === false) {
			return alert(`Отсутствует id`);
		}

		postData.id = id;

		$.post('/api/routes-targets/delete', postData).done(function (result) {
			if (result.status !== 'ok') {
				console.error(result);
				return alert(result.message);
			}

			location.reload();
		})
	});

	$('.js-routeTarget-update').on('change', function (e) {

		var postData = {};

		var id = $(this).data('id');
		var target = $(this).data('target');
		var value = $(this).val().trim();

		if (!!id === false) return alert(`Отсутствует id`);

		postData.id = id;
		postData.target = target;
		postData.value = value;

		$.post('/api/routes-targets/update', postData).done(function (result) {
			if (result.status !== 'ok') {
				console.error(result);
				return alert(result.message);
			}
		})
	})
})