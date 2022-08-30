const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom

const svg = d3.select('.chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

d3.csv('https://gist.githubusercontent.com/birgittethe/2fb454e89b47852c4fb0f26bb5eab17d/raw/dummyData.csv')
    .then((data, error) => {
        if (error) {
            throw error;
        }
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('aria-label', 'chart title');

        legend.append('text')
            .text('Fruits and Units')
            .attr('x', 100)
            .attr('y', -16);

        const yLabel = svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('class', 'y_label');

        yLabel.append('tspan')
            .attr('aria-label', 'y label')
            .text('Number of Units')
            .attr('y', -45)
            .attr('x', -220);

        const x = d3.scaleBand()
            .domain(data.map(d => d.fruit))
            .range([0, width])
            .padding(0.2);

        svg.append('g')
            .attr('aria-label', 'x axis')
            .attr('class', 'x_axis')
            .call(d3.axisBottom(x))
            .attr('transform', `translate(0, ${height})`)
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

        const y = d3.scaleLinear()
            .domain([0, 35])
            .range([height, 0]);

        svg.append('g')
            .attr('aria-label', 'y axis')
            .attr('class', 'y_axis')
            .call(d3.axisLeft(y));

        svg.selectAll('rect')
            .data(data)
            .join('rect')
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.unit))
            .attr('x', d => x(d.fruit))
            .attr('y', d => y(d.unit))
            .attr('fill', 'lightsteelblue');

        const barLabels = svg.selectAll('label')
            .data(data)
            .enter()
            .append('text')
            .attr('aria-label', 'data name and value')
            .style('fill', 'white')
            .attr('class', 'label');

        barLabels.append('label')
            .attr('aria-label', 'fruit')
            .text(d => d.fruit)

        barLabels.append('tspan')
            .attr('aria-label', 'units')
            .text(d => d.unit)
            .attr('x', d => x(d.fruit) + 20)
            .attr('y', d => y(d.unit) + margin.top - 5)
            .style('text-anchor', 'middle');

        changeColor = event => {
            const color = event.value;
            d3.selectAll('rect')
                .transition()
                .duration(1500)
                .style('fill', color)
        }

    })