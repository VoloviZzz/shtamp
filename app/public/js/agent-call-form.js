function agentCall(agentId) {
	var input = $('.agent-call-input'),
		button = $('.agent-call-btn'),
		phone = input.val().trim();
	
	if (phone == "") {
		alert('Необходимо ввести номер телефона');
		return;
	}
	
	if (phone.length < 6) {
		alert('Слишком короткий номер. Проверьте правильность ввода');
		return;
	}

	if (!confirm('Заказать звонок похоронного агента на номер ' + phone + '?')) return;
	
	input.attr('disabled', 'disabled');

	agentId = agentId || '1';
	
	$.post(
		'/api/callbacks/add',
		{ clientNumber: phone, targetId: agentId, },
		function (data) {
			if (data.status == "ok") {
				alert('Ваше сообщение отправлено дежурному агенту');
				button.replaceWith('<p class="text-center">Ваше сообщение отправлено. Ожидайте звонка от агента.</p>');
			}
			else {
				alert('Произошла ошибка во время заказа звонка. Попробуйте ещё раз или позвоните по номеру, указанному на этой странице');
				input.removeAttr('disabled');
			}
		}
	);

	return false;
}

$(document).ready(function(e) {
	$('.js-agent-call-form').on('submit', function(e) {
		e.preventDefault();

		var agentId = this.elements.targetId.value;

		agentCall(agentId);

		return false;
	})
})