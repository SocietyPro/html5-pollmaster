console.log(Cambrian.pollApp);
var pollApp = angular.module("pollApp", ["ngRoute"]) // array is required

pollApp.config(function($routeProvider){
  
  $routeProvider.when("/peerLists", {
    templateUrl: "/partials/peerLists.html",
    controller: "peerListsCtrl"
  });

  $routeProvider.when("/manageTemplates", {
    templateUrl: "/partials/manageTemplates.html",
    controller: "manageTemplatesCtrl"
  });

  $routeProvider.when("/createPoll", {
    templateUrl: "/partials/createPoll.html",
    controller: "createPollCtrl"
  });

  $routeProvider.when("/help", {
    templateUrl: "/partials/help.html",
    controller: "helpCtrl"
  });

});
  
pollApp.controller("pollAppCtrl", function($scope, $location){
    $scope.peerListsShow = function(){
      $location.path("/peerLists");
    };
    console.log($scope);

    $scope.manageTemplatesShow = function(){
      $location.path("/manageTemplates");
    };

	$scope.createPollShow = function(){
      $location.path("/createPoll");
    };

    $scope.helpShow = function(){
      $location.path("/help");
    };    
});

pollApp.controller("peerListsCtrl", function($scope){
    console.log($scope);
});

pollApp.controller("ManageTemplatesCtrl", function($scope){
    console.log($scope);
});

pollApp.controller("createPollCtrl", function($scope){
    console.log($scope);
});

pollApp.controller("helpCtrl", function($scope){
    console.log($scope);
});
