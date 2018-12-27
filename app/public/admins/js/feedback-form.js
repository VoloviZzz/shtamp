$(document).ready(function (e) {

	$('#js-feedback-addCategory').on('submit', setCategory);
	$('#js-feedback-setCategory').on('change', setCategory);

	$('.js-feedback-setOnlyRegistred').on('change', function (e) {
		var postData = {};

		postData.target = 'onlyRegistred';
		postData.fragment_id = $(this).data('fragmentId');
		postData.value = this.value;

		if (!!postData.target === false) return alert('В запросе отсутствует target');
		if ('value' in postData === false) return alert('В запросе отсутствует value');
		if (!!postData.fragment_id === false) return alert('В запросе отсутствует fragment_id');

		return sendPost(postData);
	})
	
	$('.js-feedback-setShowClientFrom').on('change', function (e) {
		var postData = {};

		postData.target = 'showClientFrom';
		postData.fragment_id = $(this).data('fragmentId');
		postData.value = this.value;

		if (!!postData.target === false) return alert('В запросе отсутствует target');
		if ('value' in postData === false) return alert('В запросе отсутствует value');
		if (!!postData.fragment_id === false) return alert('В запросе отсутствует fragment_id');

		return sendPost(postData);
	})


	function setCategory() {
		var postData = {};

		postData.target = 'category';
		postData.fragment_id = $(this).data('fragmentId');
		postData.value = this.value || this.value === '' ? this.value : this.elements.categoryName.value.trim();

		if (!!postData.target === false) return alert('В запросе отсутствует target');
		if ('value' in postData === false) return alert('В запросе отсутствует value');
		if (!!postData.fragment_id === false) return alert('В запросе отсутствует fragment_id');

		return sendPost(postData);
	}

	function sendPost(postData = {}) {
		if (!!postData.target === false) return alert('В запросе отсутствует target');
		if ('value' in postData === false) return alert('В запросе отсутствует value');
		if (!!postData.fragment_id === false) return alert('В запросе отсутствует fragment_id');

		$.post('/api/fragments/updSettings', postData).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			return location.reload();
		});

		return false;
	}
})