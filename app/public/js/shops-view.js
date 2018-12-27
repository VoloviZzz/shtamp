// 'use strict';
var map;
var marker;
window.onload = () => {
  var mapCenterCoords = $('#map').data('center').split(',');
  map = new Map('map', 11, mapCenterCoords[0], mapCenterCoords[1]);
  console.log(map);
  map.setCenter(mapCenterCoords[0]+','+mapCenterCoords[1]);
  // map.addMarker(mapCenterCoords[0], mapCenterCoords[1], 'lol', false);
  if ($('#map').data('admin') == true) {
    marker = map.addMarker(mapCenterCoords[0], mapCenterCoords[1], false, true);
    marker.on('dragend', function (e) {
      console.log(e);
      console.log(marker._latlng.lat, marker._latlng.lng);
      $('.js-shopCoords-update').val(marker._latlng.lat+', '+marker._latlng.lng);
      var value = $('.js-shopCoords-update').val().trim();
      var shopId = $('#js-shop-id').val();

  		$.post('/api/shopsList/update', { value: value, id: shopId, target: 'coords' }).done(function (result) {
  			if (result.status !== 'ok') {
  				console.log(result);
  				return alert(result.message);
  			}
  		});
    });
  }else {
    marker = map.addMarker(mapCenterCoords[0], mapCenterCoords[1], false, false);
  }
}
