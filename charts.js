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
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
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
    console.log("This is a test1.");

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    console.log("This is a test2.");

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log("This is a test3.");
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = Object.entries(result.otu_ids);
    console.log(otu_ids);
    var otu_labels = Object.entries(result.otu_labels);
    console.log(otu_labels);
    var sample_values = Object.entries(result.sample_values);
    console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last. 

    var sorted_ids = otu_ids.sort((a,b) => a-b);
    var top_ten_ids = sorted_ids.slice(0,10);

    var top_ten_samples = sample_values.slice(0,10);


    var xticks = top_ten_samples.map(x=>x[1]);
    console.log(xticks);

    var yticks = top_ten_ids.map(y=>y[1]);
    console.log(yticks);




    // 8. Create the trace for the bar chart. 
    var barData = {
        x: xticks,
        y: yticks,
        type: "bar",
        orientation: "h"
    };
    var data = [barData];
    console.log(data);

    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: {title: "Value"},
        yaxis: {title: "Bacteria Id"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, barLayout)
  });
}
