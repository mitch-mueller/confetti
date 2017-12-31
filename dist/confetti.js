/*
confetti.js by mitch-mueller
*/
(function ($) {
    $.fn.confetti = function( options ) {

        // figure out dimensions of canvas
        var targetWidth = $(window).innerWidth();
        var targetHeight = $(window).innerHeight();

        var canvas = $("<canvas/>") // canvas creation
            .prop({ // dimensions of canvas
                width: targetWidth,
                height: targetHeight
            })
            .css({ // position of canvas
                "position": "fixed",
                "z-index": "10000000",
                "top": "0",
                "left": "0"
            })
            .appendTo(this) // add to body
            .get(0); // make it a canvas that native javascript can handle

        var context = canvas.getContext("2d"); // create context to draw on

        //default options
        //creating an object and adding default, then user options
        var opts = $.extend({}, $.fn.confetti.defaults, options);

        // used for logging
        var stats = {
            frames: 0,
            totalFlakesGenerated: 0,
            lastTotalFlakesGenerated: 0
        }

        // holds all flakes that are rendered
        var flakes = [];

        /*
         *  @param i
         *  creates a flake at index i
         *  using random variations based on options
         */
        var flakeFactory = function(i) {
            flakes[i] = {
                "x": Math.floor((Math.random() * (targetWidth-opts.maxSize)) + opts.maxSize),
                "y": 0,
                "size": Math.floor((Math.random() * opts.maxSize) + opts.minSize),
                "speed": Math.floor((Math.random() * opts.maxSpeed) + opts.minSpeed),
                "color": opts.colors[Math.floor(Math.random() * opts.colors.length)]
            };
            stats.totalFlakesGenerated++; // again, just for logging purposes
        }

        // first run, please create flakes
        for (var i = 0; i<opts.population; i++) {
            flakeFactory(i);
        }

        // loop that executes n-times a second
        var loop = function(context, flakes) {
            logic(flakes);
            render(context, flakes);
        }

        //figure out location of each flake
        var logic = function(flakes) {

            
            if (flakes.length < opts.population) // not enough flakes on screen
                for (var i = flakes.length; i<opts.population; i++) {
                    flakeFactory(i); // create new flake
                }
            else if (opts.population < flakes.length) // too many flakes on screen
                for (var i = opts.population; i<flakes.length; i++) {
                    flakes.splice(i, 1); // remove flake
                }
            

            // for every flake, move according to individual speed.
            // if out of screen, replace with new flake starting from the top    
            for (var i = 0; i<flakes.length; i++) {
                flakes[i].y += flakes[i].speed;
                if (flakes[i].y > 1080) {
                    flakeFactory(i);
                }
            }

            //if logging is enabled, print this once a second
            if (opts.log && stats.frames % opts.frameRate == 0) {
                var output1 = "%c Konfetti ";
                var output2 = "%c Total Flakes: ";
                var output3 = "%c " + stats.totalFlakesGenerated + " ";
                var output4 = "%c; Last Second: ";
                var output5 = "%c " + (stats.totalFlakesGenerated - stats.lastTotalFlakesGenerated) + " ";
                console.log(output1 + output2 + output3 + output4 + output5, 'background: #222; color: #bada55;', 'background: #888; color:#fff;', 'background: #444; color: #fff', 'background: #888; color:#fff;', 'background: #444; color: #fff');
                stats.lastTotalFlakesGenerated = stats.totalFlakesGenerated;
            }

        };

        // render all flakes on screen
        var render = function(context, flakes) {

            // clear the screen
            context.clearRect(0, 0, 1920, 1080); 

            // for every flake, draw a circle based on individual attributes
            for (var i = 0; i < flakes.length; i++) {

                var flake = flakes[i];

                context.beginPath();
                context.arc(flake.x, flake.y, flake.size / 2, 0, Math.PI*2);
                context.fillStyle = flake.color;
                context.fill();
            }

            // again, just for statistics
            stats.frames++;
        };

        // repeat loop() a frameRate-times a second
        window.setInterval(function() {loop(context, flakes);}, 1000/opts.frameRate);

        // yeah, chaining is awesome B-)
        return this;
    };

    // default values, can be overriden by passing an {} to confetti()
    $.fn.confetti.defaults = {
        population: 80,
        minSize: 16,
        maxSize: 24,
        minSpeed: 6,
        maxSpeed: 12,
        frameRate: 25,
        colors: [
            "#001f3f",
            "#0074D9",
            "#7FDBFF",
            "#39CCCC",
            "#3D9970",
            "#2ECC40",
            "#01FF70",
            "#FFDC00",
            "#FF851B",
            "#FF4136",
            "#85144B",
            "#F012BE",
            "#B10DC9",
            "#AAAAAA",
            "#DDDDDD"
        ],
        log: false
    };
}(jQuery));