console.log(Cambrian.pollApp);
var pollApp = angular.module("pollApp", ["ngRoute"]) // array is required

pollApp.config(function($routeProvider){
  
  $routeProvider.when("/peerLists", {
    templateUrl: "/partials/peerLists.html",
    controller: "peerListsCtrl"
  }).
  when("/manageTemplates", {
    templateUrl: "/partials/manageTemplates.html",
    controller: "manageTemplatesCtrl"
  }).
  when("/createPoll", {
    templateUrl: "/partials/createPoll.html",
    controller: "createPollCtrl"
  }).
  when("/help", {
    templateUrl: "/partials/help.html",
    controller: "helpCtrl"
  }).
  when("/", {
    templateUrl: "/partials/pollsListing.html",
    controller: "pollsListingCtrl"
  }).
  otherwise({
    redirectTo: "/"
  });

});
  
pollApp.controller("pollAppCtrl", function($scope, $location){

    $scope.polls = Cambrian.pollApp.mocks;
    console.log($scope.polls);

    $scope.pollsListingShow = function () {
      $location.path("/");
    };

    $scope.peerListsShow = function(){
      $location.path("/peerLists");
    };

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

pollApp.controller("pollsListingCtrl", function ($scope) {
    console.log($scope);
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
