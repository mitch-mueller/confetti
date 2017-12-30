/*
confetti.js by mitch-mueller
*/
(function ($) {
    $.fn.confetti = function( options ) {

        //default options
        //creating an object and adding default, then user options
        var opts = $.extend({}, $.fn.confetti.defaults, options);

        return this;

        /*
        if selector targets more than one element, each() is required

        return this.each(function() {

        });
        */
    };

    $.fn.confetti.defaults = {

    };
}(jQuery));