$(document).ready(() => {
	google.charts.load('current', { packages: ['corechart', 'bar'] });

	getVisits().then(visits => {
		google.charts.setOnLoadCallback(() => {
			drawVisitsChart(visits);
			drawViewsChart(visits);
		});
	})

	$('#get-period-data').on('click', function () {
		let beginPeriod = $('.period__input[data-period="begin"]').val();
		let endPeriod = $('.period__input[data-period="end"]').val();

		getVisits({ beginPeriod, endPeriod }).then(visits => {
			google.charts.setOnLoadCallback(() => {
				drawVisitsChart(visits);
				drawViewsChart(visits);
			});
		})
	})

	function drawVisitsChart(visits) {
		let chartDataArray = [];

		Object.keys(visits).map(function(v) {
			chartDataArray.push([v, visits[v].visits.length]);
		})

		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Time of Day');
		data.addColumn('number', 'Число визитов');

		data.addRows(chartDataArray);

		var options = {
			title: 'Количество визитов',
			hAxis: {
				title: 'Дата',
			},
			vAxis: {
				title: 'Число визитов'
			}
		};

		var chart = new google.visualization.ColumnChart(document.getElementById('visits-chart'));

		chart.draw(data, options);
	}

	function drawViewsChart(visits) {
		let chartDataArray = [];

		Object.keys(visits).map(v => {
			// chartDataArray.push([v, visits[v].visits.length, visits[v].countViews]);
			chartDataArray.push([v, visits[v].countViews]);
		})

		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Time of Day');
		data.addColumn('number', 'Количество просмотров');
		// data.addColumn('number', 'Число просмотров');

		data.addRows(chartDataArray);

		var options = {
			title: 'Количество просмотров',
			hAxis: {
				title: 'Дата',
				scaleType: 'log'
			},
			vAxis: {
				title: 'Количество просмотров',
				scaleType: 'log'
			},
			colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
		};

		var chart = new google.visualization.ColumnChart(document.getElementById('views-chart'));

		chart.draw(data, options);
	}

	function getVisits(options) {
		return new Promise((resolve, reject) => {
			let postData = {};

			postData = Object.assign(postData, options);

			$.post('/api/attendance/getVisits', postData).done(result => {
				if(result.status !== 'ok') {
					console.log(result);
					return alert(result.message);
				}

				return resolve(result.data);
			})
		})
	}
})
