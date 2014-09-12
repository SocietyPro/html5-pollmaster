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
  
  $routeProvider.when("/polls", {
    templateUrl: "partials/polls.tmpl.html",
    controller: "pollsCtrl"
  }).
  when("/templates", {
    templateUrl: "partials/templateManager.tmpl.html",
    controller: "templatesCtrl"
  }).
  when("/", {
    templateUrl: "partials/polls.tmpl.html",
    controller: "pollsCtrl"
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

    $scope.newTitle = "";
    $scope.newDescription = "";
    $scope.newItem = false;


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

    $scope.pollsShow = function () {
      $location.path("/polls");
    };

    $scope.templatesShow = function () {
      $location.path("/templates");
    };

    $scope.startCustomizing = function(e, pollObject){
      // We won't modify or save this until save is clicked:
      $scope.pollToCustomize = pollObject; 

      // We will modify this during our WIP. See saveCustomization for where it
      // gets copied back.
      $scope.poll = angular.copy(pollObject);
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
        controller: ['$scope', '$hideDialog', '$rootScope', function ($scope, $hideDialog, $rootScope) {
          $scope.poll = poll;
          $scope.dialog = {};

          $scope.close = function () {
            $hideDialog();
          };

          $scope.copyPoll = function (e, poll) {
            $hideDialog();
            $rootScope.$broadcast('zoomedCopyPoll', {event: e, poll: poll});
          };

          $scope.destroyPoll = function (poll) {
            poll.destroy();
            $hideDialog();
          };

          $scope.pieWidth = 200;
          $scope.pieHeight = 200;
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
          };

          $scope.showComments = function (e, poll) {
            $hideDialog();
            $materialDialog({
              templateUrl: 'partials/showComments.tmpl.html',
              targetEvent: e,
              controller: ['$scope', '$hideDialog', function ($scope, $hideDialog) {
                $scope.poll = poll;
                $scope.dialog = {};

                $scope.close = function () {
                  $hideDialog();
                };

                $scope.showPoll = function (e, poll) {
                  $hideDialog();
                  $rootScope.$broadcast('showPollResults', {event: e, poll: poll});
                };

              }]
            });
          };

        }]
      });
    };

    $scope.$on('showPollResults', function (scope, args) {
      showPoll(args.event, args.poll);
    });

    $scope.$on('zoomedCopyPoll', function (scope, args) {
      $scope.copyPoll(args.event, args.poll);
    });

    $scope.newItemFromScratch = function(e, quickAddForm, isPoll) {
      var newPoll = japi.polls.build();
      newPoll.title = quickAddForm.quickAddTitle.$modelValue;
      newPoll.description = quickAddForm.quickAddDescription.$modelValue;
      $scope.isPoll = isPoll;
      $scope.isTemplate = !isPoll;
      $scope.startCustomizing(e, newPoll);
      $scope.$broadcast('resetQuickAddForm');
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
          if ($scope.poll.endTime) {
            $scope.endTime = new Date();
            $scope.endTime.setHours(parseInt($scope.poll.endTime.substring(0,2)));
            $scope.endTime.setMinutes(parseInt($scope.poll.endTime.substring(3,5)));
          }

          $timeout(function () {
            $("#addOptionInput").focus();
          });          

          $scope.checkHeight = function () {
            var dialogHeight = $('.dialog-content').height();
            var curHeight = $('#content').height();            
            if (dialogHeight < curHeight) {
               $('.dialog-content').css("overflow","auto");
            } else {
              $('.dialog-content').css("overflow","hidden");
            }
          }

          $scope.keypressListener = function (event) {
            if (event.charCode == 13) {
              $timeout(function () {
                $("#addOptionInput").focus();
              });
            }
          }

          $scope.close = function () {
            $hideDialog();
          };

          $scope.getTime = function (et) {
            if (et) {
              $scope.poll.endTime = et.toTimeString().substring(0,5);
            }
          };

          $scope.getDate = function (ed) {
            $scope.poll.endDate = new Date(ed);
          }

          $scope.addOption = function () {
            var newOption = { text: $scope.newOptionText, subgroup: "", count: 0 };
            $scope.poll.options.push(newOption);
            $scope.newOptionText = "";
            var index = $scope.poll.options.length - 1;
            $timeout(function () {
              $rootScope.$broadcast('focusedIndex', {focus: index});
            });
          };

          $scope.checkForOptionDelete = function ($event,$index) {
            if($scope.poll.options[$index].text === '' && $event.keyCode === 8) {
              if ($scope.poll.options[$index].empty != undefined && $scope.poll.options[$index].empty) {
                $scope.poll.options.splice($index, 1);
                var previousChild;
                if ($index > 0) {
                  previousChild = $index - 1;
                } else {
                  if ($scope.poll.options.length > 0) {
                    previousChild = 0;
                  } else {
                    $scope.keypressListener({"charCode":13});
                    return;
                  }
                }
                $timeout(function () {
                  $rootScope.$broadcast('focusedIndex', {focus: previousChild});
                });
              } else {
                $scope.poll.options[$index].empty = true;
              }
            }
          };

          $scope.removeOption = function ($index) {
            $scope.poll.options.splice($index, 1);
          };

          $scope.save = function (poll) {
            for (var i = 0; i<poll.options.length; i++) {
              if (!poll.options[i].text) {
                poll.options.splice(i,1);
              }
            }

            poll.save();
            poll.overflow = false;
            $hideDialog();
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
                  for (var i = 0; i<poll.options.length; i++) {
                    if (!poll.options[i].text) {
                      poll.options.splice(i,1);
                    }
                  }

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

pollApp.controller("pollsCtrl", function ($scope) {
});


pollApp.controller("templatesCtrl", function ($scope){
 
  $scope.selectedIndex = 0;
  var recentPolls = japi.polls.getList();
  var templates = japi.polls.templates.list();
  var exampleTemplates = japi.polls.templates.listExamples();
  var peerRecommendedTemplates = japi.polls.templates.listPeerRecommended();
  $scope.templates = templates;
  $scope.addTitlePlaceholder = "Add Template";
  $scope.addDescriptionPlaceholder = "Add Description";


  $(document).mouseup(function (e) {
      var container = $("#quickAddBox");
      if (!container.is(e.target) // if the target of the click isn't the container...
          && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
          var scope = angular.element($("#quickAddBox")).scope();
          scope.$apply(function(){
              scope.newTemplate = false;
          });       
      }
  });

  $scope.newTemplateFromScratch = function (e, newTitle, newDescription){
    var newTemplate = japi.polls.templates.build();
    newTemplate.title = newTitle;
    newTemplate.description = newDescription;
    $scope.isPoll = false;
    $scope.isTemplate = true;
    $scope.startCustomizing(e, newTemplate);
    $scope.newTemplateTitle = "";
    $scope.newTemplateDescription = "";
    $scope.newTemplate = false;
    $scope.quickAddForm.$setPristine();
  };

  $scope.collectionChange = function () {
    $scope.selectedIndex = this.$index;
    
    if ($scope.selectedIndex === 0) {
      $scope.templates = templates;
    } else if ($scope.selectedIndex === 1) {
      $scope.templates = recentPolls;
    } else if ($scope.selectedIndex === 2) {
      $scope.templates = exampleTemplates;
    } else if ($scope.selectedIndex === 3) {
      $scope.templates = peerRecommendedTemplates;
    };
  };

  $scope.zoomTemplate = function (e, template) {
    var isPoll = false;
    var isTemplate = true;
    var templateToEdit = angular.copy(template);
    templateToEdit.status = "unsaved";
    $scope.dialog(e, templateToEdit, isPoll, isTemplate);
  };

  $scope.$on('resetQuickAddForm', function () {
    console.log($scope.newTitle);
    console.log($scope.newDescription);
  });

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

pollApp.controller('quickAddCtrl', function ($scope) {

  $scope.$on('resetQuickAddForm', function () {
    console.log('received reset broadcast');
    $scope.newTitle = '';
    $scope.newDescription = '';
    $scope.newItem = false;
    $scope.quickAddForm.$setPristine();
  });

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
