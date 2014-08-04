var japi;
var mockScope, controller, backend, mockInterval, mockTimeout, mockLog;

beforeEach(angular.mock.module("pollApp"));

describe("pollAppCtrl", function () {

  beforeEach(angular.mock.inject(
  function ($controller, $rootScope, $http, $interval, $timeout, $log) {
    mockScope = $rootScope.$new();
    mockInterval = $interval;
    mockTimeout = $timeout;
    mockLog = $log;
    $controller("pollAppCtrl", {
      $scope: mockScope,
      $http: $http,
      $interval: mockInterval,
      $timeout: mockTimeout,
      $log: mockLog
    });
  }
  ));

  beforeEach(function () {
    Cambrian.idSeed = 0;
  });

  describe("setup", function () {
    it("instantiates mock japi", function () {
      function instantiateMockJapi(){
        japi = Cambrian.mockJAPI();
      };
      expect(instantiateMockJapi).not.toThrow();
      expect(japi.polls).toBeDefined();
    });
  });

  describe("newPollFromScratch", function () {

    it("creates a new poll object from scratch and sets it up to customize", function () {
      expect(mockScope.poll).not.toBeDefined();
      expect(mockScope.pollToCustomize).not.toBeDefined();
      mockScope.newPollFromScratch();
      expect(mockScope.poll).toBeDefined();
      expect(mockScope.pollToCustomize).toBeDefined();
      expect(mockScope.pollToCustomize).toEqual(mockScope.poll);
      mockScope.poll.title = "Join Operation Red Dawn!";
      expect(mockScope.pollToCustomize).not.toEqual(mockScope.poll);
    });

  });

  describe("editPoll", function () {

    it("clones the original poll and sets it up to customize", function () {
      var pollToEdit = japi.polls.build();
      pollToEdit.title = "Join Operation Red Dawn!";
      expect(mockScope.poll).not.toBeDefined();
      mockScope.editPoll(pollToEdit);
      expect(mockScope.poll).toEqual(pollToEdit);
      mockScope.poll.title = "What is your favorite snack?";
      expect(mockScope.poll).not.toEqual(pollToEdit);
    });

  });

  describe("copyPoll", function () {

    it("forks the poll and sets the fork up to customize", function () {
      var oldPoll = japi.polls.build();
      oldPoll.title = "Join Operation Red Dawn!";
      expect(mockScope.poll).not.toBeDefined();
      mockScope.copyPoll(oldPoll);
      expect(mockScope.poll.title).toEqual(oldPoll.title);
      expect(mockScope.poll.id).not.toEqual(oldPoll.id);
      mockScope.poll.title = "What is your favorite snack?";
      expect(mockScope.poll.title).not.toEqual(oldPoll.title);
    });

  });

  describe("newPollFromTemplate", function () {

    xit("creates a new poll from the template and sets it up to customize", function () {
      var template = japi.polls.template.build(); // Replace with Spec'd call
      template.title = "Join Operation Red Dawn!";
      expect(mockScope.poll).not.toBeDefined();
      mockScope.newPollFromTemplate(template);
      expect(mockScope.poll.title).toEqual('Join Operation Red Dawn!');
    });

  });

  describe("saveCustomization", function () {

    describe("using only savePollCustomization", function () {

      it("overwrites pollToCustomize and calls its save function", function () {
        var originalPoll = japi.polls.build();
        originalPoll.title = "Join Operation Red Dawn!";
        mockScope.editPoll(originalPoll);
        expect(mockScope.pollToCustomize).toEqual(mockScope.poll);
        mockScope.poll.title = "What is your favorite snack?";
        expect(mockScope.pollToCustomize).not.toEqual(mockScope.poll);
        mockScope.savePollCustomization();
        expect(mockScope.pollToCustomize).toEqual(mockScope.poll);
        var savedPoll = japi.polls.get(mockScope.pollToCustomize.id);
        expect(mockScope.pollToCustomize).toEqual(savedPoll);
      });

    });

    describe("using only saveTemplateCustomization", function () {

      xit("does some stuff to save a template", function () {
        // finish when template api available
      });

    });

    // add template tests when api available
  });

});

describe("customizePollCtrl", function () {

  beforeEach(angular.mock.inject(
  function ($controller, $rootScope, $http, $interval, $timeout, $log) {
    mockScope = $rootScope.$new();
    mockInterval = $interval;
    mockTimeout = $timeout;
    mockLog = $log;
    $controller("customizePollCtrl", {
      $scope: mockScope,
      $http: $http,
      $interval: mockInterval,
      $timeout: mockTimeout,
      $log: mockLog
    });
  }
  ));

  beforeEach(function () {
    Cambrian.idSeed = 0;
  });

  it("adds and subtracts new option objects to the array of options", function () {
    var poll = japi.polls.build();
    expect(mockScope.poll.options.length).toEqual(0);
    mockScope.addOption();
    expect(mockScope.poll.options.length).toEqual(1);
    var option = mockScope.poll.options[0];
    mockScope.removeOption(option);
    expect(mockScope.poll.options.length).toEqual(0);
  });

  it("saves the edited poll as a poll when 'isPoll' is true", function () {
    var originalPoll = japi.polls.build();
    originalPoll.title = "Join Operation Red Dawn!";
    mockScope.editPoll(originalPoll);
    expect(mockScope.pollToCustomize).toEqual(mockScope.poll);
    mockScope.poll.title = "What is your favorite snack?";
    expect(mockScope.pollToCustomize).not.toEqual(mockScope.poll);
    mockScope.saveCustomization(true, false);
    expect(mockScope.pollToCustomize).not.toBeDefined();
    expect(mockScope.poll).not.toBeDefined();
    var savedPoll = japi.polls.get(originalPoll.id);
    expect(savedPoll.title).toEqual("What is your favorite snack?");
  });

  it("saves the edited poll as a poll when both 'isPoll' and 'isTemplate' are true", function () {
    var originalPoll = japi.polls.build();
    originalPoll.title = "Join Operation Red Dawn!";
    mockScope.editPoll(originalPoll);
    expect(mockScope.pollToCustomize).toEqual(mockScope.poll);
    mockScope.poll.title = "What is your favorite snack?";
    expect(mockScope.pollToCustomize).not.toEqual(mockScope.poll);
    mockScope.saveCustomization(true, true);
    expect(mockScope.pollToCustomize).not.toBeDefined();
    expect(mockScope.poll).not.toBeDefined();
    var savedPoll = japi.polls.get(originalPoll.id);
    expect(savedPoll.title).toEqual("What is your favorite snack?");
  });

});
    


