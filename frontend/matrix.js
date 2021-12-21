// matrix function
function Matrix(options) {
    var width = 250,
        height = 250,
        data = options.data,
        container = options.container,
        legend_container = options.legend_container,
        labelsData = options.labels,
        startColor = options.start_color,
        endColor = options.end_color,
        update = options.update

    var widthLegend = 100

    if (!data) { throw new Error("Please pass data") }

    if (!Array.isArray(data) || !data.length || !Array.isArray(data[0])) {
        throw new Error("It should be a 2-D array")
    }

    // check if if it currently exists
    var TableSvg = d3.select(container)
    //if (TableSvg.selectChild().size() > 0) {

    
    // Update if it currently exists
    if(update != null){

        var row = TableSvg.selectAll(".row") 
        var cell = row.selectAll(".cell")

        cell.select("text")
            .style("fill", function(d, i) {
            return d >= maxValue / 2 ? "white" : "black"
            })
            .text(function(d, i) { return d })

        row.selectAll(".cell")
            .data(function(d, i) { return data[i] })
            .style("fill", update.colorMap) 

        return
    }




    var maxValue = d3.max(data, function(layer) {
        return d3.max(layer, function(d) {
            return d
        })
    })

    var minValue = d3.min(data, function(layer) {
        return d3.min(layer, function(d) {
            return d
        })
    })

    var numrows = data.length,
        numcols = data[0].length

    var x = d3.scaleBand()
        .domain(d3.range(numcols))
        .range([0, width])

    var y = d3.scaleBand()
        .domain(d3.range(numrows))
        .range([0, height])

    var colorMap = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([startColor, endColor])

    var background = TableSvg.append("rect")
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .attr("width", width)
        .attr("height", height)

    var row = TableSvg.selectAll(".row")
        .data(data)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) {
            return "translate(0," + y(i) + ")"
        })

    var cell = row.selectAll(".cell")
        .data(function(d) { return d })
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d, i) {
            return "translate(" + x(i) + ", 0)"
        })

    cell.append("rect")
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("stroke-width", 0)

    cell.append("text")
        .attr("dy", ".32em")
        .attr("x", x.bandwidth() / 2)
        .attr("y", y.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .style("fill", function(d, i) {
            return d >= maxValue / 2 ? "white" : "black"
        })
        .text(function(d, i) { return d })

    row.selectAll(".cell")
        .data(function(d, i) { return data[i] })
        .style("fill", colorMap)

    var labels = TableSvg.append("g")
        .attr("class", "labels")

    var columnLabels = labels.selectAll(".column-label")
        .data(labelsData)
        .enter().append("g")
        .attr("class", "column-label")
        .attr("transform", function(d, i) {
            return "translate(" + x(i) + "," + height + ")"
        })

    columnLabels.append("line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .attr("x1", x.bandwidth() / 2)
        .attr("x2", x.bandwidth() / 2)
        .attr("y1", 0)
        .attr("y2", 5)


    columnLabels.append("text")
        .attr("x", 30)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", ".22em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-60)")
        .text(function(d, i) { return d })

    var rowLabels = labels.selectAll(".row-label")
        .data(labelsData)
        .enter().append("g")
        .attr("class", "row-label")
        .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")" })

    rowLabels.append("line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", y.bandwidth() / 2)
        .attr("y2", y.bandwidth() / 2)

    rowLabels.append("text")
        .attr("x", -8)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(function(d, i) { return d })

    //TODO: labels for "Model Result" and "Actual Outcomes"

    var check_key = d3.select(legend_container).selectAll("svg")
    if (check_key.selectChild().size() > 0) { return }

    var key = d3.select(legend_container).append("svg")
        .attr("width", widthLegend)
        .attr("height", height + 20 + 60)

    var legend = key.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad")

    legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", endColor)
        .attr("stop-opacity", 1)

    legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", startColor)
        .attr("stop-opacity", 1)

    key.append("rect")
        .attr("width", widthLegend / 2 - 10)
        .attr("height", height)
        .style("fill", "url(#gradient)")

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([minValue, maxValue])

    var yAxis = d3.axisRight(y)

    key.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(41," + 0 + ")")
        .call(yAxis)

    return {"colorMap": colorMap}
}







//table generation function
function tabulate(data, columns, container) {

    var check_key = d3.select(container)
    if (check_key.selectChild().size() > 0) { check_key.selectAll("*").remove() }

    var table = d3.select(container)
        .append("foreignObject")
        .attr("width", 480)
        .attr("height", 50) //TODO: make this modular with the other pieces, variable dimensions, etc.
        .append("xhtml:div")
        .append("table")
        .attr("id", "score"),
        thead = table.append("thead"),
        tbody = table.append("tbody")

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns).enter()
        .append("th")
        .text(function(column) { return column })

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data).enter()
        .append("tr")

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {
                    column: column,
                    value: row[column]
                }
            })
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier") //sets the font style
        .html(function(d) { return d.value })

    return table

}