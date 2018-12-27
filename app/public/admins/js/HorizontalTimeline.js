'use strict';

$(document).ready(function () {

  $(".left").click(function() {
    var elm = $(this).parent().parent().parent();
    if (elm.prev().length != 0) {
       var query = {
         id: elm.prev().find('.control-block').data('id'),
         title: elm.find('time').text(),
         img: elm.find('img').attr('src'),
         desc: elm.find('.timeline-desc').text(),
       };
      $.post('/api/history/saveEvent', query)
      .done(function (result) {
        if (result.status == 'ok') {
          var query = {
            id: elm.find('.control-block').data('id'),
            title: elm.prev().find('time').text(),
            img: elm.prev().find('img').attr('src'),
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
  });
  $(".right").click(function() {
    var elm = $(this).parent().parent().parent();
    if (elm.next().length != 0) {
      var query = {
        id: elm.next().find('.control-block').data('id'),
        title: elm.find('time').text(),
        img: elm.find('img').attr('src'),
        desc: elm.find('.timeline-desc').text(),
      };
     $.post('/api/history/saveEvent', query)
     .done(function (result) {
       if (result.status == 'ok') {
         var query = {
           id: elm.find('.control-block').data('id'),
           title: elm.next().find('time').text(),
           img: elm.next().find('img').attr('src'),
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
  });

	$('.add-new-event').on("click", function () {
		var elem = this;
		addBlock(this);
	});

	$('.remove').on("click", function () {
		removeBlock(this);
	});

	$('.edit').click(function () {
		editEvent(this);
	});

	$('.close-edited-history').click(function () {
		var elem = this;
		var elemli = $(elem).parent().parent();
		var id = elemli.find('h2 span').text();
		$('.hidden-edit-block').hide(300, function () {
			$($('.section-content')[1]).animate({
					scrollTop: $('#history'+id).offset().top-$('#history'+id).width()
			}, 300);
		});

	});

	$('.save-edited-history').click(function () {
		var elem = this;
		var elemli = $(elem).parent().parent();
		var id = elemli.find('h2 span').text();

		if ($('.edit-title').val() == '') {
			alert('Заголовок не заполнен')
			return;
		}
		if ($('.edit-img-btn').attr('src') == '') {
			alert('Заголовок не заполнен')
			return;
		}
		if ($('.edit-desc').val() == '') {
			alert('Заголовок не заполнен')
			return;
		}




		var query = {
			 id: id,
			 title: $('.edit-title').val(),
			 img: $('.edit-img-btn').attr('src'),
			 desc: $('.edit-desc').val()
		 };
		$.post('/api/history/saveEvent', query)
		.done(function (result) {
			if (result.status == 'ok') {
				console.log(result);
				$('#history'+id).find('time').text(query.title);
				$('#history'+id).find('img').attr('src', query.img);
				$('#history'+id).find('.timeline-desc').text(query.desc);
			}
		});

		$('.hidden-edit-block').hide(300, function () {
			$($('.section-content')[1]).animate({
					scrollTop: $('#history'+id).offset().top-$('#history'+id).width()
			}, 300);
		});

	});

	$('#edit-img-input-file').on('change', function (e) {

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
				$('.edit-img-btn').attr('src', value);
			}
		});
		return false;
	});


});

function editEvent(elem) {
		var elem = $(elem);
		var id = elem.parent().data('id');
		var elemli = $(elem).parent().parent();
		$('.edit-title').val(elemli.find('time').text());
		$('.edit-img-btn').attr('src', elemli.find('img').attr('src'));
		$('.edit-desc').val(elemli.find('.timeline-desc').text());
		$('.hidden-edit-block').find('h2 span').text(id);
		$($('.section-content')[1]).animate({
        scrollTop: 0
    }, 300, function () {
			$('.hidden-edit-block').show(300);
    });
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

function addBlock(elem) {
	$.post('/api/history/addEvent', {})
	.done(function (result) {
		console.log(result);
		if (result.status == 'ok') {
			var text = '<li class="in-view">	   <div class="timeline-block" id="history'+result.data+'">';
			if ($(elem).data('admin') == true) {
				text 		+= '		<div class="control-block" data-id="'+result.data+'">';
				text 		+= '			<div class="btn btn-danger control remove"><i class="fa fa-remove"></i></div>';
				text 		+= '			<div onclick="editEvent(this);" class="btn control edit"><i class="fa fa-edit"></i></div>';
				text 		+= '		</div>';
			}
        text 		+= '	<time>Новое событие</time>';
				text 		+= '	<div class="timeline-desc">';
				text 		+= 'Описание нового события';
				text 		+= '</div>';
				text 		+= '	<img src="/uploads/upload_3567a312aec44256a029443bfcb4e69f.gif" alt="">';
				text 		+= '	</div>';
      	text 		+= '</li>';
			if ($(elem).data('admin') == true) {
				var text2 = '	   <li class="in-view">';
				text2 		+= '   <div class="timeline-block add-new-event" data-admin="true" onclick="addBlock(this)" style="cursor: pointer; text-align: center;">';
				text2		 += '   <i class="fa fa-plus"></i>';
				text2 		+= '  </div>';
				text2 		+= ' </li>';
				$(elem).parent().after(text2);
			}
					$(elem).parent().after(text);
					$(elem).parent().remove();
		}
	});
}
