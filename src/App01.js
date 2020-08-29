import React, { useRef, useEffect, useState } from 'react'; // react的dom元素pass
import './App.css';
import { select } from 'd3';

function App() {
    const [data, setData] = useState([25, 30, 45, 60, 20]);
    const svgRef = useRef();
    
    // useEffect will be called initially 以及每次数据变化的时候
    useEffect(() => {
        console.log(svgRef);
        const svg = select(svgRef.current);
        svg.selectAll("circle")
            .data(data)
            .join("circle"
                // (enter) => enter.append("circle"), 如果最后只剩一个那就circle作为join参数就行
                // (update) => update.attr("class", "updated") 如果不需要更新可以直接删除
                // (exit) => exit.remove() 默认缺省的可以删除，如果你要用动画时候可以用
            )   // 在join后面搞 同时用于enter和update 
            .attr("r", (value) => value)
            .attr("cx", (value) => value * 2)
            .attr("cy", (value) => value * 2)
            .attr("stroke", "red");  
    }, [data]); // 注意这里，每次data变了，这里的一块代码就会运行
    return (
        <React.Fragment>
            <svg ref={svgRef}>
                <circle />
            </svg>
            <br />
            <button onClick={() => setData(data.map((value) => value + 5))}>
                update data
            </button>
            <button onClick={() => setData(data.filter((value) => value <= 35))}>
                filter data
            </button>
        </React.Fragment>
    );
}

export default App;

// 本来肯定是react处理dom元素
// d3来了以后 到底是react handle the dom还是d3handle the dom? 
// 一种是还是react处理dom, d3那些utilities 和数学函数来帮助做一些事情，如拜访circle position
// 让d3做任何事情 -> 我们选择这条路 还能高一些transition; d3控制dom. react只是把svg element提供给d3, 好让d3操作DOM，并应用d3的魔法