var map;
var files2;
var marker = false;
window.onload = () => {
  var mapCenterCoords = ['53.388019', '59.075146'];
  map = new Map('map', 18, mapCenterCoords[0], mapCenterCoords[1]);
  map.setCenter(mapCenterCoords[0]+','+mapCenterCoords[1]);
  map.map.on('click', function (e) {
    if (marker) {
      marker.remove()
    }
    marker = map.addMarker(e.latlng.lat, e.latlng.lng, false, true);
    $('.edit-coord').val(e.latlng.lat+', '+e.latlng.lng);
  });
  $('.edit-coord').keyup(function () {
    $(this).val($(this).val().replace(/[a-zA-Zа-яА-Я]/g, ''));
  });
  $('.edit-coord').blur(function () {

    var coord = $(this).val().replace(/ /g, '').split(',');
    map.setCenter(coord[0]+','+coord[1]);
    marker = map.addMarker(coord[0], coord[1], false, true);
    map.map.on('click', function (e) {
      if (marker) {
        marker.remove()
      }
      marker = map.addMarker(e.latlng.lat, e.latlng.lng, false, true);
      $('.add-coord').val(e.latlng.lat+', '+e.latlng.lng);
    });
  });


  $('#upload-input-file').on('change', function (e) {

    var fd = new FormData();
    var id = $(this).data('id');

    fd.append('upload', this.files[0]);
    $.ajax({
      url: '/api/images/uploadPanoram?filename=' + this.files[0].name,
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function success(result) {
        var value = result.data.fileUrl;
        $('.edit-zip').text(value);
      },
      error: function (data) {
        console.log(data);
      }
    });
    return false;
  });


  $('.save-edited-panoram').click(function () {
    var query = {
      title: $('.edit-title').val(),
      coord: $('.edit-coord').val(),
      created: $('.edit-date').val(),
      zip: $('.edit-zip').text(),
      id: $('.hidden-edit-block').find('h2 span').text()
    };
    console.log(query);
    $.post('/api/panorams/updPanoram', query)
  	.done(function (result) {
  		if (result.status == 'ok') {
        var elem = $('#panoram'+query.id).find('td');
        $(elem[0]).text(query.title);
        $(elem[1]).text(query.zip);
        $(elem[2]).text(query.coord);
        $(elem[3]).text(query.created);

        $.post('/api/panorams/addZipDir', {zip: query.zip})
        .done(function (result) {
          console.log(result);
        })


        $('.hidden-edit-block').hide(300, function () {
    			$('.section-content').animate({
    					scrollTop: $('#panoram'+query.id).offset().top-140
    			}, 300,function () {
            $('#panoram'+query.id).css('background-color', '#e0ffe0');
            setTimeout(function () {
              $('#panoram'+query.id).css('background-color', '#fff');
            }, 200);
          });
    		});
      }
  	});
  });

  $('.close-edited-component').click(function () {
		var id = $(this).parent().parent().find('h2 span').text();
		$('.hidden-edit-block').hide(300, function () {
			$('.section-content').animate({
					scrollTop: $('#panoram'+id).offset().top-140
			}, 300);
		});
	});

  $('.edit').click(function () {
    edit(this);
  });

  $('.remove').click(function () {
    remove(this);
  });

  $('.add').click(function () {
    $.post('/api/panorams/addPanoram', {})
  	.done(function (result) {
  		if (result.status == 'ok') {
        console.log(result);
        var date = new Date();
        date = date.getFullYear() +'-'+ Number(date.getMonth()+1) +'-'+ date.getDate() +' '+ date.getHours() +':'+ date.getMinutes();
        var text = `
          <tr id="panoram`+result.id+`" data-id="`+result.id+`">
            <td>Новая панорама</td>
            <td style="text-align: center">Загрузите архив</td>
            <td style="text-align: center">53.388019, 59.075146</td>
            <td style="text-align: center">`+date+`</td>
            <td style="text-align: right">
              <div class="edit-panoram btn" onclick="edit(this)"><i class="fa fa-edit"></i></div>
              <div class="remove-panorama btn" onclick="remove(this)" data-id="`+result.id+`"><i class="fa fa-remove"></i></div>
            </td>
          </tr>`;
        $('.table-hover tbody').append(text);
  		}
  	});
  });

}

function edit(elem) {
	var elem = $(elem).parent().parent().find('td');
  console.log(elem);
	var id = elem.parent().data('id');
	$('.edit-title').val($(elem[0]).text());
	$('.edit-zip').text($(elem[1]).text());
  $('.edit-coord').val($(elem[2]).text());
	$('.edit-date').val($(elem[3]).text().replace(/ /g,'T'));
	$('.hidden-edit-block').find('h2 span').text(id);
	$('.section-content').animate({
			scrollTop: 0
	}, 300, function () {
		$('.hidden-edit-block').show(300);
	});
}

function remove(elem) {
  console.log('remove');
	$.post('/api/panorams/removePanoram', {
		id: $(elem).parent().parent().data('id')
	})
	.done(function (result) {
		if (result.status == 'ok') {
			$(elem).parent().parent().hide(200, function () {
				$(elem).parent().parent().remove();
			})
		}
	});
}


















//--------------------
