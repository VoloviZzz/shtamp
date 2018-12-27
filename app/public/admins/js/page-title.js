$(document).ready(function () {
	$('.js-pageTitle-edit').on('input', function (e) {
		const value = $(this).val().trim();
		const fragmentId = $(this).data('fragmentId');
		
		const postData = {
			fragment_id: fragmentId,
			data: JSON.stringify({
				content: value
			})
		};
		
		$.post('/api/fragments/setData', postData).done(function (result) {
			console.log(result);
		});
	})
})