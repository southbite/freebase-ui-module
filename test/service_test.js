
var UIService = require('../lib/service');
var FreebaseUI = new UIService();

FreebaseUI.start({"run-freebase":true}, function(e){

	if (e) return console.log('Failed: ' + e);

	console.log('ui_service started');

});

