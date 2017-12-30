/*
confetti.js by mitch-mueller
*/
(function ($) {
    $.fn.confetti = function( options ) {

        var canvas = document.getElementById("konfetti");
        var context = canvas.getContext("2d");

        //default options
        //creating an object and adding default, then user options
        var opts = $.extend({}, $.fn.confetti.defaults, options);

        var stats = {
            frames: 0,
            totalFlakesGenerated: 0,
            lastTotalFlakesGenerated: 0
        }

        var flakes = [];

        //TODO ::: 1920
        var flakeFactory = function(i) {
            flakes[i] = {
                "x": Math.floor((Math.random() * (1920-opts.maxSize)) + opts.maxSize),
                "y": 0,
                "size": Math.floor((Math.random() * opts.maxSize) + opts.minSize),
                "speed": Math.floor((Math.random() * opts.maxSpeed) + opts.minSpeed),
                "color": opts.colors[Math.floor(Math.random() * opts.colors.length)]
            };
            stats.totalFlakesGenerated++;
        }

        for (var i = 0; i<opts.population; i++) {
            flakeFactory(i);
        }

        var loop = function(context, flakes) {
            logic(flakes);
            render(context, flakes);
        }

        var logic = function(flakes) {

            if (opts.population > flakes.length) {
                for (var i = flakes.length; i<opts.population; i++) {
                    flakeFactory(i);
                }
            } else if (opts.population < flakes.length) {
                for (var i = opts.population; i<flakes.length; i++) {
                    flakes.splice(i, 1);
                }
            }

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

        var render = function(context, flakes) {
            context.clearRect(0, 0, 1920, 1080);

            for (var i = 0; i < flakes.length; i++) {

                var flake = flakes[i];

                context.beginPath();
                context.arc(flake.x, flake.y, flake.size / 2, 0, Math.PI*2);
                context.fillStyle = flake.color;
                context.fill();
            }
            stats.frames++;
        };

        window.setInterval(function() {loop(context, flakes);}, 1000/opts.frameRate);


        return this;

        /*
        if selector targets more than one element, each() is required

        return this.each(function() {

        });
        */
    };

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