// Routing
angular.module('storytime', ['ui.bootstrap']).
  config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/game', {templateUrl: 'partials/game.html', controller: GameCtrl}).
    when('/writer', {templateUrl: 'partials/writer.html', controller: WriterCtrl}).
    when('/about', {templateUrl: 'partials/about.html'}).
    otherwise({redirectTo: '/'});
}]);

