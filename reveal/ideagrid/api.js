/* 
 _   _          __ _                    _     
| |_| |__   ___/ _\ |__   _____      __(_)___ 
| __| '_ \ / _ \ \| '_ \ / _ \ \ /\ / /| / __|
| |_| | | |  __/\ \ | | | (_) \ V  V / | \__ \
 \__|_| |_|\___\__/_| |_|\___/ \_/\_(_)/ |___/
                                     |__/     

theShow.js is a javascript intuitive UI library that uses genatic algorithms to evolve UI content aiming to dynamically match a user's liking.
// theShow.js
// version : 0.0.1
// author : Mohamed Fouad
// license : MIT

// ver 0.0.1 Dependencies 
// AngularJS ver ??????????
// Gridster ver ???????????
// jQuery-UI ver ?????????????
// jQuery ver ???????????????

 
*/
/* This acts like the sandbox, yet to interface with ng-directives(the core) */ 
// writing a freakin cool API to use in the Angular Directives later
// Method Chaining
// Always create Options object to pass as a paramater, instead of multiple params
// also make sure you make default options object so if there is a missing param then the  fall back is to the default 

//renaming layout as "theshow"
//TODO create a fragment, frag obj

//TODO create a block, populate it with fragments, block obj

//TODO create a theShow, populate it with an options obj that contain block objects array {}

//TODO mutate one block's and update its fitness, block.mutate{adjust size}, jquery block.fitness = new value;
//TODO adjust all other blocks' fitnesses, function that exclude adjust block obj, but go through all the other blocks and call method chaining allotherblocks.each{ block.fitness.
//TODO combine two blocks and combine both their fitnesses 
//TODO seperate two blocks and split their fitnesses 
//TODO discard a block from the layout


var API_VERSION = "0.0.1"; 
var theShow, block, frag; // my objects
var theShowConfig, blockConfig, fragConfig; // my objects' options objects, should I create OptsDefault for each? 

// jump in after jQuery DOM ready!
$(function(){
	// intialize the theShowOpts of theShow api object
	theShow = function(Config) {
		if (typeof Config === theShowConfig){
			// here this referes to the passed Config
			theShowConfig = {	
			showID : this.showID,
			ds : this.ds,
			blockConfig : this.blockConfig
			gridster.widget_margins : this.widget_margins,
			gridster.widget_base_dimensions : this.widget_base_dimensions,
			gridster.serialize_params : this.serialize_params($w,wgd),_
			}
		} else {
			throw new Error("the Config for theShow is of wrong type");
		}
	},
	// start using theShow object thorugh the .start; chaining functions
	theShow.start = function(){
			// chain event 1
			// chain event 2 
	

	}, 




        // when creating it should look like this theShow(theShowOpts) ... that SIMPLE!
	theShow = $('.theShow ul').gridster({
		widget_margins: [grid_margin, grid_margin],
		widget_base_dimensions: [
		
		});



});


























///////////////////////////////////////////////////////////////////////////////////
var layout;
var block;
var grid_size = 100;
var grid_margin = 0;
var block_params = {
    max_width: 2,
    max_height: 2
};
$(function() {
    layout = $('.layouts_grid ul').gridster({
        widget_margins: [grid_margin, grid_margin],
        widget_base_dimensions: [grid_size, grid_size],
        serialize_params: function($w, wgd) {
            return {
		// grid: 200,
	    	//set_dom_grid_height = 10,  
                x: wgd.col,
                y: wgd.row,
                width: wgd.size_x,
                height: wgd.size_y,
                id: $($w).attr('data-id'),
                name: $($w).find('.block_name').html(),
            };
        },
        min_rows: block_params.max_height
    }).data('gridster');
/////////////////////////////////////////////////////////////
// i want to resize a widget and the fn. in gister got fn.resize_widget, so I will hacke the layout which is a gridster and give it ($widget, size_x, size_y) passed through a sandbox function to be able to resize the widget through my sandbox api, i can also resize through jquery-ui but the functionality is already there in jquery-gridster so! 

	incrFitness = function($widget){
			$widget.size_x++; 
			$widget.size_y++;
			// update Fitness from the widget.data or somthing to send back the server later 
		        layout.resize_widget($widget, size_x, size_y); 
	},

 	decrFitness = function($widget){
			// also resize the rest of the grid accordingly 
	},


////////////////////////////////////////////////////////////////
// http://api.jqueryui.com/resizable/	 
 $('.layout_block').resizable({
       	// http://api.jqueryui.com/resizable/#option-grid
	 grid: [ 20, 100 ], //[grid_size + (grid_margin * 2), grid_size + (grid_margin * 2)],
	animate: false,
        minWidth: grid_size,
        minHeight: grid_size,
        containment: '#layouts_grid ul',
        autoHide: false,

    start: function(event, ui) {
        var resized = $(this);
        $('.layout_block').resizable( "option", "maxWidth", resized.data('maxx') * grid_size ); 
        $('.layout_block').resizable( "option", "maxHeight", resized.data('maxy') * grid_size );
	$('.layout_block').resizable( "option", "minWidth", resized.data('minx') * grid_size );
        $('.layout_block').resizable( "option", "minHeight", resized.data('miny') * grid_size );

//  OtherWidgets.toggleClass("reverse_resizing_state", 1000, "easeOutSine");
    },        
        stop: function(event, ui) {
            var resized = $(this);
            setTimeout(function() {
                
                resizeBlock(resized);
            }, 300);
        },
   alsoResize: "#mirror", //TODO should be updated to be all the other widgets in corsspondance of the current resized widget 
    });

    $('.ui-resizable-handle').hover(function() {
        layout.disable();
	//alert($(this));
    }, function() {
        layout.enable();
	// this means that a widget been resized within a min & max given fitness calculated values
	// an algorithm with $watch to see what are the emty spaces left on the grid and how to resize cl
   	//$(elmObj).	
	
     });

    function resizeBlock(elmObj) {

        var elmObj = $(elmObj);
        var w = elmObj.width() - grid_size;
        var h = elmObj.height() - grid_size;

        for (var grid_w = 1; w > 0; w -= (grid_size + (grid_margin * 2))) {
            grid_w++;
        }

        for (var grid_h = 1; h > 0; h -= (grid_size + (grid_margin * 2))) {
            grid_h++;
        }

        layout.resize_widget(elmObj, grid_w, grid_h);
    }
});
