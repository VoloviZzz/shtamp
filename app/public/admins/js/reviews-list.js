$(document).ready(function (e) {
	$('.js-reviews-togglePublished').on('click', reviewsTogglePublished);
	$('.js-reviews-delete').on('click', reviewsDelete);

	$('#js-add-reviews-category').on('submit', function (e) {

		var title = this.elements.title.value.trim();

		$.post('/api/reviews/addCategory', { title: title }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			location.reload();
		});

		return false;
	});

	function reviewsDelete(e) {
		var $btn = $(this);
		var id = $btn.data('id');
		
		var $item = $btn.parents('.js-reviews-item');

		if (confirm('Удалить?') === false) return false;

		$.post('/api/reviews/delete', { id: id }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			$item.remove();
		});
	}

	function reviewsTogglePublished(event) {
		var $btn = $(this);
		var id = $btn.data('id');
		var published = $btn.attr('data-value');

		var PUBLISHED_STATE = {
			'1': {
				text: 'Снять с публикации',
				value: '0',
			},
			'0': {
				text: 'Опубликовать',
				value: '1',
			}
		};

		$.post('/api/reviews/togglePublished', { published: published, id: id }).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			$btn.text(PUBLISHED_STATE[published].text);
			$btn.attr('data-value', PUBLISHED_STATE[published].value);
		});
	}
})