$(document).ready(function (e) {

	$('#js-set-ach-url').on('submit', function (e) {
		e.preventDefault();

		var $form = $(this);

		var value = $form.get(0).elements.urlPage.value.trim();
		var fragmentId = $form.data('fragmentId');
		var target = $form.data('target');

		var postData = {};

		var reload = $form.data('reload');

		if (typeof value !== undefined && value !== null) {
			postData.value = value;
		}

		postData.target = target;
		postData.fragment_id = fragmentId;

		if (!!postData.target === false) return alert('В запросе отсутствует target');
		if ('value' in postData === false) return alert('В запросе отсутствует value');
		if (!!postData.fragment_id === false) return alert('В запросе отсутствует fragment_id');

		$.post('/api/fragments/updSettings', postData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}


			if (typeof reload !== undefined && reload === false) return false;

			return location.reload();
		});


		return false;
	})

	$('.js-achievements-upload-img').on('change', function (e) {
		var id = $(this).data('id');

		var fd = new FormData();

		fd.append('upload', this.files[0]);

		$.ajax({
			url: '/api/images/upload',
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function success(result) {
				var fileUrl = result.data.fileUrl;
				$.post('/api/achievements/update', { target: 'img', value: fileUrl, id }).done(function (result) {
					if (result.status !== 'ok') {
						console.log(result);
						return alert(result.message);
					}

					location.reload();
				})
			}
		});
	})

	$('.js-achievements-update').on('input', function (e) {
		var postData = {};
		var $this = $(this);

		postData.target = $this.data('target');
		postData.value = $this.val().trim();
		postData.id = $this.data('id');

		if (!!postData.target === false) return alert('Отсутствует target')
		if (!!postData.value === false && postData.value !== '') return alert('Отсутствует value');
		if (!!postData.id === false) return alert('Отсутствует id')

		$.post('/api/achievements/update', postData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}
		})
	})

	$('.js-achievements-add').on('click', function (e) {

		$.post('/api/achievements/add', {}).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		})
	})

	$('.js-achievements-delete').on('click', function (e) {

		var postData = {};
		var $this = $(this);

		postData.id = $this.data('id');

		if (!confirm('Удалить достижение?')) return false;

		$.post('/api/achievements/delete', postData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		})
	})
})