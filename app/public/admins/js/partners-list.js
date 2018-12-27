$(document).ready(function (e) {
	$('.js-partners-update').on('input', function (e) {
		var postData = {};
		var $this = $(this);

		postData.target = $this.data('target');
		postData.value = $this.val().trim();
		postData.id = $this.data('id');

		$.post('/api/partners/update', postData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}
		})
	})

	$('.js-partners-update__publicate').on('click', function (e) {

		var postData = {};
		var $this = $(this);

		postData.target = 'publicate';
		postData.value = $this.data('value');
		postData.id = $this.data('id');

		$.post('/api/partners/update', postData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		})
	})
	
	$('.js-partners-add').on('click', function (e) {

		$.post('/api/partners/add', {}).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		})
	})
	
	$('.js-partners-delete').on('click', function (e) {

		var postData = {};
		var $this = $(this);
		
		postData.id = $this.data('id');

		if (confirm('Удалить?') === false) return false;

		$.post('/api/partners/delete', postData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		})
	})
})