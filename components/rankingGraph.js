class RankingGraph {
  constructor(data) {
    this.data = data
  }

  draw() {
    var rankedRunAttendance = this.aggregateData(this.data)

    var margin = { top: 30, right: 30, bottom: 30, left: 50 },
    w = 600 - margin.left - margin.right,
    h = 200 - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([0, w]);
    var y = d3.scaleBand().range([h, 0]);
    
    rankedRunAttendance.forEach((d) => {
      d.runner = d['runner'];
      d.runCount = d['runCount']
    });

    // set axis ranges
    x.domain([0, d3.max(rankedRunAttendance, function(d) { return d.runCount; })]);
    y.domain(rankedRunAttendance.map(function(d) { return d.runner; }));

    var svg = d3.select('#ranking')
      .append('svg')
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xAxis = d3.axisBottom(x)
      .tickFormat(d3.format('d'))
      // force ticks only for integers
      .ticks(d3.max(rankedRunAttendance, function(d) { return d.runCount; }) - 1);
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0, ' + h + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'axis-label')
      .attr('dx', '480px')
      .attr('dy', '30px')
      .text('NUMBER OF RUNS');
 
    var yAxis = d3.axisLeft(y);
    svg.append('g')
      .attr('class', 'axis')
      .call(yAxis);
 
    svg.selectAll('bar')
      .data(rankedRunAttendance)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr("width", function(d) { return x(d.runCount); })
      .attr("y", function(d) { return y(d.runner); })
      .attr("height", 16);
  }

  aggregateData(data) {
    // list of all runner attendances
    var allRunners = data.map((run) => {
      return run['Runners'];
    }).join(', ').split(', ');
    
    // derive total attendance for each runner
    var runAttendance = allRunners.reduce((runTotals,runner) => {
      runTotals[runner] = (runTotals[runner] || 0) + 1
      return runTotals;
    }, {});
    
    // sort by total attendance
    return Object.keys(runAttendance).map(k => {
      return {
        'runner': k,
        'runCount': runAttendance[k]
      };
    }).sort((a, b) => a.runCount - b.runCount);
  }
}

export { RankingGraph };