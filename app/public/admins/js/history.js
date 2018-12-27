$(document).ready(function () {

	$('.add-new-event').on("click", function () {
		var elem = this;
		addBlock(this);
	});

	$('.remove').on("click", function () {
		removeBlock(this);
	});

	$('.edit').on('keyup', function (e) {
		everyEdit(this);
	});
	$('.edit').on('change', function (e) {
		everyEdit(this)
	});

	$(".left").click(function() {
		moveLeft(this);
	});

	$(".right").click(function() {
		moveRight(this);
	});

	addEventListenerChangeOnInputHiddenEditBlockUploadPhoto();
});

function everyEdit(elem) {
	var this_block = $(elem).parent();
	$('.edit-title').val(this_block.find('.edit-part-title').val());
	$('.edit-date').val(this_block.find('.edit-part-date').val());
	$('.edit-img-btn').attr('src', this_block.find('img').attr('src'));
	$('#edit-img-input-file')[0].dataset.id = this_block.data('id');
	$('.edit-desc').val(this_block.find('.edit-part-desc').val());
	$('.hidden-edit-block').find('h2 span').text(this_block.data('id'));
	saveEditedHistory()
}

function moveLeft(element) {
	var elm = $(element).parent().parent().parent();
	if (elm.prev().length != 0) {
		 var query = {
			 id: elm.prev().find('.control-block').data('id'),
			 title: elm.find('time').text(),
			 img: elm.find('img').attr('src'),
			 date: elm.find('.time').data('created'),
			 desc: elm.find('.timeline-desc').text(),
		 };
		$.post('/api/history/saveEvent', query)
		.done(function (result) {
			if (result.status == 'ok') {
				var query = {
					id: elm.find('.control-block').data('id'),
					title: elm.prev().find('time').text(),
					img: elm.prev().find('img').attr('src'),
					date: elm.prev().find('.time').data('created'),
					desc: elm.prev().find('.timeline-desc').text(),
				 };
				$.post('/api/history/saveEvent', query)
				.done(function (result) {
					if (result.status == 'ok') {
					elm.insertBefore(elm.prev());
					}
				});
			}
		});
	}
}

function moveRight(element) {
	var elm = $(element).parent().parent().parent();
	if (elm.next().length != 0 && !elm.next().hasClass('plus')) {
		var query = {
			id: elm.next().find('.control-block').data('id'),
			title: elm.find('time').text(),
			img: elm.find('img').attr('src'),
			date: elm.find('.time').data('created'),
			desc: elm.find('.timeline-desc').text(),
		};
	 $.post('/api/history/saveEvent', query)
	 .done(function (result) {
		 if (result.status == 'ok') {
			 var query = {
				 id: elm.find('.control-block').data('id'),
				 title: elm.next().find('time').text(),
				 img: elm.next().find('img').attr('src'),
				 date: elm.next().find('.time').data('created'),
				 desc: elm.next().find('.timeline-desc').text(),
				};
			 $.post('/api/history/saveEvent', query)
			 .done(function (result) {
				 if (result.status == 'ok') {
				 elm.insertAfter(elm.next());
				 }
			 });
		 }
	 });
	}
}

function editEvent(elem) {

	var elem = $(elem);
	var id = elem.parent().data('id');
	var id_back = $('.hidden-edit-block').find('h2 span').text();
	var elemli = $(elem).parent().parent();
	if ($('.hidden-edit-block').css('display') == 'none') {
		$('.edit-title').val(elemli.find('time').text());
		$('.edit-date').val(elemli.find('.time').data('created'));
		$('.edit-img-btn').attr('src', elemli.find('img').attr('src'));
		$('.edit-desc').val(elemli.find('.timeline-desc').text());
		$('.hidden-edit-block').find('h2 span').text(id);
		var edit_block = $('.hidden-edit-block').clone();
		$('.hidden-edit-block').remove();
		elemli.find('time').hide();
		elemli.find('.time').hide();
		elemli.find('img').hide();
		elemli.find('.timeline-desc').hide();
		elemli.append(edit_block);
		addEventListenerBlurOnInputsHiddenEditBlock();
		addEventListenerChangeOnInputHiddenEditBlockUploadPhoto()
		$('.hidden-edit-block').show();

	}else {
		$('#history'+id_back).find('time').show();
		$('#history'+id_back).find('.time').show();
		$('#history'+id_back).find('img').show();
		$('#history'+id_back).find('.timeline-desc').show();
		$('#history'+id).find('time').show();
		$('#history'+id).find('.time').show();
		$('#history'+id).find('img').show();
		$('#history'+id).find('.timeline-desc').show();
		$('.hidden-edit-block').hide();
	}
}

function removeBlock(elem) {
	$.post('/api/history/removeEvent', {
		id: $(elem).parent().data('id')
	})
	.done(function (result) {
		if (result.status == 'ok') {
			$(elem).parent().parent().parent().hide(200, function () {
				$(elem).parent().parent().parent().remove();
			})
		}
	});
}

function saveEditedHistory() {
	var elemli = $('.hidden-edit-block');
	var id = elemli.find('h2 span').text();

	var query = {
		 id: id,
		 title: $('.edit-title').val(),
		 date: $('.edit-date').val(),
		 img: $('.edit-img-btn').attr('src'),
		 desc: $('.edit-desc').val()
	 };
	$.post('/api/history/saveEvent', query)
	.done(function (result) {
		if (result.status == 'ok') {
			// console.log(result.status);
		}
	});
}

function addEventListenerBlurOnInputsHiddenEditBlock() {
	$('.hidden-edit-block').find('input').each(function () {
		this.addEventListener('blur',function () {
			console.log('blur');
			saveEditedHistory(this);
		}, false);
	});
}

function addEventListenerChangeOnInputHiddenEditBlockUploadPhoto() {
	$('#edit-img-input-file').on('change', function (e) {

		var fd = new FormData();
		var id = $(this).data('id');
		var back_id = this.dataset.id;

		fd.append('upload', this.files[0]);

		$.ajax({
			url: '/api/images/upload?filename=' + this.files[0].name,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function success(result) {
				var value = result.data.fileUrl;
				$('.edit-img-btn').attr('src', value);
				console.log(id);
				$('#history'+id).find('img').attr('src', value);
				saveEditedHistory();
			}
		});
		return false;
	});
}

function addBlock(elem) {
	$.post('/api/history/addEvent', {})
	.done(function (result) {
		console.log(result);
		if (result.status == 'ok') {
			var text = '<li class="in-view">	   <div class="timeline-block" id="history'+result.data+'">';
			if ($(elem).data('admin') == true) {
				text 		+= `		<div class="control-block" data-id="`+result.data+`">
							<div onclick="removeBlock(this)" class="btn btn-danger control remove"><i class="fa fa-remove"></i></div>
							<div onclick="editEvent(this);" class="btn control edit"><i class="fa fa-edit"></i></div>
				    	<div onclick="moveLeft(this);" class="btn control left"><i class="fa fa-arrow-up"></i></div>
				      <div onclick="moveRight(this);" class="btn control right"><i class="fa fa-arrow-down"></i></div>
						</div>`;
			}
			text 		+= `	<img src="/uploads/upload_3567a312aec44256a029443bfcb4e69f.gif" alt="">
										<time>Новое событие</time>
						        	<div class="time"data-created="1997-01-01">01 янв 1970</div>
											<div class="timeline-desc">
										Описание нового события
										</div>
											</div>
						      	</li>`;
				var text2 = '	   <li class="in-view plus">';
				text2 		+= '   <div class="timeline-block add-new-event" data-admin="true" onclick="addBlock(this)" style="cursor: pointer; text-align: center;">';
				text2		 += '   <i class="fa fa-plus"></i>';
				text2 		+= '  </div>';
				text2 		+= ' </li>';
				$(elem).parent().after(text2);
					$(elem).parent().after(text);
					$(elem).parent().remove();
		}
	});
}

function getTheTime(date) {

  function twoCharInt(anInt) {
    return anInt < 10 ? '0' + anInt : anInt;
  }

  const times = new Date(date);
  const year = times.getFullYear()
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const month = months[times.getMonth()];
  const day = twoCharInt(times.getDate());

  return day + ' ' + month + ' ' + year
}

function getTheInputDate(date) {

  var time = new Date(date);
  var day = time.getDate() < 10 ? '0'+time.getDate():time.getDate();
  var month = time.getMonth() + 1; var month = month < 10 ? '0'+month : month;
  const year = time.getFullYear();

  return year + '-' + month + '-' + day
}






































//-----------------------------end-------------------
