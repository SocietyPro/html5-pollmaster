console.log(Cambrian.pollApp);
var pollApp = angular.module("pollApp", ["ngRoute"]) // array is required

pollApp.config(function($routeProvider){
  
  $routeProvider.when("/peerLists", {
    templateUrl: "partials/peerLists.html",
    controller: "peerListsCtrl"
  }).
  when("/manageTemplates", {
    templateUrl: "partials/manageTemplates.html",
    controller: "manageTemplatesCtrl"
  }).
  when("/createPoll", {
    templateUrl: "partials/createPoll.html",
    controller: "createPollCtrl"
  }).
  when("/help", {
    templateUrl: "partials/help.html",
    controller: "helpCtrl"
  }).
  when("/pollResults", {
    templateUrl: "partials/pollResults.html",
    controller: "pollResultsCtrl"
  }).
  when("/", {
    templateUrl: "partials/pollsListing.html",
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

    $scope.pollResultsShow = function (poll) {
      $scope.poll = poll;
      $location.path("/pollResults")
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

pollApp.controller("pollResultsCtrl", function ($scope) {
    console.log($scope);

    $scope.poll = $scope.poll || $scope.polls[0];
    $scope.chartData = [];
    for (var i = 0; i < $scope.poll.options.length; i++) {
      $scope.chartData[i] = {
        label: $scope.poll.options[i],
        data: $scope.poll.counts[i]
      }
    }
});

pollApp.controller("peerListsCtrl", function ($scope){
    console.log($scope);
});

pollApp.controller("manageTemplatesCtrl", function ($scope){
    console.log($scope);
});

pollApp.controller("createPollCtrl", function ($scope){
    console.log($scope);
});

pollApp.controller("helpCtrl", function($scope){
    console.log($scope);
});

pollApp.directive('resultsChart', function () {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {

      var chart = null,
          opts = {
            series: {
              pie: {
                show: true
              }
            },
            legend: {
              show: false
            },
            colors: ["red", "orange", "green", "blue", "purple"]
          }

      scope.$watch(attrs.ngmodel, function (v) {
        if (!chart){
          chart = $.plot(element, v, opts);
          element.show();
        } else {
          chart.setData(v);
          chart.draw();
        }
      });
    }
  }
});