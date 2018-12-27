function Map (map, zoom, lat, lng) {

	console.log('Map constructor');

  this.polygon;
	this.mapID = map;
  this.polyline;
  this.polyline_array = [];
  this.marker = [];
  this.dot = [];
  this.polygon_bool = false;
  this.polyline_bool = false;
  this.adding_bool = false;
  this.pligon_array = [];
  this.center = [lat, lng];
  this.zoom = zoom;
  this.editDot = [];
  this.areasPolygon = [];
  this.roadsPolyline = [];
  this.edit = false;




	this.init(map, zoom, lat, lng);
}


Map.prototype.init = function (map, zoom, lat, lng) { // Инициализация

	console.log('Map initMap');

    this.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{             // создание слоя тайлов от openstreetmap
      maxZoom: 22
    });

    this.mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {  // создание слоя тайлов от mapbox
        maxZoom: 22,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoidm9sb3Zpenp6IiwiYSI6ImNqbDIxa3ZmNzFscHMzd2xtMHA2dXRseHIifQ.RQoROZMMQMT-y2Aab-HuUQ'
    });

    this.mapbox_dark = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', { // создание слоя тайлов от mapbox - тёмная версия
        maxZoom: 22,
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1Ijoidm9sb3Zpenp6IiwiYSI6ImNqbDIxa3ZmNzFscHMzd2xtMHA2dXRseHIifQ.RQoROZMMQMT-y2Aab-HuUQ'
    });

    this.google = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{ // создание слоя тайлов от google
        maxZoom: 22,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    this.baseMaps = {                        // объект с именами слоёв
      "OpenStreetMap": this.osm,
      "MapBox Street": this.mapbox,
      "MapBox Dark": this.mapbox_dark,
      "Google": this.google
    };


  this.map = L.map(this.mapID, {      // Инициализация карты
      center: this.center,
      zoom: this.zoom
      // layers: this.mapbox
      // drawControl: true
  });

	  this.mapbox.addTo(this.map);
  // L.control.layers(this.baseMaps).addTo(this.map); //вставка слоёв в карту

  this.markers = L.markerClusterGroup({
    spiderfyOnMaxZoom :  true,
    showCoverageOnHover :  false,
    zoomToBoundsOnClick :  false,
    disableClusteringAtZoom : true
  });
  this.square = L.markerClusterGroup({
    spiderfyOnMaxZoom :  true,
    showCoverageOnHover :  false,
    zoomToBoundsOnClick :  false,
    disableClusteringAtZoom : 21
  });

  var classMap = this;

  this.dotIcon = L.icon({
    iconUrl: '/img/dot.png',
    shadowUrl: '/img/marker-shadow.png',
    iconSize:     [20, 20],
    shadowSize:   [20, 20]
});
this.addPolygonConstruct();          //конструктор полигонов
this.addPolylineConstruct();        // конструктор линий

}

Map.prototype.addMarker = function (lat, lng, popup, draggable) {         // добавить маркер
	if (draggable == true) {
		draggable = false;
	}
  var marker = L.marker([lat, lng],
  {
    draggable:draggable
  }).addTo(this.map);
  this.map.addLayer(marker);
  if (popup) {
    marker.bindPopup(popup);
  }
  return marker;
}

Map.prototype.addSquare = function (lat, lng, id, popup, color) {       // добавить квадрат (вообще как бы див 15х15px)
  var myIcon = L.divIcon({
  className: 'square',
  html: '<div style="width:15px; height:15px; background-color: '+color+'3; border: solid 1px '+color+';"></div>'
  });

  var square = L.marker([lat, lng], {
    icon: myIcon,
    draggable:true
  });
  var classMap = this;
  square.on('dragend', function (e) {
    if (classMap.edit) {
      classMap.saveLatLngSquare(this._latlng.lat, this._latlng.lng, id);
    }else {
      this.setLatLng([lat, lng]);
      toastr.error('Редактирование не активированно','Ошибка');
    }
  });

  this.square.addLayer(square);                   // группируем объекты

  if (popup == '') {
  }else {
    square.bindPopup(popup);
  }
  return square;
}

Map.prototype.saveLatLngSquare = function (lat, lng, id) {
  var data = {
      route :  'map',
      ctrl : 'saveGrave',
      id : id,
      lat : lat,
      lng : lng
    };

  app.send({data : data})
    .then(data => {

      if (JSON.parse(data).status == 'ok') {
        toastr.success('Захоронение перемещенно','Успех!');
      }else {
        toastr.error(data.error,'Ошибка');
      }

    });
}

Map.prototype.addCircle = function (lat, lng, popup, color) {               // Добавить круг


  var circle = L.circle([lat, lng], {
      color: color,
      fillColor: '#f03',
      fillOpacity: 0.1,
      radius: 0.5
  });
  // .addTo(this.map);

  this.markers.addLayer(circle);                    // группируем объекты

  if (popup == '') {
  }else {
    circle.bindPopup(popup);
  }
  return circle;
}

Map.prototype.addAnyIcon = function (lat, lng, img, popup, door) {           // добавить любую картинку 20х20px
  var IMG = L.icon({
      iconUrl: img,
      shadowUrl: '/img/marker-shadow.png',
      iconSize:     [20, 20],
      shadowSize:   [20, 20]
  });
  var Icon = L.marker([lat, lng],
    {
    draggable:true,
    icon: IMG
    }
  ).addTo(this.map);

  if (door) {
    var classMap = this;
    Icon.on('dragend', function (e) {
      if (classMap.edit) {
        classMap.saveLatLngDoor(this._latlng.lat, this._latlng.lng, door.id, door.entrances, lat, lng);
      }else {
        Icon.setLatLng([lat, lng]);
        toastr.error('Редактирование не активированно','Ошибка');
      }
    });
  }

  if (popup) {
    Icon.bindPopup(popup);
  }
  return Icon;
}


Map.prototype.saveLatLngDoor = function (lat, lng, id, entrances, lat2, lng2) {                    // Сохранить позицию двери
  for (var i in entrances) {
    if (entrances[i].coord.replace(/ /g,'') == lat2+','+lng2) {
      entrances[i].coord = lat+','+lng;
    }
  }
  var data = {
      route :  'map',
      ctrl : 'saveDoor',
      id : id,
      entrances : JSON.stringify(entrances)
    };

  app.send({data : data})
    .then(data => {

      if (JSON.parse(data).status == 'ok') {
        toastr.success('Вход перемещен','Успех!');
      }else {
        toastr.error(data.error,'Ошибка');
      }

    });
}


Map.prototype.addDot = function (lat, lng, popup) {                                   //добавить точку
  var dot = L.marker([lat, lng],
    {
    draggable:true,
    icon: this.dotIcon
    }
  ).addTo(this.map);

  this.dot.push(dot);
                        // помещаем объект в соответствующий массив для возможности группировки и удаления всех объектов сразу.
  if (this.cemeteryEdit) {
    var classMap = this;
    var getlat, getlng;
    dot.on('dragstart', function (e) {
        getlat = this._latlng.lat;
        getlng = this._latlng.lng;
    });
    dot.on('dragend', function (e) {
      if (classMap.cemeteryEdit.status == 'cemetery') {
        classMap.saveLatLngCemeteryOutline(this._latlng.lat, this._latlng.lng, getlat, getlng);
      }else if (classMap.cemeteryEdit.status == 'areas') {
        classMap.saveLatLngAreasOutline(this._latlng.lat, this._latlng.lng, getlat, getlng);
      }else if (classMap.cemeteryEdit.status == 'roads') {
        classMap.saveLatLngRoadsLine(this._latlng.lat, this._latlng.lng, getlat, getlng);
      }else {
        //---не возможно----
      }
    });
  }

  if (popup) {
    dot.bindPopup(popup);
  }
  return dot;
}

Map.prototype.saveLatLngRoadsLine = function (lat, lng, lat2, lng2) {
  var roadsSet = [];
  var countLatLng = 0;
  for (var i in this.roads) {
    var roads = JSON.parse(this.roads[i].points);
    for (var j in roads) {
      if (roads[j][0]+','+roads[j][1] == lat2+','+lng2) {
        roads[j] = [lat, lng];
        countLatLng++;
      }
    }
    roadsSet.push({
      id : this.roads[i].id,
      points : JSON.stringify(roads)
    })
  }
  if (countLatLng != 0) {
    var data = {
        route :  'map',
        ctrl : 'savePointsRoads',
        roads : JSON.stringify(roadsSet)
      };
      app.send({data : data})
        .then(data => {

          if (JSON.parse(data).status == 'ok') {

            var data = {
          			route :  'map',
          			ctrl : 'getRoads',
          			cemetery : this.cemetery.id
          		};

          	app.send({data : data})
          		.then(data => {

          			data = JSON.parse(data);
          			data = data.data;

          			this.roads = data.roads;
          			map.roads = data.roads;

                for (var i in this.roadsPolyline) {
                  this.roadsPolyline[i].remove();
                }

          			for (var i in data.roads) {
          				this.roadsPolyline.push(this.addPolyline(JSON.parse(data.roads[i].points), 'red'));
          			}

          		});

          }else {
            toastr.error(data.error,'Ошибка');
          }
        });
      }else {
        toastr.error('Указанная точка не соответствует ни одной координате квартала','Ошибка');
      }

}

Map.prototype.saveLatLngAreasOutline = function (lat, lng, lat2, lng2) {
  var areasSet = [];
  var countLatLng = 0;
  for (var i in this.areas) {
    var area = JSON.parse(this.areas[i].outline);
    for (var j in area) {
      if (area[j][0]+','+area[j][1] == lat2+','+lng2) {
        area[j] = [lat, lng];
        countLatLng++;
      }
    }
    areasSet.push({
      id : this.areas[i].id,
      outline : JSON.stringify(area)
    })
  }
  if (countLatLng != 0) {
    var data = {
        route :  'map',
        ctrl : 'saveOutlineAreas',
        areas : JSON.stringify(areasSet)
      };
      app.send({data : data})
        .then(data => {
          if (JSON.parse(data).status == 'ok') {
            var data = {
                route :  'map',
                ctrl : 'getAreas',
                cemetery : this.cemetery.id
              };
            app.send({data : data})
              .then(data => {
                data = JSON.parse(data);
                data = data.data;
                this.areas = data.areas;
                map.areas = data.areas;
                for (var i in this.areasPolygon) {
                  this.areasPolygon[i].remove();
                }
                for (var i in data.areas) {
                  this.areasPolygon.push(this.addPolygon(JSON.parse(data.areas[i].outline), 'blue'));
                }
              });
          }else {
            toastr.error(data.error,'Ошибка');
          }
        });
      }else {
        toastr.error('Указанная точка не соответствует ни одной координате квартала','Ошибка');
      }
}

Map.prototype.saveLatLngCemeteryOutline = function (lat, lng, lat2, lng2) {

  var outline = JSON.parse(this.cemetery.outline);
  var countLatLng = 0;
  for (var i in outline) {
    for (var j in outline[i]) {
      if (outline[i][j][0]+','+outline[i][j][1] == lat2+','+lng2) {
        outline[i][j] = [lat, lng];
        countLatLng++;
      }
    }
  }
  if (countLatLng != 0) {
    var data = {
        route :  'map',
        ctrl : 'saveOutlineCemetery',
        id : this.cemetery.id,
        outline : JSON.stringify(outline)
      };

    app.send({data : data})
      .then(data => {

        if (JSON.parse(data).status == 'ok') {
          var data = {
        			route :  'map',
        			ctrl : 'getCemetery',
        			cemetery : this.cemetery.id
        		};

        	app.send({data : data})
        		.then(data => {
              data = JSON.parse(data);
        			data = data.data;
        			this.cemetery = data.cemetery;
        			map.cemetery = data.cemetery;
              this.cemeteryPolygon.remove();
        			this.cemeteryPolygon = this.addPolygon(JSON.parse(data.cemetery.outline), 'red');
              toastr.success('Границы кладбища изменены','Успех!');
        		});
        }else {
          toastr.error(data.error,'Ошибка');
        }
      });
  }else {
    toastr.error('Указанная точка не соответствует ни одной координате кладбища','Ошибка');
  }
}

Map.prototype.addLabel = function (lat, lng, text, lvl) {                               // добавить надпись
  var myIcon = L.divIcon({
  className: 'label-into-map',
  html: '<h'+lvl+' style="width:200px">'+text+'</h'+lvl+'>'
  });

  L.marker([lat, lng], {icon: myIcon}).addTo(map.map);
}

Map.prototype.addPolygon = function (outline, color, fitBounds) {                                       //добавить полигон
  var polygon = L.polygon(outline,{color: color}).addTo(this.map);
  if (fitBounds) {
    this.map.fitBounds(polygon.getBounds());                    // объект в поле зрения
  }
  return polygon;
}

Map.prototype.addPolyline = function (outline, color, fitBounds) {                                  //добавить ломаную линию
  var polyline = L.polyline(outline,{color: color}).addTo(this.map);
  if (fitBounds) {
    this.map.fitBounds(polygon.getBounds());                        // объект в поле зрения
  }
  return polyline;
}

Map.prototype.addPolygonConstruct = function (popup) {      //конструктор полигонов
  var classMap = this;
  this.map.on('click', function (e) {
    if (classMap.polygon_bool == true) {
      classMap.pligon_array.push([e.latlng.lat, e.latlng.lng]);
      if (classMap.polygon) {
        classMap.polygon.remove();
      }
      var dot = classMap.addDot(e.latlng.lat, e.latlng.lng);
      classMap.polygon = L.polygon(classMap.pligon_array,).addTo(this).bindPopup('<div onclick="map.savePolygon()" class="btn btn-success">Сохранить</div><div  onclick="map.removePolygon()" class="btn btn-danger">Удалить</div>');
    }else {
      if (popup) {
        L.popup()
        .setLatLng(e.latlng)
        .setContent(popup)
        .openOn(this);
      }
    }
  });

}

                                                                                        // рисование ломаной линии
Map.prototype.addPolylineConstruct = function (popup) {
  var classMap = this;
  this.map.on('click', function (e) {
    if (classMap.polyline_bool == true) {
          classMap.polyline_array.push([e.latlng.lat, e.latlng.lng]);
          if (classMap.polyline) {
            classMap.polyline.remove();
          }
          var dot = classMap.addDot(e.latlng.lat, e.latlng.lng);
          classMap.polyline = L.polyline(classMap.polyline_array, {color: 'red'}).addTo(this).bindPopup('<div onclick="map.savePolyline()" class="btn btn-success">Сохранить</div><div  onclick="map.removePolyline()" class="btn btn-danger">Удалить</div>');
    }else {
      if (popup) {
        L.popup()
        .setLatLng(e.latlng)
        .setContent(popup)
        .openOn(this);
      }
    }
  });

}

                                                              // возвращает массив точек созданной линии
Map.prototype.savePolyline = function () {
  console.log(JSON.stringify(this.polyline_array));
  this.polyline_array = [];
}


Map.prototype.removePolyline = function () {                        // удалить ломаную линию
  for (var i = 0; i < this.dot.length; i++) {
    this.dot[i].remove();
  }
  this.polyline.remove();
  this.polyline_array = [];
}

Map.prototype.savePolygon = function () {                           // возвращает массив точек созданного полигона
  console.log(JSON.stringify(this.pligon_array));
  this.pligon_array = [];
}


Map.prototype.removePolygon = function () {       // удалить полигон
  for (var i = 0; i < this.dot.length; i++) {
    this.dot[i].remove();
  }
  this.polygon.remove();
  this.pligon_array = [];
}

Map.prototype.clearMap = function () {          // очистить карту | переинициализировать
  this.center = [this.map._lastCenter.lat, this.map._lastCenter.lng];
  this.zoom = this.map._zoom;
  this.map.remove();
  this.map = L.map(this.mapID, {
      center: this.center,
      zoom: this.zoom,
      layers: this.google
  });

  // L.control.layers(this.baseMaps).addTo(this.map);
  this.addPolygonConstruct();
  this.addPolylineConstruct();
  this.polyline_array = [];
  this.marker = [];
  this.dot = [];
  this.polygon_bool = false;
  this.polyline_bool = false;
  this.adding_bool = false;
  this.pligon_array = [];
}


Map.prototype.setCenter= function (latlng) {                                 // установить центер
  this.center = [this.map._lastCenter.lat, this.map._lastCenter.lng];
  // this.zoom = this.map._zoom;
  this.map.remove();
  this.center = [latlng.replace(/ /g,'').split(',')[0], latlng.replace(/ /g,'').split(',')[1]];

  this.map = L.map(this.mapID, {
      center: this.center,
      zoom: this.zoom
      // layers: this.
  });
	this.mapbox.addTo(this.map);

  // L.control.layers(this.baseMaps).addTo(this.map);
  // this.map.options.crs = L.CRS.EPSG3395;
  this.addPolygonConstruct();
  this.addPolylineConstruct();
  this.polyline_array = [];
  this.marker = [];
  this.dot = [];
  this.polygon_bool = false;
  this.polyline_bool = false;
  this.adding_bool = false;
  this.pligon_array = [];
}

Map.prototype.edittable = function (object, id) {         // Включить редактирование
  this.unedittable();
  this.edit = true;
  if (object == 'cemetery') { //редактирование контура кладбища
    this.cemeteryEdit = {
      status : 'cemetery',
      cemeteryId : this.cemetery.id
    };
    var outline = JSON.parse(this.cemetery.outline);
    for (var i in outline) {
      for (var j in outline[i]) {
        this.editDot.push(this.addDot(outline[i][j][0], outline[i][j][1]));             // добавляем в массив созданую по контуру точку редактирования.
      }
    }
  }else if (object == 'areas') {              //редактирование контура кварталов
    this.cemeteryEdit = {
      status : 'areas'
    };
    for (var i in this.areas) {
      var area = JSON.parse(this.areas[i].outline);
      for (var j in area) {
        if (id) {
          if (id == this.areas[i].id) {
            this.editDot.push(this.addDot(area[j][0], area[j][1]));             // добавляем в массив созданую по контуру точку редактирования.
          }
        }else {
          this.editDot.push(this.addDot(area[j][0], area[j][1]));             // добавляем в массив созданую по контуру точку редактирования.
        }
      }
    }
  }else if (object == 'roads') {              //редактирование дорог
    this.cemeteryEdit = {
      status : 'roads'
    };
    for (var i in this.roads) {
      var roads = JSON.parse(this.roads[i].points);
      for (var j in roads) {
        if (id) {
          if (id == this.roads[i].id) {
            this.editDot.push(this.addDot(roads[j][0], roads[j][1]));             // добавляем в массив созданую по контуру точку редактирования.
          }
        }else {
          this.editDot.push(this.addDot(roads[j][0], roads[j][1]));             // добавляем в массив созданую по контуру точку редактирования.
        }
      }
    }
  }else {
    toastr.error('Не указан объект редактирования','Ошибка');
  }
}


Map.prototype.unedittable = function () {               // выключить редактирование
  this.edit = false;
  for (var i in this.editDot) {
        this.editDot[i].remove();   // удаляем точки редактирования.
  }
}







Map.prototype.addWoterMark = function () {                          // Добавить водяной знак. или картинку на карту.
  // L.Control.Watermark = L.Control.extend({
  //     onAdd: function(map) {
  //         var img = L.DomUtil.create('img');
  //         img.src = '/img/brain.png';
  //         L.DomEvent.on(img, 'click', function () {
  //           $(this._container).toggleClass('inset');
  //           if (classMap.adding_bool == false) {
  //             classMap.adding_bool = true;
  //
  //           }else {
  //             classMap.adding_bool = false;
  //           }
  //         }, this);
  //         return img;
  //     },
  //
  //     onRemove: function(map) {
  //         // Nothing to do here
  //     }
  // });
  //
  // L.control.watermark = function(opts) {
  //     return new L.Control.Watermark(opts);
  // }
  //
  // L.control.watermark({ position: 'topleft' }).addTo(this.map);
}


































//------------
