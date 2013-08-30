function GameCtrl($scope, $routeParams, $http){
//  $scope.gameId = $routeParams.gameId;
  function load(storyname){
    storyname = storyname || 'wizardhackers'
    var url = "/stories/" + storyname + ".json"
    $http({method: 'GET', url: url}).
      success(function(data, status, headers, config){
        console.log("loaded!");
        console.log(data);

        $scope.game = data;
        $scope.game.current_room = $scope.game.rooms["start"];

      }).
      error(function(data, status, headers, config){
        console.log("Hmm... couldn't load");
        console.log({data: data, status: status, headers: headers, config: config});
      });

  }

  load('wizardhackers');

  $scope.goto = function (roomname){
    $scope.game.current_room = $scope.game.rooms[roomname];
    console.log("yay");
  }
}
