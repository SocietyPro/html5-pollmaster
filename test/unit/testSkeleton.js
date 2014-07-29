var mockScope, controller, backend, mockInterval, mockTimeout, mockLog;

  beforeEach(angular.mock.module("ballotApp"));

  beforeEach(angular.mock.inject(function ($controller, $rootScope,
            $http, $interval, $timeout, $log) {
        mockScope = $rootScope.$new();
        mockInterval = $interval;
        mockTimeout = $timeout;
        mockLog = $log;
        $controller("ballotCreatorCtrl", {
            $scope: mockScope,
            $http: $http,
            $interval: mockInterval,
            $timeout: mockTimeout,
            $log: mockLog
        });
    }));

  it("creates a currentOptions array", function () {
    expect(mockScope.currentOptions).toEqual([]);
  });
