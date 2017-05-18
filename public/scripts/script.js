viewService.init();

httpService.makeRequest(
	'POST',
	'/login',
	JSON.stringify({
		login: 'Vanvan',
		password: '123456'
	})
);
