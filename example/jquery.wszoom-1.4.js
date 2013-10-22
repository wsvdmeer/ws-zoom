/*
 *  Project: WS Zoom
 *  Description: zoom   
 *  Author: Wiebe Steven v/d Meer
 *  Version:1.2 21-08-2013
 *  License:
 */
;(function ( $, window, document, undefined ) {
    // Create the defaults once
    var pluginName = "wszoom",
    defaults = {
      windowXpos:0,
      windowYpos:0,
      windowWidth:300,
      windowHeight:300,
      debug:false,
      fitImage:false,
      centerImage:false
    };

    // The actual plugin constructor
    function Plugin( element, options ) {
      this.element        = element;
      this.options        = $.extend( {}, defaults, options );
      this._defaults      = defaults;
      this._name          = pluginName;
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
          var windowXpos    = this.options.windowXpos;
          var windowYpos    = this.options.windowYpos;
          var windowWidth   = this.options.windowWidth;
          var windowHeight  = this.options.windowHeight;
          var debug         = this.options.debug;
          var fitImage      = this.options.fitImage;
          var centerImage   = this.options.centerImage;
          
          //ZOOM
          var obj           = $(this.element);
          var thumb         = obj.find("img");  
          var scale         = 0;
          var thumbX        = 0;
          var thumbY        = 0;
          var thumbWidth    = 0; 
          var thumbHeight   = 0;
          
          //ADDED 28-08-2013
          //http://css-tricks.com/snippets/jquery/get-an-images-native-width/
          var dummyImage = new Image();
          dummyImage.src = thumb.attr("src");
         
            
           //ADDED 20-09-2013
           //if image is not cached
           var interval; 
           interval = setInterval(function(){
            trace(dummyImage.width+"X"+dummyImage.height);
            if((dummyImage.width!=0)||(dummyImage.height!=0)){
                clearInterval(interval);
                //CHECK IMAGE SIZE AND SCALE TO VIEWPORT
                if(fitImage){
                  if(thumb.width()<thumb.height()){
                      scale           = dummyImage.height/dummyImage.width;
                      //DONT UPSCALE
                      if(thumbWidth<obj.width()){
                          thumbWidth      = dummyImage.width;
                          thumbHeight      =  dummyImage.width*scale; 
                      }else{
                          thumbWidth      = obj.width();
                          thumbHeight     = obj.width()*scale; 
                      }
                    }else if(thumb.width()>thumb.height()) {
                      scale           = dummyImage.width/dummyImage.height;   
                      if(thumbWidth<obj.width()){
                          thumbHeight      = dummyImage.height;
                          thumbWidth      =  dummyImage.height*scale; 
                      }else{
                          thumbHeight     = obj.height();
                          thumbWidth      =  obj.height()*scale;
                      }  
                    }else{
                      scale           = 0;
                      thumbHeight      = dummyImage.height;
                      thumbWidth      =  dummyImage.width;
                  }
                }
                
                //
                if(centerImage){
                    thumbX            = Math.round((obj.width()-thumbWidth)*.5);
                    thumbY            = Math.round((obj.height()-thumbHeight)*.5);
                }
                  
                
                thumb.css({height:Math.round(thumbHeight),width:Math.round(thumbWidth),left:thumbX, top:thumbY});
                thumb.attr({width:Math.round(thumbWidth),height:Math.round(thumbHeight)})
                
            }
            
          },1000);

          //IF DEBUG CREATE DEBUG ELEMENT
          var debugOutput = "";
          if(debug){
            debugOutput = "<span class='debug'></span>";
          }
              
          //CREATE WINDOW    
          obj.append("<div class='zoom-window' style='width:"+windowWidth+"px;height:"+windowHeight+"px;left:"+windowXpos+"px;top:"+windowYpos+"px'><img src=''>"+debugOutput+"</div>")
            
          //ADD EVENTS
          //START
          obj.on("mouseover touchstart",function(){ 
            //check if source is already set
            if(obj.find(".zoom-window img").attr("src")== thumb.data("large")){  
            }else{
              obj.find(".zoom-window img").attr("src",thumb.data("large"));
            }
            
            //SET ATTRIBUTES
             var img = obj.find(".zoom-window img");
             img.load(function() {

                
               $(this).attr("width",this.width);
                $(this).attr("height",this.height);
            });
            
            
            //show
            obj.find(".zoom-window").show();
            
          //END          
          }).on("mouseout touchend",function(){
            obj.find(".zoom-window").hide();
          //MOVE      
          }).on("onmousemove mousemove touchmove",function(event){
            //$(document)
            
            event.preventDefault();
            var xpos = 0;
            var ypos = 0;
            
            //if touch  
            if(event.type =="touchmove"){
              var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
              xpos      =  touch.pageX-thumb.offset().left;
              ypos      =  touch.pageY-thumb.offset().top;
            }else{
              xpos      = event.pageX-thumb.offset().left;
              ypos      = event.pageY-thumb.offset().top;
            }
                
            if(debug){obj.find(".debug").text(xpos+"x"+ypos)};

            if((xpos<0)||(xpos>thumb.width())){
              obj.find(".zoom-window").hide();
            }else  if((ypos<0)||(ypos>thumb.height())){
                   
            }
      
            var maxX;
            var maxY;
            var newX          = 0;
            var newY          = 0;
            var pcx           =(xpos/thumb.width())*1;
            var pcy           =(ypos/thumb.height())*1;
            var windowWidth   =  obj.find(".zoom-window").width();
            var windowHeight  = obj.find(".zoom-window").height();
            var big           = obj.find(".zoom-window img");
            
            
            
            
            //SET POSITION  
            if(big.height()!=0 && big.width()!=0){
              
              
              maxX            = big.width()-windowWidth;
              maxY            = big.height()-windowHeight;
              newX            = -(maxX*pcx);
              newY            = -(maxY*pcy);
              big.css({left:newX+'px',top:newY+"px"});
            }
          });
          /**
          *DEBUG FUNCTION
          *log: login string
          */
          function trace(log) {
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


