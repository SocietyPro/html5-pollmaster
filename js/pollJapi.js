/*
if(Cambrian === undefined){
  throw("japi.js needs a root object Cambrian.")
};
if(Cambrian.isMockCambrian === true){
  throw("Mocks detected; japi.js aborting")
}
var Cambrian = Cambrian || {}
*/
// var polls = pollAll(); returns array of js poll objects
app.factory("pollAll", function($filter) {
  return function () {
    console.log("pollAll called");
    var qtPolls = $filter('filter')(japi.polls.getList(), {isTemplate: false});
    var polls = [];
    for (var i=0; i < qtPolls.length; i++) {
      polls.push(angular.copy(qtPolls[i]));
    }
    return polls;
  };
});

//var newPoll = pollNew(); returns new js poll object
//var copiedPoll = pollNew(oldPoll); returns copied js poll object with no id
app.factory("pollNew", function () {
  return function (source) {
      var source = source || {};
      var newPoll = {
        allowComments: source.allowComments || false,
        allowMultipleChoices: source.allowMultipleChoices || false,
        dateStarted: null,
        dateStopped: null,
        description: source.description || "",
        destroy: function () {
          pollDestroy(this);
        },
        dismissText: source.dismissText || "",
        isTemplate: source.isTemplate || false,
        options: source.options || [],
        originator: "voodoo",
        pollTargetId: source.pollTargetId || "",
        pollTimeLength: source.pollTimeLength || 0,
        save: function () {
          pollCreateOrUpdate(this);
        },
        status: "unsaved",
        submitText: source.submitText || "",
        title: source.title || "",
        type: "poll"
      }
      return newPoll;
  };
});

//var poll = pollFind("12345"); returns js poll object or undefined
app.factory("pollFind", function () {
  return function (id) {
    var poll;
    qtPoll = japi.polls.get(id);
    if (qtPoll) {
      poll = angular.copy(qtPoll);
      return poll;
    } else {
      return undefined;
    }
  };
});

//var poll = pollCreateOrUpdate(pollToUpdate); returns js poll object with new id and status
app.factory("pollCreateOrUpdate", function () {
  return function (source,startNow) {
    var qtPoll;
    if (source.id) {
      qtPoll = japi.polls.get(source.id);
    }
    if (qtPoll) {
      if (qtPoll.isTemplate != source.isTemplate) {
        qtPoll = japi.polls.build();
      }
    } else {
      qtPoll = japi.polls.build();
    }
    var sourceOptions = [];
    for (var i=0; i < source.options.length; i++) {
      sourceOptions.push(source.options[i].text);
    }
    qtPoll.allowComments = source.allowComments;
    qtPoll.allowMultipleChoices = source.allowMultipleChoices;
    qtPoll.description = source.description;
    qtPoll.dismissText = source.dismissText;
    qtPoll.isTemplate = source.isTemplate;
    qtPoll.options = sourceOptions;
    qtPoll.originator = source.originator;
    qtPoll.pollTargetId = source.pollTargetId;
    qtPoll.pollTimeLength = source.pollTimeLength;
    qtPoll.submitText = source.submitText;
    qtPoll.title = source.title;
    qtPoll.type = source.type;
    for (var i=0; i < qtPoll.options.length; i++) {
      qtPoll.options[i].isSelected = source.options[i].isSelected;
    }
    if (startNow) {
      qtPoll.start();
    }
    qtPoll.save("save from pollCreate factory");
    var poll = angular.copy(qtPoll);
    return poll;
  }
});

//var poll = pollDestroy(pollToDestroy); returns true if poll found by id, false if not
app.factory("pollDestroy", function () {
  return function (source) {
    var qtPoll = japi.polls.get(source.id);
    if (qtPoll) {
      qtPoll.destroy("destroy from pollDestroy factory");
      return true;
    } else {
      return false;
    }
  }
});

//var pollIsStarted = pollStart(unstartedPoll); returns true if found by id, false if not
app.factory("pollStart", function () {
  return function (source) {
    var qtPoll = japi.polls.get(source.id);
    if (qtPoll) {
      qtPoll.start();
      return true;
    } else {
      return false;
    }
  }
});

//var pollIsStopped = pollStop(runningPoll); returns true if found by id, false if not
app.factory("pollStop", function () {
  return function (source) {
    var qtPoll = japi.polls.get(source.id);
    if (qtPoll) {
      qtPoll.stop();
      return true;
    } else {
      return false;
    }
  }
});

//var ballotReturned = pollSubmit(ballot, comment); returns true if found by id, false if not
app.factory("pollSubmit", function () {
  return function (source, comment) {
    var qtPolls = japi.polls.getList();
    var qtPoll;
    for (var i=0; i < qtPolls.length; i++) {
      if (qtPolls[i].id === source.id) {
        qtPoll = qtPolls[i];
      }
    }
    if (qtPoll) {
      for (var i=0; i < qtPoll.options.length; i++) {
        qtPoll.options[i].isSelected = source.options[i].isSelected;
      }
      qtPoll.submit(comment);
      return true;
    } else {
      return false;
    }
  }
});

//var comments = pollComments(poll); returns the voter-submitted commments for the poll
app.factory("pollComments", function () {
  return function (source) {
    var qtPoll = japi.polls.get(source.id);
    var qtResults = qtPoll.getResults();
    var comments = [];
    for (var i = 0; i < qtResults.comments.length; i++) {
      comments.push(qtResults.comments[i]);
    }
    return comments;
  }
});

// var templates = templateAll(); returns array of js poll objects
app.factory("templateAll", function ($filter) {
  return function () {
    var qtTemplates = $filter('filter')(japi.polls.getList(), {isTemplate: true});
    var templates = [];
    for (var i=0; i < qtTemplates.length; i++) {
      templates.push(angular.copy(qtTemplates[i]));
    }
    return templates;
  };

});

//var groups = groupAll(); returns an array of js group objects
app.factory("groupAll", function () {
  return function () {
    var groups = [];
    var qtGroups = japi.me.groups;
    for (var i=0; i < qtGroups.length; i++) {
      groups.push(angular.copy(qtGroups[i]));
    }
    return groups;
  };
});