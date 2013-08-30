// Routing
angular.module('storytime', []).
  config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/game', {templateUrl: 'partials/game.html', controller: GameCtrl}).
    when('/writer', {templateUrl: 'partials/writer.html', controller: GameCtrl}).
    when('/about', {templateUrl: 'partials/about.html'}).
    otherwise({redirectTo: '/'});
}]);

