var japi;
if(Cambrian.JAPI !== undefined){
  japi = Cambrian.JAPI();
} else {
  // use mocks
  japi = Cambrian.mockJAPI();
}

console.log(Cambrian.pollApp);
var pollApp = angular.module("pollApp", ["ngRoute", "ui.bootstrap"]) // array is required

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
  when("/createPoll/customize", {
    templateUrl: "partials/customizePoll.html",
    controller: "customizePollCtrl"
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

    $scope.polls = japi.polls.getList();
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

    $scope.customizePollShow = function (poll) {
      $scope.poll = poll;
      $location.path("/createPoll/customize");
    };

    $scope.helpShow = function(){
      $location.path("/help");
    };

    $scope.startCustomizing = function(pollObject){
      // We won't modify or save this until save is clicked:
      $scope.pollToCustomize = pollObject; 

      // We will modify this during our WIP. See saveCustomization for where it
      // gets copied back.
      $scope.skeletonPoll = angular.copy(pollObject);
      $location.path = "/createPoll/customize";
    };

    $scope.saveCustomization = function(isPoll, isTemplate){
      // Called upon user clicking Save in poll customization screen.
      if(isPoll){
        $scope.savePollCustomization();
      };
      if(isTemplate){
        $scope.saveTemplateCustomization();
      };
      // TODO: ASYNC
      delete $scope.skeletonPoll;
      delete $scope.pollToCustomize;
    };

    $scope.savePollCustomization = function(){
      $scope.pollToCustomize = angular.copy($scope.skeletonPoll);
      $scope.pollToCustomize.save();
    };

    $scope.saveTemplateCustomization = function(){
      return undefined;
    };

    $scope.copyPoll = function(oldPoll){
      var newPoll = japi.polls.build(oldPoll);
      $scope.startCustomizing(newPoll);
    };

    $scope.editPoll = function(oldPoll){
      $scope.startCustomizing(oldPoll);
    };

    $scope.newPollFromScratch = function(){
      var newPoll = japi.polls.build();
      $scope.startCustomizing(newPoll);
    };

    $scope.newPollFromTemplate = function(template){
      var newPoll = japi.polls.build(template);
      $scope.startCustomizing(newPoll);
    };
   
    $scope.prettyJSON = function(obj){
      return JSON.stringify(obj, null, 2)
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
    //var allPolls = japi.polls.getList();
    var allPolls = $scope.polls;
    $scope.recentPolls = allPolls.slice(0, 5);
    $scope.examplePolls = allPolls.slice(0, 5);
    $scope.myTemplates = allPolls.slice(0, 5);
});

pollApp.controller("customizePollCtrl", function ($scope){

  $scope.poll = $scope.poll || japi.polls.build();
  console.log('$scope.poll:');
  console.log($scope.poll);
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
