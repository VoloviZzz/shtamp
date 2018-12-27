$(document).ready(function (e) {
	$('#toggle-admin-mode').on('click', toggleAdmin);

	$(document).on('keydown', function (e) {
		if (e.shiftKey && e.ctrlKey && e.keyCode == 'E'.charCodeAt(0)) {
			toggleAdmin();
		}
	});

	$('#js-adminPanel-showRouteSettings').click(function (e) {
		const $modal = $('#js-adminPanel-routeSettingsModal');
		const $close = $modal.find('.close');

		const closeModal = function () {
			$modal.hide(function (e) {
				$close.off('click', closeModal);
			});
		};

		$modal.show();


		$close.on('click', closeModal);

		$(window).click(function (e) {
			if (e.target === $modal.get(0)) {
				closeModal();
			}
		})
	});


	function toggleAdmin() {
		var postData = {
			ctrl: 'toggle_admin_mode'
		};

		var parseQueryString = function () {
			var queryString = location.search.substring(1);

			if (queryString == '') return {};

			var params = {}, queries, temp, i, l;
			// Split into key/value pairs
			queries = queryString.split("&");
			// Convert the array of strings into an object
			for (i = 0, l = queries.length; i < l; i++) {
				temp = queries[i].split('=');
				params[temp[0]] = temp[1];
			}
			return params;
		};

		var queryParams = parseQueryString();

		queryParams['admin-mode'] = queryParams['admin-mode'] == '1' ? '0' : '1';

		var queryString = $.param(queryParams);

		location.search = queryString;
	}
})