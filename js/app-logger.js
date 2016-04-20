"use strict"
/**
* app-logger Module
*
* Description
*/
angular.module('app-logger', [])
	.service('logger', function(){
		var loggerLevel = "debug";
		var logger = {
			"d": null, //debug
			"l": null, //log
			"i": null, //info
			"e": null, //error
			"w": null //warning
		};
		var stub = () => {};
		logger.setLoggerLevel = (level) => {
			switch (level) {
				case "debug" : {
					logger.d = console.debug;
					logger.i = console.info;
					logger.l = console.log;
					logger.e = console.error;
					logger.w = console.warn;
					break;
				}
				case "release" : {
					logger.d = stub;
					logger.i = stub;
					logger.l = stub;
					logger.e = stub;
					logger.w = stub;
					break;
				}
				default : {
					console.warn("attempt to set non-implemented logger output method")
				}
			}
		}
		return logger;
	})