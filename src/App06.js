import React, { useState } from "react"; // react的dom元素pass
import BarChart from './BarChart';
import './App.css'

function App() {
    const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);

    return (
        <React.Fragment>
            <BarChart data={data} />
            <button onClick={() => setData(data.map((value) => value + 5))}>
                update data
            </button>
            <button
                onClick={() => setData(data.filter((value) => value <= 35))}>
                filter data
            </button>
            <button
                onClick={() =>
                    setData([...data, Math.round(Math.random() * 100)])}>
                Add data
            </button>
        </React.Fragment>
    );
}

export default App;