$(document).ready(function(e) {
	$("input[name=phone]").mask("+7(999)-999-99-99");
	
	$('#js-callback-form').on('submit', callbackSend);

	function callbackSend(e) {
		e.preventDefault();
		
		var forms = new Forms();
		var clientNumber = forms.getFormData(this).phone;
		var postData = {};

		postData.clientNumber = clientNumber;
		postData.targetId = forms.getFormData(this).targetId;
		
		$.post('/api/callbacks/add', postData).done(function(result) {
			if(result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			alert('Звонок добавлен в список');
			return location.reload();
		});
	}
})