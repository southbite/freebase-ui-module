function freebaseUI() {

	var _this = this;
	var http = require('http');

	_this.settings = {};

	_this.start = function(options, callback){
		try{

			if (!options)
				options = {};

			if (options['run-freebase'] && !options['freebase-config']){
				options['freebase-config'] = {
					mode:"embedded"
				};
				options['freebase-port'] = 8000;
				options['freebase-ip'] = '127.0.0.1';
			}

			_this.settings['freebase-ip'] = options['freebase-ip']?options['freebase-ip']:'127.0.0.1';
			_this.settings['freebase-port'] = options['freebase-port']?parseInt(options['freebase-port']):8000;
			_this.settings['freebase-ui-port'] = options['freebase-ui-port']?parseInt(options['freebase-ui-port']):9999;
			_this.settings['run-freebase'] = options['run-freebase']?options['run-freebase']:false;
			
			var startFreebase = function(done){
				_this.freebaseService = require('freebase').service;
				_this.freebaseService.initialize
				(
					options['freebase-config'], 
					function(e){
						if (!e){
							console.log('Initialized freebase service on port ' + _this.settings['freebase-port']);
							done();
						}else{
							console.log('Failed to initialize freebase service: ' + e);
							done(e);
						}
					}
				);
			}

			var express = require('express');
			var app = express();

			app.use(express.bodyParser());
			app.use(express.cookieParser());
			app.use(express.static(__dirname+'/app'));

			//we proxy to the freebase instance - wherever it may be...
			app.get('/browser_client', function(req, res){
			  
				var options = {
				  hostname: _this.settings['freebase-ip'],
				  port: _this.settings['freebase-port'],
				  path: '/browser_client',
				  method: 'GET'
				};

				var connector = http.request(options, function(freebase_res) {
				  freebase_res.pipe(res, {end:true});//tell 'response' end=true
				});

				req.pipe(connector, {end:true});

			});

			app.get('/browser_primus.js', function(req, res){
			  
				var options = {
				  hostname: _this.settings['freebase-ip'],
				  port: _this.settings['freebase-port'],
				  path: '/browser_primus.js',
				  method: 'GET'
				};

				var connector = http.request(options, function(freebase_res) {
				  freebase_res.pipe(res, {end:true});//tell 'response' end=true
				});

				req.pipe(connector, {end:true});

			});

			app.get('/', function(req, res){
			  res.sendfile(__dirname+'/app/index.htm');
			});



			var startUIService = function(){
				app.listen(_this.settings['freebase-ui-port']);
				console.log('Initialized freebase ui portal on port ' + _this.settings['freebase-ui-port']);
				console.log('You can now navigate to "http://localhost:' + _this.settings['freebase-ui-port'] + '" locally');
				console.log('Or to "http://<external ip of this device>:' + _this.settings['freebase-ui-port'] + '" from a different device');
				callback(null);
			}

			if (_this.settings['run-freebase']){
				startFreebase(function(e){
					if (e) return callback(e);
					startUIService();
				});
			} else startUIService();
				
		}catch(e){
			callback(e);
		}
	}
	_this.stop = function(callback){

	}
}

module.exports = freebaseUI;

