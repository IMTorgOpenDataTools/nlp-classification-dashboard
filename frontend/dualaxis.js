//const { forceSimulation } = require("d3");

// support function
function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

// dual y-axis line chart function
function DualYaxis(options) {
    var container = options.container,
        height = options.height,
        width = options.width,
        margin = options.margin,
        data = options.data,
        xData = options.xData,
        y1Data = options.y1Data,
        y2Data = options.y2Data,
        labels = options.labels,
        interaction = options.interaction


    if (!data) {
        throw new Error('Please pass data')
    }

    // set the ranges
    var x = d3.scaleLinear().range([0, width]),
        y1 = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height, 0])

    // define the y1Data line
    var line1 = d3.line()
        .x(function(d) { return x(d[xData]) })
        .y(function(d) { return y1(d[y1Data]) })

    // define the y2Data line
    var line2 = d3.line()
        .x(function(d) { return x(d[xData]) })
        .y(function(d) { return y2(d[y2Data]) })

    // scale the range of the data
    x.domain([0, 1]) //TODO: should use this >> d3.extent(data, function(d) { return x[xData] }))
    y1.domain([0, 1])
    y2.domain([0, 1])

    /*typically, we should use the code below, but for these instances we know that it should be 0,1
    y1.domain([0, d3.max(data, function(d){return d[y1Data]})])
    y1.domain([0, d3.max(data, function(d){return d[y2Data]})])
    */

    // get plot area and remove old parts, if necessary
    var LineSvg = d3.select(container).select("g")
    if (LineSvg.selectChild()) { LineSvg.selectAll('*').remove() }

    // Add the y1Data line path
    LineSvg.append("g").append("path")
        .data([data])
        .attr("class", "line " + labels.y1Data)
        .attr("d", line1)

    // Add the y2Data line path
    LineSvg.append("g").append("path")
        .data([data])
        .attr("class", "line " + labels.y2Data)
        .attr("d", line2)

    // add the x axis
    LineSvg.append("g")
        .attr("id", "x")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    // Add the y1 axis
    LineSvg.append("g")
        .attr("id", "y1")
        .attr("class", "axis")
        .call(d3.axisLeft(y1))

    // Add the y2 axis
    LineSvg.append("g")
        .attr("id", "y2")
        .attr("class", "axis")
        .attr("transform", "translate( " + width + ", 0)")
        .call(d3.axisRight(y2))

    // Add X label
    LineSvg.append("g")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 30)
        .attr("dy", ".75em")
        .text(capitalize(xData))

    // Add Y1 label
    LineSvg.append("g")
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -20)
        .attr("dy", ".75em")
        .text(capitalize(y1Data))

    // Add Y2 label
    LineSvg.append("g")
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "left")
        .attr("x", width)
        .attr("y", -20)
        .attr("dy", ".75em")
        .text(capitalize(y2Data))

    // Legend
    var xPos = width + (margin.right / 4),
        yPos = height / 2

    var key = LineSvg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate( " + xPos + "," + yPos + ")")

    key.append("circle")
        .attr("class", labels.y1Data)
        .attr("cx", 0)
        .attr("cy", -10)
        .attr("r", 6)

    key.append("circle")
        .attr("class", labels.y2Data)
        .attr("cx", 0)
        .attr("cy", 10)
        .attr("r", 6)

    key.append("text").attr("x", 10).attr("y", -10).text(capitalize(labels.y1Data)).style("font-size", "15px").attr("alignment-baseline", "middle")
    key.append("text").attr("x", 10).attr("y", 10).text(capitalize(labels.y2Data)).style("font-size", "15px").attr("alignment-baseline", "middle")










        // (used for interaction)
        if (interaction == true) {
            var focus = LineSvg.append("g")
                .attr("id", "focus")
                .style("display", "none")
    
            if (container == '#PlotA'){

                // append the x line
                focus.append("line")
                    .attr("class", "x")
                    .style("stroke", "black")
                    .style("stroke-dasharray", "3,3")
                    .style("opacity", 0.5)
                    .attr("y1", 0)
                    .attr("y2", height)
                
                // append the y line
                focus.append("line")
                    .attr("class", "y")
                    .style("stroke", "black")
                    .style("stroke-dasharray", "3,3")
                    .style("opacity", 0.5)
                    .attr("x1", width)
                    .attr("x2", width)
                
                // append the circle at the intersection
                focus.append("circle")
                    .attr("class", "y1")
                    .style("fill", "none")
                    .style("stroke", "black")
                    .attr("r", 4)
                
                // append the circle at the intersection
                focus.append("circle")
                    .attr("class", "y2")
                    .style("fill", "none")
                    .style("stroke", "black")
                    .attr("r", 4)

                focus.append("text")
                    .attr("class", "y6")
                    .attr("dx", 8)
                    .attr("dy", "1em")

            } else if (container == '#PlotC'){

                // append the circle at the intersection
                focus.append("circle")
                    .attr("class", "y3")
                    .style("fill", "none")
                    .style("stroke", "blue")
                    .attr("r", 4)
                
                // append the circle at the intersection
                focus.append("circle")
                    .attr("class", "y4")
                    .style("fill", "none")
                    .style("stroke", "blue")
                    .attr("r", 4)
                
                focus.append("text")
                    .attr("class", "y5")
                    .style("stroke", "white")
                    .style("stroke-width", "3.5px")
                    .style("opacity", 0.8)
                    .attr("dx", 8)
                    .attr("xy", "2.5em")
            }
        }
    return { 'x': x, 'y1': y1, 'y2': y2, 'focus': focus }
}