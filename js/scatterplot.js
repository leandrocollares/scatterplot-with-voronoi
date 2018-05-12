var margin = {top: 40, right: 20, bottom: 85, left: 75},
    width = 900 - margin.left - margin.right,
    height = 445 - margin.top - margin.bottom;

var svg = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

var wrapper = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); 

var tooltip = d3.select('#chart').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

var colours = ['#009e73','#d55e00','#cc79a7 ','#0072b2 ','#f0e442'];

var xScale = d3.scaleLinear().range([0, width]),
    yScale = d3.scaleLinear().range([height, 0]),
    colourScale = d3.scaleOrdinal(colours);

d3.csv('data/indices.csv', function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.ihdi = +d.ihdi;
    d.eci = +d.eci;
  });

  xScale.domain(d3.extent(data, function(d) { return d.eci; })).nice();
  yScale.domain([0.1, 0.9]);

  wrapper.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale))
    .append('text')
      .attr('x', width - 10)
      .attr('y', 40)
      .style('fill', '#333333')
      .style('text-anchor', 'middle')
      .text('ECI');

  wrapper.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(yScale))
    .append('text')
      .attr('x', 0)
      .attr('y', -20)
      .style('fill', '#333333')
      .style('text-anchor', 'middle')
      .text('IDHI');
   
  // Creates circles
  var circles = wrapper.selectAll('circle')
      .data(data)
    .enter().append('circle')
      .attr('class', 'circle')
      .attr('r', 4)
      .style('fill', function(d) { return colourScale(d.continent); })
      .style('opacity', 0.7)
      .attr('cx', function(d) { return xScale(d.eci); })
      .attr('cy', function(d) { return yScale(d.ihdi); });  

  // The Voronoi diagram partitions the scatterplot area into cells to improve
  // the UX. Instead of having to place the mouse pointer over the circle to
  // see the corresponding tooltip with ECI and IHDI info, users just need to 
  // place the pointer close enough to the circle.
  var voronoiDiagram = d3.voronoi()
      .x(function (d) { return xScale(d.eci); })
      .y(function (d) { return yScale(d.ihdi); })
      .size([width, height])(data);

  // The Voronoi radius determines how close the pointer has to be to cause the
  // circle to be highlighted and the corresponding tooltip to be shown.
  var voronoiRadius = width / 25;

  wrapper.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale))
    .append('text')
      .attr('x', width - 10)
      .attr('y', 40)
      .style('fill', '#333333')
      .style('text-anchor', 'middle')
      .text('ECI');

  // The radius of the highlighted circle increases.
  wrapper.append('circle')
      .attr('class', 'highlighted-circle')
      .attr('r', 6) 
      .style('fill', 'none')
      .style('display', 'none');  

  // The invisible overlay on top of the scatterplot captures mouse events. 
  wrapper.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .style('opacity', 0)
      .on('mousemove', function () {
        var mouseCoordinates = d3.mouse(this);
        var mouseX = mouseCoordinates[0];
        var mouseY = mouseCoordinates[1];

        // voronoiDiagram.find() locates the closest Voronoi site to the
        // mouse cursor. 
        var site = voronoiDiagram.find(mouseX, mouseY, voronoiRadius);

        // If a site is found, the point mapped to that site by the computed 
        // Voronoi diagram is highlighted and the tooltip appears. Otherwise,
        // nothing happens. 
        highlight(site && site.data);
      })
      .on('mouseleave', highlight(null));
  
  // Creates legend
  var legend = wrapper.selectAll('.legend')
      .data(colourScale.domain())
    .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) { return 'translate(' + i * 65 + ', 0)'; })
      .on('mouseover', changeOpacity(0.1))
      .on('mouseout', changeOpacity(0.7));

  legend.append('rect')
      .attr('x', width / 2 - 155)
      .attr('y', height + 50)
      .attr('width', 60)
      .attr('height', 15)
      .style('fill', colourScale)
      .style('opacity', 0.7);

  legend.append('text')
      .attr('x', width / 2 - 125)
      .attr('y', height + 75)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text(function(d) { return d; });
});

// Decreases the opacity of non-selected circles when hovering over legend elements
function changeOpacity(opacity) {
  return function(d) {
    var hoveredOver = d;
    wrapper.selectAll('.circle')
        .filter(function(e) { return e.continent != hoveredOver})
        .transition()
        .duration(200)
        .style('opacity', opacity);
    };
}

function highlight(d) {
  if (!d) {
    d3.select('.highlighted-circle').style('display', 'none');
    tooltip.style('opacity', 0);
  } else {
    d3.select('.highlighted-circle')
        .style('display', '')
        .style('fill', colourScale(d.continent))
        .attr('cx', xScale(d.eci))
        .attr('cy', yScale(d.ihdi));
    tooltip.style('opacity', 0.9);
    tooltip.html(
      '<p><strong>' + d.country + '</strong></p>' +
      '<p><strong>ECI: </strong>' + d.eci + '</p>' +
      '<p><strong>IHDI: </strong>' + d.ihdi + '</p>'
    )
        .style('left', (d3.event.pageX - 10) + 'px')
        .style('top', (d3.event.pageY + 25) + 'px');  
}}