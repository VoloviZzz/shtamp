var $form = $('.js-metaManage-add');
var $addAlias = $('.js-routesAliases-add');
$('.text-to-translit').on('keyup', function () {
	$('.translit').click()
});
$addAlias.on('submit', function (e) {
	e.preventDefault();
	$('.translit').click()
	console.log(this.elements);
	var value = this.elements.alias.value;
	var routeId = this.elements.routeId.value;
	var params = this.elements.params.value;
	var postData = {
		alias: value,
		route_id: routeId,
		params: params
	};
	console.log(postData);

	$.post('/api/routes-aliases/add', postData).done(function(result) {
		if(result.status !== 'ok') {
			console.log(result);
			return alert(result.message);
		}

		location.reload();
	});

	return false;
})

$form.on('submit', function (e) {
	e.preventDefault();

	var $this = $(this);
	var elements = $this.get(0).elements;

	var route_id = elements.route_id.value || false;
	var category = elements.category.value || false;
	var alias_id = elements.alias_id ? elements.alias_id.value : false;
	var target_type = elements.target_type.value || false;
	var target_id = elements.target_id.value || false;

	var metaDescription = elements['description'].value ? elements['description'].value.trim() : '';
	var metaKeywords = elements['keywords'].value ? elements['keywords'].value.trim() : '';
	var metaTitle = elements['title'].value ? elements['title'].value.trim() : '';

	if (category === false) {
		return alert('Не выбрана категория для добавления');
	}

	if (category === 'alias' && alias_id === false) {
		return alert('error alias');
	}

	// if (category === 'target' && (target_type === false || target_id === false)) {
	// 	return alert('error target');
	// }

	var postData = {
		route_id: route_id,
		['description']: metaDescription,
		['keywords']: metaKeywords,
		['title']: metaTitle,

	};

	if (category === 'target') {
		postData.target_type = target_type;
		postData.target_id = target_id;
	} else if (category === 'alias') {
		postData.alias_id = alias_id;
	}

	$.post('/api/metaManage/add', postData).done(function (result) {
		if (result.status !== 'ok') {
			console.log(result);
			return alert(result.message);
		}

		location.reload();
	})

	return false;
});

$('.js-metaManage-showParams').on('change', function () {
	var targetForm = $('.js-radio-form[data-target="target"]');

	targetForm.hide();

	if (this.value == 'target') {
		targetForm.show();
	}
})

$('.translit').click(function () {
	$('.alias').val(cyrill_to_latin($('.text-to-translit').val()));
});


function cyrill_to_latin(text){
	if (text[0] != '/') {
		text = '/'+text;
	}
	var arrru = ['Я','я','Ю','ю','Ч','ч','Ш','ш','Щ','щ','Ж','ж','А','а','Б','б','В','в','Г','г','Д','д','Е','е','Ё','ё','З','з','И','и','Й','й','К','к','Л','л','М','м','Н','н', 'О','о','П','п','Р','р','С','с','Т','т','У','у','Ф','ф','Х','х','Ц','ц','Ы','ы','Ь','ь','Ъ','ъ','Э','э','"','\'','  ',' '];
	var arren = ['Ya','ya','Yu','yu','Ch','ch','Sh','sh','Sh','sh','Zh','zh','A','a','B','b','V','v','G','g','D','d','E','e','E','e','Z','z','I','i','J','j','K','k','L','l','M','m','N','n', 'O','o','P','p','R','r','S','s','T','t','U','u','F','f','H','h','C','c','Y','y','','','','','E', 'e','','',' ','-'];
	for(var i=0; i<arrru.length; i++){
		var reg = new RegExp(arrru[i], "g");
		text = text.replace(reg, arren[i]);
    }
	return text;
}






//---------
