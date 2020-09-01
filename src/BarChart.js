import React, { useRef, useEffect, useState } from "react"; // react的dom元素pass
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";

const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
        const observeTarget = ref.current;
        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                setDimensions(entry.contentRect);
            });
            // set resized dimensions here
        });
        console.log("called");
        resizeObserver.observe(observeTarget);
        // cleanup/ 当使用这个自定义resize observer hook的组件被Unmounted或者removed时候需要cleanup
        // 请看官网为啥这么写 - 关于需要清除的effect
        return () => {
            resizeObserver.unobserve(observeTarget);
        }
    },[ref])
    return dimensions;
}

// 让页面responsive 自定义hook、 把barchart变成component使得他reusable只是一开始随便一搞
function BarChart({ data }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        const svg = select(svgRef.current);
        console.log(dimensions);

        if (!dimensions) return;

        const xScale = scaleBand()
            .domain(data.map((value, index) => index)) // 参数是字符串，等距的scale到range上
            .range([0, dimensions.width])
            .padding(0.5);

        const yScale = scaleLinear().domain([0, 150]).range([dimensions.height, 0]);

        const colorScale = scaleLinear()
            .domain([75, 100, 150])
            .range(["green", "orange", "red"])
            .clamp(true);

        const xAxis = axisBottom(xScale).ticks(data.length);
        svg.select(".x-axis")
            .style("transform", `translateY(${dimensions.height}px)`)
            .call(xAxis);

        const yAxis = axisRight(yScale);
        svg.select(".y-axis")
            .style("transform", `translateX(${dimensions.width}px)`)
            .call(yAxis);

        svg.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .style("transform", "scale(1,-1)")
            .attr("x", (value, index) => xScale(index))
            .attr("y", -dimensions.height)
            .attr("width", xScale.bandwidth()) // 宽度
            // 开始加交互！需要在transition前面！
            .on("mouseenter", (value, index) => {
                svg.selectAll(".tooltip")
                    .data([value]) // 仅仅是鼠标进入到的bar的值
                    // .join("text")
                    .join((enter) =>
                        enter.append("text").attr("y", yScale(value) - 3)
                    ) // 为了让字体出现的更自然, 起始位置就在y那
                    .attr("class", "tooltip")
                    .text(value)
                    .attr("x", xScale(index) + xScale.bandwidth() / 2) // 注意这里的参数(index)而不用什么箭头
                    .attr("text-anchor", "middle") // 文字对齐居中  是对文字而言的
                    .transition()
                    .attr("y", yScale(value) - 8)
                    .attr("opacity", 1);
            })
            .on("mouseleave", () => svg.select(".tooltip").remove()) // 保证每次都是新的text元素
            .transition() // 需要放在要被animate东西前面
            .attr("fill", colorScale) // 放在这里颜色过渡更自然
            .attr("height", (value) => dimensions.height - yScale(value));
    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </div>
    );
}

export default BarChart;
