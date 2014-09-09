var japi;
if(Cambrian.JAPI !== undefined){
  console.log('Instantiating japi');
  japi = Cambrian.JAPI();
} else {
  // use mocks
  console.log('Instantiating mock japi');
  japi = Cambrian.mockJAPI();
}

var pollApp = angular.module("pollApp", ["ngRoute", "ui.bootstrap", "ngMaterial", 'nvd3ChartDirectives','ui.date','ui.timepicker']) // array is required

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

pollApp.factory("menu", ['$rootScope', function ($rootScope) {
  var self;
  var filters = [{ filter: 'All', color: '#000000' }, 
                 { filter: 'Votes', color: '#d19b9b' },
                 { filter: 'Running', color: '#92e4c9' },
                 { filter: 'Unstarted', color: '#ffffff' },
                 { filter: 'Completed', color: '#c9d1ff' }];

  return self = {
    filters: filters,

    selectFilter: function(filter) {
      self.currentFilter = filter;
      if (filter.filter === "All") {
        $rootScope.pollFilter = undefined;
      } else if (filter.filter === "Running") {
        $rootScope.pollFilter = "started";
      } else if (filter.filter === "Completed") {
        $rootScope.pollFilter = "complete";
      } else {
        $rootScope.pollFilter = filter.filter.toLowerCase();
      };
    },

    isFilterSelected: function (filter) {
      return self.currentFilter === filter;
    }
  };
}]);

pollApp.directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);

pollApp.controller("pollAppCtrl", function ($scope, $location, $modal, $materialDialog, $materialSidenav, menu){

    $scope.menu = menu;
    $scope.menu.selectFilter(menu.filters[0]);

    $scope.polls = japi.polls.getList();
    $scope.myTemplates = japi.polls.templates.list();
    $scope.exampleTemplates = japi.polls.templates.listExamples();
    $scope.peerRecommendedTemplates = japi.polls.templates.listPeerRecommended();

    $(document).mouseup(function (e) {
        var container = $("#quickAddBox");
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            var scope = angular.element($("#quickAddBox")).scope();
            scope.$apply(function(){
                scope.newPoll = false;
            });       
        }
    });

    $scope.toggleMenu = function () {
      $materialSidenav('left').toggle();
    };

    $scope.filterPolls = function (filter) {
      if (filter.filter === "All") {
        $scope.pollFilter = {status: ''};
      } else {
        $scope.pollFilter = {status: filter.filter};
      }
    };

    $scope.listView = "quilt";

    $scope.streamView = function () {
      $scope.listView = "stream";
    };

    $scope.quiltView = function () {
      $scope.listView = "quilt";
    };

    $scope.overflowToggle = function (poll) {
      poll.overflow = !poll.overflow;
    };

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
      var modalInstance = $modal.open({
        templateUrl: 'partials/help.html',
        controller: "helpCtrl"
      });
    };

    $scope.startCustomizing = function(e, pollObject){
      // We won't modify or save this until save is clicked:
      $scope.pollToCustomize = pollObject; 

      // We will modify this during our WIP. See saveCustomization for where it
      // gets copied back.
      $scope.poll = angular.copy(pollObject);
      var dateTime = new Date();
      $scope.poll.end
      $scope.dialog(e, $scope.poll, $scope.isPoll, $scope.isTemplate);
    };

    $scope.savePollCustomization = function(){
      $scope.pollToCustomize = $scope.poll;
      $scope.pollToCustomize.save();
    };

    $scope.saveTemplateCustomization = function(){
      $scope.templateToCustomize = $scope.poll;
      $scope.templateToCustomize.save();
    };

    $scope.copyPoll = function(e, oldPoll){
      oldPoll.overflow = false;
      var newPoll = japi.polls.build(oldPoll);
      $scope.isPoll = true;
      $scope.isTemplate = false;
      $scope.startCustomizing(e, newPoll);
    };

    $scope.editPoll = function(e, oldPoll){
      $scope.isPoll = true;
      $scope.isTemplate = false;
      $scope.startCustomizing(e, oldPoll);
    };

    $scope.startPoll = function(oldPoll){
      console.log("Starting Poll:");
      oldPoll.start();
    };

    $scope.zoomPoll = function (e, poll) {
      if (poll.status === "unstarted") {
        $scope.editPoll(e, poll);
      } else {
        showPoll(e, poll);
      }
    };

    function showPoll (e, poll) {
      $materialDialog({
        templateUrl: 'partials/showPoll.tmpl.html',
        targetEvent: e,
        controller: ['$scope', '$hideDialog', function ($scope, $hideDialog) {
          $scope.poll = poll;

          $scope.close = function () {
            $hideDialog();
          };

        }]
      });
    };

    $scope.newPollFromScratch = function(e, title, description) {
      var newPoll = japi.polls.build();
      newPoll.title = title;
      newPoll.description = description;
      $scope.isPoll = true;
      $scope.isTemplate = false;
      $scope.startCustomizing(e, newPoll);
      $scope.newPollTitle = "";
      $scope.newPollDescription = "";
      $scope.newPoll = false;
      $scope.quickAddForm.$setPristine();
    };

    $scope.newPollFromTemplate = function(template){
      var newPoll = japi.polls.build(template);
      $scope.isPoll = true;
      $scope.isTemplate = false;
      $scope.startCustomizing(newPoll);
    };

    $scope.destroyPoll = function (poll) {
      poll.destroy();
    };

    $scope.newTemplateFromScratch = function(){
      var newTemplate = japi.polls.templates.build();
      $scope.isPoll = false;
      $scope.isTemplate = true;
      $scope.startCustomizing(newTemplate);
    };

    $scope.newTemplateFromPoll = function (oldPoll) {
      var newTemplate = japi.polls.build(oldPoll);
      $scope.isPoll = false;
      $scope.isTemplate = true;
      $scope.startCustomizing(newTemplate);
    };

    $scope.editTemplate = function(oldTemplate){
      $scope.isPoll = false;
      $scope.isTemplate = true;
      $scope.startCustomizing(oldTemplate);
    };

    $scope.forkTemplate = function (oldTemplate) {
      var newTemplate = japi.polls.templates.build(oldTemplate);
      $scope.isPoll = false;
      $scope.isTemplate = true;
      $scope.startCustomizing(newTemplate);
    };
   
    $scope.destroyTemplate = function(template) {
      template.destroy();
    };

    $scope.prettyJSON = function(obj){
      return JSON.stringify(obj, null, 2)
    };

    $scope.pieWidth = 100;
    $scope.pieHeight = 100;
    $scope.xFunction = function () {
      return function (d) {
        return d.text;
      };
    }
    $scope.yFunction = function () {
      return function (d) {
        return d.count;
      };
    }
    $scope.descriptionFunction = function () {
      return function (d) {
        return d.text;
      };
    }

    $scope.dialog = function (e, poll, isPoll, isTemplate) {
      $materialDialog({
        templateUrl: 'partials/editPoll.tmpl.html',
        targetEvent: e,
        controller: ['$scope', '$hideDialog', '$rootScope', '$timeout', function ($scope, $hideDialog, $rootScope, $timeout) {
          $scope.poll = poll;
          $scope.isPoll = isPoll;
          $scope.isTemplate = isTemplate;
          $scope.ballotPreview = false;
          $scope.optionsMenu = false;

          $scope.close = function () {
            $hideDialog();
          };

          $scope.getTime = function () {
            $scope.poll.endTime = $scope.endTime.toTimeString().substring(0,5);
          };

          $scope.addOption = function () {
            var newOption = { text: $scope.newOptionText, subgroup: "", count: 0 };
            $scope.poll.options.push(newOption);
            $scope.newOptionText = "";
            var index = $scope.poll.options.length - 1;
            $timeout(function () {
              $rootScope.$broadcast('focusedIndex', {focus: index});
            });
          };

          $scope.checkForOptionDelete = function ($index) {
            if($scope.poll.options[$index].text === '') {
              $scope.poll.options.splice($index, 1);
              var previousChild;
              if ($index > 0) {
                previousChild = $index - 1;
              } else {
                previousChild = 0;
              }
              $timeout(function () {
                $rootScope.$broadcast('focusedIndex', {focus: previousChild});
              });
            }
          };

          $scope.removeOptions = function () {
            var index = -1;
            for (var i = 0; i < $scope.poll.options.length; i++) {
              if ($scope.poll.options[i].remove) {
                index = i;
                break
              }
            }
            if (index > -1) {
              $scope.poll.options.splice(index, 1);
              $scope.removeOptions();
            }
          };

          $scope.nextDialog = function (e, poll, isPoll, isTemplate) {
            $hideDialog();
            $materialDialog({
              templateUrl: 'partials/selectTarget.tmpl.html',
              targetEvent: e,
              controller: ['$scope', '$hideDialog', function ($scope, $hideDialog) {
                $scope.poll = poll;
                $scope.myGroups = japi.me.groups;
                $scope.isPoll = isPoll;
                $scope.isTemplate = isTemplate;

                $scope.close = function () {
                  $hideDialog();
                };

                $scope.save = function (poll) {
                  poll.save();
                  poll.overflow = false;
                  $hideDialog();
                };


              }]
            });
          };

        }]
      });
    };

});

pollApp.controller("pollsListingCtrl", function ($scope) {
});

pollApp.controller("pollResultsCtrl", function ($scope) {

    $scope.poll = $scope.poll || $scope.polls[0];
    $scope.chartData = [];
    for (var i = 0; i < $scope.poll.options.length; i++) {
      $scope.chartData[i] = {
        label: $scope.poll.options[i].text,
        data: $scope.poll.counts[i]
      }
    }
});

pollApp.controller("peerListsCtrl", function ($scope){
});

pollApp.controller("manageTemplatesCtrl", function ($scope){
  $scope.recentPolls = japi.polls.getList();
  $scope.peerPolls = japi.polls.templates.listPeerRecommended();
});

pollApp.controller("createPollCtrl", function ($scope){
  $scope.recentPolls = japi.polls.getList();
  $scope.examplePolls = japi.polls.templates.listExamples();
  $scope.myTemplates = japi.polls.templates.list();
  $scope.peerPolls = japi.polls.templates.listPeerRecommended();
});

pollApp.controller("customizePollCtrl", function ($scope, $location, $controller){
  $controller("pollAppCtrl", {$scope: $scope});
  $scope.saveButtonLabel = "Save";

  $scope.isPoll = $scope.isPoll  === undefined ? true : $scope.isPoll;
  $scope.isTemplate = $scope.isTemplate === undefined ? false : $scope.isTemplate;
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
      case "Years":
        $scope.poll.pollTimeLength = length * 31536000;
        break;
    }
  };

  $scope.saveCustomization = function(){
    // Called upon user clicking Save in poll customization screen.
    $scope.convertTimeToSeconds($scope.temporaryPollOptions.lifespan, $scope.temporaryPollOptions.timeUnits);
    $scope.poll.status = "unstarted";
    //$scope.skeletonPoll = $scope.poll;

    if($scope.isTemplate){
      $scope.saveTemplateCustomization();
    };
    if($scope.isPoll){
      $scope.savePollCustomization();
      if($scope.startPollAfterCustomizing){
        //$scope.poll.start();
        $scope.startPoll($scope.poll);
      };
    };
    // TODO: ASYNC
    delete $scope.poll;
    delete $scope.pollToCustomize;
    if($scope.isTemplate && !$scope.isPoll) {
      $location.path('/manageTemplates');
    } else {
     $location.path('/');
    }
  };

});

pollApp.controller("helpCtrl", function ($scope, $modalInstance) {

      $scope.close = function () {
        $modalInstance.dismiss('close');
      };

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

pollApp.directive('focusThis', function () {
  return {
    link: function (scope, element, attrs) {
      scope.$on('focusedIndex', function (event, args) {
        if (args.focus == attrs['focusThis']) {
          element.focus();
        } else {
          element.blur();
        }
      });
    }
  };
});
