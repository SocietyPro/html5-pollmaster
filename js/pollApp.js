console.log(angular);
var helloModule = angular.module("pollApp", []) // array is required
  
helloModule.controller("pollAppCtrl", function($scope){
    console.log($scope);
})

