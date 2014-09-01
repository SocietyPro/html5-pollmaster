pollApp.controller("targetSelectionCtrl", function($scope){
  $scope.chooseTarget = function(type){
    console.log('Choosing',type);
    var targets = null;
    var hint = null;
    switch(type){
      case 'peers': 
        targets = japi.me.peers;
        hint = "Choose one target Peer:"
        break;
      case 'groups':
        targets = japi.me.groups;
        hint = "Choose one target Group:"
        break;
      /*  
      case 'peerLists':
        targets = japi.me.peerLists();
        hint = "Choose one target Peer List:"
        break;
      */
    };
    $scope.targetCategory = type;
    $scope.targetHint = hint;
    $scope.targetChoices = targets;
    $scope.poll.target = targets[0];
  }
  $scope.targetCategory = 'peers';
  //$scope.targetChoices = japi.me.peers();
  //$scope.poll.target = $scope.targetChoices[0];
  $scope.chooseTarget('peers');
});
