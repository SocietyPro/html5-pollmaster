var japi;
if(Cambrian.JAPI !== undefined){
  japi = Cambrian.JAPI();
} else {
  // use mocks
  japi = Cambrian.mockJAPI();
}

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
      $scope.pollToCustomize = poll;
      $scope.poll = angular.copy(poll);
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
      $scope.poll = angular.copy(pollObject);
      $location.path("/createPoll/customize");
    };

    $scope.savePollCustomization = function(){
      $scope.pollToCustomize = $scope.poll;
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
});

pollApp.controller("pollResultsCtrl", function ($scope) {

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
});

pollApp.controller("manageTemplatesCtrl", function ($scope){
});

pollApp.controller("createPollCtrl", function ($scope){
  $scope.recentPolls = japi.polls.getList();
  $scope.examplePolls = japi.polls.getExamples();
  $scope.myTemplates = japi.polls.getTemplates();
  $scope.peerPolls = japi.polls.getPeerRecommended();
});

pollApp.controller("customizePollCtrl", function ($scope, $location, $controller){
  $controller("pollAppCtrl", {$scope: $scope});
  $scope.isPoll = true;
  $scope.isTemplate = false;
  $scope.saveButtonLabel = "Save";

  $scope.setPollSaveOptions = function(){
    if($scope.isPoll == false){
      $scope.startPollAfterCustomizing = false; // Turn the Start Poll option off
    };
    if($scope.isPoll && $scope.startPollAfterCustomizing){
      $scope.saveButtonLabel = "Save and Start";
    } else {
      $scope.saveButtonLabel = "Save";
    };
  };

  $scope.poll = $scope.poll || japi.polls.build();

  $scope.temporaryPollOptions = {};

  $scope.poll.dateStarted = $scope.poll.dateStarted || new Date();
  $scope.pollTypes = ["Eve Battle Ping", "Vote", "Opinion"];
  $scope.units = ["Minutes", "Hours", "Days", "Weeks", "Months", "Years"];

  $scope.addOption = function () {
    var newOption = { text: "", subgroup: "" };
    if ($scope.temporaryPollOptions.defaultChatRoom) {
      newOption.subgroup = $scope.temporaryPollOptions.defaultChatRoom;
    }
    $scope.poll.options.push(newOption);
  };

  $scope.removeOption = function (option) {
    var index = $scope.poll.options.indexOf(option);

    if (index > -1) {
      $scope.poll.options.splice(index, 1);
    }
  };

  $scope.convertTimeToSeconds = function (length, units) {
    switch(units) {
      case "Minutes":
        $scope.poll.pollTimeLength = length * 60;
        break;
      case "Hours":
        $scope.poll.pollTimeLength = length * 3600;
        break;
      case "Days":
        $scope.poll.pollTimeLength = length * 86400;
        break;
      case "Weeks":
        $scope.poll.pollTimeLength = length * 604800;
        break;
      case "Months":
        $scope.poll.pollTimeLength = length * 2592000;
        break;
      case "Months":
        $scope.poll.pollTimeLength = length * 31536000;
        break;
    }
  };

  $scope.saveCustomization = function(){
    // Called upon user clicking Save in poll customization screen.
    $scope.convertTimeToSeconds($scope.temporaryPollOptions.lifespan, $scope.temporaryPollOptions.timeUnits);
    $scope.poll.status = "unstarted";
    $scope.skeletonPoll = $scope.poll;

    if($scope.isPoll){
      $scope.savePollCustomization();
      if($scope.startPollAfterCustomizing){
        //$scope.poll.start();
      };
    };
    if($scope.isTemplate){
      $scope.saveTemplateCustomization();
    };
    // TODO: ASYNC
    delete $scope.poll;
    delete $scope.pollToCustomize;
    $location.path('/');
  };

});

pollApp.controller("helpCtrl", function($scope){
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
