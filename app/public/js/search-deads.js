function Search() {

	this.unindentCemeterySelector = $('#unindent-cem-selector');
	this.unindentBtn = $('#search-show-unidentified');
	this.unindentMoreBtn = $('#search-more-unidentified');
	this.unindentList = $('#unidentified-list');
	this.unindentPart = 0;
	this.curUnindentCount = 0;
	this.unindentLoader = $('#unidentified-loader');

	this.unnamedCemeterySelector = $('#unnamed-cem-selector');
	this.unnamedBtn = $('#search-show-unnamed');
	this.unnamedMoreBtn = $('#search-more-unnamed');
	this.unnamedList = $('#unnamed-list');
	this.unnamedPart = 0;
	this.curUnnamedCount = 0;
	this.unnamedLoader = $('#unnamed-loader');

	this.init();

}
Search.prototype.init = function () {

	this.unindentBtn.on('click', this.unindentBtnClick.bind(this));
	this.unindentMoreBtn.on('click', this.unindentMoreBtnClick.bind(this));

	this.unnamedBtn.on('click', this.unnamedBtnClick.bind(this));
	this.unnamedMoreBtn.on('click', this.unnamedMoreBtnClick.bind(this));

}
Search.prototype.unindentBtnClick = function () {
	this.unindentPart = 0;
	this.curUnindentCount = 0;
	this.unindentList.html('');
	this.showUnindent();
}
Search.prototype.unindentMoreBtnClick = function () {
	this.unindentPart++;
	this.showUnindent();
}
Search.prototype.showUnindent = function () {
	var cemetery = this.unindentCemeterySelector.val();
	if (cemetery == '') {
		alert('Необходимо выбрать кладбище');
		return;
	}
	this.unindentLoader.show();
	$.post(
		'',
		{ ctrl: 'getUnindent', cemetery: cemetery, part: this.unindentPart },
		function (data) {
			data = JSON.parse(data);
			if (data.status == 'ok') {
				this.unindentLoader.hide();
				this.unindentList.append(data.content);
				if (this.unindentPart == 0) this.curUnindentCount = data.count;
				if (((this.unindentPart + 1) * 20) < this.curUnindentCount) {
					this.unindentMoreBtn.show();
				}
			}
		}.bind(this)
	);
}
Search.prototype.unnamedBtnClick = function () {
	this.unnamedPart = 0;
	this.curUnnamedCount = 0;
	this.unnamedList.html('');
	this.showUnnamed();
}
Search.prototype.unnamedMoreBtnClick = function () {
	this.unnamedPart++;
	this.showUnnamed();
}
Search.prototype.showUnnamed = function () {
	var cemetery = this.unnamedCemeterySelector.val();
	if (cemetery == '') {
		alert('Необходимо выбрать кладбище');
		return;
	}
	this.unnamedLoader.show();
	$.post(
		'',
		{ ctrl: 'getUnnamed', cemetery: cemetery, part: this.unnamedPart },
		function (data) {
			console.log(data);
			data = JSON.parse(data);
			if (data.status == 'ok') {
				this.unnamedLoader.hide();
				this.unnamedList.append(data.content);
				if (this.unnamedPart == 0) this.curUnnamedCount = data.count;
				if (((this.unnamedPart + 1) * 20) < this.curUnnamedCount) {
					this.unnamedMoreBtn.show();
				}
			}
		}.bind(this)
	);
}

function AdvancedFiler() {

}

AdvancedFiler.prototype.clearFields = function () {
	$('.js-advanced-item').val("");
	return true;
}

AdvancedFiler.prototype.getData = function () {
	return {
		surname: $('#search-f').val().trim() || '',
		firstname: $('#search-i').val().trim() || '',
		patronymic: $('#search-o').val().trim() || '',
		placeNumber: $('#search-p').val().trim() || '',
		graveNumber: $('#search-g').val().trim() || '',
		dieDay: $('#search-day-death').val().trim() || '',
		bornDay: $('#search-day-birthday').val().trim() || '',
		bornMonth: $('#search-month-birthday').val().trim() || '',
		bornYear: $('#search-year-birthday').val().trim() || '',
		dieMonth: $('#search-month-death').val().trim() || '',
		dieYear: $('#search-year-death').val().trim() || '',
		cemetery: $('#search-cemetery').val() || '',
	}
}

$(document).ready(function () {

	function pressedEnter(e) {

		e = e || event;

		return (e.keyCode == 13);
	}

	const State = {
		searchMode: 'default',
	}

	var search = new Search();
	let advancedFilter = new AdvancedFiler();

	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};

	var fullnameUrlQuery = getUrlParameter('fullname');

	if (!!fullnameUrlQuery === true) {
		$('#search-fio').val(fullnameUrlQuery.replace(/\+/g, ' '));
		findGrave();
	}

	$('.js-advanced-item').on('change', function () {
		return findGrave();
	})

	$('#search-fio').on('keydown', function (e) {
		if (pressedEnter(e)) {
			$('#search-more-button').attr('data-part', '0').hide();
			return findGrave();
		}
	});

	$('#find-graves').on('click', function (e) {
		$('#search-more-button').attr('data-part', '0').hide();
		return findGrave();
	});

	$('#search-more-button').on('click', function () {
		var part = Number($('#search-more-button')[0].dataset.part);
		return findGrave(part);
	});

	$('#send-error-report').on('click', function (e) {
		let reportText = $('#error-report-text').val().trim();
		let postData = {
			ctrl: 'add_error_report',
			reportText: reportText
		}

		$.post('', postData).done(function (result) {
			if (result.status == 'success') {
				return location.reload();
			}
		})
	})

	$('#search-clear-str').on('click', function () {
		$('#search-fio').val('');
		history.pushState(null, null, '/search');
		$('#search-list').html('');
		$('.search-error').hide();
		$('.search-info').show();
		$('.js-advanced-item').val("");
		$('#search-more-button').attr('data-part', '0').hide();

		advancedFilter.clearFields();

		if (State.searchMode == 'advanced') {
			$('#search-f').focus();
		}
		else {
			$('#search-fio').focus();
		}
	});

	$('#show-advanced').on('click', function (e) {

		State.searchMode = State.searchMode == 'advanced' ? 'default' : 'advanced';

		if (State.searchMode == 'advanced') {
			$('#search-fio').attr('disabled', 'true');
			$('#search-fio').val("");
		}
		else {
			$('#search-fio').removeAttr('disabled');

			advancedFilter.clearFields();
		}

		$('.advanced_search').toggleClass('advanced_search__showed');
	})

	function findGrave(part) {

		part = part || 0;

		let search_mode = State.searchMode;

		let fullname = $('#search-fio').val().trim();
		fullname = fullname.replace(/\s+/g, " ");

		let postData = {
			fullname: fullname || '',
			ctrl: 'search_grave',
			part: part,
			search_mode: search_mode,
		};

		const advancedData = advancedFilter.getData();

		if (postData.search_mode == 'default') {
			if (postData.fullname == '') {
				return alert('Необходимо ввести имя');
			}
		}
		else {

			delete postData.fullname;

			let validData = Object.keys(advancedData).some(function (d) {
				dValue = advancedData[d];

				if (dValue !== '') {
					return true;
				}
			})

			if (validData === false) {
				return alert('Для поиска необходимо заполнить хоть одно поле');
			}
			else {
				Object.assign(postData, advancedData);
			}
		}

		if (part == 0) $('#search-list').html('<img id="search-loader" src="/img/load.gif" style="margin: 20px auto; display: block;">');

		$('.search-error').hide();
		$('.search-info').hide();

		$.post("/api/search-deads/search", postData).done(function (res) {
			if (res.status == 'ok') {

				if (part == 0) $('#search-list').html('');

				$('#search-list').append(res.data);

				if (postData.search_mode != 'advanced') {
					let nameParts = postData.fullname.split(' ');

					$('.dead-name.noinit').each(function (i, item) {
						item = $(item);
						var name = item.text();
						nameParts.forEach(function (part) {
							var re = new RegExp(part, "ig")
							name = name.replace(re, '<span style="background:yellow;">' + part + '</span>');
						});
						item.html(name);
						item.css({ 'text-transform': 'uppercase' });
						item.removeClass('noinit');
					});
				}

				if ($('.search-result__item').length < Number($('.search-results-count').text())) {
					$('#search-more-button').show();
					$('#search-more-button').attr('data-part', Number($('#search-more-button')[0].dataset.part) + 1);
				}
				else {
					$('#search-more-button').hide();
				}
			}
			else {
				$('#search-list').html('');
				$('.search-error').show();
				$('.search-info').hide();
			}
		});
	}

	$('#search-fio').focus();

})