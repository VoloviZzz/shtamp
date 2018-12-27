$(document).ready(function (e) {
	
	var catId = $('#js-shop-cat-id').val();
	var $menu = $('.js-shop-menu');
	var $menuItem = $menu.find('.js-shop-menu-item[data-cat-id=' + catId + ']');
	
	$menu.find('.js-shop-menu-item').removeClass('active');
	$menuItem.addClass('active');

	$('#js-shop-search-form').submit(function (e) {
		var forms = new Forms();
		var formData = forms.getFormData(this);

		$.post('/api/goodsList/search', { value: formData.searchQuery }).done(function(result) {
			$('#js-load-content').html(result.data);
		})

		return false;
	});
})