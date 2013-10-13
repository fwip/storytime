// Routing
var app = angular.module('storytime', ['ui.bootstrap']).
  config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/game', {templateUrl: 'partials/game.html', controller: GameCtrl}).
    when('/writer', {templateUrl: 'partials/writer.html', controller: WriterCtrl}).
    otherwise({redirectTo: '/', templateUrl: 'partials/home.html'});
}]);

// Components

app.directive('arrayAccordion', function($http){
  return  {
    restrict: 'A',
    compile: function( element, attrs){
      console.log(element);
      console.log(attrs);
      var type = attrs.arrayAccordion;

      var config_html = Writer.config_html[type];

      element.append(
        '<div class="panel-group" id="' + type + '_accordion">'
        + '<div class="panel panel-default" ng-repeat="o in game.'+type+'">'
        + '<div class="panel-heading">'
        + '<h4 class="panel-title">'
        + '<a class="accordion-toggle" data-toggle="collapse" data-parent="#' + type + '_accordion" href="#' + type + '_{{o.id}}">'
        + '{{o.name}} ({{o.id}})'
        + '</a>'
        + '<button type="button" class="close" aria-hidden="true" ng-click="deleteThing(o.id, ' + type + ')">&times;</button>'
        + '<button type="button" class="btn btn-default btn-xs pull-right glyphicon glyphicon-arrow-up" aria-hidden="true" ng-click="moveThingUp(o.id, \'' + type + '\')"></button>'
        + '<button type="button" class="btn btn-default btn-xs pull-right glyphicon glyphicon-arrow-down" aria-hidden="true" ng-click="moveThingDown(o.id, \'' + type + '\')"></button>'
        + '</h4>'
        + '</div>'
        + '<div id="' + type + '_{{o.id}}" class="panel-collapse collapse">'
        + '<div class="panel-body">'
        + config_html
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
      );
    }

  }
});


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

Array.prototype.moveUpById = function(id){
  var len = this.length;
  for (var i = 1; i < len; i++){
    if (this[i].id == id){
      var tmp = this[i-1];
      this[i-1] = this[i];
      this[i] = tmp;
      return true;
    }
  }
  return false;
}

Array.prototype.moveDownById = function(id){
  var len = this.length;
  for (var i = 0; i < len - 1; i++){
    if (this[i].id == id){
      var tmp = this[i+1];
      this[i+1] = this[i];
      this[i] = tmp;
      return true;
    }
  }
  return false;
}

/*Array.prototype.findById = function(id){
  return (this.filter(function(o){3 == 3}));
}*/

Array.prototype.hasId = function(id){
  for (var i = 0; i < this.length; i++){
    if (this[i].id == id){
      return true;
    }
  }
  return false;
}

// Config HTML
var Writer = {};
Writer.config_html = {};

Writer.config_html.reqs =
  '<div class="container">'
 + '<button class="btn" ng-click="addReq(o)">Add Requirement</button>'
  + '<div class="form-group" ng-repeat="req in o.reqs">'
   + '<div class="col-lg-1"> Type: </div>'
   + '<select class="col-lg-2" ng-model="req.type">'
    + '<option value="hasItem">Has Item</option>'
   + '</select>'
   + '<div class="col-lg-1">Object:</div>'
    + '<select class="col-lg-2" ng-model="req.objectId" ng-options="object.id as object.name for object in game.objects"></select>'
  + '</div>'
 + '</div>';

Writer.config_html.places =
  '<div class="form-group">'
+ '<label class="col-lg-1"> Name </label>'
+ '<div class="col-lg-11"> <input class="form-control input-lg" ng-model="o.name"></input> </div>'
+ '</div>'
+ '<div class="form-group">'
+ '<label class="col-lg-1"> Description </label>'
+ '<div class="col-lg-11"> <textarea rows="3" class="form-control" ng-model="o.desc"></textarea> </div>'
+ '</div>';

Writer.config_html.routes =
        '<div class="container form-group">'
          + '<label class="col-lg-1"> Name </label>'
          + '<div class="col-lg-11"><input class="form-control input-lg" ng-model="o.name"></input></div>'
        + '</div>'
        + '<div class="container form-group">'
          + '<label class="col-lg-1"> From </label>'
          + '<div class="col-lg-5">'
            + '<select ng-model="o.from" ng-options="place.id as place.name for place in game.places"></select>'
          + '</div>'
          + '<label class="col-lg-1"> To </label>'
          + '<div class="col-lg-5">'
            + '<select ng-model="o.to" ng-options="place.id as place.name for place in game.places"></select>'
          + '</div>'
        + '</div>'
        + '<div class="container form-group">'
          + '<label class="col-lg-1"> Description </label>'
          + '<div class="col-lg-11"><textarea rows="2" class="form-control" ng-model="o.desc"></textarea></div>'
        + '</div>'
        + Writer.config_html.reqs;

Writer.config_html.objects =
        '<div class="form-group">'
          + '<label class="col-lg-1">Name</label>'
          + '<div class="col-lg-11"><input class="input-sm form-control" type="text" ng-model="o.name"></input></div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-lg-1">Description</label>'
          + '<div class="col-lg-11"><textarea class="input-sm form-control" ng-model="o.desc"></textarea></div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-lg-1">Takeable</label>'
          + '<div class="col-lg-1"><input type="checkbox" class="checkbox input-sm form-control" ng-model="o.takeable"></input></div>'
          + '<label class="col-lg-1">Location</label>'
          + '<div class="col-lg-1">'
            + '<select ng-model="o.loc" ng-options="place.id as place.name for place in game.places"></select>'
          + '</div>'
        + '</div>';
