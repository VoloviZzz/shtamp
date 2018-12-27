'use strict';

$(document).ready(function() {

    var routesList = new RoutesList();
    var forms = new Forms();

    $('.js-delete-route').on('click', function() {
        return routesList.delete(this.dataset.routeId);
    });

    $('.js-show-edit-route-form').on('click', function() {
        $('.section-center .section-content').scrollTop(0);
        return routesList.showEditForm(this);
    });

    $('.js-routes-list-add-route').on('submit', function(e) {
        e.preventDefault();
        var $form = $(this);
        var formData = forms.getFormData($form);

        routesList.addRoute(formData);
    });

    $('.js-routes-list-upd-route').on('submit', function(e) {
        e.preventDefault();
        var $form = $(this);
        var formData = forms.getFormData($form);

        routesList.updRoute(formData);
    });

    $('.js-routes-list-showAddForm').on('click', function(e) {
        $('#js-routes-list-addForm').toggle();
    });

    $('.js-routeFragments-delete').on('click', function(e) {
        if (confirm('Удалить фргамент?') === false) return false;

        var $this = $(this);

        var postData = {
            fragment_id: $this.data('id')
        };

        $.post('/api/fragments/del', postData).done(function(result) {
            if (result.status !== 'ok') {
                console.log(result);
                return alert(result.message);
            }

            $this.parent('.js-routeFragment-item').remove();
        })
    });

    $('.js-routeFragments-togglePublished').on('click', function(e) {
		var $btn = $(this);
        
		var postData = {
			target: 'published',
			value: $btn.val(),
			fragment_id: $btn.data('id')
		};

        $.post('/api/fragments/upd', postData).done(function(result) {
            if (result.status !== 'ok') {
                console.log(result);
                return alert(result.message);
            }

			if(postData.value == '1') {
				$btn.text('Снять с публикации');
				$btn.attr('value', '0');
			} else {
				$btn.text('Опубликовать');
				$btn.attr('value', '1');
			}
        })
    })
});