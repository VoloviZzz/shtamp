$(document).ready(function () {
	var togglePublished = $('.js-slide-togglePublished');
	var slideUpdate = $('.js-slide-update');
	var addSlide = $('.js-slider-add');
	var deleteSlide = $('.js-slider-deleteSlide');
	var uploadImage = $('.js-slides-uploadImage');

	uploadImage.on('change', function (e) {
		var $input = $(this);
		var id = $input.data('id');
		var files = $input.get(0).files;
		var fd = new FormData();

		for (var index = 0; index < files.length; index++) {
			var file = files[index];

			fd.append('upload', file);
		}

		$input.attr('disabled', 'disabled');

		$.ajax({
			url: '/api/images/upload',
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function success(result) {

				var image = result.data.fileUrl;

				if (result.status !== 'ok') {
					console.log(result);
					return alert(result.message);
				}

				$.post('/api/slides/update', { id: id, value: image, target: 'image' }).done(function (result) {
					
					$input.removeAttr('disabled');

					if (result.status !== 'ok') {
						console.log(result);
						return alert(result.message);
					}

					location.reload();
				});
			}
		});
	})

	deleteSlide.on('click', function (e) {
		if (confirm('Удалить слайд?') === false) return false;

		var id = $(this).data('id');

		$.post('/api/slides/delete', { id: id }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		})
	})

	addSlide.on('click', function (e) {

		var fragment_id = $(this).data('fragmentId');

		$.post('/api/slides/add', { fragment_id: fragment_id }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		})
	});

	slideUpdate.on('change', function (e) {
		var $this = $(this);

		var id = $this.data('id');
		var value = $this.val();
		var target = $this.data('target');

		$.post('/api/slides/update', { id: id, value: value, target: target }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}
		})
	});

	togglePublished.on('click', function (e) {

		var $this = $(this);

		var id = $this.data('id');
		var value = $this.data('value');
		var target = "published";

		$.post('/api/slides/togglePublished', { id: id, value: value, target: target }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		})
	});
})