$(document).ready(function (e) {
	$('.js-callback-changeStatus').on('click', callbackChangeStatus);
	$('.js-callback-delete').on('click', callbackDelete);

	function callbackChangeStatus(e) {
		var postData = {};
		var $this = $(this);
		
		postData.id = $this.data('id');
		postData.value = $this.data('value');
		postData.target = 'status';

		if(!confirm($this.text() + '?')) return false;
		
		$.post('/api/callbacks/changeStatus', postData).done(function(result) {
			if(result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		});
	}

	function callbackDelete(e) {
		var postData = {};
		var $this = $(this);
		
		postData.id = $this.data('id');

		if(!confirm($this.text() + '?')) return false;
		
		$.post('/api/callbacks/delete', postData).done(function(result) {
			if(result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		});
	}
})