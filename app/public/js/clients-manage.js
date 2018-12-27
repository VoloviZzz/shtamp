'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(function () {
	var Clients = function () {
		function Clients() {
			_classCallCheck(this, Clients);
		}

		_createClass(Clients, [{
			key: 'searchClients',
			value: function searchClients(value) {
				var _this = this;

				var postData = { value: value };

				$.post("/api/clients/search", postData).done(function (result) {
					var clients = JSON.parse(result.data);
					$('#clients-list').html(_this.renderClientsList(clients));
				}).catch(function (error) {
					return alert('В работе сайте возникла ошибка. Обратитесь к администратору сайта.');
				});
			}
		}, {
			key: 'renderClientsList',
			value: function renderClientsList() {
				var clients = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


				var resultHtml = '';

				if (clients.length < 1) {
					resultHtml = 'Никого не найдено';
					return resultHtml;
				}

				/*clients.map(function (c) {
					resultHtml += `
						<div class="client-card">
							<div class="client-card__title">
								<h2>#${c.id} - ${c.surname} ${c.firstname} ${c.patronymic}</h2>
								<ul class="text-left">
									<li>Электронный адрес: <a class="page-link" href="mailto:${c.mail}">${c.mail}</a></li>
									<li>Номер телефона: <a class="page-link" href="callto:${c.phone}">${c.phone}</a></li>
									<label>
										Администратор:
										${c.admin ? 
											`<button class="btn js-clients-toggleAdmin" data-user-id="${c.id}" value="0">Убрать администратора</button>` :
											`<button class="btn js-clients-toggleAdmin" data-user-id="${c.id}" value="1">Сделать администратором</button>`
										}
									</label>
								</ul>
							</div>
						</div>
					`;
				});*/
				clients.map(function (c) {
					resultHtml += `
						<tr>
							<td class="tbody-p">${c.surname} ${c.firstname} ${c.patronymic}</td>
							<td class="tbody-p">${c.mail}</td>
							<td class="tbody-p">${c.phone}</td>
							<td style="text-align: right">
							${c.admin ? 
								`<button class="btn js-clients-toggleAdmin" data-user-id="${c.id}" value="0">Убрать администратора</button>` :
								`<button class="btn js-clients-toggleAdmin" data-user-id="${c.id}" value="1">Сделать администратором</button>`
							}
							</td>
						</tr>
					`;
				});

				return resultHtml;
			}
		}, {
			key: 'toggleAdmin',
			value: function toggleAdmin(_ref) {
				var userId = _ref.userId,
					value = _ref.value;

				var target = 'admin';
				value = value ? '1' : '0';

				$.post('/api/clients/toggleAdmin', { target: target, value: value, id: userId }).done(function (data) {
					if (data.status !== 'ok') {
						console.log(data);
						alert(data.message);
					} else {
						location.reload();
					}
				}).catch(function (error) {
					return alert('В работе сайте возникла ошибка. Обратитесь к администратору сайта.');
				});
			}
		}]);

		return Clients;
	}();

	var clients = new Clients();

	$('.clients-search__input').on('input', function (e) {
		return clients.searchClients(this.value);
	});

	$('#clients-list').on('click', '.js-clients-toggleAdmin', function (e) {
		if (!confirm(this.textContent + '?')) return false;

		return clients.toggleAdmin({ userId: this.dataset.userId, value: this.value });
	});
});