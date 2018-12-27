$(document).ready(function (e) {
	$('.js-item-toggle-state').on('click', function () {

		var $btn = $this = $(this);

		var postData = {};

		postData.id = $this.data('id');
		postData.value = $this.data('state');
		postData.target = $this.data('target');
		postData.table = $this.data('table');

		if (!!postData.id === false) return alert('Отсутствует id');
		if (!!postData.target === false) return alert('Отсутствует target');
		if (!!postData.table === false) return alert('Отсутствует table');
		if (typeof postData.value === undefined) return alert('Отсутствует value');

		if(postData.value == '1') {
			postData.reason = prompt('Причина отклонения');
		}

		$.post('/api/memory_book/change-state-item', postData).done(function (result) {
			if(result.status !== 'ok') {
				console.log(result);
				return alert(result.message || 'Что-то пошло не так');
			}

			location.reload();
		})
	})
})