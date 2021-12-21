// histogram function
function Histogram(options) {
    var container = options.container,
        height = options.height,
        width = options.width,
        data = options.data,
        threshold = options.threshold,
        colorActualPos = options.colorActualPos,
        colorActualNeg = options.colorActualNeg,
        interaction = options.interaction,
        update = options.update

    if (!data) { throw new Error('Please pass data') }

    var hover_correction = 0.025


    // Update if it is currently available
    if(update != null){
    
        //append the bar rectangles to the svg element
        update.NegBars
            .style("fill", function(d) { 
                if (d.x0 + hover_correction < threshold) { return update.colorActualNeg['light'] } 
                else { return update.colorActualNeg['dark'] } })
            .style("opacity", 0.6)

        update.PosBars
            .style("fill", function(d) { 
                if (d.x0 + hover_correction < threshold) { return update.colorActualPos['light'] } 
                else { return update.colorActualPos['dark'] } })
            .style("opacity", 0.6)

        return
    }




    const createSeq = (len, val) => {
        var adj_len = len + 1
        arr = new Array((adj_len)).fill(0).map((x, i) => val / (adj_len - 1) * i)
        arr.pop()
        return arr;
    }

    // set the ranges
    var adj_for_brush = 0.0001 //without adjustment, the brush is not able to select all of the records
    var x = d3.scaleLinear()
        .domain([0, (1 + adj_for_brush)])
        .rangeRound([0, width])
    var y = d3.scaleLinear()
        .range([height, 0])

    // set the parameters for the histogram
    var histogram = d3.bin()
        .value(function(d) { return d.yhat })
        .domain(x.domain())
        .thresholds(createSeq(20, 1)) //fixed edge cases by using an adjustment

    // scale the range of the data
    // group the data for the bars
    var bins1 = histogram(data.filter(function(d) { return d.actualy === 0.0 }))
    var bins2 = histogram(data.filter(function(d) { return d.actualy === 1.0 }))

    // scale the range fo the data in the y domain
    var mx1 = d3.max(bins1, function(d) { return d.length })
    var mx2 = d3.max(bins2, function(d) { return d.length })
    y.domain([0, Math.max(mx1, mx2)])

    // get plot area and remove old parts, if necessary
    var HistSvg = d3.select(container).select("g")
    if (HistSvg.selectChild()) { HistSvg.selectAll("*").remove() }

    hover_correction = 0.025
        //append the bar rectangles to the svg element
    var NegBars = HistSvg.append("g").selectAll("rect")
        .data(bins1)
        .enter().append("rect")
        .attr("class", "bar neg")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")" })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1 })
        .attr("height", function(d) { return height - y(d.length) })
        .style("fill", function(d) { if (d.x0 + hover_correction < threshold) { return colorActualNeg['light'] } else { return colorActualNeg['dark'] } })
        .style("opacity", 0.6)

    var PosBars = HistSvg.append("g").selectAll("rect")
        .data(bins2)
        .enter().append("rect")
        .attr("class", "bar pos")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")" })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1 })
        .attr("height", function(d) { return height - y(d.length) })
        .style("fill", function(d) { if (d.x0 + hover_correction < threshold) { return colorActualPos['light'] } else { return colorActualPos['dark'] } })
        .style("opacity", 0.6)

    //add the x axis
    HistSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    //add the y axis
    HistSvg.append("g")
        .call(d3.axisLeft(y))

    //manual legend TODO: take from dualaxis.js

    // add y1 label
    HistSvg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -20)
        .attr("dy", ".75em")
        .text("Count")

    HistSvg.append("g")
        .append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 30)
        .text("Predicted Probability")



    // Legend
    var xPos = width + (200 / 10),//(margin.right / 4),
        yPos = height / 2

    var key = HistSvg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate( " + xPos + "," + yPos + ")")

    key.append("circle")
        //.attr("class", labels.y1Data)
        .attr("cx", 0)
        .attr("cy", -10)
        .attr("r", 6)
        .attr("fill", colorActualNeg['dark'])

    key.append("circle")
        //.attr("class", labels.y2Data)
        .attr("cx", 0)
        .attr("cy", 10)
        .attr("r", 6)
        .attr("fill", colorActualPos['dark'])

    key.append("text").attr("x", 10).attr("y", -10).text(capitalize("Actual Negative")).style("font-size", "15px").attr("alignment-baseline", "middle")
    key.append("text").attr("x", 10).attr("y", 10).text(capitalize("Actual Positive")).style("font-size", "15px").attr("alignment-baseline", "middle")








    if (interaction) {
        //add brushing
        HistSvg.append("g").call(d3.brushX()
                .extent([
                    [0, 0], 
                    [width, height]
                ]).on("start brush", brushed))

        function brushed(event) {
            var low = x.invert(event.selection[0]),
                high = x.invert(event.selection[1])
            var selected = data.filter(function(d) { return (d.yhat > low & d.yhat < high) })
            displayTable(selected)

            function displayTable(d_brushed) {
                if (d_brushed.length > 0) {
                    clearTableRows()
                    d3.select("#SelectedCount").text("Rows selected: " + d_brushed.length)
                    d_brushed.forEach(d_row => populateTableRow(d_row))
                } else {
                    clearTableRows()
                    d3.select("#SelectedCount").text("Rows selected: " + d_brushed.length)
                }
            }

            //TODO: add styling for each td in row
            function populateTableRow(d_row) {
                var d_row_filter = [d_row.id, d_row.text, d_row.actualy, d_row.yhat.toFixed(3)]
                d3.select("#table").select("tbody")
                    .append("tr")
                    .attr("class", "row_data")
                    .selectAll("td")
                    .data(d_row_filter)
                    .enter()
                    .append("td")
                    .attr("align", (d, i) => i == 0 ? "left" : "right")
                    .text(d => d)
            }

            function clearTableRows() {
                d3.select("#table").selectAll(".row_data").remove()
            }
        }
        return {NegBars, PosBars, colorActualNeg, colorActualPos}
    }
}