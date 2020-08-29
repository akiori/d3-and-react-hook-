import React, { useRef, useEffect, useState } from 'react'; // react的dom元素pass
import './App.css';
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";
// scaleband 让bar直接居中。因为bar有宽度。不像点，需要各种css调节之类的。用scaleBand可以直接帮你算好这些。但是domain参数要传实际要显示的值的数组。离散值的映射！不是连续的。可以说是字符串到数字的映射！字符串之间都是等距的

// 动画转场，矩形绘制的一些技巧
function App() {
    const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);
    const svgRef = useRef();
    console.log(svgRef); // 等dom元素被render以后才能访问svgRef. 所以需要用useEffect
    useEffect(() => {
        const svg = select(svgRef.current);
        const xScale = scaleBand()
            .domain(data.map((value, index) => index)) // 参数是字符串，等距的scale到range上
            .range([0, 300])
            .padding(0.5)
        
        const yScale = scaleLinear()
            .domain([0, 150])
            .range([150, 0])
    
        const colorScale = scaleLinear()
            .domain([75, 100, 150])
            .range(["green", "orange", "red"])
            .clamp(true);

        const xAxis = axisBottom(xScale).ticks(data.length)
        svg
            .select('.x-axis')
            .style("transform", "translateY(150px)")
            .call(xAxis)
    
        const yAxis = axisRight(yScale);
        svg
            .select(".y-axis")
            .style("transform", "translateX(300px)")
            .call(yAxis);
        
        svg.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .style("transform", "scale(1,-1)")
            .attr("x", (value, index) => xScale(index))
            .attr("y", -150) // 应该是D3中的一个操作技巧
            .attr("width", xScale.bandwidth()) // 宽度
            .transition() // 需要放在要被animate东西前面
            .attr("fill", colorScale) // 放在这里颜色过渡更自然
            .attr("height", (value) => 150 - yScale(value));

    }, [data]); 

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