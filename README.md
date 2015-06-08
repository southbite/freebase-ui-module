freebase-ui-module
==========

*This is an angular ui that allows for the exploration of a freebase instance. 
To get it going:*

- (1) git clone "https://github.com/southbite/freebase-ui-module.git" && cd freebase-ui-module
- (2) npm install
- (3) node test/service_test

The service test starts the freebase ui, and also initializes and an embedded freebase service:

	var UIService = require('../lib/service');
	var FreebaseUI = new UIService();

	FreebaseUI.start({"run-freebase":true}, function(e){

		if (e) return console.log('Failed: ' + e);

		console.log('ui_service started');

	});



