const sendPost = require('./send_post');
const db = require('../../libs/db');

module.exports = async (data) => {
	try {
		// console.log(data);
		// если пустой массив с позициями, ничего не делать
		if (data.poses.length < 1) return false;

		const { poses, client_info } = data;

		const groupPosesByCrmId = {};

		for (const position of poses) {
			const { connect_id } = position;

			if (!!connect_id === false) continue;

			if (!!groupPosesByCrmId[connect_id] === false) {
				groupPosesByCrmId[connect_id] = [];
			}

			groupPosesByCrmId[connect_id].push(position);
		}

		for (const connect_id of Object.keys(groupPosesByCrmId)) {
			var [error, connectedCrmArray] = await db.execQuery(`SELECT * FROM connected_crm WHERE id = '${connect_id}'`);
			if (connectedCrmArray.length != 1) continue;

			const connectedCrm = connectedCrmArray[0];
			const { host, port, token } = connectedCrm;
			const crmPoses = groupPosesByCrmId[connect_id];

			const sendItemsResult = await sendPost(`http://${host}:${port}/shop_api/`, { data: JSON.stringify({ client_info, poses: crmPoses }), path: 'sales_export', func: 'sales_export' });

			console.log('------>', sendItemsResult);
		}
	} catch (error) {
		console.log(error);
	}
};