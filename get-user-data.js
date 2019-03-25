'use strict';

// When using fetch api
const getUserUrl = 'https://w3c484vqwa.execute-api.ap-northeast-1.amazonaws.com/dev/users/user-profile';

fetch(getUserUrl, {
	method: 'POST',
	mode: 'cors',
	body: {
		'line_id': 'U1e405a0b62ce2a2173de7eac77afaa0b' // あとでここwindow.onloadしたときのline idを入れるッッ!!
	},
	headers: {
		'Content-Type':'application/json'
	}
}).then(function(json) {
	console.log(json);
	const responseBody = JSON.parse(json);
	let users;
	for (let i = 0; i < responseBody.User.length; i++) {
		users = '<option value="'
			+ JSON.stringify(responseBody.User[i].user_id) 
			+ '">' 
			+ JSON.stringify(responseBody.User[i].user_name)
			+ '</option>';
	};
	document.getElementById('wrap-users').innerHTML = users; 	
}).catch(function(error) {
	console.log(error);
});

// When using request module
/* 
const request = require('request');
const headers = {
	'Content-Type':'application/json'
};

const options = {
	url: 'https://w3c484vqwa.execute-api.ap-northeast-1.amazonaws.com/dev/users/user-profile',
	method: 'GET',
	headers: headers,
	json: true
};

const callback = (err, res, body) => {
	if (res.StatusCode==200) {
		const responseBody = JSON.parse(body);
		let users;
		for (let i = 0; i < body.User.length; i++) {
			users = '<option value="'
				+ JSON.stringify(body.User[i].user_id) 
				+ '">' 
				+ JSON.stringify(body.User[i].user_name)
				+ '</option>'
		};
		document.getElementById('wrap-users').innerHTML = users; 
	} else {
		alert("エラーが発生しました。もう一度このページを開いてみてください。")
	}
};

request.post(options, callback);
*/