class AttendanceGraph {
  constructor(data) {
    this.data = data
  }

  draw() {
    var margin = { top: 30, right: 30, bottom: 30, left: 50 },
    w = 600 - margin.left - margin.right,
    h = 200 - margin.top - margin.bottom;

    var x = d3.scaleTime().range([0, w]);
    var y = d3.scaleLinear().range([h, 0]);
    var parseDate = d3.timeParse('%Y-%m-%d');
    var bisectDate = d3.bisector(function(d) { return d.runDate; }).left;

    this.data.forEach((d) => {
      d.runDate = parseDate(d['Date']);
      d.runnersList = d['Runners'];
      d.runners = d['Runners'].split(', ').length;
    });

    // set axis ranges
    x.domain([this.data[0].runDate, this.data[this.data.length - 1].runDate]);
    y.domain([0, d3.max(this.data, function(d) { return d.runners; })]);

    var svg = d3.select('#attendance')
      .append('svg')
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // x axis of run dates (weekly)
    var xAxis = d3.axisBottom(x)
      .ticks(d3.timeWeek, 1)
      .tickFormat(d3.timeFormat('%d/%m/%y'));
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0, ' + h + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'axis-label')
      .attr('dx', '500px')
      .attr('dy', '28px')
      .text('RUN DATE')
      ;

    // y axis with number of runners
    var yAxis = d3.axisLeft(y)
      .tickFormat(d3.format('d'))
      // force ticks only for integers
      .ticks(d3.max(this.data, function(d) { return d.runners; }) - 1);
    svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
      .append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('dy', '-26px')
      .text('RUNNERS');

    // graph line
    var line = d3.line()
      .x(function(d) { return x(d.runDate); })
      .y(function(d) { return y(d.runners); });
    svg.append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', line);

    // elements for the focus tooltip
    var tooltip = d3.select('#attendance').append('div')
      .attr('class', 'tooltip')
      .style('display', 'none');
    tooltip.append('div').attr('class', 'tooltip-date')
    tooltip.append('div').attr('class', 'tooltip-runners')

    // circle for focus on data point
    var focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');
    focus.append('circle')
      .attr('r', 5);

    const data = this.data
    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', w)
      .attr('height', h)
      .on('mouseover', function() { focus.style('display', null); tooltip.style('display', null);  })
      .on('mouseout', function() { focus.style('display', 'none'); tooltip.style('display', 'none'); })
      .on('mousemove', function() {
        var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.runDate > d1.runDate - x0 ? d1 : d0;
        focus.attr('transform', 'translate(' + x(d.runDate) + ',' + y(d.runners) + ')');
        tooltip.attr('style', 'left:' + (x(d.runDate)) + 'px;top:' + (y(d.runners) + 90) + 'px;');
        tooltip.select('.tooltip-date').text(d3.timeFormat('%d %B %Y')(d.runDate));
        tooltip.select('.tooltip-runners').text(d.runnersList);
      });
  }
}

export { AttendanceGraph };
