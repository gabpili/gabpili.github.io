let d3 = window.d3;
let c = 0;

const process = data =>  {
  const counts = data.reduce((acc, { CountryName }) => {
    acc.afghan     += CountryName.toLowerCase().includes("Afghanistan");
    acc.count = acc.count + c + 1;
    console.log(acc.count );

    return acc;
  }, 
  // { mr: 0, mrs: 0, male: 0, female: 0, age: 0 });
  { afghan: 0});

  console.log("Total Afghan countries", counts.count);
}


// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#stacked_data")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
  d3.csv("global_food_prices.csv").then( function(data) {
      process(data);

  // List of subgroups = header of the csv files = soil condition here
  const subgroups = data.columns.slice(9)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => (d.CityName))

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 60])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.CityName))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())

        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top  + 20)
        .text("Market Name");
})