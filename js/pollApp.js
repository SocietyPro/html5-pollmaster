var japi;
if(Cambrian.JAPI !== undefined){
  console.log('Instantiating japi');
  japi = Cambrian.JAPI();
} else {
  // use mocks
  console.log('Instantiating mock japi');
  japi = Cambrian.mockJAPI();
}

var app = angular.module("pollApp", ["ngRoute", "ui.bootstrap", "ngMaterial","ngAria", 'nvd3ChartDirectives','ui.date','ui.timepicker','wu.masonry']) // array is required
var saveMatrix = {poll: false, template: false};

app.config(function($routeProvider){
  
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
  otherwise({
    redirectTo: "/polls"
  });

});

app.factory("menu", ['$rootScope', function ($rootScope) {
  var self;
  var filters = [{ filter: 'All', color: '#000' }, 
                 { filter: 'Vote', color: '#FF6D3F' },
                 { filter: 'Running', color: '#1CE8B5' },
                 { filter: 'Unstarted', color: '#B8C4C9' },
                 { filter: 'Completed', color: '#3FC3FF' }];

  return self = {
    filters: filters,

    selectFilter: function(filter) {
      self.currentFilter = filter;
      if (filter.filter === "All") {
        $rootScope.pollFilter = undefined;
      } else if (filter.filter === "Running") {
        $rootScope.pollFilter = "started";
      } else if (filter.filter === "Completed") {
        $rootScope.pollFilter = "stopped";
      } else {
        $rootScope.pollFilter = filter.filter.toLowerCase();
      };
    },

    isFilterSelected: function (filter) {
      return self.currentFilter === filter;
    }
  };
}]);

app.directive('ngReallyClick', [function() {
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

app.directive('focusThis', function () {
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

app.controller("pollAppCtrl", function ($scope, 
                                        $location, 
                                        $modal, 
                                        $mdDialog, 
                                        $mdSidenav, 
                                        $timeout,
                                        $rootScope,  
                                        menu,
                                        pollNew, 
                                        pollCreateOrUpdate,
                                        groupAll){

    $scope.menu = menu;
    $scope.menu.selectFilter(menu.filters[0]);
    if ($location.path() == "/templates") {
      $scope.view=!true;
      $scope.isTmpl = !false;
    } else {
      $scope.view=!false;
      $scope.isTmpl = !true;
    }

    $scope.reloadMasonry = true;

    $(document).mouseup(function (e) {
        var container = $("#filterDropdown");
        var button = $("#buttonFilterDropdown");
        if (!container.is(e.target) // if the target of the click isn't the container...
            && !button.is(e.target) && button.has(e.target).length === 0) { // ... nor a descendant of the container
            $scope.safeApply(function () {
              $scope.showFilter = false;
            });       
        }
    });

    $scope.selectFilter = function (filter) {
      menu.selectFilter(filter);
      $scope.safeApply(reloadM);
    }

    var reloadM = function () {
      $scope.reloadMasonry = false;
      $timeout(function () {
        $scope.reloadMasonry = true;
      },50); 
    }

    $scope.safeApply = function(fn) {
      var phase = $rootScope.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

    $scope.toggleMenu = function () {
      $mdSidenav('left').toggle();
    };

    $scope.listView = "quilt";

    $scope.streamView = function () {
      $( ".cardholder" ).addClass( "positionAuto");
      $scope.listView = "stream";
      $scope.safeApply(reloadM);
    };

    $scope.quiltView = function () {
      $( ".cardholder" ).removeClass( "positionAuto");
      $scope.listView = "quilt";
      $scope.safeApply(reloadM);
    };

    $scope.overflowToggle = function (item) {
      item.overflow = !item.overflow;
    };

    $scope.pollsShow = function () {
      $scope.isTmpl = false;
      $scope.view=true;
      $location.path("/polls");
    };

    $scope.templatesShow = function () {
      $scope.isTmpl = true;
      $scope.view=false;
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
      $scope.poll = itemObject;
      $scope.dialog(e, $scope.poll, saveMatrix);
    };

    $scope.newItemFromScratch = function(e, isPoll, quickAddForm, newTitle, newDescription) {
      var newItem = pollNew();
      newItem.title = newTitle;
      newItem.description = newDescription;
      saveMatrix = {poll: isPoll, template: !isPoll};
      $scope.startCustomizing(e, newItem, saveMatrix);
      $scope.$broadcast('resetQuickAddForm');
    };

    $scope.dialog = function (e, poll, saveMatrix) {
      $mdDialog.show({
        templateUrl: 'partials/editPoll.tmpl.html',
        targetEvent: e,
        controller: ['$scope', '$timeout', '$rootScope', 'pollNew', 'groupAll','pollCreateOrUpdate', '$location', '$mdDialog', function ($scope, $timeout, $rootScope, pollNew, groupAll,pollCreateOrUpdate, $location, $mdDialog) {
          $scope.poll = poll;
          $scope.poll.allowComments = true;
          $scope.myGroups = groupAll();
          $scope.ballotPreview = false;
          $scope.optionsMenu = false;
          var today = new Date();
          var d = new Date(today.getTime() + (24*60*60*1000));
          $scope.edate = d.format("mm/dd/yy");
          $scope.endTime = new Date();
          $scope.endTime.setHours(d.getHours());
          $scope.endTime.setMinutes(d.getMinutes());
          $scope.time = today.toLocaleTimeString();
          $scope.saveMatrix = {poll: false, template: false};
          timepickerOptions = {appendTo:'head'};
          if ($location.path() == "/polls") {
            $scope.saveMatrix.poll = true;
          } else {
            $scope.saveMatrix.template = true;
          }

          $scope.hide = function () {
            $mdDialog.hide();
          };
          
          $scope.convertTimeToSeconds = function (date, time) {
            var pollDate = new Date(date +" " +time);
            var todayDate = new Date();
            return (pollDate.getTime()-todayDate.getTime())/1000;
          };

          function saveItem (item, saveMatrix, startNow) {
            for (var i = 0; i<item.options.length; i++) {
              if (!item.options[i].text) {
                item.options.splice(i,1);
              }
            }
            item.overflow = false;
            item.status = "unsaved";
            if (saveMatrix.poll) {
              item.isTemplate = false;
              pollCreateOrUpdate(item,startNow);
            }

            if (saveMatrix.template) {
              item.isTemplate = true;
              item.pollTargetId = "";
              item.dateStarted = null;
              item.dataStopped = null;
              pollCreateOrUpdate(item,startNow);
            }
            $mdDialog.hide();

          };

          $scope.save = function (startNow) {
            if (!$scope.newDate) {
              $scope.newDate = $scope.edate;
            }
            if ($scope.newDate && $scope.time) {
               var seconds = $scope.convertTimeToSeconds($scope.newDate, $scope.time);
            if (seconds > 0) {
              $scope.poll.pollTimeLength = seconds | 0;
              saveItem($scope.poll, $scope.saveMatrix, startNow);
              $scope.poll.overflow = false;
            } else {
              console.log("error in seconds");
              }
            }
          }

          $scope.getTime = function (time) {
            if (time != undefined) {
              $scope.time = time.toLocaleTimeString();
            } else {
              $scope.time = undefined;
            }
          }
          
          $scope.hasData = function (options) {
            if (options.length == 0) {
              return false;
            }
            for (var i = 0; i < options.length; i++) {
              if (options[i].text == "") {
                return false;
              }
            }
            return true;
          };

          $scope.keypressListener = function (event) {
            if (event.charCode == 13) {
              $timeout(function () {
                $("#addOptionInput").focus();
              });
            }
          }

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

          $scope.addOption = function () {
            var newOption = { text: $scope.newOptionText, subgroup: "", count: 0 };
            $scope.poll.options.push(newOption);
            $scope.newOptionText = "";
            var index = $scope.poll.options.length - 1;
            $timeout(function () {
              $rootScope.$broadcast('focusedIndex', {focus: index});
            });
          };

        }]
      });
    };

    function saveItem (item, saveMatrix, startNow) {
      for (var i = 0; i<item.options.length; i++) {
        if (!item.options[i].text) {
          item.options.splice(i,1);
        }
      }
      item.overflow = false;
      item.status = "unsaved";
      if (saveMatrix.poll) {
        item.isTemplate = false;
        pollCreateOrUpdate(item,startNow);
      }

      if (saveMatrix.template) {
        item.isTemplate = true;
        item.pollTargetId = "";
        item.dateStarted = null;
        item.dataStopped = null;
        pollCreateOrUpdate(item,startNow);
      }

    };

    function convertTimeToSeconds (length, units) {
      switch(units) {
        case "Minutes":
          return length * 60;
          break;
        case "Hours":
          return length * 3600;
          break;
        case "Days":
          return length * 86400;
          break;
        case "Weeks":
          return length * 604800;
          break;
        case "Months":
          return length * 2592000;
          break;
        case "Years":
          return length * 31536000;
          break;
      }
    };

});

app.controller("pollsCtrl", function ($scope, 
                                      $mdDialog, 
                                      $filter, 
                                      pollAll, 
                                      pollNew, 
                                      pollDestroy, 
                                      pollStart,
                                      pollStop) {

  Cambrian.polls.onPollSaved.connect(getPollsList);
  Cambrian.polls.onPollDestroyed.connect(getPollsList);
  Cambrian.polls.onBallotReceived.connect(getPollsList);
  Cambrian.polls.onVoteReceived.connect(getPollsList);
  Cambrian.polls.onPollStopped.connect(getPollsList);
  $scope.polls = pollAll();
  $scope.addTitlePlaceholder = "Add Poll";
  $scope.addDescriptionPlaceholder = "Add Description";


  // NVD3 CHARTS CONFIG ==========================================
  $scope.noOptions = [
    {
      text:"No Votes",
      count:1
    },
    {
      text:"",
      count:0
    }
  ];
  var colorArray = ['#A7A7A7', '#000'];
  $scope.colorFunction = function() {
    return function(d, i) {
        return colorArray[i];
      };
  }
  $scope.toolTipContentFunction = function(){
    return function(key, x, y, e, graph) {
        return  key;
    }
  }
  //====================================================================

  $scope.selected = -1;
  $scope.optionSelected = function (poll,i) {
    if (!poll.allowMultipleChoices) {
      if ($scope.selected != -1) {
        if ($scope.selected == i) {
          $scope.selected = -1;
        } else {
          poll.options[$scope.selected].isSelected = false;
          $scope.selected = i;
        }  
      } else {
        $scope.selected = i;
      }
    }
  }

  $scope.getEndPollDate = function (dateStarted,pollTimeLength) {
    if (dateStarted && pollTimeLength) {
      var d = new Date(dateStarted.getTime() + (pollTimeLength*1000));    
      return d.toString().substring(0,d.toString().lastIndexOf(":"));
    }
    return "";
  };

  $scope.filterPolls = function (filter) {
    if (filter.filter === "All") {
      $scope.pollFilter = {status: ''};
    } else {
      $scope.pollFilter = {status: filter.filter};
    }
  };

  $scope.zoomPoll = function (e, poll) {
    console.log(e);
    if (poll.status === "unstarted") {
      $scope.editPoll(e, poll);
    } else if (poll.status === 'unvoted') {
      vote(e, poll);
    } else {
      showPoll(e, poll);
    }
  };

  $scope.copyPoll = function(e, oldPoll){
    oldPoll.overflow = false;
    var newPoll = pollNew(oldPoll);
    newPoll.pollTimeLength = oldPoll.pollTimeLength;
    saveMatrix = {poll: true, template: false};
    $scope.startCustomizing(e, newPoll, saveMatrix);
  };

  $scope.editPoll = function(e, oldPoll){
    saveMatrix = {poll: true, template: false};
    $scope.startCustomizing(e, oldPoll, saveMatrix);
  };

  $scope.destroyPoll = function (poll) {
    pollDestroy(poll);
  };

  $scope.startPoll = function(poll,e){
    var sm = {poll:true}
    $mdDialog.show({
      templateUrl: 'partials/pollEndsDate.tmpl.html',
      targetEvent: e,
      locals: {
        item: poll,
        saveMatrix: sm
      },
      controller: 'pollEndDateCtrl'
    });
    getPollsList();
  };

  $scope.stopPoll = function(poll) {
    pollStop(poll);
    getPollsList();
  };

  $scope.newTemplateFromPoll = function (e, poll) {
    var newTemplate = pollNew(poll);
    newTemplate.status = "unsaved";
    newTemplate.pollTimeLength = poll.pollTimeLength;
    saveMatrix = {poll: false, template: true};
    $scope.startCustomizing(e, newTemplate, saveMatrix);
  };
  $scope.hasData = function (options) {
    var a = 0;
    for (var i = 0; i < options.length; i++) {
      a += options[i].count;
    };
    return a!=0;
  }
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

  //$scope.$on('startNow', function (scope, args) {
  //  $scope.startPoll(args.poll);
  //});

  $scope.$on('refreshPollsList', function (scope, args) {
    getPollsList();
  });

  function getPollsList() {
    console.log('refreshing polls list');
    $scope.safeApply(function () {
      $scope.polls = pollAll();
    });
  }; 
  
  function vote (e, poll) {
    $mdDialog.show({
      templateUrl: 'partials/votingBoothDialog.tmpl.html',
      targetEvent: e,
      controller: ['$scope', '$mdDialog', '$rootScope', 'pollSubmit', function ($scope, $mdDialog, $rootScope, pollSubmit) {
        $scope.poll = poll;
        $scope.pollLength = {numeral: poll.pollTimeLength / 60, units: "Minutes"};
        $scope.ballot = {};
        $scope.ballot.selectedOption = $scope.poll.options[0].text;
        for (var i=0; i < $scope.poll.options.length; i++) {
          if ($scope.poll.options[i].isSelected === true) {
            $scope.ballot.selectedOption =  $scope.poll.options[i].text;
          }
        }

        $scope.dismiss = function () {    
          console.log("Ballot " + $scope.poll.id + " dismissed.");
          for (var i = 0; i < $scope.poll.options.length; i++) {
            $scope.poll.options.isSelected = false;
          }
          pollSubmit($scope.poll);
          $rootScope.$broadcast('refreshPollsList');
          $mdDialog.hide();
        };

        $scope.submit = function () {
          var voterComment;
          if ($scope.poll.allowComments) {
            voterComment = $scope.ballot.ballotComment;
          }
          if (!$scope.poll.allowMultipleChoices) {
            for (var i=0; i < $scope.poll.options.length; i++) {
              if ($scope.poll.options[i].text === $scope.ballot.selectedOption) {
                $scope.poll.options[i].isSelected = true;
              }
            }
          }
          console.log($scope.poll);
          console.log(voterComment);
          pollSubmit($scope.poll, voterComment);
          $rootScope.$broadcast('refreshPollsList');
          $mdDialog.hide();
        };

      }]
    });
  };

  function showPoll (e, poll) {
    $mdDialog.show({
      templateUrl: 'partials/showPoll.tmpl.html',
      targetEvent: e,
      controller: ['$scope', '$mdDialog', '$rootScope', '$filter', 'pollFind', 'pollResults', function ($scope, $mdDialog, $rootScope, $filter, pollFind, pollResults) {
        Cambrian.polls.onVoteReceived.connect(refreshPoll);
        // NVD3 CHARTS CONFIG ==========================================
        $scope.noOptions = [
          {
            text:"No Votes",
            count:1
          },
          {
            text:"",
            count:0
          }
        ];
        var colorArray = ['#A7A7A7', '#000'];
        $scope.colorFunction = function() {
          return function(d, i) {
              return colorArray[i];
            };
        }
        $scope.toolTipContentFunction = function(){
          return function(key, x, y, e, graph) {
              return  key;
          }
        }
        //====================================================================
        if (poll.status === 'voted') {
          $scope.poll = poll;
        } else {
          $scope.poll = pollResults(poll);
        }
        if (poll.dateStarted) {
          var d = new Date(poll.dateStarted.getTime() + (poll.pollTimeLength*1000));    
          $scope.endPollDate = d.toString().substring(0,d.toString().lastIndexOf(":"));
        }
        $scope.selectedOptions = $filter('filter')($scope.poll.options, {isSelected: true});
        $scope.dialog = {};

        $scope.close = function () {
          $mdDialog.hide();
        };
        $scope.hasData = function (options) {
          var a = 0;
          for (var i = 0; i < options.length; i++) {
            a += options[i].count;
          };
          return a!=0;
        }

        $scope.copyPoll = function (e, poll) {
          $mdDialog.hide();
          $rootScope.$broadcast('zoomedCopyPoll', {event: e, poll: poll});
        };

        $scope.destroyPoll = function (poll) {
          pollDestroy(poll);
          $mdDialog.hide();
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
          $mdDialog.hide();
          $mdDialog.show({
            templateUrl: 'partials/showComments.tmpl.html',
            targetEvent: e,
            controller: ['$scope', '$mdDialog', 'pollComments', function ($scope, $mdDialog, pollComments) {
              Cambrian.polls.onVoteReceived.connect(refreshComments);
              $scope.poll = poll;
              $scope.comments = pollComments(poll);
              $scope.dialog = {};

              $scope.goChat = function (comment) {
                var jid = comment.name + "@xmpp.cambrian.org";
                Cambrian.apps.chat.open(jid); //This has to be replaced with the actual jid property name
                $mdDialog.hide();
              };

              $scope.close = function () {
                $mdDialog.hide();
              };

              $scope.showPoll = function (e, poll) {
                $mdDialog.hide();
                $rootScope.$broadcast('showPollResults', {event: e, poll: poll});
              };

              function refreshComments (poll) {
                $scope.safeApply (function () {
                  $scope.comments = pollComments(poll);
                });
              };

            }]
          });
        };

        function refreshPoll () {
          $scope.safeApply (function () {
            console.log("getting the new poll stuff");
            $scope.poll = pollFind($scope.poll.id);
            console.log($scope.poll);
          });
        };

      }]
    });
  };

});

app.controller("templatesCtrl", function ($scope, 
                                          $mdDialog, 
                                          $filter, 
                                          pollAll, 
                                          pollNew, 
                                          pollDestroy,
                                          templateAll){

  var recentPolls = pollAll();
  var templates = templateAll();
  var exampleTemplates = japi.polls.templates.listExamples();
  var peerRecommendedTemplates = japi.polls.templates.listPeerRecommended();

  Cambrian.polls.onPollSaved.connect(refreshTemplates);
  Cambrian.polls.onPollDestroyed.connect(refreshTemplates);
  Cambrian.polls.onBallotReceived.connect(refreshTemplates);

  $scope.selectedIndex = 0;
  $scope.tabs = ["My templates","Copy from recent polls", "copy from examples", "copy from peer recommended"];
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
    saveMatrix = {poll: false, template: true};
    $scope.startCustomizing(e, template, saveMatrix);
  };

  $scope.forkTemplate = function (e, template) {
    var newTemplate = pollNew(template);
    saveMatrix = {poll: false, template: true};
    $scope.startCustomizing(e, newTemplate, saveMatrix);
  };
 
  $scope.destroyTemplate = function(template) {
    pollDestroy(template);
  };

  $scope.zoomTemplate = function (e, template) {
    saveMatrix = {poll: false, template: true};
      $scope.startCustomizing(e, template, saveMatrix);
    
  };

  $scope.newPollFromTemplate = function(e, template){
    var newPoll = pollNew(template);
    saveMatrix = {poll: true, template: false};
    $scope.startCustomizing(e, newPoll, saveMatrix);
  };

  $scope.$on('zoomedForkTemplate', function (scope, args) {
    $scope.forkTemplate(args.event, args.template);
  });

  $scope.$on('zoomedPollFromTemplate', function (scope, args) {
    $scope.newPollFromTemplate(args.event, args.template);
  });

  function refreshTemplates () {
    recentPolls = pollAll();
    templates = templateAll();
    $scope.safeApply(function () {
      if ($scope.selectedIndex == 0) {
        $scope.templates = templates;
      } else if ($scope.selectedIndex == 1) {
        $scope.templates = recentPolls;
      }
    });
    
  };

  function showTemplate (e, template, selectedIndex) {
    $mdDialog.show({
      templateUrl: 'partials/showTemplate.tmpl.html',
      targetEvent: e,
      controller: ['$scope', '$mdDialog', '$rootScope', function ($scope, $mdDialog, $rootScope) {
        $scope.template = template;
        $scope.dialog = {};
        $scope.selectedIndex = selectedIndex;

        $scope.close = function () {
          $mdDialog.hide();
        };

        $scope.forkTemplate = function (e, template) {
          $mdDialog.hide();
          $rootScope.$broadcast('zoomedForkTemplate', {event: e, template: template});
        };

        $scope.newPollFromTemplate = function(e, template){
          $mdDialog.hide();
          $rootScope.$broadcast('zoomedPollFromTemplate', {event: e, template: template});
        };

      }]
    });
  };

});

app.controller('quickAddCtrl', function ($scope, $timeout, $rootScope, pollNew, groupAll,pollCreateOrUpdate, $location, $mdDialog) {
  $scope.poll = pollNew();
  $scope.poll.allowComments = true;
  $scope.myGroups = groupAll();
  $scope.ballotPreview = false;
  $scope.optionsMenu = false;
  var today = new Date();
  var d = new Date(today.getTime() + (24*60*60*1000));
  $scope.edate = d.format("mm/dd/yy");
  $scope.endTime = new Date();
  $scope.endTime.setHours(d.getHours());
  $scope.endTime.setMinutes(d.getMinutes());
  $scope.time = today.toLocaleTimeString();
  $scope.saveMatrix = {poll: false, template: false};
  timepickerOptions = {appendTo:'head'};
  if ($location.path() == "/polls") {
    $scope.saveMatrix.poll = true;
  } else {
    $scope.saveMatrix.template = true;
  }

  $(document).mouseup(function (e) {
    var ballotPreview = $("#quickBallotPreview");
    var container = $("#quickAddBox");
    var options = $(".optionsMenu");
    var datepicker = $("#ui-datepicker-div");
    var timepicker = $(".ui-timepicker-wrapper");
    if ((!container.is(e.target) && !ballotPreview.is(e.target) && !datepicker.is(e.target) && !timepicker.is(e.target) && !options.is(e.target)) // if the target of the click isn't the container...
        && (container.has(e.target).length === 0 && datepicker.has(e.target).length === 0 && ballotPreview.has(e.target).length === 0 && timepicker.has(e.target).length === 0 && options.has(e.target).length === 0)) // ... nor a descendant of the container
    {
      var exists = ($('#quickAddBox').length === 1)
      if (exists) {
        $scope.safeApply(function() {
          $scope.poll = pollNew();
          $scope.poll.allowComments = true;
          $scope.newItem = false;
          $scope.ballotPreview = false;
          $scope.optionsMenu = false;
          $scope.quickAddForm.$setPristine();
        });       
      }
    }
  });

  $scope.$on('resetQuickAddForm', function () {
    $scope.safeApply(function() {
      $scope.poll = pollNew();
      $scope.poll.allowComments = true;
      $scope.newItem = false;
      $scope.ballotPreview = false;
      $scope.optionsMenu = false;
      $scope.quickAddForm.$setPristine();
    });
    
  });
  
  $scope.convertTimeToSeconds = function (date, time) {
    var pollDate = new Date(date +" " +time);
    var todayDate = new Date();
    return (pollDate.getTime()-todayDate.getTime())/1000;
  };

  function saveItem (item, saveMatrix, startNow) {
    for (var i = 0; i<item.options.length; i++) {
      if (!item.options[i].text) {
        item.options.splice(i,1);
      }
    }
    item.overflow = false;
    item.status = "unsaved";
    if (saveMatrix.poll) {
      item.isTemplate = false;
      pollCreateOrUpdate(item,startNow);
    }

    if (saveMatrix.template) {
      item.isTemplate = true;
      item.pollTargetId = "";
      item.dateStarted = null;
      item.dataStopped = null;
      pollCreateOrUpdate(item,startNow);
    }
    $scope.poll = pollNew();
    $scope.poll.allowComments = true;
    $scope.newItem = false;
    $scope.ballotPreview = false;
    $scope.optionsMenu = false;
    $scope.quickAddForm.$setPristine();

  };

  $scope.save = function (startNow) {
    if (!$scope.newDate) {
      $scope.newDate = $scope.edate;
    }
    if ($scope.newDate && $scope.time) {
       var seconds = $scope.convertTimeToSeconds($scope.newDate, $scope.time);
    if (seconds > 0) {
      $scope.poll.pollTimeLength = seconds | 0;
      saveItem($scope.poll, $scope.saveMatrix, startNow);
      $scope.poll.overflow = false;
    } else {
      console.log("error in seconds");
      }
    }
  }

  $scope.getTime = function (time) {
    if (time != undefined) {
      $scope.time = time.toLocaleTimeString();
    } else {
      $scope.time = undefined;
    }
  }
  
  $scope.hasData = function (options) {
    if (options.length == 0) {
      return false;
    }
    for (var i = 0; i < options.length; i++) {
      if (options[i].text == "") {
        return false;
      }
    }
    return true;
  };

  $scope.keypressListener = function (event) {
    if (event.charCode == 13) {
      $timeout(function () {
        $("#addOptionInput").focus();
      });
    }
  }

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

  $scope.addOption = function () {
    var newOption = { text: $scope.newOptionText, subgroup: "", count: 0 };
    $scope.poll.options.push(newOption);
    $scope.newOptionText = "";
    var index = $scope.poll.options.length - 1;
    $timeout(function () {
      $rootScope.$broadcast('focusedIndex', {focus: index});
    });
  };

});

app.controller('votingBoothCtrl', function ($scope, $routeParams, $location) {
  var pollID = $routeParams.pollID;
  var requestedPoll = japi.polls.get(pollID);
  
  if (requestedPoll.status === "unvoted") {
    $scope.poll = requestedPoll;
    $scope.ballot = {};
    $scope.ballot.selectedOption = $scope.poll.options[0].text;
  } else {
    $location.path("/polls");
  }

  $scope.dismiss = function () {
    console.log("Ballot " + $scope.poll.id + " dismissed.");
    for (var i = 0; i < $scope.poll.options.length; i++) {
      $scope.poll.options.isSelected = false;
    }
    pollSubmit($scope.poll)
    $location.path("/polls");
  };

  $scope.submit = function () {
    console.log("Ballot " + $scope.poll.id + " submitted.")
    var voterComment;
    if ($scope.poll.allowComments) {
      voterComment = $scope.ballot.ballotComment;
    }
    if (!$scope.poll.allowMultipleChoices) {
      for (var i=0; i < $scope.poll.options.length; i++) {
        if ($scope.poll.options[i].text === $scope.ballot.selectedOption) {
          $scope.poll.options[i].isSelected = true;
        }
      }
    };
    pollSubmit($scope.poll, voterComment);
    $location.path("/polls");
  };

});

app.controller("helpCtrl", function ($scope, $modalInstance) {

      $scope.close = function () {
        $modalInstance.dismiss('close');
      };

});

app.controller("pollEndDateCtrl", ['$scope','$mdDialog','item','saveMatrix','pollCreateOrUpdate', function ($scope, $mdDialog,item,saveMatrix,pollCreateOrUpdate) {
  if (item.dateStarted) {
    var d = new Date(item.dateStarted.getTime() + (item.pollTimeLength*1000));    
  } else {
    var today = new Date();
    var d = new Date(today.getTime() + (24*60*60*1000));
  }
  $scope.edate = d.format("mm/dd/yy");
  $scope.endTime = new Date();
  $scope.endTime.setHours(d.getHours());
  $scope.endTime.setMinutes(d.getMinutes());
  //var today = new Date();
  //$scope.endTime = new Date(today.substring(0,))


  $scope.convertTimeToSeconds = function (date, time) {
    var pollDate = new Date(date +" " +time);
    var todayDate = new Date();
    return (pollDate.getTime()-todayDate.getTime())/1000;
  };
  function saveItem (item, saveMatrix, startNow) {
      for (var i = 0; i<item.options.length; i++) {
        if (!item.options[i].text) {
          item.options.splice(i,1);
        }
      }
      item.overflow = false;
      item.status = "unsaved";
      if (saveMatrix.poll) {
        item.isTemplate = false;
        pollCreateOrUpdate(item,startNow);
      }

      if (saveMatrix.template) {
        item.isTemplate = true;
        item.pollTargetId = "";
        item.dateStarted = null;
        item.dataStopped = null;
        pollCreateOrUpdate(item,startNow);
      }

    };
  $scope.getTime = function (time) {
    if (time != undefined) {
      $scope.time = time.toLocaleTimeString();
    } else {
      $scope.time = undefined;
    }
  }
  $scope.save = function () {
    if (!$scope.newDate) {
      $scope.newDate = $scope.edate;
    }
    if ($scope.newDate && $scope.time) {
      var seconds = $scope.convertTimeToSeconds($scope.newDate, $scope.time);
      if (seconds > 0) {
        item.pollTimeLength = seconds | 0;
        saveItem(item, saveMatrix, true);
        item.overflow = false;
        $mdDialog.hide();
      }
    }
  }
  $scope.close = function () {
    $mdDialog.hide();
  }
}]);
