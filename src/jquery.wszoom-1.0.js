/*
 *  Project: WS Zoom
 *  Description: zoom   
 *  Author: Wiebe Steven v/d Meer
 *  License:
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "wszoom",
        defaults = {
          windowXpos:0,
          windowYpos:0,
          windowWidth:300,
          windowHeight:300
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            
            //OPTIONS
           var windowXpos = this.options.windowXpos;
           var windowYpos = this.options.windowYpos;
           var windowWidth = this.options.windowWidth;
           var windowHeight = this.options.windowHeight;
          
            //ZOOM
              var obj = $(this.element);
            
            
              //CREATE WINDOW
              obj.append("<div class='zoom-window' style='width:"+windowWidth+"px;height:"+windowHeight+"px;left:"+windowXpos+"px;top:"+windowYpos+"px'><img src=''></div>")
            
              obj.mouseover(function(){
                    if(obj.find(".zoom-window img").attr("src")== obj.find("img").data("large")){  
                    }else{
                        obj.find(".zoom-window img").attr("src",obj.find("img").data("large"));
                    }
                    obj.find(".zoom-window").show();
             }).mouseout(function(){
                    obj.find(".zoom-window").hide();
             }).mousemove(function(event){
               var xpos = event.pageX-obj.offset().left;
               var ypos = event.pageY-obj.offset().top;
        
               if((xpos<0)||(xpos>obj.find("img").width())){
                    obj.find(".zoom-window").hide();
               }else  if((ypos<0)||(ypos>obj.find("img").height())){
                   obj.find(".zoom-window").hide();
               }
        
               var pcx =(xpos/obj.find("img").width())*1;
               var pcy =(ypos/obj.find("img").height())*1;
               var windowWidth =  obj.find(".zoom-window").width();
               var windowHeight = obj.find(".zoom-window").height();
               var maxX;
               var maxY;
               var newX = 0;
               var newY = 0;
               var big = obj.find(".zoom-window img");
              
               if(big.height()!=0 && big.width()!=0){
                    maxX = big.width()-windowWidth;
                    maxY = big.height()-windowHeight;
                    newX = -(maxX*pcx);
                    newY = -(maxY*pcy);
                    big.css({left:newX+'px',top:newY+"px"});
               }
           });
            
            
             
            /**
            *DEBUG FUNCTION
            *log: login string
            */
            function debug(log) {
                if (window.console != undefined) {
                    console.log(log);
                }
            }
            
            
        },

        /*yourOtherFunction: function(el, options) {
            // some logic
        }*/
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );


