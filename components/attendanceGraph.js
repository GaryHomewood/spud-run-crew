class AttendanceGraph {
  constructor(w, h, margin, data) {
    this.w = w;
    this.h = h;
    this.margin = margin;
    this.data = data;
  }

  draw() {
    var x = d3.scaleTime().range([0, this.w]);
    var y = d3.scaleLinear().range([this.h, 0]);
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
      .attr('width', this.w + this.margin.left + this.margin.right)
      .attr('height', this.h + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // x axis of run dates (weekly)
    var xAxis = d3.axisBottom(x)
      .ticks(d3.timeWeek, 1)
      .tickFormat(d3.timeFormat('%d/%m/%y'));
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0, ' + this.h + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'axis-label')
      .attr('dx', this.w/2 + 'px')
      .attr('dy', '34px')
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
      .attr('dx', '2px')
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
      .attr('width', this.w)
      .attr('height', this.h)
      .on('mouseover', function() { focus.style('display', null); tooltip.style('display', null);  })
      .on('mouseout', function() { focus.style('display', 'none'); tooltip.style('display', 'none'); })
      .on('mousemove', function() {
        var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.runDate > d1.runDate - x0 ? d1 : d0;
        focus.attr('transform', 'translate(' + x(d.runDate) + ',' + y(d.runners) + ')');
        tooltip.attr('style', 'left:' + (x(d.runDate)) + 'px;top:' + (y(d.runners) + 134) + 'px;');
        tooltip.select('.tooltip-date').text(d3.timeFormat('%d %B %Y')(d.runDate));
        tooltip.select('.tooltip-runners').text(d.runnersList);
      });
  }
}

export { AttendanceGraph };
