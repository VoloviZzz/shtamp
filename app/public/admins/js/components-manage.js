'use strict';

$(document).ready(function () {

	$('.save-added-component').click(function () {
		var query = {
			title: $('.add-title').val(),
			 component: $('.add-component').val(),
			 block_id: $(".block_id option:selected").val(),
			 static: $(".static:checked").val(),
			 once: $(".once:checked").val()
		 };
		$.post('/api/components/addComponent', query)
		.done(function (result) {
			if (result.status == 'ok') {
				console.log(result);
				location.reload();
			}
		});
	});

	$('.select-for-delete').click(function () {
		$('.js-delete-selected-route').hide();
		$('.select-for-delete').each(function () {
			if ($(this).prop("checked") == true) {
				$('.js-delete-selected-route').show();
			}
		});
	});

	$('.js-delete-route').click(function () {
		$.post('/api/components/delComponent', {id: id})
		.done(function (result) {
			if (result.status == 'ok') {
				console.log(result);
				// toast.success('Компоненты удалены')
			}
		});
	});

	$('.js-delete-selected-route').click(function () {
		var ids = [];
		var index = 1;
		$('.select-for-delete:checked').each(function () {
			ids.push($(this).data('route-id'));
			$(this).parent().parent().delay(100*index).hide(100);
			index++;
		});
		ids = JSON.stringify(ids);
		$.post('/api/components/delComponents', {ids: ids})
		.done(function (result) {
			if (result.status == 'ok') {
				console.log(result);
				//toast.success('Компоненты удалены')
			}
		});
	});

});
