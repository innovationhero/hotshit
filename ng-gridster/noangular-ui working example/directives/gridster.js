app.directive('gridster', function($timeout) {
  return {
    restrict: 'AC',
    scope: { model: '=model' },
    template: '<ul><div widget ng-repeat="item in model" widget-model="item"></div></ul>',
    link: function($scope, $element, $attributes, $controller) {
      var gridster;
      var ul = $element.find('ul');
      var defaultOptions = {
        widget_margins: [10, 10],
        widget_base_dimensions: [180, 100]
      };
      var options = angular.extend(defaultOptions, $scope.$eval($attributes.options));

      $timeout(function() {
        gridster = ul.gridster(options).data('gridster');

        gridster.options.draggable.stop = function(event, ui) {
          //update model
          angular.forEach(ul.find('li'), function(item, index) {
            var li = angular.element(item);
            if (li.attr('class') === 'preview-holder') return;
            var widget = $scope.model[index];
            widget.row = li.attr('data-row');
            widget.col = li.attr('data-col');
          });
          $scope.$apply();
        };
      });
// This is important as it seems this is jquery $ gridster documentation.....................
      var attachElementToGridster = function(li) {
        //attaches a new element to gridster
        var $w = li.addClass('gs_w').appendTo(gridster.$el).hide();
        gridster.$widgets = gridster.$widgets.add($w);
        gridster.register_widget($w).add_faux_rows(1).set_dom_grid_height();
        $w.fadeIn();
      };
      $scope.$watch('model.length', function(newValue, oldValue) {
        if (newValue != oldValue+1) return; //not an add
        var li = ul.find('li').eq(newValue-1); //latest li element
        $timeout(function() { attachElementToGridster(li); }); //attach to gridster
      });
    }
  };
});

// this directive should contain content slider code
// also should fetch from Service Json $resource or $http
app.directive('widget', function() {
  return {
    restrict: 'AC',
    scope: { widgetModel: '=' },
    replace: true,
    template:
      '<li data-col="{{widgetModel.col}}" data-row="{{widgetModel.row}}" data-sizex="{{widgetModel.sizex}}" data-sizey="{{widgetModel.sizey}}">'+
        '{{widgetModel.text}},row ({{widgetModel.row}}), col({{widgetModel.col}})'+ ', sizex {{widgetModel.sizex}} , sizey {{widgetModel.sizey}}' +
      '</li>',
    link: function($scope, $element, $attributes, $controller) {
    }
  };
});






















/*// =======================================================
// this directive should contain content slider code
// also should fetch from Service Json $resource or $http
app.directive('widget', function() {
  return {
    restrict: 'AC',
    scope: { widgetModel: '=' },
    replace: true,
    template:
      '<li data-col="{{widgetModel.col}}" data-row="{{widgetModel.row}}" data-sizex="{{widgetModel.sizex}}" data-sizey="{{widgetModel.sizey}}">'+
        '{{widgetModel.text}},notveryimp <iframe width="120" height="115" src="http://www.youtube.com/embed/epRNaSIibew" frameborder="0" allowfullscreen></iframe> ({{widgetModel.row}},{{widgetModel.col}})'+
      '</li>',
    link: function($scope, $element, $attributes, $controller) {
    }
  };
});
// ======================================================*/
