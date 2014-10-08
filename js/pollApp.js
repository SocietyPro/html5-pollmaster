var japi;
if(Cambrian.JAPI !== undefined){
  console.log('Instantiating japi');
  japi = Cambrian.JAPI();
} else {
  // use mocks
  console.log('Instantiating mock japi');
  japi = Cambrian.mockJAPI();
}

var app = angular.module("pollApp", ["ngRoute", "ui.bootstrap", "ngMaterial", 'nvd3ChartDirectives','ui.date','ui.timepicker']) // array is required
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
  when("/", {
    templateUrl: "partials/polls.tmpl.html",
    controller: "pollsCtrl"
  }).
  otherwise({
    redirectTo: "/"
  });

});

app.factory("menu", ['$rootScope', function ($rootScope) {
  var self;
  var filters = [{ filter: 'All', color: '#000' }, 
                 { filter: 'Vote', color: '#a48623' },
                 { filter: 'Running', color: '#458B74' },
                 { filter: 'Unstarted', color: '#D2D6DF' },
                 { filter: 'Completed', color: '#40505E' }];

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
                                        $materialDialog, 
                                        $materialSidenav, 
                                        $timeout,
                                        $rootScope,  
                                        menu,
                                        pollNew, 
                                        pollCreateOrUpdate,
                                        groupAll){

    $scope.menu = menu;
    $scope.menu.selectFilter(menu.filters[0]);
    if ($location.path() == "/polls") {
      $scope.view=true;
      $scope.isTmpl = false;
    } else {
      $scope.view=false;
      $scope.isTmpl = true;
    }

    
    

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
      $materialDialog({
        templateUrl: 'partials/editPoll.tmpl.html',
        targetEvent: e,
        controller: ['$scope', '$hideDialog', '$rootScope', '$timeout', function ($scope, $hideDialog, $rootScope, $timeout) {
          $scope.poll = poll;
          $scope.poll.pollTimeLength = $scope.poll.pollTimeLength || 86400;
          $scope.units = ["Minutes", "Hours", "Days", "Weeks", "Months", "Years"];
          $scope.pollLength = {numeral: $scope.poll.pollTimeLength / 60, units: "Minutes"};
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

          $scope.save = function (item, saveMatrix) {
            saveItem(item, saveMatrix, false);
            item.overflow = false;
            $hideDialog();
          };

          $scope.nextDialog = function (e, poll, saveMatrix, pollLength) {
            $hideDialog();
            $materialDialog({
              templateUrl: 'partials/selectTarget.tmpl.html',
              targetEvent: e,
              controller: ['$scope', '$hideDialog', '$rootScope','$materialDialog', function ($scope, $hideDialog, $rootScope,$materialDialog) {
                $scope.poll = poll;
                $scope.myGroups = groupAll();
                $scope.saveMatrix = saveMatrix;
                $scope.pollLength = pollLength;

                $scope.close = function () {
                  $hideDialog();
                };

                $scope.save = function (item, saveMatrix,e) {
                  if ($scope.startNow) {
                    
                    $materialDialog({
                      templateUrl: 'partials/pollEndsDate.tmpl.html',
                      targetEvent: e,
                      locals: {
                        item: item,
                        saveMatrix: saveMatrix
                      },
                      controller: 'pollEndDateCtrl'
                    });

                  $scope.startNow = false;
                    $hideDialog();
                  } else {
                    item.pollTimeLength = convertTimeToSeconds($scope.pollLength.numeral, $scope.pollLength.units);
                    saveItem(item, saveMatrix, $scope.startNow && item.pollTargetId);
                    item.overflow = false;  
                    
                  $scope.startNow = false;
                    $hideDialog();
                  }
                  
                };


              }]
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
                                      $materialDialog, 
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

  $("#cssmenu>ul>li>material-button").addClass('inactive');
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
        if ($("#cssmenu>ul>li>ul").css('left') == "-96px") {
            $("#cssmenu>ul>li>ul").css('opacity',0);
            $("#cssmenu>ul>li>ul").css('left',"-9999px");
            $("#cssmenu>ul>li>material-button").removeClass('active');
            $("#cssmenu>ul>li>material-button").addClass('inactive');
        } else {
          $("#cssmenu>ul>li>ul").css('left',"-96px");
          $("#cssmenu>ul>li>ul").css('opacity',1);
          $("#cssmenu>ul>li>material-button").removeClass('inactive');
          $("#cssmenu>ul>li>material-button").addClass('active');   
        }
    });
    $(document).mouseup(function (e) {
        var container = $("#cssmenu>ul>li");
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) { // ... nor a descendant of the container
            $("#cssmenu>ul>li>ul").css('opacity',0);
            $("#cssmenu>ul>li>ul").css('left',"-9999px");
            $("#cssmenu>ul>li>material-button").addClass('inactive');
            $("#cssmenu>ul>li>material-button").removeClass('active');       
        }
    });

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
    $materialDialog({
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
    $materialDialog({
      templateUrl: 'partials/votingBoothDialog.tmpl.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog', '$rootScope', 'pollSubmit', function ($scope, $hideDialog, $rootScope, pollSubmit) {
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
          $hideDialog();
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
          $hideDialog();
        };

      }]
    });
  };

  function showPoll (e, poll) {
    $materialDialog({
      templateUrl: 'partials/showPoll.tmpl.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog', '$rootScope', '$filter', 'pollFind', function ($scope, $hideDialog, $rootScope, $filter, pollFind) {
        Cambrian.polls.onVoteReceived.connect(refreshPoll);
        $scope.poll = poll;
        if (poll.dateStarted) {
          var d = new Date(poll.dateStarted.getTime() + (poll.pollTimeLength*1000));    
          $scope.endPollDate = d.toString().substring(0,d.toString().lastIndexOf(":"));
        }
        $scope.selectedOptions = $filter('filter')($scope.poll.options, {isSelected: true});
        $scope.dialog = {};

        $scope.close = function () {
          $hideDialog();
        };
        $scope.hasData = function (options) {
          var a = 0;
          for (var i = 0; i < options.length; i++) {
            a += options[i].count;
          };
          return a!=0;
        }

        $scope.copyPoll = function (e, poll) {
          $hideDialog();
          $rootScope.$broadcast('zoomedCopyPoll', {event: e, poll: poll});
        };

        $scope.destroyPoll = function (poll) {
          pollDestroy(poll);
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
            controller: ['$scope', '$hideDialog', 'pollComments', function ($scope, $hideDialog, pollComments) {
              Cambrian.polls.onVoteReceived.connect(refreshComments);
              $scope.poll = poll;
              $scope.comments = pollComments(poll);
              $scope.dialog = {};

              $scope.goChat = function (comment) {
                var jid = comment.name + "@xmpp.cambrian.org";
                Cambrian.apps.chat.open(jid); //This has to be replaced with the actual jid property name
                $hideDialog();
              };

              $scope.close = function () {
                $hideDialog();
              };

              $scope.showPoll = function (e, poll) {
                $hideDialog();
                $rootScope.$broadcast('showPollResults', {event: e, poll: poll});
              };

              function refreshComments (poll) {
                $scope.$apply (function () {
                  $scope.comments = pollComments(poll);
                });
              };

            }]
          });
        };

        function refreshPoll () {
          $scope.$apply (function () {
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
                                          $materialDialog, 
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
    if($scope.selectedIndex == 0) {
      $scope.startCustomizing(e, template, saveMatrix);
    } else {
      showTemplate(e, template, $scope.selectedIndex);
    };
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

app.controller('quickAddCtrl', function ($scope, $timeout, $rootScope, pollNew, groupAll,pollCreateOrUpdate, $location) {

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
  $scope.saveMatrix = {poll: false, template: false};
  timepickerOptions = {appendTo:'head'};
  if ($location.path() == "/polls") {
    $scope.saveMatrix.poll = true;
  } else {
    $scope.saveMatrix.template = true;
  }

  $(document).mouseup(function (e) {
    var container = $("#quickAddBox");
    var datepicker = $("#ui-datepicker-div");
    var timepicker = $(".ui-timepicker-wrapper");
    if ((!container.is(e.target) && !datepicker.is(e.target) && !timepicker.is(e.target)) // if the target of the click isn't the container...
        && (container.has(e.target).length === 0 && datepicker.has(e.target).length === 0 && timepicker.has(e.target).length === 0 )) // ... nor a descendant of the container
    {
      var exists = ($('#quickAddBox').length === 1)
      if (exists) {
        $scope.$apply(function() {
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
    $scope.$apply(function() {
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

app.controller("pollEndDateCtrl", ['$scope','$hideDialog','item','saveMatrix','pollCreateOrUpdate', function ($scope, $hideDialog,item,saveMatrix,pollCreateOrUpdate) {
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
        $hideDialog();
      }
    }
  }
  $scope.close = function () {
    $hideDialog();
  }
}]);
