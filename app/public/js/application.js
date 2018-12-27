'use strict';

$(document).ready(function () {


	function pressedEnter(e) {

		e = e || event;

		return (e.keyCode == 13);
	}

	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	window.getParameterByName = getParameterByName;

	if (getParameterByName('postError') == '1') {
		alert('При запросе произошла ошибка. Попробуйте позже')
	}

	const App = {};
	window.App = App;

	//================ Показ/скрытие верхнего меню, при ширине экрана мобильной версии (<992px) ===============//
	/*var g_top = 0;

	if ($(window).width() < 992) {
		$(window).scroll(function () {
			var top = $(this).scrollTop();

			if (top > g_top) {
				$('.document-header').fadeOut(400);
			} else {
				$('.document-header').fadeIn(400);
			}

			g_top = top;
		});
	};*/

	var mainHeader = $('.document-header'),
		belowNavHeroContent = $('.sub-nav-hero');

	//установим переменные
	var scrolling = false,
		previousTop = 0,
		currentTop = 0,
		scrollDelta = 10,
		scrollOffset = 150;

	$(window).on('scroll', function () {
		if (!scrolling) {
			scrolling = true;
			(!window.requestAnimationFrame)
				? setTimeout(autoHideHeader, 250)
				: requestAnimationFrame(autoHideHeader);
		}
	});

	function autoHideHeader() {
		var currentTop = $(window).scrollTop();

		(belowNavHeroContent.length > 0)
			? checkStickyNavigation(currentTop) // secondary navigation below intro
			: checkSimpleNavigation(currentTop);

		previousTop = currentTop;
		scrolling = false;
	};

	function checkSimpleNavigation(currentTop) {
		//there's no secondary nav or secondary nav is below primary nav
		if (previousTop - currentTop > scrollDelta) {
			//if scrolling up...
			mainHeader.removeClass('document-header--hidden');
		} else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
			//if scrolling down...
			mainHeader.addClass('document-header--hidden');
		}
	};

	//================ Кнопка вызова бокового меню ===============//
	if ($('.section-left').length > 0) {
		if ($(window).width() < 992) {
			$('.aside-toggle').show();
		}
	};

	$('.toggle-menu').on('click', function(e){
		$('.menu-center').toggleClass('active');
		$('.menu-right').toggleClass('active');
	});

	// ------------------ Вкладки --------------------------------
	var tabs = document.querySelectorAll(".tab");
	var contents = document.querySelectorAll(".tab-content");
	var $tabsWrap = $(".tabs-titles-wrap");
	var activeClass = "active";

	$tabsWrap.on("click", function (e) {
		if ($(e.target).hasClass("tab")) {
			$(contents).removeClass(activeClass);
			$(tabs).removeClass(activeClass);

			$(".tab").each(function (tabIndex, tab) {
				if (e.target === tab) {
					$(tab).addClass(activeClass);
					$(contents).eq(tabIndex).addClass(activeClass);
				}
			});
		}
	});
	// ------------------ Вкладки --------------------------------

});

// ----------------------------------------------------------------------------------------
function Shop() { };

Shop.prototype.addCategories = function (data) {

	data.parent_id = data.parent_id !== false ? data.parent_id : '';

	let defaultData = {
		level: 0,
		parent_id: ''
	};

	data = Object.assign(defaultData, data);

	$.post('/api/shop/addCategories', data).done(function (result) {
		if (result.status !== 'ok') {
			console.log(result);
			return alert(result.message);
		}

		return location.reload();
	});
};

Shop.prototype.updCategories = function (args) {
	var id = args.id,
		target = args.target,
		value = args.value;

	$.post('/api/shop/updCategories', { id: id, target: target, value: value }).done(function (result) {
		if (result.status !== 'ok') {
			console.log(result);
			return alert(result.message);
		}
	});
};

Shop.prototype.delCategories = function (args) {
	var id = args.id;

	if (confirm('Удалить?') === false) return false;

	$.post('/api/shop/delCategories', { id: id }).done(function (result) {
		if (result.status !== 'ok') {
			console.log(result);
			return alert(result.message);
		}

		return location.reload();
	});
};

Shop.prototype.setPhoto = function (args) {
	var id = args.id,
		target = args.target,
		value = args.value;

	$.post('/api/shop/updCategories', { id: id, target: target, value: value }).done(function (result) {
		if (result.status !== 'ok') {
			console.log(result);
			return alert(result.message);
		}

		return location.reload();
	});
};

Shop.prototype.addPosition = function (_ref4) {
	var _ref4$cat_id = _ref4.cat_id,
		cat_id = _ref4$cat_id === undefined ? false : _ref4$cat_id;


	if (!!cat_id === false) return alert('Отсутствует или неправильный параметр cat_id');

	$.post('/api/goodsPosition/addProduct', { cat_id: cat_id }).done(function (result) {
		if (result.status !== 'ok') {
			console.log(result);
			return alert(result.message);
		}

		return location.reload();
	});
};

// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------
function Forms() { };

Forms.prototype.getFormData = function (form) {
	var returnData = {};
	$(form).serializeArray().map(function (v) {
		return returnData[v.name] = v.value;
	});
	return returnData;
};
// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------
function Slider() { };

Slider.prototype.deleteSlide = function (_ref5) {
	var slide_id = _ref5.slide_id,
		fragment_id = _ref5.fragment_id;

	if (confirm('Удалить слайд?') === false) {
		return false;
	}

	$.post('/api/slider/deleteSlide', { slide_id: slide_id, fragment_id: fragment_id }).done(function (result) {
		if (result.status == 'ok') return location.reload();

		console.log(result);
		alert(result.message);
	});
};

Slider.prototype.updSlide = function (args) {
	var slide_id = args.slide_id,
		fragment_id = args.fragment_id,
		target = args.target,
		value = args.value;

	var afterSuccess = args.afterSuccess;

	$.post('/api/slider/updSlide', { slide_id: slide_id, fragment_id: fragment_id, target: target, value: value }).done(function (result) {
		if (result.status != 'ok') {
			console.log(result);
			return alert(result.message);
		}

		if (afterSuccess == 'reload') {
			return location.reload();
		}
	});
};

Slider.prototype.setImage = function (args) {
	var slide_id = args.slide_id,
		fragment_id = args.fragment_id,
		target = args.target,
		value = args.value;

	$.post('/api/slider/updSlide', { slide_id: slide_id, fragment_id: fragment_id, target: target, value: value }).done(function (result) {

		if (result.status !== 'ok') {
			console.log(result);
			return alert(result.message);
		}

		return location.reload();
	});
};
// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------
function Fragments() { }

Fragments.prototype.add = function (args) {
	var route_id = args.route_id,
		block_id = args.block_id;

	$.post("/api/fragments/add", { route_id: route_id, block_id: block_id }).done(function (result) {
		if (result.status === 'ok') return location.reload();
		console.log(result);
		alert(result.message);
	});
};

Fragments.prototype.changeComponent = function (fragment_id, value) {

	var target = 'component_id';

	$.post('/api/fragments/upd', { value: value, target: target, fragment_id: fragment_id }).done(function (result) {
		if (result.status === 'ok') return location.reload();

		alert(result.message);
	}).catch(function (error) {
		alert('Произошла ошибка. Попробуйте позже');
	});
};

Fragments.prototype.delete = function (fragment_id) {

	if (confirm('Удалить фрагмент?') === false) {
		return false;
	}

	$.post('/api/fragments/del', { fragment_id: fragment_id }).done(function (result) {
		if (result.status === 'ok') return location.reload();

		alert(result.message);
	}).catch(function (error) {
		alert('Произошла ошибка. Попробуйте позже');
	});
};

Fragments.prototype.setData = function (args) {
	var fragment_id = args.fragment_id,
		data = args.data;

	$.post('/api/fragments/setData', { fragment_id: fragment_id, data: JSON.stringify({ body: data }) }).done(function (result) {
		if (result.status !== 'ok') {
			console.log(result);
			return alert(result.message);
		}
	});
};

// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------
function MenuList() { }
MenuList.prototype.addMenuItem = function (_ref10) {
	var title = _ref10.title,
		_ref10$parent_id = _ref10.parent_id,
		parent_id = _ref10$parent_id === undefined ? null : _ref10$parent_id,
		href = _ref10.href,
		menu_id = _ref10.menu_id;

	$.post('/api/menu/addMenuItem', { title: title, parent_id: parent_id, href: href, menu_id: menu_id }).done(function (result) {
		if (result.status == 'ok') return location.reload();

		console.log(result);
		alert(result.message);
	});
};

MenuList.prototype.addMenuGroup = function (_ref11) {
	var title = _ref11.title,
		route_id = _ref11.route_id;

	$.post('/api/menu/addMenuGroup', { title: title, route_id: route_id }).done(function (result) {
		if (result.status == 'ok') return location.reload();

		console.log(result);
		alert(result.message);
	});
};

MenuList.prototype.deleteMenuItem = function (_ref12) {
	var menu_id = _ref12.menu_id;

	if (confirm('Удалить пункт меню?') === false) {
		return false;
	}

	$.post('/api/menu/deleteMenuItem', { menu_id: menu_id }).done(function (result) {
		if (result.status == 'ok') return location.reload();

		console.log(result);
		alert(result.message);
	});
};

MenuList.prototype.updMenuItem = function (_ref13) {
	var id = _ref13.id,
		target = _ref13.target,
		value = _ref13.value;

	$.post('/api/menu/updMenuItem', { id: id, target: target, value: value }).done(function (result) {
		if (result.status == 'ok') return;

		console.log(result);
		alert(result.message);
	});
};
// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------
function RoutesList() { }
RoutesList.prototype.delete = function (routeId) {

	if (!confirm('Удалить маршрут с сайта?')) return false;

	if (!!routeId === false) {
		console.log("У кнопки отсутствует номер маршрута");
		return alert('Что-то пошло не так. Попробуйте позже');
	}

	$.post('/api/routes/del', { id: routeId }).done(function (result) {

		if (result.status == 'ok') {
			return location.reload();
		}

		console.log(result);
		return alert(result.message);
	});
};

RoutesList.prototype.addRoute = function (data) {
	$.post('/api/routes/add', data).done(function (result) {
		if (result.status == 'ok') {
			return location.reload();
		}

		console.log(result);
		return alert(result.message);
	});
};
RoutesList.prototype.updRoute = function (data) {
	$.post('/api/routes/upd', data).done(function (result) {
		if (result.status == 'ok') return location.reload();

		console.log(result);
		return alert(result.message);
	});
};

RoutesList.prototype.showEditForm = function (elem) {
	/*var $this = $(elem);
	var $routeItem = $('td[data-route-id="'+$this.attr('data-route-id')+'"]');

	$routeItem.toggleClass('js-edit-form--show');*/
};




var Alert = undefined;

(function(Alert) {
  var alert, error, info, success, warning, _container;
  info = function(message, title, options) {
    return alert("info", message, title, "fa fa-info-circle", options);
  };
  warning = function(message, title, options) {
    return alert("warning", message, title, "fa fa-exclamation-triangle", options);
  };
  error = function(message, title, options) {
    return alert("error", message, title, "fa fa-minus-circle", options);
  };
  success = function(message, title, options) {
    return alert("success", message, title, "fa fa-check-circle", options);
  };
  alert = function(type, message, title, icon, options) {
    var alertElem, messageElem, titleElem, iconElem, innerElem, _container;
    if (typeof options === "undefined") {
      options = {};
    }
    options = $.extend({}, Alert.defaults, options);
    if (!_container) {
      _container = $("#alerts");
      if (_container.length === 0) {
        _container = $("<ul>").attr("id", "alerts").appendTo($("body"));
      }
    }
    if (options.width) {
      _container.css({
        width: options.width
      });
    }
      alertElem = $("<li>").addClass("alert").addClass("alert-" + type);
      setTimeout(function() {
         alertElem.addClass('open');
      }, 1);
    if (icon) {
      iconElem = $("<i>").addClass(icon);
      alertElem.append(iconElem);
    }
    innerElem = $("<div>").addClass("alert-block");
    alertElem.append(innerElem);
    if (title) {
      titleElem = $("<div>").addClass("alert-title").append(title);
      innerElem.append(titleElem);
    }
    if (message) {
      messageElem = $("<div>").addClass("alert-message").append(message);
      innerElem.append(messageElem);
    }
    if (options.displayDuration > 0) {
      setTimeout((function() {
        leave();
      }), options.displayDuration);
    } else {
      innerElem.append("<em>Click to Dismiss</em>");
    }
    alertElem.on("click", function() {
      leave();
    });
     function leave() {
         alertElem.removeClass('open');
          alertElem.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',  function() { return alertElem.remove(); });
    }
    return _container.prepend(alertElem);
  };
  Alert.defaults = {
    width: "",
    icon: "",
    displayDuration: 3000,
    pos: ""
  };
  Alert.info = info;
  Alert.warning = warning;
  Alert.error = error;
  Alert.success = success;
  return _container = void 0;


})(Alert || (Alert = {}));

this.Alert = Alert;



























// ----------------------------------------------------------------------------------------
