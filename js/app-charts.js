/**
* app-output Module
*
* Description
*/
angular.module('app-charts', ['app-core']).	
	service('chartService', ['$log', 'calculateService', 'treeDataService', 'globalConfigService', 
	function ($log, calculateService, treeDataService, globalConfigService){
		//KAV: check later whether angular.copy required. it seems that it's absent brake nothing
		//but who knows exactly..

		var _cs = this;

		var chartState = {
			activeCharts : {
				lambdaChart : true,
				barChart : false
			},
			switchTo : function (chartName){
				for (var chart in this.activeCharts){
					this.activeCharts[chart] = false;
				}
				this.activeCharts[chartName] = true;
			},
			getActiveChart : function (){
				var activeChart;
				for (chartName in this.activeCharts){
					if (this.activeCharts[chartName] === true){
						activeChart = chartName;
					}
				}
				return activeChart;
			}
		};
		
		this.getChartState = function (){
			return chartState.activeCharts;
		}

		this.updateCharts = function (element){
			// if (!globalConfigService.online){
			// 	return;
			// }
			checkChartType(element);
			switch (chartState.getActiveChart()){
				case "lambdaChart": {
					_cs.updateLambdaChart(_cs.generateLambdaData(element));
					break;
				}
				case "barChart": {
					_cs.updateBarChart(_cs.generateBarChartData(element));
					break;
				}
				default: {
					throw 'updateCharts. no charts selected';
				}
			}
		}

		this.updateLambdaChart = function(chartArray){
			// if (!globalConfigService.online){
			// 	return;
			// }
			// chartState.switchTo("lambdaChart");
			var data = google.visualization.arrayToDataTable(chartArray);
	      	var options = {
		        title: 'Lambda(t)',
		        pointsSize: "2",
		        legend: 'left',
		        vAxis: {
		        	title: 'lambda',
		        	format: 'scientific'
		        },
		        hAxis: {
		        	title: 'temperature (Celcius)'
		        }
	      	};
	      	var chart = new google.visualization.LineChart(document.getElementById('charts'));

	      	chart.draw(data, options);
	      	// $log.info(chartState);
		}

		this.updateBarChart = function(chartArray){
			// if (!globalConfigService.online){
			// 	return;
			// }
			// chartState.switchTo("barChart");
			var data = google.visualization.arrayToDataTable(chartArray);
	      	var options = {
		        title: 'Вклад в общую ненадежность %',
		        legend: 'left',
		        pointsSize: "2",
		        vAxis: {
		        	title: '%'
		        },
		        hAxis: {
		        	title: 'elements'
		        },
		        bars: "horizontal"
	      	};
	      	var chart = new google.visualization.ColumnChart(document.getElementById('charts'));

	      	chart.draw(data, options);
	      	$log.info(chartState);
		}

		this.generateLambdaData = function (element){
			switch (element.type) {
				case "element": {
					return generateElementLambdaData(element);
				}
				case "module": {
					return generateModuleLambdaData(element);
				}
				default : {
					throw "generateLambdaData error. undefined type of element"
				}
			} 
		}

		var generateElementLambdaData = function (element){
			var lambdaDataArray = [];
			lambdaDataArray[0] = ['temperature', 'lambda'];
			var keysArray = calculateService.initKeys(element);
			for(var t = -100; t <= 200; t+=10){
				keysArray.forEach(function (item){
					if (item.key == "Tn" || item.key == "T"){
						item.value = t;
					}

				})
				var varObj = calculateService.calculateCoefficients(element, keysArray);
				var coefficientsOut = calculateService.extendVarObjWithCoefs(element, varObj);
				calculateService.calculateModel(element, varObj);
				lambdaDataArray.push([t.toString() , element.modelValue])
			}
			return lambdaDataArray;
		}

		var generateModuleLambdaData = function (module){
			var summaryLambdaChartArray = []; 
			var children = treeDataService.getChildrenArray(module);
			angular.forEach(children, function(child){
				// generating chart data	
				var lambdaChartArray = generateElementLambdaData(angular.copy(child));
				if (summaryLambdaChartArray.length === 0){
					summaryLambdaChartArray = lambdaChartArray;
				}
				else{
					summaryLambdaChartArray.forEach(function (sumItem, index){
						if (index === 0) return; //cause it is used for axis labels
						sumItem[1] += lambdaChartArray[index][1];
					})
				}
			});
			return summaryLambdaChartArray;
		}

		//for element.type == 'module' only
		this.generateBarChartData = function (element){
			if (element.type === "element"){
				return ['impossible to generate bar data fro single element']
			}
			var summaryPercentChartArray = [];
			var children = treeDataService.getChildrenArray(element);
			summaryPercentChartArray[0] = ['asdasd', 'Вклад'];
			//know when we know total lambda we can calculate percent per item;
			angular.forEach(children, function (child){
				var item = [];
				item.push(child.name);
				item.push(child.modelValue / element.summaryModelValue * 100);
				summaryPercentChartArray.push(item);
			})
			return summaryPercentChartArray;
		}

		this.switchCharts = function (element){
			if (chartState.activeCharts.barChart){
				chartState.switchTo("lambdaChart");
			}
			else{
				chartState.switchTo("barChart");
			}
			_cs.updateCharts(element);
		}

		var checkChartType = function (element){
			if (element.type === 'element' && chartState.activeCharts['barChart'] === true){
				chartState.switchTo("lambdaChart");
			}
		}
	}]).
	controller('OutputCTRL', ['$scope', 'chartService', function ($scope, chartService){
		// $scope.activeChart = {};
		// $scope.activeChart.value = 'lambdaChart';
		$scope.activeChart = chartService.getChartState();
		$scope.switchCharts = function (){
			chartService.switchCharts($scope.selectedNode);
		}
	}]).
	run(['$log', function($log){
		$log.info('app-output initialized successfully');
	}])