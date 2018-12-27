'use strict';

$(document).ready(function () {

	var Reviews = {
		add: function add() {

			var reviewText = Reviews.getText();
			var targetType = $('#js-reviews-add-wrapper').data('targetType');
			var targetId = $('#js-reviews-add-wrapper').data('targetId');

			if (!reviewText) return alert('Нельзя добавить пустой отзыв');
			if (reviewText.length < 6) return alert('Длина отзыва должна быть не меньше 6 символов');

			if (targetType == 0) {
				return alert('Не выбрана категория отзывов');
			}

			$.post("/api/reviews/add", { text: reviewText, targetType: targetType, targetId: targetId }).done(function (result) {
				if (result.status !== 'ok') {
					console.log(result);
					return alert(result.message);
				}

				location.reload();
			});
		},
		getText: function getText() {
			return $('#add-review-text').val().trim();
		}
	};

	$('.new-reviews-button').on('click', Reviews.add);
});

function reviewsListSetHeight() {
	var pageTextHeight = $('.reviews-page-text').outerHeight(true);
	var contentHeight = $('.section-content').outerHeight(true);
	var addWrapperHeight = $('.reviews-add-wrapper').outerHeight(true);

	var reviewsListHeight = contentHeight - (addWrapperHeight + pageTextHeight) + 'px';

	$('.reviews-list-wrapp').css({ height: reviewsListHeight });
}