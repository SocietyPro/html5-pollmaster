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
var saveMatrix = [];

pollApp.config(function($routeProvider){
  
  $routeProvider.when("/polls", {
    templateUrl: "partials/polls.tmpl.html",
    controller: "pollsCtrl"
  }).
  when("/templates", {
    templateUrl: "partials/templateManager.tmpl.html",
    controller: "templatesCtrl"
  }).
  when("/votingbooth/:pollID", {
    templateUrl: "partials/votingBooth.tmpl.html",
    controller: "votingBoothCtrl"
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

pollApp.controller("pollAppCtrl", function ($scope, $location, $modal, $materialDialog, $materialSidenav, menu, $timeout){

    $scope.menu = menu;
    $scope.menu.selectFilter(menu.filters[0]);
    $scope.view=true;
    
    $(document).mouseup(function (e) {
      var container = $("#quickAddBox");
      if (!container.is(e.target) // if the target of the click isn't the container...
          && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
        var exists = ($('#quickAddBox').length === 1)
        if (exists) {
          var scope = angular.element($("#quickAddBox")).scope();
          scope.$apply(function(){
              scope.newItem = false;
          });       
        }
      }
    });

    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

    $scope.toggleMenu = function () {
      $materialSidenav('left').toggle();
    };

    $scope.listView = "quilt";

    $scope.streamView = function () {
      $scope.listView = "stream";
    };

    $scope.quiltView = function () {
      $scope.listView = "quilt";
    };

    $scope.overflowToggle = function (item) {
      item.overflow = !item.overflow;
    };

    $scope.pollsShow = function () {
      $location.path("/polls");
    };

    $scope.templatesShow = function () {
      $location.path("/templates");
    };

    $scope.checkView = function () {
      var path = $location.path().substring(1,$location.path().length);
      if (path == "polls" || path == "") {
        return true;
      } else {
        return false;
      }

    };

    $scope.startCustomizing = function(e, itemObject, saveMatrix){
      // We won't modify or save this until save is clicked:
      $scope.itemToCustomize = itemObject; 

      // We will modify this during our WIP. See saveCustomization for where it
      // gets copied back.
      $scope.poll = itemObject;
      $scope.dialog(e, $scope.poll, saveMatrix);
    };

    $scope.newItemFromScratch = function(e, isPoll, quickAddForm, newTitle, newDescription) {
      var newItem = japi.polls.build();
      newItem.title = newTitle;
      newItem.description = newDescription;
      saveMatrix[0] = saveMatrix[1] = isPoll;
      saveMatrix[2] = saveMatrix[3] = !isPoll;
      $scope.startCustomizing(e, newItem, saveMatrix);
      $scope.$broadcast('resetQuickAddForm');
    };

    $scope.dialog = function (e, poll, saveMatrix) {
      $materialDialog({
        templateUrl: 'partials/editPoll.tmpl.html',
        targetEvent: e,
        controller: ['$scope', '$hideDialog', '$rootScope', '$timeout', function ($scope, $hideDialog, $rootScope, $timeout) {
          $scope.poll = poll;
          $scope.saveMatrix = saveMatrix;
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
            //$scope.poll.options.push(newOption);
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

          $scope.save = function (item, saveMatrix) {
            saveItem(item, saveMatrix);
            item.overflow = false;
            $hideDialog();
          };

          $scope.nextDialog = function (e, poll, saveMatrix) {
            $hideDialog();
            $materialDialog({
              templateUrl: 'partials/selectTarget.tmpl.html',
              targetEvent: e,
              controller: ['$scope', '$hideDialog', '$rootScope', function ($scope, $hideDialog, $rootScope) {
                $scope.poll = poll;
                $scope.myGroups = japi.me.groups;
                $scope.saveMatrix = saveMatrix;

                $scope.close = function () {
                  $hideDialog();
                };

                $scope.save = function (item, saveMatrix) {
                  saveItem(item, saveMatrix);
                  if ($scope.startNow && item.target) {
                    $rootScope.$broadcast('startNow', {poll: item});
                  }
                  item.overflow = false;
                  $scope.startNow = false;
                  $hideDialog();
                };


              }]
            });
          };

        }]
      });
    };

    function saveItem (item, saveMatrix) {
      for (var i = 0; i<item.options.length; i++) {
        if (!item.options[i].text) {
          item.options.splice(i,1);
        }
      }
      item.overflow = false;
      item.status = "unsaved";

      if (saveMatrix[1]) {
        if (saveMatrix[0]) {
          item.isTemplate = false;
          item.save("save from save poll branch of saveItem() in pollAppCtrl");
        } else {
          var newItem = japi.polls.build(item);
          newItem.isTemplate = false;
          newItem.save("save from build and save poll branch of saveItem() in pollAppCtrl");
        }
      }

      if (saveMatrix[3]) {
        if (saveMatrix[2]) {
          item.isTemplate = true;
          item.save("save from save template branch of saveItem() in pollAppCtrl");
        } else {
          var newItem = japi.polls.build(item);
          newItem.isTemplate = true;
          newItem.save("save from build and save template branch of saveItem() in pollAppCtrl");
        }
      }

    };

});

pollApp.controller("pollsCtrl", function ($scope, $materialDialog, $filter) {

  Cambrian.polls.onPollSaved.connect(getPollsList);
  Cambrian.polls.onPollDestroyed.connect(getPollsList);
  console.log('registered listeners ' + Cambrian.polls.pointer); 
  $scope.polls = $filter('filter')(japi.polls.getList(), {isTemplate: false});
  $scope.addTitlePlaceholder = "Add Poll";
  $scope.addDescriptionPlaceholder = "Add Description";

  $("#cssmenu>ul>li").click(function() {
        element = $(this);
        var w = element.width();
        if ($(this).hasClass('has-sub'))
        {
            leftPos = element.position().left + w/2 - 12;
        }
        else {
            leftPos = element.position().left + w/2 - 6;
        }
        if ($("#cssmenu>ul>li>ul").css('left') == "auto") {
            $("#cssmenu>ul>li>ul").css('opacity',0);
            $("#cssmenu>ul>li>ul").css('left',"-9999px");;
        } else {

        $("#cssmenu>ul>li>ul").css('left',"auto");
        $("#cssmenu>ul>li>ul").css('opacity',1);   
        }
    });
    $(document).mouseup(function (e) {
        var container = $("#cssmenu>ul>li");
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) { // ... nor a descendant of the container
            $("#cssmenu>ul>li>ul").css('opacity',0);
            $("#cssmenu>ul>li>ul").css('left',"-9999px");       
        }
    });

  $scope.filterPolls = function (filter) {
    if (filter.filter === "All") {
      $scope.pollFilter = {status: ''};
    } else {
      $scope.pollFilter = {status: filter.filter};
    }
  };

  $scope.zoomPoll = function (e, poll) {
    if (poll.status === "unstarted") {
      $scope.editPoll(e, poll);
    } else {
      showPoll(e, poll);
    }
  };

  $scope.copyPoll = function(e, oldPoll){
    oldPoll.overflow = false;
    var newPoll = japi.polls.build(oldPoll);
    saveMatrix = [true, true, false, false];
    $scope.startCustomizing(e, newPoll, saveMatrix);
  };

  $scope.editPoll = function(e, oldPoll){
    saveMatrix = [true, true, false, false];
    $scope.startCustomizing(e, oldPoll, saveMatrix);
  };

  $scope.destroyPoll = function (poll) {
    poll.destroy("destroyed from destroyPoll() in pollAppCtrl");
  };

  $scope.startPoll = function(oldPoll){
    oldPoll.start();
  };

  $scope.newTemplateFromPoll = function (e, poll) {
    var newTemplate = japi.polls.templates.build(poll);
    newTemplate.status = "unsaved";
    saveMatrix = [false, false, true, true];
    $scope.startCustomizing(e, newTemplate, saveMatrix);
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

  $scope.$on('showPollResults', function (scope, args) {
    showPoll(args.event, args.poll);
  });

  $scope.$on('zoomedCopyPoll', function (scope, args) {
    $scope.copyPoll(args.event, args.poll);
  });

  $scope.$on('startNow', function (scope, args) {
    $scope.startPoll(args.poll);
  });

  function getPollsList() {
    console.log('refreshing polls list');
    $scope.safeApply(function () {
      $scope.polls = $filter('filter')(japi.polls.getList(), {isTemplate: false});
    });
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
          poll.destroy("destroy from destroyPoll() in showPoll() in pollsCtrl");
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

});

pollApp.controller("templatesCtrl", function ($scope, $materialDialog, $filter){

  var recentPolls = $filter('filter')(japi.polls.getList(), {isTemplate: false});
  var templates = $filter('filter')(japi.polls.getList(), {isTemplate: true});
  var exampleTemplates = japi.polls.templates.listExamples();
  var peerRecommendedTemplates = japi.polls.templates.listPeerRecommended();

  Cambrian.polls.onPollSaved.connect(refreshTemplates);
  Cambrian.polls.onPollDestroyed.connect(refreshTemplates);

  $scope.selectedIndex = 0;
  $scope.templates = templates;
  $scope.addTitlePlaceholder = "Add Template";
  $scope.addDescriptionPlaceholder = "Add Description";

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

  $scope.editTemplate = function(e, template){
    saveMatrix = [false, false, true, true];
    $scope.startCustomizing(e, template, saveMatrix);
  };

  $scope.forkTemplate = function (e, template) {
    var newTemplate = japi.polls.build(template);
    saveMatrix = [false, false, true, true];
    $scope.startCustomizing(e, newTemplate, saveMatrix);
  };
 
  $scope.destroyTemplate = function(template) {
    template.destroy("destroy from destroyTemplate() in templatesCtrl");
  };

  $scope.zoomTemplate = function (e, template) {
    saveMatrix = [false, false, true, true];
    if($scope.selectedIndex == 0) {
      $scope.startCustomizing(e, template, saveMatrix);
    } else {
      showTemplate(e, template, $scope.selectedIndex);
    };
  };

  $scope.newPollFromTemplate = function(e, template){
    var newPoll = japi.polls.build(template);
    saveMatrix = [true, true, false, false];
    $scope.startCustomizing(e, newPoll, saveMatrix);
  };

  $scope.$on('zoomedForkTemplate', function (scope, args) {
    $scope.forkTemplate(args.event, args.template);
  });

  $scope.$on('zoomedPollFromTemplate', function (scope, args) {
    $scope.newPollFromTemplate(args.event, args.template);
  });

  function refreshTemplates () {
    recentPolls = $filter('filter')(japi.polls.getList(), {isTemplate: false});
    templates = $filter('filter')(japi.polls.getList(), {isTemplate: true});
    $scope.safeApply(function () {
      if ($scope.selectedIndex == 0) {
        $scope.templates = templates;
      } else if ($scope.selectedIndex == 1) {
        $scope.templates = recentPolls;
      }
    });
    
  };

  function showTemplate (e, template, selectedIndex) {
    $materialDialog({
      templateUrl: 'partials/showTemplate.tmpl.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog', '$rootScope', function ($scope, $hideDialog, $rootScope) {
        $scope.template = template;
        $scope.dialog = {};
        $scope.selectedIndex = selectedIndex;

        $scope.close = function () {
          $hideDialog();
        };

        $scope.forkTemplate = function (e, template) {
          $hideDialog();
          $rootScope.$broadcast('zoomedForkTemplate', {event: e, template: template});
        };

        $scope.newPollFromTemplate = function(e, template){
          $hideDialog();
          $rootScope.$broadcast('zoomedPollFromTemplate', {event: e, template: template});
        };

      }]
    });
  };

});

pollApp.controller('quickAddCtrl', function ($scope) {

  $scope.$on('resetQuickAddForm', function () {
    $scope.newTitle = '';
    $scope.newDescription = '';
    $scope.newItem = false;
    $scope.quickAddForm.$setPristine();
  });

});

pollApp.controller('votingBoothCtrl', function ($scope, $routeParams, $location) {
  var pollID = $routeParams.pollID;
  var requestedPoll = japi.polls.get(pollID);
  
  if (requestedPoll.status === "started") {
    $scope.poll = requestedPoll;
    $scope.ballot = {};
    $scope.ballot.selectedOption = $scope.poll.options[0].text;
  } else {
    $location.path("/polls");
  }

  $scope.dismiss = function () {
    console.log("Ballot " + $scope.poll.id + " dismissed.");
    $scope.poll.status = "complete";
    $scope.poll.save("save from $scope.dismiss() in votingBoothCtrl");
    $location.path("/polls");
  };

  $scope.submit = function () {
    console.log("Ballot submitted with selection: " + $scope.selectedOption);
    console.log($scope.ballot.ballotComment);
    if ($scope.poll.allowComments && $scope.ballot.ballotComment) {
      console.log("Ballot submitted with comment: " + $scope.ballot.ballotComment);
      comment = ["user1", $scope.ballot.ballotComment, new Date()];
      $scope.poll.comments.push(comment);
    }
    $scope.poll.status = "complete";
    $scope.poll.save("save from $scope.submit() in votingBoothCtrl");
    $location.path("/polls");
  };

});

pollApp.controller("helpCtrl", function ($scope, $modalInstance) {

      $scope.close = function () {
        $modalInstance.dismiss('close');
      };

});
