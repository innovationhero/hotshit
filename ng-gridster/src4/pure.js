/* 
                  _____   _                              __   _              __                
                 / ___ \ (_)___   ___  ___  _  __ ___ _ / /_ (_)___   ___   / /  ___  ____ ___ 
                / / _ `// // _ \ / _ \/ _ \| |/ // _ `// __// // _ \ / _ \ / _ \/ -_)/ __// _ \
                \ \_,_//_//_//_//_//_/\___/|___/ \_,_/ \__//_/ \___//_//_//_//_/\__//_/   \___/
                 \___/                                                                         

  
                                 _   _._|_|_|_|_ o._ (~|  o _   _ ._   o _| _ _ |
                                }_\/}_|  _| | | ||| | _|  |_\  (_|| |  |(_|}_(_|o
*//////////////////////////////////////////////////////////////////////////////////////////////// 

////////////////////////////////////////////////////////////////////////////////////////////////
var layout;
var grid_size = 50;
var grid_margin = 10;
var block_params = {
    max_width: 6,
    max_height: 6
};
$(function() {

    layout = $('.layouts_grid ul').gridster({
        widget_margins: [grid_margin, grid_margin],
        widget_base_dimensions: [grid_size, grid_size],
        serialize_params: function($w, wgd) {
            return {
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

    $('.layout_block').resizable({
        grid: [grid_size + (grid_margin * 2), grid_size + (grid_margin * 2)],
        animate: false,
        minWidth: grid_size,
        minHeight: grid_size,
        containment: '#layouts_grid ul',
        autoHide: true,
 	//aspectRatio: true,
     
      //  alsoResize: '#'+$(this).attr('id')+' *',
      //  alsoResize: '.layout_block *',
        stop: function(event, ui) {
            var resized = $(this);
            setTimeout(function() {
                resizeBlock(resized);
            }, 300);
/*	
    $("layoutblock").resizable({
        alsoResizeReverse: "layoutblock"
    });
*/
        }
    });

    $('.ui-resizable-handle').hover(function() {

        layout.disable();
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
////////////////////////////////
    $.ui.plugin.add("resizable", "alsoResizeReverse", {

        start: function(event, ui) {

            var self = $(this).data("resizable"), o = self.options;

            var _store = function(exp) {
                $(exp).each(function() {
                    $(this).data("resizable-alsoresize-reverse", {
                        width: parseInt($(this).width(), 10), height: parseInt($(this).height(), 10),
                        left: parseInt($(this).css('left'), 10), top: parseInt($(this).css('top'), 10)
                    });
                });
            };

            if (typeof(o.alsoResizeReverse) == 'object' && !o.alsoResizeReverse.parentNode) {
                if (o.alsoResizeReverse.length) { o.alsoResize = o.alsoResizeReverse[0];    _store(o.alsoResizeReverse); }
                else { $.each(o.alsoResizeReverse, function(exp, c) { _store(exp); }); }
            }else{
                _store(o.alsoResizeReverse);
            }
        },

        resize: function(event, ui){
            var self = $(this).data("resizable"), o = self.options, os = self.originalSize, op = self.originalPosition;

            var delta = {
                height: (self.size.height - os.height) || 0, width: (self.size.width - os.width) || 0,
                top: (self.position.top - op.top) || 0, left: (self.position.left - op.left) || 0
            },

            _alsoResizeReverse = function(exp, c) {
                $(exp).each(function() {
                    var el = $(this), start = $(this).data("resizable-alsoresize-reverse"), style = {}, css = c && c.length ? c : ['width', 'height', 'top', 'left'];

                    $.each(css || ['width', 'height', 'top', 'left'], function(i, prop) {
                        var sum = (start[prop]||0) - (delta[prop]||0);
                        if (sum && sum >= 0)
                            style[prop] = sum || null;
                    });

                    //Opera fixing relative position
                    if (/relative/.test(el.css('position')) && $.browser.opera) {
                        self._revertToRelativePosition = true;
                        el.css({ position: 'absolute', top: 'auto', left: 'auto' });
                    }

                    el.css(style);
                });
            };

            if (typeof(o.alsoResizeReverse) == 'object' && !o.alsoResizeReverse.nodeType) {
                $.each(o.alsoResizeReverse, function(exp, c) { _alsoResizeReverse(exp, c); });
            }else{
                _alsoResizeReverse(o.alsoResizeReverse);
            }
        },

        stop: function(event, ui){
            var self = $(this).data("resizable");

            //Opera fixing relative position
            if (self._revertToRelativePosition && $.browser.opera) {
                self._revertToRelativePosition = false;
                el.css({ position: 'relative' });
            }

            $(this).removeData("resizable-alsoresize-reverse");
        }
    });



    $("layoutblock").resizable({
        alsoResizeReverse: "layoutblock"
    });
/*

$(function() {

    $(".resizable").resizable({
        alsoResizeReverse: ".resizable"
    });

}); */
