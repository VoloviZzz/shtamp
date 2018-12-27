'use strict';

$(document).ready(function () {

	$('.active').click(function () {
		var elem = this;
		var active = $(elem).parent().data('active') == 0 ? 1 : 0;
		$.post('/api/offersList/activeToggle', {
				id: $(elem).parent().data('id'),
			 	value: active,
				target: 'active'
		  })
		.done(function (result) {
			if (result.status == 'ok') {
				$(elem).parent().data('active', active);
				$(elem).find('i').removeClass('fa-check-square-o');
				$(elem).find('i').removeClass('fa-square-o');
				if (active == 0) {
					$(elem).find('i').addClass('fa-square-o');
					$(elem).parent().parent().css('background-color', '#f6cdcd')
				}else {
					$(elem).find('i').addClass('fa-check-square-o');
					$(elem).parent().parent().css('background-color', 'transparent')
				}
			}
		});
	});

	$('.edit').click(function () {
		var elem = $(this);
		var id = elem.parent().data('id');
		var elemli = $(elem).parent().parent();
		$('.edit-title').val(elemli.find('.main-title').text());
		$('.edit-img-btn').attr('src', elemli.find('img').attr('src'));
		$('.edit-desc').val(elemli.find('p').text());
		$('.edit-link').val(elemli.find('.main-title').attr('href'));
		$('.hidden-edit-block').find('h2 span').text(id);
		$($('.section-content')[1]).animate({
        scrollTop: 0
    }, 300, function () {
			$('.hidden-edit-block').show(300);
    });
	});

	$('.close-edited-offer').click(function () {
		var elem = this;
		var elemli = $(elem).parent().parent();
		var id = elemli.find('h2 span').text();
		$('.hidden-edit-block').hide(300, function () {
			$($('.section-content')[1]).animate({
					scrollTop: $('#offer'+id).offset().top-$('#offer'+id).width()
			}, 300);
		});

	});

	$('.save-edited-offer').click(function () {
		var elem = this;
		var elemli = $(elem).parent().parent();
		var id = elemli.find('h2 span').text();

		if ($('.edit-title').val() == '') {
			alert('Заголовок не заполнен')
			return;
		}
		if ($('.edit-img-btn').attr('src') == '') {
			alert('Заголовок не заполнен')
			return;
		}
		if ($('.edit-desc').val() == '') {
			alert('Заголовок не заполнен')
			return;
		}
		if ($('.edit-link').val() == '') {
			alert('Заголовок не заполнен')
			return;
		}

		var query = {
			 id: id,
			 title: $('.edit-title').val(),
			 img: $('.edit-img-btn').attr('src'),
			 desc: $('.edit-desc').val(),
			 link: $('.edit-link').val()
		 };

		$.post('/api/offersList/saveOffer', query)
		.done(function (result) {
			if (result.status == 'ok') {
				$('#offer'+id).find('.main-title').text(query.title);
				$('#offer'+id).find('img').attr('src', query.img);
				$('#offer'+id).find('p').text(query.desc);
				$('#offer'+id).find('a').each(function () {
					$(this).attr('href', query.link)
				});
			}
		});

		$('.hidden-edit-block').hide(300, function () {
			$($('.section-content')[1]).animate({
					scrollTop: $('#offer'+id).offset().top-$('#offer'+id).width()
			}, 300);
		});

	});


	$('#edit-img-input-file').on('change', function (e) {

		var fd = new FormData();
		var id = $(this).data('id');

		fd.append('upload', this.files[0]);

		$.ajax({
			url: '/api/images/upload?filename=' + this.files[0].name,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function success(result) {
				var value = result.data.fileUrl;
				$('.edit-img-btn').attr('src', value);
			}
		});
		return false;
	});



	$('.add').click(function () {
		var elem = this;
		$.post('/api/offersList/addOffer', {})
		.done(function (result) {
			console.log(result);
			if (result.status == 'ok') {
					location.reload();
			}
		});
	});

	$('.remove').click(function () {
		var elem = this;
		$.post('/api/offersList/removeOffer', {
			 id: $(elem).parent().data('id')
		  })
		.done(function (result) {
			if (result.status == 'ok') {
					$(elem).parent().parent().hide(200, function () {
						$(this).remove()
					});
			}
		});
	});

});
