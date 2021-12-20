function setMarkdownGuide() {
    var str = `### Guide
The following interactive visualization is useful for a variety of purposes, but it is 
spectifically designed to solve three problem domains: Active Learning, Threshold 
Analysis, and Performance Monitoring.

Questions that it can be used to answer include:

* When we are training a model, how do we focus our efforts to minimize time spent labeling?
* Once we have a good model, how do we adapt it to our needs without re-training it?
* After a model is deployed, how do we know it is working as intended despite possible 
changes in input data?

This sidebar will explain how it can be used to solve these problems.

-----------------

Working from top to bottom, the 'Data selected' dropdown allows teh user to choose amongst 
different data files.  For demonstration purposes, we use: 'simulated' data for an ideal 
situation, 'typical' data to display ordinary decent model results, and 'actual solution' to
show the current model in focus.

The first graph shows individual Precision and Recall lines across model threshold.  Enter 
your mouse from the sides to move the interactive threshold, then exit your mouse from the 
top / bottom to main its position.  Changing the threshold will update the model result
calculations in the confusion matrix, as well as the Precision-Recall graph.

The second graph is the histogram of model predicted probabilities, grouped by the Actual
category.  You can use hte mouse to click-down and 'brush' to select specific records by 
predicted probability.  These selections appear in the bottom table where they can be viewed,
individually.
`

    var md = window.markdownit({ breaks: false }),
        result = md.render(str.replace("'", "").replace("`", "")),
        div = document.getElementById('guide')

    div.innerHTML = result
}