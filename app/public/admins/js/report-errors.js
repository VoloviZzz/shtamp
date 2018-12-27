$(document).ready(() => {
	const Reports = {
		init() {

			Reports.selectedCheckbox = [];

			$('.change-status-report').on('click', Reports.changeStatus);
			$('.delete-report').on('click', Reports.delete);
			$('.js-error-checkbox').on('click', Reports.toggleCheckbox);
			$('.js-delete-selected').on('click', Reports.deleteSelected);
			$('.js-finish-selected').on('click', Reports.finishSelected);
		},

		delete() {

			if (!confirm('Удалить выбранный отчёт?')) return false;

			let id = this.dataset.id;

			Reports.sendPost({ ctrl: 'delete_report', id });
		},

		changeStatus() {
			if (!Reports.confirm(this)) return false;
			Reports.sendPost({ ctrl: 'change_status_report', id: this.dataset.id, value: this.dataset.status });
		},

		toggleCheckbox() {
			const $this = $(this);
			const thisId = $this.data('id');
			const thisChecked = $this.prop('checked');

			if (thisChecked === true) {
				Reports.selectedCheckbox.push(thisId);
			}
			else {
				const indexInArray = Reports.selectedCheckbox.indexOf(thisId);
				indexInArray != '-1' ? Reports.selectedCheckbox.splice(indexInArray, 1) : false;
			}
		},

		deleteSelected() {

			if (Reports.selectedCheckbox.length < 1) {
				return alert('Для удаления необходимо выбрать хотя бы один отчёт');
			}

			if (!confirm('Удалить выбранные ошибки?')) return false;

			const ids = Reports.selectedCheckbox.join(',');

			Reports.sendPost({ ctrl: 'delete_report_by_ids', ids });
		},

		finishSelected() {
			if (Reports.selectedCheckbox.length < 1) {
				return alert('Для завершения необходимо выбрать хотя бы один отчёт');
			}

			if (!confirm('Завершить выбранные отчёты?')) return false;

			const ids = Reports.selectedCheckbox.join(',');

			Reports.sendPost({ ctrl: 'change_status_report_by_ids', ids, value: '0' });
		},

		sendPost(data) {
			return $.post('/api/report-error/' + data.ctrl, data).done(result => {
				if (result.status == 'ok') {
					return location.reload();
				}
				else {
					return alert(result.data);
				}
			})
		},

		confirm(elem) {
			return confirm(`Отчёт #${elem.dataset.id} - ${elem.textContent}?`);
		}
	};

	Reports.init();
})