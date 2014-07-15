console.log(angular);
var helloModule = angular.module("pollApp", ["ngRoute"]) // array is required

helloModule.config(function($routeProvider){
  $routeProvider.when("/peerLists", {
    templateUrl: "/partials/peerLists.html",
    controller: "peerListsCtrl"
  });
});
  
helloModule.controller("pollAppCtrl", function($scope, $location){
    $scope.peerListsShow = function(){
      $location.path("/peerLists");
    };
    console.log($scope);
})

helloModule.controller("peerListsCtrl", function($scope){
    console.log($scope);
})

