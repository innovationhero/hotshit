
app.directive('gridster', function($timeout) {
  return {
    restrict: 'AC',
    scope: { model: '=model' },
    template: '<ul><div widget ng-repeat="item in model" widget-model="item"></div></ul>',
    link: function($scope, $element, $attributes, $controller) {
      var gridster;
      var ul = $element.find('ul'); // find() - Limited to lookups by tag name in case if only using jqLite http://api.jquery.com/find/ 
      var defaultOptions = {
        widget_margins: [10, 10],
        widget_base_dimensions: [180, 100]
      };
      var options = angular.extend(defaultOptions, $scope.$eval($attributes.options));// Extends the destination object dst by copying all of the properties from the src object(s) to dst. You can specify multiple src objects. angular.extend(dst, src); http://docs.angularjs.org/api/angular.extend // so that from the html page options can be passed and it will extend the defaultOptions object. <div class="gridster" model="widgets" options="{widget_margins:[5,5],  widget_base_dimensions:[180,180]}"> </div> 

      $timeout(function() {
        gridster = ul.gridster(options).data('gridster');

	console.log(gridster.get_widgets_under_player());  
//	gridster.options.draggable.handle = ("handle");
		
//	if (gridster.is_widget){console.log("bedan feh Determines if there is a widget in the cell represented by col/row params.")} else {console.log("mafesh")};


	// http://gridster.net/#options
        gridster.options.draggable.stop = function(event, ui) {
          //update model
          angular.forEach(ul.find('li'), function(item, index) {
            var li = angular.element(item);
            if (li.attr('class') === 'preview-holder') return;
            var widget = $scope.model[index];
            widget.row = li.attr('data-row');
            widget.col = li.attr('data-col');
	   // widget.placeholder('data-row','data-col'); 
          });
          $scope.$apply();
        };
      });


      // This is important as it seems this is jquery $ gridster documentation....
      var attachElementToGridster = function(li) {
        //attaches a new element to gridster
       // if (gridster.is_widget){console.log("bedan feh Determines if there is a widget in the cell represented by col/row params.")} else {console.log("mafesh")};


var $w = li.addClass('gs_w').appendTo(gridster.$el).hide();
        gridster.$widgets = gridster.$widgets.add($w);
        gridster.register_widget($w).add_faux_rows(1).set_dom_grid_height();
//  gridster.resize_widget($w, [4], [4] );
//	$w.set_placeholder(4,4);
        // $w.fadeIn(); // the original code is jquery fadeIn();
	// $w.slideDown(); // works funny jquery slidedown
	$w.animate({
    opacity: 0.9,
    height: 'toggle'
  }, 5000, function() {
    // Animation complete.
  });
      };


// my watch code in atempd to adjust the placeholder size
      $scope.$watch('model[0].sizex',function(){
//$scope.widgets[0].sizex++;
//console.log('model[0].sizex');
console.log("sizex is being watched from the directive thorugh the scope");
 });
			
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
/////////////////////////////////////////////////////////
app.directive('widget', function() {
  return {
    restrict: 'AC',
    scope: { widgetModel: '=' },
    replace: true,
    template:
      '<li data-col="{{widgetModel.col}}" data-row="{{widgetModel.row}}" data-sizex="{{widgetModel.sizex}}" data-sizey="{{widgetModel.sizey}}">'+ '<div class="handle">f</div>'  + 
        '{{widgetModel.text}},row ({{widgetModel.row}}), col({{widgetModel.col}})'+ ', sizex {{widgetModel.sizex}} , sizey {{widgetModel.sizey}}' +
      '</li>',
    link: function($scope, $element, $attributes, $controller, $timeout) {
    }
  };
});
