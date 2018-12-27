


/*
*
*___________только_события______
*
*/




	$('.save-editing-item').click(function () {
		Alert.success('Товар отредактирован', 'Успех');
		saveEdittingItem();
	});

	$('.show-ways').click(function () {
		$('.edit-row').hide(200);
		$('.select-way').toggle(200);
	});

	$('.remove_group').click(function () {
		var elem = $(this);
		$.post('api/categoriesList/delgroup', {id: $(this).data('id')}).done(function (data) {
			Alert.success('Группа удалёна');
			elem.parent().hide(200, function () {
				elem.remove();
			});
		});
	});

	$('.remove_tag').click(function () {
		var elem = $(this);
		$.post('api/categoriesList/deltag', {id: $(this).data('id')}).done(function (data) {
			Alert.success('Тег удалён');
			elem.parent().hide(200, function () {
				elem.remove();
			})
		});
	});

	$('.add_tag').click(function () {
		$.post('api/categoriesList/addtag').done(function (data) {
			Alert.success('Добавлен тег');
			$('.tag_list').prepend(`<div style="display: inline-flex; width: 100%;">
			<div data-id="`+data.result+`" class="tag" oncontextmenu="return false;">Новый тег</div>
			<div data-id="`+data.result+`" class="btn btn-danger remove_tag"><i class="fa fa-remove"></i></div>
			</div>`);
			$($('.tag_list div .tag')[0]).contextmenu(function (e) {
				hideed_tag = $(this);
				hideed_tag.after(`<input type="text" style="color:#000" class="form-control" onkeyup = "edit_tag_title(this, event)" value="`+hideed_tag.text().trim()+`">`)
				hideed_tag.hide();
			})
			$($('.tag_list div .tag')[0]).mousedown(function (e) {
				if (e.originalEvent.button == 2) {

				}else {
					$('body').css('user-select', 'none');
					var clone = $(this).clone();
					hideed_tag = $(this);
					$(this).hide(100);
					clone.css('width', 'auto');
					clone.css('position', 'fixed');
					clone.css('z-index', '999');
					clone.css('left', e.clientX+'px');
					clone.css('top', e.clientY+'px');
					draggable_tag = clone;
					$('body').append(clone);
				}
			});
		});
	});

	$('.add_group').click(function () {
		$.post('api/categoriesList/addgroup').done(function (data) {
			Alert.success('Добавлена группа');
			$('.group_list').prepend(`
				<div data-id="`+data.result+`" class="group">
					<span oncontextmenu="return false;">Новая группа</span>
					<div class="tags_with_group"></div>
				</div>
			`);
		});
	});
	$('.tag').contextmenu(function (e) {
		hideed_tag = $(this);
		hideed_tag.after(`<input type="text" style="color:#000" class="form-control" onkeyup = "edit_tag_title(this, event)" value="`+hideed_tag.text().trim()+`">`)
		hideed_tag.hide();
	})
	var draggable_tag;
	var hideed_tag;
	var hideed_span;
	$('.tag').mousedown(function (e) {
		if (e.originalEvent.button == 2) {

		}else {
			$('body').css('user-select', 'none');
			var clone = $(this).clone();
			hideed_tag = $(this);
			$(this).hide(100);
			clone.css('width', 'auto');
			clone.css('position', 'fixed');
			clone.css('z-index', '999');
			clone.css('left', e.clientX+'px');
			clone.css('top', e.clientY+'px');
			draggable_tag = clone;
			$('body').append(clone);
		}
	});
	$('body').mousemove(function (e) {
		if (draggable_tag) {
			draggable_tag.css('left', e.clientX+'px');
			draggable_tag.css('top', e.clientY+'px');
		}
	});
	$('.group').hover(function (e) {
		if (draggable_tag) {
			$(this).animate({
				minHeight: parseInt($(this).css('height'))+parseInt($(draggable_tag).css('height'))+'px'
			}, 200);
		}
	},function (e) {
		if (draggable_tag) {
			$(this).animate({
				minHeight: '0px'
			}, 200);
		}
	});
	$('body').mouseup(function (e) {
		if (draggable_tag) {
			$('body').css('user-select', 'auto');
			$('.group').animate({
				minHeight: '0px'
			}, 200);
			if ($(e.target).hasClass('group')) {
				$.post('api/categoriesList/settag', {
					id: draggable_tag.data('id'),
					group_id: $(e.target).data('id')
				}).done(function (data) {
					console.log(data);
					Alert.success('Тег добавлен в группу');
					$(e.target).find('.tags_with_group').prepend(`<div style="display: inline-flex; width: 100%;">
					<div data-id="`+draggable_tag.data('id')+`" class="tag">`+draggable_tag.text()+`</div>
					<div data-id="`+draggable_tag.data('id')+`" onclick="remove_tag(this)" class="btn btn-danger remove_tag"><i class="fa fa-remove"></i></div>
					</div>`);
					hideed_tag.parent().hide(200);
				});
			}else {
				hideed_tag.show(200);
			}
			draggable_tag.hide(100, function () {
				draggable_tag.remove();
				draggable_tag = false;
			});
		}
	});

	$('.open_category_cats').click(function () {
			$('.select-way').hide(300, function functionName() {
				$('.edit-cat').show(300);
			});
			$('.edit-item').hide(300, function functionName() {
				$('.edit-cat').show(300);
			});

	});

	$('.add-elem').click(function () {
		var elem = $(this).data('elem');

		$('.edit-'+elem).show(200, function(){
			$('.select-way').hide(300);
			$('.edit-cat').hide(300);
		});
			$.post('api/categoriesList/add'+elem).done(function (res, err) {
				if (res.status == 'ok') {
					Alert.info('Вы можете редактировать её сейчас или позже в настроках категории.', 'Настройка категории');
					Alert.success('Элемент добавлен.', 'Успех');
					if (elem == 'item') {
						useing_item_id = res.result;
					}else {
						$('.save-edited-'+elem)[0].dataset.id = res.result;
					}
				}else {
					Alert.error('Ошибка', err.message);
				}
			});
	});

	$('.toggle_filter').click(function () {
		var span = $(this).find('span');
		if (span.hasClass('active')) {
			span.removeClass('active');
		}else {
			span.addClass('active');
		}
	});

	$('.add-cat').click(function () {
			$.post('api/categoriesList/addcat').done(function (res, err) {
				if (res.status == 'ok') {
					console.log(res);
					Alert.success('Элемент добавлен.', 'Успех');
					$('.category_list').prepend('	<input type="text" data-id="'+res.result+'" onkeyup="save_edited_cat(this, event)" value="Новая категория" placeholder="Имя категории" class="save-edited-cat form-control">');
				}else {
					Alert.error('Ошибка', err.message);
				}
			});
	});

	$('.remove_cat').click(function () {
		var elem = $(this);
		$.post('api/categoriesList/delcat', {id: $(this).data('id')}).done(function (res, err) {
			if (res.status == 'ok') {
				elem.parent().hide(200, function () {
					elem.parent().remove();
				})
				Alert.success('Элемент удалён', 'Успех');
			}else {
				Alert.error('Ошибка', err.message);
			}
		});
	});


$('.open__filters').click(function () {
	if (parseInt($('.bar').css('height')) < 81) {
		$('.after5').show();
		$('.more').hide();
		$('.bar').css('height', 'auto');
		$('.open_filters_arrow i').css('transform', 'rotate(180deg)');
	}else {
		$('.after5').hide();
		$('.more').show();
		$('.bar').css('height', '80px');
		$('.open_filters_arrow i').css('transform', 'rotate(0deg)');
	}
});

$('.sort').click(function () {
	if ($(this).hasClass('desc')) {
		iso.arrange({
			sortBy: 'number',
			sortAscending: false
		});
		recalcFlickities();
		iso.layout();
	}else {
		iso.arrange({ sortBy: 'number'});
		recalcFlickities();
		iso.layout();
	}
})


$('.tag_fliter').click(function () {
	if ($(this).hasClass('selected')) {
		$(this).removeClass('selected');
	}else {
		$(this).addClass('selected');
	}

	if ($('.toggle_filter').find('span').hasClass('active')) {
		var query = ':not( ';
		$('.selected').each(function () {
			query += '.'+cyrill_to_latin($(this).text())+', ';
		});
	}else {
		var query = '';
		$('.selected').each(function () {
			query += '.'+cyrill_to_latin($(this).text())+', ';
		});
	}

	if($('.filter__item--selected').data('filter') != '*'){
		query = query.slice(0,-2);
		query += ':not(';
		$('.filter__item').each(function () {
			if ($('.filter__item--selected').data('filter') != $(this).data('filter') && $(this).data('filter') != '*') {
				query += ''+$(this).data('filter')+', ';
			}
		});
		query = query.slice(0,-2);
		query += ')';
	}else {
		if ($('.toggle_filter').find('span').hasClass('active')) {
			query = query.slice(0,-2);
			query += ')';
		}else {
			query = query.slice(0,-2);
		}
	}

	iso.arrange({
		filter: query
	});
	recalcFlickities();
	iso.layout();

});





	$('.save-edited-cat').on('keyup', function (e) {
		if (e.keyCode == 13) {
			Alert.success('Имя категории успешно сохранено', 'Успех');
		}
		$.post('api/categoriesList/setcat', {title: $(this).val(), id: 	$('.save-edited-cat')[0].dataset.id}).done(function (res, err) {
			if (res.status != 'ok'){
				Alert.error('Ошибка', res.message);
			}
		});
	});
	$('.editing-item').on('keyup', function () {
		saveEdittingItem();
	});
	$('.save-edited-tag').on('keyup', function (e) {
		if (e.keyCode == 13) {
			Alert.success('Тег успешно сохранен', 'Успех');
		}
		$.post('api/categoriesList/settag', {title: $(this).val(), id: 	$('.save-edited-tag')[0].dataset.id}).done(function (res, err) {
			if (res.status != 'ok'){
				Alert.error('Ошибка', res.message);
			}
		});
	});

	$('#search_category').on('keyup', function (e) {
		if (e.keyCode == 13) {

		}
		$.post('api/categoriesList/getcat', {text: $(this).val()}).done(function (res, err) {
			if (res.status == 'ok') {
				$('.category-hint').empty();
				res.result.forEach(elem => {
					$('.category-hint').append('<span onclick="add_cat_hint(\''+elem.title+'\', '+elem.id+')"><i class="fa fa-plus"></i> '+elem.title+'</span>')
				});

			}
		});
	});

	$('#photos_array').on('change', function (e) {

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
				$('.photos_array').prepend(`<div class="photos_array_item added">
					<img src="`+value+`">
					<div onclick="$(this).parent().remove()" class="delete_photos_array_item"><i class="fa fa-remove"></i></div>
				</div>`);
				saveEdittingItem();
      },
      error: function (data) {
        console.log(data);
      }
    });
    return false;
  });
	$('#photo__edit').on('change', function (e) {

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
				$('.photo__edit').prepend(`<div class="photo__edit_item added">
					<img src="`+value+`">
					<div onclick="$(this).parent().remove()" class="delete_photo__edit_item"><i class="fa fa-remove"></i></div>
				</div>`);
      },
      error: function (data) {
        console.error(data);
      }
    });
    return false;
  });

$('#search_tag').on('keyup', function (e) {
	if (e.keyCode == 13) {

	}
	$.post('api/categoriesList/gettag', {text: $(this).val()}).done(function (res, err) {
		if (res.status == 'ok') {
			$('.tag-adding-block-with-hint').empty();
			res.result.forEach(elem => {
				$('.tag-adding-block-with-hint').append('<span onclick="add_hint(\''+elem.title+'\', '+elem.id+')"><i class="fa fa-plus"></i> '+elem.title+'</span>')
			});

		}
	});
});

	$('#item-modal').on('show.bs.modal', function (event) {

	  var item = $(event.relatedTarget);
	  var modal = $(this);
		var id = item.data('id');
		// modal.find('.photo').append(clone);
		$.post('api/categoriesList/getitem', {id : id}).done(function (res, err) {
			$('.modalToCart')[0].dataset.data = JSON.stringify(res.result[0]);
			modal.find('.title').text(res.result[0].title);
			modal.find('.brand').text(res.result[0].brand);
			modal.find('.price').text(res.result[0].price+' ₽');
			modal.find('.desc').text(res.result[0].desc);
			setTimeout(function () {
				modal.find('.slider_m').empty();
				JSON.parse(res.result[0].photos_array).forEach(elem => {
					modal.find('.slider_m').append('<div class="slider__item"><img src="'+elem+'"/></div>');
				});
				init_modal()
			}, 200);
			// $('.photo__edit_item').remove();
			JSON.parse(res.result[0].photos_array).forEach(elem => {
				modal.find('.photo__edit').prepend(`<div class="photo__edit_item added">
					<img src="`+elem+`">
					<div onclick="$(this).parent().remove()" class="delete_photo__edit_item"><i class="fa fa-remove"></i></div>
				</div>`);
			});

			modal.find('.title').val(res.result[0].title);
			modal.find('.brand').val(res.result[0].brand);
			modal.find('.price').val(res.result[0].price);
			modal.find('.desc').val(res.result[0].desc);

		});
	});
	$('#item-modal').on('hidden.bs.modal', function (event) {
		var modal = $('#item-modal');
		var view = modal.find('.view');
		var edit = modal.find('.edit');
		view.show();
		edit.hide();
	});
	$('.edit-item').click(function () {
		var modal = $('#item-modal');
		var view = modal.find('.view');
		var edit = modal.find('.edit');
		if (view.css('display') == 'none') {
			view.show();
			edit.hide();
			$('#cke_editor1').hide();
		}else {
			view.hide();
			$('#cke_editor1').show();
			console.log(view.find('.desc'));
			console.log(view.find('.desc').text());
			ckeditor.insertText(view.find('div.desc').text());
			edit.show();
		}
	});

	$('.search-showed-items').on('keyup', function () {

	});

var useing_item_id = null;


var ckeditor = CKEDITOR.replace( 'editor1');

setTimeout(function () {
	$('#cke_editor1').hide();
}, 500);


var parent = document.querySelector(".range-slider");
  // if(!parent){ return 0 };

  var
    rangeS = parent.querySelectorAll("input[type=range]"),
    numberS = parent.querySelectorAll("input[type=number]");

  rangeS.forEach(function(el) {
    el.oninput = function() {
      var slide1 = parseFloat(rangeS[0].value),
        	slide2 = parseFloat(rangeS[1].value);

      if (slide1 > slide2) {
				[slide1, slide2] = [slide2, slide1];
        // var tmp = slide2;
        // slide2 = slide1;
        // slide1 = tmp;
      }

      numberS[0].value = slide1;
      numberS[1].value = slide2;
			var query = '';
			 $('.grid__item').each(function () {
				 if (parseInt($(this).find('.meta__price').text()) >= slide1 && parseInt($(this).find('.meta__price').text()) <= slide2) {
					 query += '.'+parseInt($(this).find('.meta__price').text())+', '
				 }
			 });
			 query = query.slice(0,-2);
			 iso.arrange({
				  filter: query
				});
				recalcFlickities();
				iso.layout();
    }
  });

  numberS.forEach(function(el) {
    el.oninput = function() {
			var number1 = parseFloat(numberS[0].value),
					number2 = parseFloat(numberS[1].value);

      if (number1 > number2) {
        var tmp = number1;
        numberS[0].value = number2;
        numberS[1].value = tmp;
      }

      rangeS[0].value = number1;
      rangeS[1].value = number2;
			var query = '';
			 $('.grid__item').each(function () {
				 if (parseInt($(this).find('.meta__price').text()) > number1 && parseInt($(this).find('.meta__price').text()) < number2) {
					 query += '.'+parseInt($(this).find('.meta__price').text())+', '
				 }
			 });
			 query = query.slice(0,-2);
			 iso.arrange({
				  filter: query
				});
				recalcFlickities();
				iso.layout();
    }
  });





























//-------------------
