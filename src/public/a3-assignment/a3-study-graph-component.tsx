import * as d3 from 'd3';
import { useRef, useEffect } from 'react';
import { useCurrentStep } from '../../routes';

function renderGraph() {
  // Graph number
  const id = useCurrentStep()[-1];

  // Load in data based on id
  const data = [
    [
      0.06688441755799339,
      -0.1625261052414077,
      -0.4837103807719284,
      -0.6825336291656889,
      -0.8048886915453495,
      -0.9272437539250097,
      -1.1107733651159506,
      -1.2637157019012508,
      -1.5084198619034723,
      -1.6766618006486922,
    ],
    [
      1.832058955679908,
      1.7892194266355583,
      1.732105004690999,
      1.6178724482159503,
      1.5036361791549713,
      1.3751250171937826,
      1.1894957207021044,
      1.1038203751993354,
      0.9895878187242868,
      0.8753552622492381,
    ],
  ];
  data[0].push();

  const zip = data[0].map((e, i) => ({ x: e, y: data[1][i] }));
  // Create page content
  const contentRef = useRef<HTMLDivElement>(null);

  // Generate d3 graph
  useEffect(() => {
    const margin = {
      top: 20, right: 20, left: 80, bottom: 50,
    };
    const width = (2 * 400) - margin.left - margin.right;
    const height = (2 * 400) - margin.top - margin.bottom;
    const domain = [-3, 3];
    const range = [-3, 3];
    const tickGap = 0.5;

    const x = d3.scaleLinear().domain(domain).range([0, width]);
    const y = d3.scaleLinear().domain(range).range([height, 0]);

    const svg = d3.select(contentRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Grid lines
    svg.selectAll('line.horizontalGrid')
      .data(y.ticks((domain[1] - domain[0]) / tickGap))
      .enter()
      .append('line')
      .attr('class', 'horizontalGrid')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => y(d) + 1)
      .attr('y2', (d) => y(d) + 1)
      .attr('fill', 'none')
      .attr('shape-rendering', 'crispEdges')
      .attr('stroke', '#ebebeb')
      .attr('stroke-width', '1px');

    svg.selectAll('line.verticalGrid')
      .data(x.ticks((range[1] - range[0]) / tickGap))
      .enter()
      .append('line')
      .attr('class', 'horizontalGrid')
      .attr('x1', (d) => x(d))
      .attr('x2', (d) => x(d))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('fill', 'none')
      .attr('shape-rendering', 'crispEdges')
      .attr('stroke', '#ebebeb')
      .attr('stroke-width', '1px');

    // Axes
    svg.append('g')
      .attr('transform', `translate(0, ${height / 2})`)
      .call(d3.axisBottom(x)
        .tickFormat(() => '')
        .tickSizeOuter(0));

    svg.append('g')
      .attr('transform', `translate(${width / 2}, 0)`)
      .call(d3.axisLeft(y)
        .tickFormat(() => '')
        .tickSizeOuter(0));

    // Data
    svg.append('g')
      .selectAll('dot')
      .data(zip)
      .enter()
      .append('path')
      .attr('d', d3.symbol().type(d3.symbolCircle).size(100))
      .attr('transform', (d) => `translate(${x(d.x)}, ${y(d.y)})`)
      .style('fill', (d) => {
        switch (d) { // TODO: Introduce shape & color
          default: return '#0033FF';
        }
      });

    // Clean up state
    return () => {
      if (contentRef.current) {
        contentRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div id="scatter-wrapper" ref={contentRef} />;
}

export default renderGraph;
