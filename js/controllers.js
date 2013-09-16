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

  $scope.selectStory = function(name){
    var data = JSON.parse(localStorage.games)[name];
    $scope.game = data;
    $scope.goto($scope.game.start);
    $scope.game.inventory = [];
    localStorage.selectedStory = name;
  }

  $scope.take = function(id){
    var obj = $scope.game.objects.filter( function(o){ return o.id == id})[0];
    obj.loc = 'inventory';

    $scope.game.inventory.push(obj);
    $scope.goto( $scope.game.current_place.id );
  }


  $scope.goto = function (id){
    $scope.game.current_place = $scope.game.places.filter(
      function(d){ return d.id == id})[0];
    $scope.game.available_routes = $scope.game.routes.filter(
      function(r){ return r.from == id});
    $scope.game.available_objects = $scope.game.objects.filter(
      function(o){ return o.loc == id});
  }

  localStorage.games = localStorage.games || angular.toJson({});
  $scope.stories = JSON.parse(localStorage.games);
  $scope.selectStory(localStorage.selectedStory);
}

function WriterCtrl($scope, $routeParams, $http){


  /* doesn't work as advertised */
  function loadFromUrl(storyname){
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

  $scope.addStat = function(){
    $scope.game.stats.push( {
      "name": '',
      "start": 0
    });
  }

  $scope.addPlace = function(){
    $scope.game.places.push( {
      "name": "New place",
      "id": ++$scope.game.nextPlaceID});
  }

  $scope.addRoute = function(){
    $scope.game.routes.push({});
  }

  $scope.addObject = function(){
    $scope.game.objects = $scope.game.objects || [];
    $scope.game.objects.push({'name': '', 'desc': '', 'takeable': false, 'id': $scope.game.nextObjectID++});
  }

  $scope.routeName = function(route){
    var to = $scope.game.places.filter( function(d) { return d.id == route.to } )[0] || {};
    var from = $scope.game.places.filter( function(d) { return d.id == route.from } )[0] || {};
    return (from.name || '_' ) + " to " + ( to.name || '_' ) + ", via " + (route.name || '_');
  }

  $scope.saveGame = function(name){
    var game = $scope.game;
    game.savename = name;
    var games = (localStorage.games) ? JSON.parse(localStorage.games) : {};
    games[name] = game;
    localStorage.games = angular.toJson(games);
    $scope.savedGames = $scope.getSaves();
    localStorage.selectedStory = name;
  }

  $scope.saveDialog = function(){
    $scope.saveGame(prompt("Save as", $scope.game.savename));
  }

  $scope.getSaves = function(){
    return JSON.parse(localStorage.games);
  }

  $scope.newGame = function(name){
    name = name || 'new game';
    var game = { "title": name,
      "places": [],
      "stats": [],
      "objects": [],
      "routes": [],
      "nextPlaceID": 0,
      "nextObjectID": 0
    };

    $scope.game = game;
  }

  $scope.loadGame = function(name){
    $scope.game = JSON.parse(localStorage.games)[name]; 
    console.log(name);
    console.log(JSON.parse(localStorage.games));
    if (! $scope.game ){
      $scope.newGame();
      return;
    }
    console.log($scope.game);
    localStorage.selectedStory = name;
  }

  $scope.export = function(){
    prompt("Copy the below:", angular.toJson($scope.game));
  }

  $scope.import = function(){
    var game = JSON.parse( prompt("Paste the game below:", ''));
    if (game){
      $scope.game = game;
    }
  }

  //load('wizardhackers');
  localStorage.games = localStorage.games || angular.toJson({});
  $scope.loadGame(localStorage.selectedStory);
  $scope.savedGames = $scope.getSaves();
}
