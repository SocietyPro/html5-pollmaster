var myApp = angular.module('myApp',[]);

// root object
if(Cambrian === undefined || Cambrian.isMockCambrian === true){
  throw("japi.js needs a root object Cambrian.")
};


var Cambrian = Cambrian || {}

var g_chores = {
	list: ["laundry", "lunch", "grapes", "satellite"]
};
var g_file = null;

var Add = function() {
	g_chores.list.push("nothing");
}

myApp.controller('ApiTestController', ['$scope', function($scope) {
  	$scope.greeting = 'Hola!';
    $scope.Cambrian = Cambrian;
    $scope.chores = g_chores;
	$scope.file = null;

    $scope.Add = function() {
    	$scope.chores.list.push("NaNgular " + (new Date())  );
    }
    $scope.Reload = function() {
    	console.log("refresh()");
    	$scope.greeting = new Date();
    }
	$scope.append = function(oPoll) {
		oPoll.addAttatchment(g_name, g_file, g_type);
	}
	$scope.deleteAt = function(at) {
		at.destroy();
	}

}]);


handleFileSelect = function(evt) {
	console.log("aaaaaaaaaa");
	console.log(evt);
	if ( !evt ) return;
	
	var files = evt.target.files;
	var file = files[0];

	if (files && file) {
		var reader = new FileReader();

		reader.onload = function(readerEvt) {
			var binaryString = readerEvt.target.result;
			g_file = btoa(binaryString);
			g_name = file.name;
			g_type = file.type;
			/*
			document.getElementById("atName").value = file.name;
			document.getElementById("atType").value = file.type;
			document.getElementById("base64textarea").value = g_file;
			*/
			scope = angular.element(document.getElementById("ApiTestController")).scope();
			scope.$apply(function() {
				scope.atName = file.name;
				scope.atType = file.type;
				scope.atContent = g_file;
			});
		};
		reader.readAsBinaryString(file);
	}
};

if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}