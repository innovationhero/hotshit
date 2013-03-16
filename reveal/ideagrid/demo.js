/* 
 _   _          __ _                    _     
| |_| |__   ___/ _\ |__   _____      __(_)___ 
| __| '_ \ / _ \ \| '_ \ / _ \ \ /\ / /| / __|
| |_| | | |  __/\ \ | | | (_) \ V  V / | \__ \
 \__|_| |_|\___\__/_| |_|\___/ \_/\_(_)/ |___/
                                     |__/     
*/ 
/* This acts like the sandbox, yet to interface with ng-directives(the core) */ 

var layout;
var block;
var grid_size = 100;
var grid_margin = 5;
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
		grid: 200,
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

   // layout.set_dom_grid_height(1);	
   

 /*  block_resize = */  $('.layout_block').resizable({
        grid: [grid_size + (grid_margin * 2), grid_size + (grid_margin * 2)],
	animate: false,
        minWidth: grid_size,
        minHeight: grid_size,
        containment: '#layouts_grid ul',
        autoHide: true,
    start: function(event, ui) {
        var resized = $(this);
        $('.layout_block').resizable( "option", "maxWidth", resized.data('maxx') * grid_size ); //maximum x of a block
        $('.layout_block').resizable( "option", "maxHeight", resized.data('maxy') * grid_size ); // maximum y of a block
	$('.layout_block').resizable( "option", "minWidth", resized.data('minx') * grid_size ); // minumum x of a block
        $('.layout_block').resizable( "option", "minHeight", resized.data('miny') * grid_size ); // minumum y of a block

    },        
        stop: function(event, ui) {
            var resized = $(this);
            setTimeout(function() {
                
                resizeBlock(resized);
            }, 300);
        }
    });

    $('.ui-resizable-handle').hover(function() {
        layout.disable();
//	alert('.hover is happening');
    }, function() {
        layout.enable();
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
