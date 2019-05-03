import { Graph } from "./graph";

class RankingGraph extends Graph {
  constructor(dimens, data) {
    super(dimens, data);
  }

  draw() {
    var rankedRunAttendance = this.aggregateData(this.data)

    var x = d3.scaleLinear().range([0, this.w]);
    var y = d3.scaleBand().range([this.h, 0]);
    
    rankedRunAttendance.forEach((d) => {
      d.runner = d['runner'];
      d.runCount = d['runCount']
    });

    // set axis ranges
    x.domain([0, d3.max(rankedRunAttendance, function(d) { return d.runCount; })]);
    y.domain(rankedRunAttendance.map(function(d) { return d.runner; }));

    var svg = d3.select('#ranking')
      .append('svg')
      .attr('width', this.w + this.margin.left + this.margin.right)
      .attr('height', this.h + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    var xAxis = d3.axisBottom(x)
      .tickFormat(d3.format('d'))
      // force ticks only for integers
      .ticks(d3.max(rankedRunAttendance, function(d) { return d.runCount; }) - 1);
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0, ' + this.h + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'axis-label')
      .attr('dx', this.w/2 + 'px')
      .attr('dy', '34px')
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
      .attr("height", 15);
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