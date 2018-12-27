'use strict';

$(document).ready(function (e) {
	$('.show-question-button').on('click', function (e) {
		$(this).parent().toggleClass('show-question');
	});

	$('.question').on('click', function (e) {
		e.preventDefault();
	});

	$('.add-question-button').on('click', function () {
		var data = {
			ctrl: "add question",
			question: $('.add-question-text').val().trim(),
			target: $('#js-question-target').val()
		};

		if (data.question === '') {
			alert('Нельзя добавить пустой вопрос');
			return false;
		}

		$.post("/api/questions/addQuestion", data).done(function (result) {
			if (result.status !== 'ok') {
				console.log(result);
				return alert(result.message);
			}

			alert('Ваш вопрос добавлен');
			location.reload();
		});
	});
});