'use strict';

$(document).ready(function () {

	var routesList = new RoutesList();
	var forms = new Forms();

	$('.js-delete-route').on('click', function () {
		return routesList.delete(this.dataset.routeId);
	});

	$('.js-show-edit-route-form').on('click', function () {
		//$('.section-center .section-content').scrollTop(0);
		return routesList.showEditForm(this);
	});

	$('.js-routes-list-add-route').on('submit', function (e) {
		e.preventDefault();
		var $form = $(this);
		var formData = forms.getFormData($form);

		routesList.addRoute(formData);
	});

	$('.js-routes-list-upd-route').on('submit', function (e) {
		e.preventDefault();
		var $form = $(this);
		var formData = forms.getFormData($form);

		routesList.updRoute(formData);
	});

	$('.js-routes-list-showAddForm').on('click', function (e) {
		$('#js-routes-list-addForm').toggle();
	});
});