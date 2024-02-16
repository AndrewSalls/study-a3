import * as d3 from 'd3';
import { useRef, useEffect } from 'react';
import { useCurrentStep } from '../../routes';
import indices from './graph-selection.json';
import dinosaur from './test-dinosaur.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderGraph() {
  // Graph number
  const id = useCurrentStep();

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

    // Load in data based on id
    const url = 'https://raw.githubusercontent.com/shivalimani/a3-Experiment/main/json/reformatted_02_data.json';
    const dataRead = new Request(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'default',
    });

    fetch(dataRead).then((r) => r.json()).then((data) => {
      const fileIds = indices[parseInt(id.slice(-1), 10)];
      for (let t = 0; t < 3; t += 1) {
        let xValues: number[];
        let yValues: number[];
        const fId = fileIds[t];

        if (fId !== null) {
          xValues = data[fId].x;
          yValues = data[fId].y;
        } else {
          xValues = dinosaur[0];
          yValues = dinosaur[1];
        }

        const zip = xValues.map((e: number, i: number) => ({ x: e, y: yValues[i] }));

        // Data
        svg.append('g')
          .selectAll('dot')
          .data(zip)
          .enter()
          .append('path')
          .attr('d', t === 1 ? d3.symbol().type(d3.symbolCross).size(100) : d3.symbol().type(d3.symbolCircle).size(100))
          .attr('transform', (d) => `translate(${x(d.x)}, ${y(d.y)})`)
          .style('fill', () => {
            switch (t) {
              case 2:
                return '#00FF33';
              default:
                return '#0033FF';
            }
          });
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
