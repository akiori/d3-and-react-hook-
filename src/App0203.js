import React, { useRef, useEffect, useState } from 'react'; // react的dom元素pass
import './App.css';
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear } from "d3";

function App() {
    const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);
    const svgRef = useRef();
    console.log(svgRef); // 等dom元素被render以后才能访问svgRef. 所以需要用useEffect
    useEffect(() => {
        const svg = select(svgRef.current);
        const xScale = scaleLinear()
            .domain([0, data.length - 1])
            .range([0, 300])
        
        const yScale = scaleLinear()
            .domain([0, 100])
            .range([150, 0])

        // 让标度从1开始
        const xAxis = axisBottom(xScale).ticks(data.length).tickFormat(index => index + 1)
        
        svg
            .select('.x-axis')
            .style("transform", "translateY(150px)")
            .call(xAxis)
    
        const yAxis = axisRight(yScale);
        svg.select(".y-axis")
            .style("transform", "translateX(300px)")
            .call(yAxis);

        const myLine = line()
            .x((value, index) => xScale(index))
            .y(yScale) // .y(value => yScale(value))的简化形式
            .curve(curveCardinal);

        svg
            .selectAll(".line")
            .data([data]) //中括号避免每个元素生成一个path
            .join("path")
            .attr("class", "line")
            .attr("d", value => myLine(value)) 
            .attr("fill", "none")
            .attr("stroke", "blue")
    }, [data]); // 注意这里，每次data变了，这里的一块代码就会运行
    return (
        <React.Fragment>
            <svg ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
            <br />
            <button onClick={() => setData(data.map((value) => value + 5))}>
                update data
            </button>
            <button
                onClick={() => setData(data.filter((value) => value <= 35))}
            >
                filter data
            </button>
        </React.Fragment>
    );
}

export default App;
