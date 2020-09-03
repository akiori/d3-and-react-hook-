import React, { useRef, useEffect, useState } from "react"; 
import { select, format, scaleQuantize, range, timeDays, timeMonths, timeWeek, timeYear, timeFormat, csv, nest } from "d3";

const [width, height, cellSize] = [960, 136, 17];

// 修改usefEffect的作用范围
// 修改这里的dji数据，相当于只在componentDidMount里出现一次
function App() {
    const [dji, setDji] = useState([]);

    const divRef = useRef();
    const div = select(divRef.current);


    console.log(dji);

    useEffect(() => {
        csv("dji.csv").then((csv) => {
            let data = nest()
                .key((d) => d.Date)
                .rollup((d) => (d[0].Close - d[0].Open) / d[0].Open)
                .object(csv);

            setDji(data);
        });
    }, [])

    const formatPercent = format(".1%");

    const color = scaleQuantize()
        .domain([-0.05, 0.05])
        .range([
            "#a50026",
            "#d73027",
            "#f46d43",
            "#fdae61",
            "#fee08b",
            "#ffffbf",
            "#d9ef8b",
            "#a6d96a",
            "#66bd63",
            "#1a9850",
            "#006837",
        ]);

    const svg = div.selectAll("svg")
        .data(range(2009, 2011))
        .enter()
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr(
            "transform",
            "translate(" +
            (width - cellSize * 53) / 2 +
            "," +
            (height - cellSize * 7 - 1) +
            ")"
        );

    svg.append("text")
        .attr(
            "transform",
            "translate(-6," + cellSize * 3.5 + ")rotate(-90)"
        )
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d;
        });

    // 每一年小方格的group
    const rect = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .selectAll("rect")
        .data(d => timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1))) // new Date(d, 0, 1)就是d年1月1日。主要是计算某一年所有日子构成的数组。
        .enter()
        .append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", d => timeWeek.count(timeYear(d), d) * cellSize)
        .attr("y", d => d.getDay() * cellSize) // 一周中的哪一天
        .datum(timeFormat("%Y-%m-%d"));
    
    const pathMonth = (t0) => {
        let t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(),
            w0 = timeWeek.count(timeYear(t0), t0),
            d1 = t1.getDay(),
            w1 = timeWeek.count(timeYear(t1), t1);
        return (
            "M" + (w0 + 1) * cellSize + "," + d0 * cellSize + "H" + w0 * cellSize + "V" + 7 * cellSize + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize + "H" + (w1 + 1) * cellSize + "V" + 0 + "H" + (w0 + 1) * cellSize + "Z"
        );
    };
    
    // 边框线的path
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data((d) => timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
        .enter()
        .append("path")
        .attr("d", pathMonth);
    
    rect.filter(d => d in dji)
        .attr("fill", d => color(dji[d]))
        .append("title")
        .text(d => d + ": " + formatPercent(dji[d]))

    return (
        <div ref={divRef}></div>
    );
}

export default App;

// 本来肯定是react处理dom元素
// d3来了以后 到底是react handle the dom还是d3handle the dom?
// 一种是还是react处理dom, d3那些utilities 和数学函数来帮助做一些事情，如拜访circle position
// 让d3做任何事情 -> 我们选择这条路 还能高一些transition; d3控制dom. react只是把svg element提供给d3, 好让d3操作DOM，并应用d3的魔法
