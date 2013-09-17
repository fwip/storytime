// Routing
angular.module('storytime', ['ui.bootstrap']).
  config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/game', {templateUrl: 'partials/game.html', controller: GameCtrl}).
    when('/writer', {templateUrl: 'partials/writer.html', controller: WriterCtrl}).
    when('/about', {templateUrl: 'partials/about.html'}).
    otherwise({redirectTo: '/'});
}]);


Array.prototype.deleteById = function(id){
  var len = this.length;
  for (var i = 0; i < len; i++){
    if (this[i].id == id){
      this.splice(i, 1);
      return true;
    }
  }
  return false;
}
