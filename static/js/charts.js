function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    gaugeChart(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  gaugeChart(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log("Below is the resultArray.");
    console.log(resultArray);

    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then(function(data) {
  console.log(data);
  console.log("Above is 'data'.");

    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    console.log(samples);
    console.log("Above is 'samples'.");

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray1 = samples.filter(sampleObj => sampleObj.id == sample);
    console.log("Below is resultArray1.");
    console.log(resultArray1);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray1[0];
    console.log("Below is result.");
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    console.log("Below are the 'otu_ids'.");
    var otuIds = Object.entries(result.otu_ids);
    console.log(otuIds);

    console.log("Below are the 'otu_labels'.");
    var otuLabels = Object.entries(result.otu_labels);
    console.log(otuLabels);

    console.log("Below are the 'sample_values'.");
    var sampleValues = Object.entries(result.sample_values);
    console.log(sampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.

    var sortedIds = otuIds.sort((a,b) => a-b);
    var topTenIds = sortedIds.slice(0,10).reverse();

    var topTenSamples = sampleValues.slice(0,10).reverse();
    var topTenLabels = otuLabels.slice(0,10).reverse();

    var xTicks = topTenSamples.map(x=>x[1]);
    console.log("Below are the 'xticks'.");
    console.log(xTicks);

    var yTicks = topTenIds.map(y=> `OTU ${y[1]}  `);
    console.log("Below are the 'yticks'.");
    console.log(yTicks);

    var tLabels = topTenLabels.map(z=>z[1]);
    console.log("Below are the tlabels.");
    console.log(tLabels);

    // Bar Chart
    // 8. Create the trace for the bar chart.
    var barData = {
        x: xTicks,
        y: yTicks,
        type: "bar",
        text: tLabels,
        orientation: "h"
    };

    var barDataArray = [barData];
    console.log("Below is the bar graph data in JSON.");
    console.log(data);

    // 9. Create the layout for the bar chart.
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: {title: "Value"}
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barDataArray, barLayout);

  // Bubble chart
    // 1. Create the trace for the bubble chart.
    var xArray = otuIds.map(a=>a[1]);
    console.log ("Below: xArray");
    console.log(xArray);
    var yArray = sampleValues.map(b=>b[1]);
    console.log ("Below: yArray");
    console.log (yArray);
    var tArray = otuLabels.map(c=>c[1]);
    console.log ("Below: tArray");
    console.log (tArray);

        var bubbleData = [{
            x: xArray,
            y: yArray,
            text: tArray,
            type: "scatter",
            mode: "markers",
            marker: {size: yArray, sizeref: .05, sizemode: "area", color: xArray, colorscale: "Earth"},
        }];

    // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
            title: 'Bacteria Cultures per Sample',
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"},
            hovermode: "closest"
        };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
}

function gaugeChart(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray2 = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log("Below is the resultArray2.");
    console.log(resultArray2);

    // 3. Create a variable that holds the washing frequency.
    var wfreq = resultArray2[0].wfreq;
    console.log("Below is the person's wfreq.");
    console.log(wfreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
        {
            type: "indicator",
            mode: "gauge+number",
            value: resultArray2[0].wfreq,
            title: {text: "Belly Button Washing Frequency"},
            gauge: {
                axis: {range: [null, 10], tickwidth: 2, tickcolor: "gray"},
                bar: {color: "black"},
                bgcolo: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    {range: [0,2], color: "red"},
                    {range: [2,4], color: "orange"},
                    {range: [4,6], color: "yellow"},
                    {range: [6,8], color: "green"},
                    {range: [8,10], color: "darkgreen"}
                ]
            }
        }
    ];

    // 5. Create the layout for the gauge chart.
//    var gaugeLayout = {
//      height: 40,
//      margin: { t: 0, r: 0, l: 0, b: 0 },
//      paper_bgcolor: "lavender",
//      font: { color: "darkblue", family: "Arial" }
//    }

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData);
    });
}