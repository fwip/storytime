function GameCtrl($scope, $routeParams, $http){
  function load(storyname){
    storyname = storyname || 'wizardhackers';
    var url = "/stories/" + storyname + ".json";
    $http({method: 'GET', url: url}).
      success(function(data, status, headers, config){

      $scope.game = data;
      $scope.goto(1);

    }).
      error(function(data, status, headers, config){
      console.log("Hmm... couldn't load");
      console.log({data: data, status: status, headers: headers, config: config});
    });

    console.log("yay");
  }

  load('wizardhackers');

  $scope.goto = function (id){
    $scope.game.current_place = $scope.game.places.filter(
      function(d){ return d.id == id})[0];
    $scope.game.available_routes = $scope.game.routes.filter(
      function(r){ return r.from == id});
  }
}

function WriterCtrl($scope, $routeParams, $http){


  function load(storyname){
    storyname = storyname || 'wizardhackers'
    var url = "/stories/" + storyname + ".json";
    $http({method: 'GET', url: url}).
      success(function(data, status, headers, config){
      $scope.game = data;
      console.log('yay');
      console.log(JSON.stringify($scope.game));
    }).
      error(function(data, status, headers, config){
      console.log("Hmm... couldn't load");
      console.log({data: data, status: status, headers: headers, config: config});
    });

  }

  $scope.alphaNum = function (string){
    return string.replace(/[^-_A-z0-9]+/g, '');
  }

  load('wizardhackers');

  $scope.addPlace = function(){
    $scope.game.places.push( {
      "name": "New place",
      "objects": [] });
  }

  $scope.addRoute = function(){
    $scope.game.routes.push({});
  }

  $scope.addObject = function(place){
    place.objects = place.objects || [];
    place.objects.push({});
  }

  $scope.routeName = function(route){
    var to = $scope.game.places.filter( function(d) { return d.id == route.to } )[0] || {};
    var from = $scope.game.places.filter( function(d) { return d.id == route.from } )[0] || {};
    return (from.name || '_' ) + " to " + ( to.name || '_' ) + " via " + (route.name || '_');
  }
}
