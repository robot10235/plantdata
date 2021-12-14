<!DOCTYPE html>
<html lang = 'en'>

<head>
    <meta charset = 'UTF-8'>
    <title>Small Multiple Maps</title>
    <script src = "https://d3js.org/d3.v3.min.js"></script>
    <script src = "https://d3js.org/queue.v1.min.js"></script>
    <style>
    html,
    body {
        margin: 0;
        padding: 0;
    }
    #vis {
        width: 100%;
        max-width: 960px;
        margin: 0 auto;
    }
    #vis div {
        float: left;
        position: relative;
    }
    #vis path {
        fill: #2ca25f;
        stroke: #FFF;
        stroke-width: 1px;
    }
    #vis p.legend {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
        left: 0;
        font-weight: bold;
        font-size: 11px;
    }
    </style>
</head>

<body>
    <div id = 'vis'></div>
    <script>
    var Vis = (function(d3) {
        var geojson;
        queue()
            .defer(d3.json, 'aust.json')
            .defer(d3.json, 'data.json')
            .await(visualize);

        var width = 150,
            height = 180;

        var projection = d3.geo.mercator().scale(600).translate([-30, 700]),
            path = d3.geo.path().projection(projection),
            opacity = d3.scale.linear().domain([0, 100]).range([0.2, 1]);

        function visualize(error, states, data) {

            var visualizationWrapper = d3.select('#vis');
            
            data.data.forEach(function(data, i) {
                var wrapper = visualizationWrapper
                    .append('div')
                    .style({
                        width: width + 'px',
                        height: height + 'px'
                    });

                createMap(wrapper, states, data)
            });
        }

        function createMap(wrapper, geo, data) {
            
            wrapper.append('p')
                .text(data.key)
                .attr('class', 'legend');

            var svg = wrapper.append('svg')
                .attr({
                    width: width,
                    height: height
                });

            svg.selectAll('path')
                .data(geo.features)
                .enter()
                .append('path')
                .attr('d', path)
                .style('opacity', function(d) {
                    var value = data.values[d.properties.GEN];
                    return opacity(value);
                })
                .attr('class', function(d) {
                    return d.properties.GEN.toLowerCase()
                })
                .on('mouseenter', function(d, i) {
                    notify('.' + d.properties.GEN.toLowerCase(), 'select')
                })
                .on('mouseleave', function(d) {
                    notify('.' + d.properties.GEN.toLowerCase(), 'unselect')
                })
                .on('select', function(self) {
                    var geoData = self.data();
                    self.node().parentNode.parentNode.getElementsByTagName('p')[0].innerHTML = data.values[geoData[0].properties.GEN];
                })
                .on('unselect', function(self) {
                    self.node().parentNode.parentNode.getElementsByTagName('p')[0].innerHTML = data.key;
                })

            function notify(selector, eventName) {
                d3.selectAll(selector)[0].forEach(function(el, i) {
                    var shape = d3.select(el);
                    shape.on(eventName)(shape);
                });
            }
        }
    })(d3);
    </script>
</body>

</html>
