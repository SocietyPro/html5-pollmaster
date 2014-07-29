var japi;
var mockScope, controller, backend, mockInterval, mockTimeout, mockLog;

  beforeEach(angular.mock.module("pollApp"));

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

  describe("setup", function () {
    it("instantiates mock japi", function () {
      function instantiateMockJapi(){
        japi = Cambrian.JAPI();
      };
      expect(instantiateMockJapi).not.toThrow();
      expect(japi.polls).toBeDefined();
    });

  });
  it("creates a currentOptions array", function () {
    expect(mockScope.currentOptions).toEqual([]);
  });
