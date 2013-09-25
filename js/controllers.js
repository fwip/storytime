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

  var Writer = {};

  Writer.places_config_html = 
    '<div class="form-group">'
  + '<label class="col-lg-1"> Name </label>'
  + '<div class="col-lg-11"> <input class="form-control input-lg" ng-model="o.name"></input> </div>'
  + '</div>'
  + '<div class="form-group">'
  + '<label class="col-lg-1"> Description </label>'
  + '<div class="col-lg-11"> <textarea rows="3" class="form-control" ng-model="o.desc"></textarea> </div>'
  + '</div>';

  $scope.migrateStory = function(fromVersion){
    // Just update this when you've got new functions.
    var currentVersion = 2;
    fromVersion = fromVersion || 0;
    if (fromVersion <= currentVersion){
      var game = $scope.game;

      // Update all IDs.
      game.nextID = 1;
      var old2newPlace = {};
      for (var i = 0; i < game.places.length; i++){
        var tmpID = game.places[i].id || 0;
        old2newPlace[tmpID] = game.nextID;
        game.places[i].id = game.nextID++;
      }
      for (var i = 0; i < game.routes.length; i++){
        var r = game.routes[i];
        r.id = game.nextID++;
        r.to = old2newPlace[r.to];
        r.from = old2newPlace[r.from];
      }
      for (var i = 0; i < game.objects.length; i++){
        var o = game.objects[i];
        o.id = game.nextID++;
        o.loc = old2newPlace[o.loc];
      }
    }
    alert('Upgrade complete - please check to make sure stuff is okay before you save it');
  }

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

  /* Creation code */
  $scope.addStat = function(){
    $scope.game.stats.push( {
      "name": '',
      "start": 0
    });
  }

  $scope.addPlace = function(){
    $scope.game.places.push( {
      "name": "New place",
      "id": $scope.game.nextID++});
  }

  $scope.addRoute = function(){
    $scope.game.routes.push({
    "id": $scope.game.nextID++});
  }

  $scope.addObject = function(){
    $scope.game.objects = $scope.game.objects || [];
    $scope.game.objects.push({'name': '', 'desc': '', 'takeable': false, 'id': $scope.game.nextID++});
  }

  /* Removal code */
  $scope.deleteThing = function(id, type){
    var list = $scope.game[type];
    if (confirm('Really delete?')){
      list.deleteById(id);
    }
  }

  $scope.moveThingUp = function(id, type){
    var list = $scope.game[type];
    list.moveUpById(id);
  }
  $scope.moveThingDown = function(id, type){
    var list = $scope.game[type];
    list.moveDownById(id);
  }

  $scope.routeName = function(route){
    var to = $scope.game.places.filter( function(d) { return d.id == route.to } )[0] || {};
    var from = $scope.game.places.filter( function(d) { return d.id == route.from } )[0] || {};
    return (from.name || '_' ) + " to " + ( to.name || '_' ) + ", via " + (route.name || '_');
  }

  $scope.saveGame = function(name){
    if (name){
      var game = $scope.game;
      game.savename = name;
      var games = (localStorage.games) ? JSON.parse(localStorage.games) : {};
      games[name] = game;
      localStorage.games = angular.toJson(games);
      $scope.savedGames = $scope.getSaves();
      localStorage.selectedStory = name;
    } else {
      $scope.saveDialog();
    }
  }

  $scope.saveDialog = function(){
    var name = prompt("Save as", $scope.game.savename)
    if (name){
      $scope.saveGame(name);
    }
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
      "nextID": 1,
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
